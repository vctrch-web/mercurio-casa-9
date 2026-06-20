/* ============================================================
   MERCÚRIO CASA 9 — Lógica do editor
   ============================================================ */

if (Util.requireAuth()) {

if (typeof SupabaseClient === 'undefined') {
  console.error('SupabaseClient não foi carregado. Verifique se js/supabase-client.js está acessível e é servido como JavaScript (não bloqueado por extensão/MIME type).');
  Util.toast('Erro: js/supabase-client.js não carregou. Veja a consola.', 'close');
}

Util.injectGlyph('.masthead__glyph');
document.getElementById('userEmail').textContent = DB.getSession().email;

document.getElementById('navDashboard').innerHTML = `${ICONS.dashboard} Painel`;
document.getElementById('navNew').innerHTML = `${ICONS.feather} Escrever novo texto`;
document.getElementById('navView').innerHTML = `${ICONS.link} Ver o site`;
document.getElementById('btnLogout').innerHTML = `${ICONS.logout} Terminar sessão`;
document.getElementById('btnBackList').innerHTML = `${ICONS.arrowLeft} Voltar à lista`;
document.getElementById('btnSave').innerHTML = `${ICONS.check} Guardar`;
document.getElementById('btnPreview').innerHTML = `${ICONS.link} Ver texto publicado`;
document.getElementById('btnDeleteFromEditor').innerHTML = `${ICONS.trash} Apagar este texto`;
document.getElementById('coverIcon').innerHTML = ICONS.image;
document.getElementById('bodyImageIcon').innerHTML = ICONS.image;
document.getElementById('btnRemoveCover').innerHTML = ICONS.close;

document.getElementById('btnToggleSubtitle').innerHTML = `${ICONS.headline} Adicionar cabeçalho / subtítulo`;

// Ícones da barra de ferramentas
const tbIcons = {
  undo: ICONS.undo, redo: ICONS.redo,
  bold: ICONS.bold, italic: ICONS.italic,
  insertUnorderedList: ICONS.listUl,
};
document.querySelectorAll('[data-cmd]').forEach(btn => {
  if (tbIcons[btn.dataset.cmd]) btn.innerHTML = tbIcons[btn.dataset.cmd];
});
document.querySelector('[data-block="blockquote"]').innerHTML = ICONS.quote;
document.querySelector('[data-block="hr"]').innerHTML = ICONS.divider;
document.getElementById('btnInsertLink').innerHTML = ICONS.link;
document.getElementById('btnInsertImage').innerHTML = ICONS.image;

document.querySelector('[data-layout="float-left"]').innerHTML = ICONS.imgFloatLeft + '<span style="font-size:0.6rem;display:block;margin-top:2px;">Esquerda</span>';
document.querySelector('[data-layout="float-right"]').innerHTML = ICONS.imgFloatRight + '<span style="font-size:0.6rem;display:block;margin-top:2px;">Direita</span>';
document.querySelector('[data-layout="wide"]').innerHTML = ICONS.imgWide + '<span style="font-size:0.6rem;display:block;margin-top:2px;">Larga</span>';
document.querySelector('[data-layout="inline"]').innerHTML = ICONS.image + '<span style="font-size:0.6rem;display:block;margin-top:2px;">Padrão</span>';

// ---------- Estado ----------
const params = new URLSearchParams(window.location.search);
const editingId = params.get('id');
let existingPost = null;
let coverImageData = '';
let savedSelectionRange = null;

const titleInput = document.getElementById('titleInput');
const subtitleField = document.getElementById('subtitleField');
const subtitleInput = document.getElementById('subtitleInput');
const editorSurface = document.getElementById('editorSurface');
const dateInput = document.getElementById('dateInput');
const statusSelect = document.getElementById('statusSelect');
const coverDrop = document.getElementById('coverDrop');
const coverPreview = document.getElementById('coverPreview');
const coverPreviewImg = document.getElementById('coverPreviewImg');
const coverCaptionInput = document.getElementById('coverCaptionInput');
const coverFileInput = document.getElementById('coverFileInput');

// ---------- Carregar texto existente (após sincronizar com o Supabase) ----------
async function loadExisting() {
  try {
    await DB.sync();
  } catch (e) {
    console.error('Falha ao sincronizar com o Supabase:', e);
    Util.toast(`Sem ligação à base de dados: ${e.message}`, 'close');
  }
  existingPost = editingId ? DB.getPostById(editingId) : null;

  if (existingPost) {
    document.getElementById('editorHeading').textContent = 'Editar texto';
    document.getElementById('btnDeleteFromEditor').style.display = 'flex';
    titleInput.value = existingPost.title || '';
    if (existingPost.subtitle) {
      subtitleInput.value = existingPost.subtitle;
      subtitleField.classList.add('is-active');
      document.getElementById('btnToggleSubtitle').innerHTML = `${ICONS.headline} Remover cabeçalho / subtítulo`;
    }
    editorSurface.innerHTML = existingPost.bodyHtml || '';
    dateInput.value = existingPost.date || new Date().toISOString().slice(0, 10);
    statusSelect.value = existingPost.status || 'draft';
    if (existingPost.coverImage) {
      coverImageData = existingPost.coverImage;
      coverPreviewImg.src = coverImageData;
      coverCaptionInput.value = existingPost.coverCaption || '';
      coverPreview.classList.add('is-active');
      coverDrop.style.display = 'none';
    }
  } else {
    dateInput.value = new Date().toISOString().slice(0, 10);
  }
  updateCounts();
}
loadExisting();

// ---------- Subtítulo / cabeçalho toggle ----------
document.getElementById('btnToggleSubtitle').addEventListener('click', () => {
  const active = subtitleField.classList.toggle('is-active');
  document.getElementById('btnToggleSubtitle').innerHTML = active
    ? `${ICONS.headline} Remover cabeçalho / subtítulo`
    : `${ICONS.headline} Adicionar cabeçalho / subtítulo`;
  if (active) subtitleInput.focus();
  else subtitleInput.value = '';
});

// ---------- Capa: upload e drag/drop ----------
coverDrop.addEventListener('click', () => coverFileInput.click());
coverFileInput.addEventListener('change', () => {
  if (coverFileInput.files[0]) handleCoverFile(coverFileInput.files[0]);
});
['dragover', 'dragenter'].forEach(evt => coverDrop.addEventListener(evt, (e) => {
  e.preventDefault(); coverDrop.classList.add('is-dragover');
}));
['dragleave', 'drop'].forEach(evt => coverDrop.addEventListener(evt, (e) => {
  e.preventDefault(); coverDrop.classList.remove('is-dragover');
}));
coverDrop.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleCoverFile(file);
});

async function handleCoverFile(file) {
  // prévia instantânea local, enquanto a imagem sobe para o Storage
  const localPreview = URL.createObjectURL(file);
  coverPreviewImg.src = localPreview;
  coverPreview.classList.add('is-active');
  coverDrop.style.display = 'none';
  coverPreview.classList.add('is-uploading');

  try {
    coverImageData = await DB.uploadImage(file, 'capas');
  } catch (e) {
    Util.toast('Falha ao enviar a imagem', 'close');
    coverImageData = '';
    coverPreview.classList.remove('is-active');
    coverDrop.style.display = 'block';
  } finally {
    coverPreview.classList.remove('is-uploading');
  }
}

document.getElementById('btnRemoveCover').addEventListener('click', () => {
  coverImageData = '';
  coverPreviewImg.src = '';
  coverCaptionInput.value = '';
  coverPreview.classList.remove('is-active');
  coverDrop.style.display = 'block';
  coverFileInput.value = '';
});

// ---------- Barra de ferramentas: comandos de formatação ----------
function focusEditor() { editorSurface.focus(); }

document.querySelectorAll('[data-cmd]').forEach(btn => {
  btn.addEventListener('click', () => {
    focusEditor();
    document.execCommand(btn.dataset.cmd, false, null);
    updateToolbarState();
  });
});

document.querySelectorAll('[data-block]').forEach(btn => {
  btn.addEventListener('click', () => {
    focusEditor();
    const tag = btn.dataset.block;
    if (tag === 'hr') {
      document.execCommand('insertHorizontalRule', false, null);
    } else if (tag === 'blockquote') {
      // toggle blockquote
      const sel = window.getSelection();
      const node = sel.anchorNode ? sel.anchorNode.parentElement : null;
      const inQuote = node && node.closest('blockquote');
      document.execCommand('formatBlock', false, inQuote ? 'p' : 'blockquote');
    } else {
      document.execCommand('formatBlock', false, tag);
    }
    updateToolbarState();
  });
});

editorSurface.addEventListener('input', () => {
  updateCounts();
});
editorSurface.addEventListener('keyup', updateToolbarState);
editorSurface.addEventListener('mouseup', updateToolbarState);

function updateToolbarState() {
  ['bold', 'italic'].forEach(cmd => {
    const btn = document.querySelector(`[data-cmd="${cmd}"]`);
    if (!btn) return;
    try {
      btn.classList.toggle('is-active', document.queryCommandState(cmd));
    } catch (e) {}
  });
}

function updateCounts() {
  const text = editorSurface.textContent || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('wordCount').textContent = `${words} palavra${words !== 1 ? 's' : ''}`;
  const minutes = Math.max(1, Math.round(words / 200));
  document.getElementById('readTimeLabel').textContent = `~${minutes} min de leitura`;
}

// ---------- Colar texto de qualquer editor ----------
// Mantém formatação básica (negrito, itálico, títulos, listas, citações,
// links, parágrafos) mas remove estilos inline pesados, classes e lixo
// de Word/Google Docs/etc, para o texto colado herdar sempre o design do site.
editorSurface.addEventListener('paste', (e) => {
  e.preventDefault();
  const clipboard = e.clipboardData || window.clipboardData;
  let html = clipboard.getData('text/html');
  const text = clipboard.getData('text/plain');

  if (html) {
    const cleaned = sanitizePastedHtml(html);
    document.execCommand('insertHTML', false, cleaned);
  } else if (text) {
    const paras = text.split(/\n{2,}/).map(p => `<p>${Util.escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
    document.execCommand('insertHTML', false, paras || '<p></p>');
  }
  updateCounts();
});

function sanitizePastedHtml(dirtyHtml) {
  const allowedTags = ['P','H2','H3','STRONG','B','EM','I','UL','OL','LI','BLOCKQUOTE','A','BR','HR','FIGURE','IMG','FIGCAPTION'];
  const temp = document.createElement('div');
  temp.innerHTML = dirtyHtml;

  // Remove elementos indesejados inteiramente (scripts, estilos, comentários do Word)
  temp.querySelectorAll('script, style, meta, link').forEach(el => el.remove());

  function walk(node) {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName;

        if (tag === 'B') { renameTag(child, 'STRONG'); }
        else if (tag === 'I') { renameTag(child, 'EM'); }
        else if (tag === 'SPAN' || tag === 'FONT' || tag === 'DIV') {
          // desembrulha, mantendo filhos
          walk(child);
          unwrap(child);
          return;
        } else if (tag === 'H1') { renameTag(child, 'H2'); }
        else if (!allowedTags.includes(tag)) {
          walk(child);
          unwrap(child);
          return;
        }

        // Remove todos os atributos exceto href em <a> e src/alt em <img>
        const keep = tag === 'A' ? ['href'] : (tag === 'IMG' ? ['src', 'alt'] : []);
        Array.from(child.attributes || []).forEach(attr => {
          if (!keep.includes(attr.name)) child.removeAttribute(attr.name);
        });

        walk(child);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
      }
    });
  }

  function renameTag(el, newTag) {
    const replacement = document.createElement(newTag);
    replacement.innerHTML = el.innerHTML;
    el.replaceWith(replacement);
  }

  function unwrap(el) {
    const parent = el.parentNode;
    if (!parent) return;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  walk(temp);
  return temp.innerHTML;
}

// ---------- Modal: hiperligação ----------
const linkModal = document.getElementById('linkModal');
document.getElementById('btnInsertLink').addEventListener('click', () => {
  const sel = window.getSelection();
  if (sel.rangeCount > 0) savedSelectionRange = sel.getRangeAt(0).cloneRange();
  document.getElementById('linkUrlInput').value = '';
  linkModal.classList.add('is-open');
  setTimeout(() => document.getElementById('linkUrlInput').focus(), 50);
});
document.getElementById('cancelLink').addEventListener('click', () => linkModal.classList.remove('is-open'));
linkModal.addEventListener('click', (e) => { if (e.target === linkModal) linkModal.classList.remove('is-open'); });

document.getElementById('confirmLink').addEventListener('click', () => {
  let url = document.getElementById('linkUrlInput').value.trim();
  if (!url) { linkModal.classList.remove('is-open'); return; }
  const urlLower = url.toLowerCase();
  const hasProtocol = urlLower.indexOf('http://') === 0 || urlLower.indexOf('https://') === 0 || urlLower.indexOf('mailto:') === 0;
  if (!hasProtocol) url = 'https://' + url;

  focusEditor();
  if (savedSelectionRange) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedSelectionRange);
  }
  if (window.getSelection().toString().length === 0) {
    document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener">${Util.escapeHtml(url)}</a>`);
  } else {
    document.execCommand('createLink', false, url);
  }
  linkModal.classList.remove('is-open');
  updateCounts();
});

// ---------- Modal: inserir imagem no corpo ----------
const imageModal = document.getElementById('imageModal');
let selectedLayout = 'inline';

document.getElementById('btnInsertImage').addEventListener('click', () => {
  const sel = window.getSelection();
  if (sel.rangeCount > 0) savedSelectionRange = sel.getRangeAt(0).cloneRange();
  pendingBodyImageFile = null;
  document.getElementById('bodyImageUrlInput').value = '';
  document.getElementById('bodyImageCaptionInput').value = '';
  selectedLayout = 'inline';
  document.querySelectorAll('.layout-opt').forEach(b => b.classList.toggle('is-active', b.dataset.layout === 'inline'));
  switchModalTab('upload');
  imageModal.classList.add('is-open');
});
document.getElementById('cancelImage').addEventListener('click', () => imageModal.classList.remove('is-open'));
imageModal.addEventListener('click', (e) => { if (e.target === imageModal) imageModal.classList.remove('is-open'); });

function switchModalTab(tab) {
  document.querySelectorAll('.modal-tabs button').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tab));
  document.querySelectorAll('.modal-tab-panel').forEach(p => p.classList.toggle('is-active', p.dataset.panel === tab));
}
document.querySelectorAll('.modal-tabs button').forEach(btn => {
  btn.addEventListener('click', () => switchModalTab(btn.dataset.tab));
});

document.querySelectorAll('.layout-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedLayout = btn.dataset.layout;
    document.querySelectorAll('.layout-opt').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
  });
});

const bodyImageDrop = document.getElementById('bodyImageDrop');
const bodyImageFileInput = document.getElementById('bodyImageFileInput');
let pendingBodyImageFile = null;

bodyImageDrop.addEventListener('click', () => bodyImageFileInput.click());
bodyImageFileInput.addEventListener('change', () => {
  if (bodyImageFileInput.files[0]) selectBodyImageFile(bodyImageFileInput.files[0]);
});
['dragover', 'dragenter'].forEach(evt => bodyImageDrop.addEventListener(evt, (e) => { e.preventDefault(); bodyImageDrop.classList.add('is-dragover'); }));
['dragleave', 'drop'].forEach(evt => bodyImageDrop.addEventListener(evt, (e) => { e.preventDefault(); bodyImageDrop.classList.remove('is-dragover'); }));
bodyImageDrop.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) selectBodyImageFile(file);
});

function selectBodyImageFile(file) {
  pendingBodyImageFile = file;
  bodyImageDrop.querySelector('p').textContent = 'Imagem selecionada ✓';
}

document.getElementById('confirmImage').addEventListener('click', async () => {
  const activeTab = document.querySelector('.modal-tabs button.is-active').dataset.tab;
  let src = activeTab === 'url' ? document.getElementById('bodyImageUrlInput').value.trim() : '';

  if (activeTab === 'upload') {
    if (!pendingBodyImageFile) { Util.toast('Escolha uma imagem', 'close'); return; }
    const confirmBtn = document.getElementById('confirmImage');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'A enviar…';
    try {
      src = await DB.uploadImage(pendingBodyImageFile, 'corpo');
    } catch (e) {
      Util.toast('Falha ao enviar a imagem', 'close');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Inserir imagem';
      return;
    }
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Inserir imagem';
  }

  if (!src) { Util.toast('Escolha ou indique uma imagem', 'close'); return; }

  const caption = document.getElementById('bodyImageCaptionInput').value.trim();
  const layoutClass = selectedLayout === 'inline' ? '' : `is-${selectedLayout}`;

  const figureHtml = `<figure class="${layoutClass}" contenteditable="false">
    <img src="${src}" alt="${Util.escapeHtml(caption)}">
    ${caption ? `<figcaption>${Util.escapeHtml(caption)}</figcaption>` : ''}
  </figure><p><br></p>`;

  focusEditor();
  if (savedSelectionRange) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedSelectionRange);
  }
  document.execCommand('insertHTML', false, figureHtml);

  pendingBodyImageFile = null;
  imageModal.classList.remove('is-open');
  bodyImageDrop.querySelector('p').textContent = 'Arraste uma imagem, ou clique para escolher';
  updateCounts();
});

// ---------- Guardar ----------
function collectPostData() {
  const title = titleInput.value.trim();
  const subtitle = subtitleField.classList.contains('is-active') ? subtitleInput.value.trim() : '';
  const bodyHtml = editorSurface.innerHTML.trim();
  const date = dateInput.value || new Date().toISOString().slice(0, 10);
  const status = statusSelect.value;

  const slug = DB.uniqueSlug(title || 'sem-titulo', existingPost ? existingPost.id : null);
  const folio = existingPost ? (existingPost.folio || DB.nextFolio()) : DB.nextFolio();

  const post = {
    folio, slug, title, subtitle,
    coverImage: coverImageData,
    coverCaption: coverCaptionInput.value.trim(),
    bodyHtml, status, date,
  };
  if (existingPost) post.id = existingPost.id;
  return post;
}

document.getElementById('btnSave').addEventListener('click', async () => {
  const title = titleInput.value.trim();
  if (!title) {
    Util.toast('Dê um título ao seu texto antes de guardar', 'close');
    titleInput.focus();
    return;
  }
  const btnSave = document.getElementById('btnSave');
  btnSave.disabled = true;
  try {
    const post = collectPostData();
    const saved = await DB.savePost(post);
    existingPost = saved;
    document.getElementById('editorHeading').textContent = 'Editar texto';
    document.getElementById('btnDeleteFromEditor').style.display = 'flex';

    const newUrl = `admin-editor.html?id=${encodeURIComponent(saved.id)}`;
    window.history.replaceState({}, '', newUrl);

    Util.toast(saved.status === 'published' ? 'Texto publicado' : 'Rascunho guardado', 'check');
  } catch (e) {
    console.error('Falha ao guardar post:', e);
    Util.toast(`Falha ao guardar: ${e.message || 'verifique a ligação'}`, 'close');
  } finally {
    btnSave.disabled = false;
  }
});

document.getElementById('btnPreview').addEventListener('click', () => {
  if (!existingPost || !existingPost.slug) {
    Util.toast('Guarde o texto primeiro', 'close');
    return;
  }
  window.open(`texto.html?slug=${encodeURIComponent(existingPost.slug)}`, '_blank');
});

// ---------- Apagar a partir do editor ----------
const deleteModal = document.getElementById('deleteModal');
document.getElementById('btnDeleteFromEditor').addEventListener('click', () => {
  deleteModal.classList.add('is-open');
});
document.getElementById('cancelDelete').addEventListener('click', () => deleteModal.classList.remove('is-open'));
deleteModal.addEventListener('click', (e) => { if (e.target === deleteModal) deleteModal.classList.remove('is-open'); });
document.getElementById('confirmDelete').addEventListener('click', async () => {
  if (existingPost) {
    try {
      await DB.deletePost(existingPost.id);
      Util.toast('Texto apagado', 'check');
      setTimeout(() => window.location.href = 'admin-dashboard.html', 500);
    } catch (e) {
      Util.toast('Falha ao apagar: verifique a ligação', 'close');
    }
  }
});

document.getElementById('btnLogout').addEventListener('click', () => {
  DB.logout();
  window.location.href = 'admin-login.html';
});

// Atalho Ctrl+S para guardar
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    document.getElementById('btnSave').click();
  }
});

}
