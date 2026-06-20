/* ============================================================
   MERCÚRIO CASA 9 — Cliente Supabase
   ------------------------------------------------------------
   Configuração da ligação e funções de baixo nível para falar
   com a API REST (tabela "posts") e o Storage (bucket de imagens).
   Nenhuma outra parte do site deve montar URLs do Supabase
   diretamente — tudo passa por aqui.
   ============================================================ */

const SUPABASE_URL = 'https://whuimbkyaicspnzsqhsu.supabase.co';
const SUPABASE_REST = `${SUPABASE_URL}/rest/v1`;
const SUPABASE_STORAGE = `${SUPABASE_URL}/storage/v1`;
const SUPABASE_ANON_KEY = 'sb_publishable_cv3B2wd5FFdZy2xOBoD0nQ_nDuBfmS_';
const SUPABASE_BUCKET = 'imagens-mercurio-cada-nove';

const SupabaseClient = {
  _headers(extra) {
    return Object.assign({
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    }, extra || {});
  },

  async _handle(res) {
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.json()).message || ''; } catch (e) {}
      throw new Error(`Supabase ${res.status}: ${detail || res.statusText}`);
    }
    if (res.status === 204) return null;
    return res.json();
  },

  // ---------- Tabela "posts" (REST) ----------
  async select(query = '') {
    const res = await fetch(`${SUPABASE_REST}/posts${query}`, {
      headers: this._headers(),
    });
    return this._handle(res);
  },

  async insert(row) {
    console.log('[Supabase] POST', `${SUPABASE_REST}/posts`, row);
    const res = await fetch(`${SUPABASE_REST}/posts`, {
      method: 'POST',
      headers: this._headers({
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      }),
      body: JSON.stringify(row),
    });
    console.log('[Supabase] resposta', res.status);
    return this._handle(res);
  },

  async update(id, row) {
    const res = await fetch(`${SUPABASE_REST}/posts?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: this._headers({
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      }),
      body: JSON.stringify(row),
    });
    return this._handle(res);
  },

  async remove(id) {
    const res = await fetch(`${SUPABASE_REST}/posts?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this._headers(),
    });
    return this._handle(res);
  },

  // ---------- Storage (upload de imagens) ----------
  async uploadImage(file, path) {
    const res = await fetch(`${SUPABASE_STORAGE}/object/${SUPABASE_BUCKET}/${path}`, {
      method: 'POST',
      headers: this._headers({
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true',
      }),
      body: file,
    });
    await this._handle(res);
    return `${SUPABASE_STORAGE}/object/public/${SUPABASE_BUCKET}/${path}`;
  },

  buildImagePath(prefix, file) {
    const ext = (file.name && file.name.includes('.')) ? file.name.split('.').pop() : 'jpg';
    const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    return `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  },
};
