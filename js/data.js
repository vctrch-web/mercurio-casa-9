/* ============================================================
   MERCÚRIO CASA 9 — Camada de dados (Supabase)
   ------------------------------------------------------------
   Mantém a mesma interface pública usada pelo resto do site
   (DB.getPosts, DB.savePost, DB.deletePost, etc.), mas agora
   apoiada no Supabase. Os métodos de leitura continuam síncronos
   porque trabalham sobre um cache em memória (_cache.posts);
   esse cache é populado por DB.sync(), que cada página chama
   uma vez, no início, antes de renderizar.
   ============================================================ */

const DB = {
  KEYS: {
    SESSION: 'mc9_session',
    ADMIN: 'mc9_admin',
    RESET: 'mc9_reset_code',
  },

  ADMIN_EMAIL: 'joaomrtns8@gmail.com',

  _cache: { posts: [], loaded: false },

  _read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  _write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  // ---------- Conversão entre linha do Supabase e objeto "post" do site ----------
  _fromRow(row) {
    return {
      id: row.id,
      folio: row.folio || 1,
      slug: row.slug || '',
      title: row.title || '',
      subtitle: row.subtitle || '',
      coverImage: row.cover_image || '',
      coverCaption: row.cover_caption || '',
      bodyHtml: row.content || '',
      status: row.status || 'draft',
      date: row.post_date || '',
      category: row.category || '',
      createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    };
  },

  _toRow(post) {
    return {
      title: post.title || '',
      subtitle: post.subtitle || '',
      content: post.bodyHtml || '',
      category: post.category || '',
      cover_image: post.coverImage || '',
      cover_caption: post.coverCaption || '',
      status: post.status || 'draft',
      post_date: post.date || new Date().toISOString().slice(0, 10),
      slug: post.slug,
      folio: post.folio,
    };
  },

  // ---------- Sincronização com o Supabase ----------
  // Cada página chama isto (await DB.sync()) antes de renderizar,
  // para garantir que o cache em memória está atualizado.
  async sync() {
    try {
      const rows = await SupabaseClient.select('?select=*&order=created_at.desc');
      this._cache.posts = rows.map(this._fromRow);
      this._cache.loaded = true;
    } catch (e) {
      console.error('Falha ao ligar ao Supabase:', e);
      this._cache.loaded = true;
      throw e;
    }
    return this._cache.posts;
  },

  // ---------- Leitura (síncrona, a partir do cache) ----------
  getPosts() {
    return this._cache.posts;
  },

  getPublishedPosts() {
    return this._cache.posts
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getPostById(id) {
    return this._cache.posts.find(p => String(p.id) === String(id)) || null;
  },

  getPostBySlug(slug) {
    return this._cache.posts.find(p => p.slug === slug) || null;
  },

  // ---------- Escrita (assíncrona — fala com o Supabase) ----------
  async savePost(post) {
    const row = this._toRow(post);
    let saved;
    if (post.id) {
      const [result] = await SupabaseClient.update(post.id, row);
      saved = result;
    } else {
      const [result] = await SupabaseClient.insert(row);
      saved = result;
    }
    const converted = this._fromRow(saved);
    const idx = this._cache.posts.findIndex(p => String(p.id) === String(converted.id));
    if (idx >= 0) this._cache.posts[idx] = converted;
    else this._cache.posts.unshift(converted);
    return converted;
  },

  async deletePost(id) {
    await SupabaseClient.remove(id);
    this._cache.posts = this._cache.posts.filter(p => String(p.id) !== String(id));
  },

  async uploadImage(file, prefix) {
    const path = SupabaseClient.buildImagePath(prefix, file);
    return SupabaseClient.uploadImage(file, path);
  },

  // ---------- Administrador / sessão (continuam em localStorage: não há tabela de utilizadores) ----------
  getAdmin() {
    let admin = this._read(this.KEYS.ADMIN, null);
    if (!admin) {
      admin = { email: this.ADMIN_EMAIL, password: 'mercurio9' };
      this._write(this.KEYS.ADMIN, admin);
    }
    return admin;
  },

  setAdminPassword(newPassword) {
    const admin = this.getAdmin();
    admin.password = newPassword;
    this._write(this.KEYS.ADMIN, admin);
  },

  getSession() {
    return this._read(this.KEYS.SESSION, null);
  },

  login(email, password) {
    const admin = this.getAdmin();
    if (email.trim().toLowerCase() === admin.email.toLowerCase() && password === admin.password) {
      this._write(this.KEYS.SESSION, { email: admin.email, since: Date.now() });
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(this.KEYS.SESSION);
  },

  isAuthenticated() {
    return !!this.getSession();
  },

  generateResetCode(email) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    this._write(this.KEYS.RESET, { email: email.trim().toLowerCase(), code, expires: Date.now() + 10 * 60 * 1000 });
    return code;
  },

  verifyResetCode(code) {
    const entry = this._read(this.KEYS.RESET, null);
    if (!entry) return false;
    if (Date.now() > entry.expires) return false;
    return entry.code === code;
  },

  clearResetCode() {
    localStorage.removeItem(this.KEYS.RESET);
  },

  // ---------- Auxiliares ----------
  nextFolio() {
    return this._cache.posts.length + 1;
  },

  slugify(title) {
    return title
      .toString()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60) || 'texto';
  },

  uniqueSlug(title, excludeId) {
    const base = this.slugify(title);
    const posts = this._cache.posts.filter(p => String(p.id) !== String(excludeId));
    let slug = base;
    let n = 2;
    while (posts.some(p => p.slug === slug)) {
      slug = `${base}-${n}`;
      n++;
    }
    return slug;
  },

  estimateReadTime(html) {
    const text = (html || '').replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  },
};
