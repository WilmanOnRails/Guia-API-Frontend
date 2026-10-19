const API = 'https://api.tenrai.org/v1';
const $ = (id) => document.getElementById(id);
let page = 1, lastQuery = '', lastData = [], hasNext = false, requestController = null;
const fallbackImage = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="100%" height="100%" fill="#20263b"/><text x="50%" y="48%" fill="#9b91d9" font-size="48" text-anchor="middle">✦</text><text x="50%" y="58%" fill="#9ba3bb" font-size="18" text-anchor="middle">Sin imagen</text></svg>`);
function escapeHTML(value = '') { return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function showStatus(message, error = false) { const el = $('status'); el.textContent = message; el.className = 'status show' + (error ? ' error' : ''); }
function hideStatus() { $('status').className = 'status'; }
function titleOf(a) { return a.title_english || a.title || a.title_japanese || 'Título desconocido'; }
function imageOf(a) { return a.images?.webp?.large_image_url || a.images?.jpg?.large_image_url || a.images?.webp?.image_url || a.images?.jpg?.image_url || fallbackImage; }
function listOf(a) { return Array.isArray(a.genres) ? a.genres.map(g => g.name).filter(Boolean) : []; }
function yearOf(a) { return a.year || a.aired?.prop?.from?.year || (a.aired?.from ? new Date(a.aired.from).getFullYear() : '—') || '—'; }
function scoreOf(a) { return typeof a.score === 'number' ? a.score.toFixed(2) : 'N/A'; }
function cardHTML(a) { const genres = listOf(a).slice(0, 3); return `<article class="card" tabindex="0" role="button" aria-label="Ver detalles de ${escapeHTML(titleOf(a))}" data-id="${a.mal_id}"><div class="poster"><img loading="lazy" src="${escapeHTML(imageOf(a))}" alt="Portada de ${escapeHTML(titleOf(a))}" onerror="this.onerror=null;this.src=fallbackImage"><div class="score">★ ${scoreOf(a)}</div></div><div class="card-body"><h3>${escapeHTML(titleOf(a))}</h3><div class="meta"><span>${escapeHTML(a.type || 'Anime')} · ${escapeHTML(String(a.episodes ?? '?'))} ep.</span><span>${escapeHTML(String(yearOf(a)))}</span></div><div class="genres">${genres.length ? genres.map(g => `<span class="genre">${escapeHTML(g)}</span>`).join('') : '<span class="genre">Anime</span>'}</div></div></article>`; }
function render(items) { lastData = items || []; $('results').innerHTML = lastData.length ? lastData.map(cardHTML).join('') : `<div class="empty"><div class="emoji">🫧</div><strong>No encontramos resultados</strong><p>Prueba con otro título o cambia los filtros.</p></div>`; $('resultCount').textContent = lastData.length ? `${lastData.length} resultados` : ''; }
async function api(path, params = {}) { const url = new URL(API + path); Object.entries(params).forEach(([k, v]) => { if (v !== '' && v !== undefined && v !== null) url.searchParams.set(k, v) }); const response = await fetch(url, { headers: { Accept: 'application/json' } }); if (!response.ok) { let detail = ''; try { const body = await response.json(); detail = body.message || body.error || '' } catch { }; const err = new Error(response.status === 429 ? 'Llegamos al límite temporal de consultas. Espera unos segundos e inténtalo de nuevo.' : `La API respondió con error HTTP ${response.status}${detail ? ': ' + detail : ''}.`); err.status = response.status; throw err } return response.json(); }
async function loadAnime({ search = lastQuery, reset = false } = {}) {
    if (reset) page = 1; lastQuery = search; const query = $('query').value.trim(); const chosenQuery = search === undefined ? query : search;
    if (requestController) requestController.abort(); requestController = new AbortController();
    $('results').innerHTML = '<div class="empty"><div class="emoji">✨</div>Buscando en el catálogo...</div>'; hideStatus(); $('prev').disabled = true; $('next').disabled = true;
    $('resultsTitle').textContent = chosenQuery ? 'Resultados de búsqueda' : 'Anime para descubrir'; $('resultsSubtitle').textContent = chosenQuery ? `Coincidencias para “${chosenQuery}”` : 'Explora títulos populares del catálogo';
    try {
        const params = { page, limit: 20, order_by: $('sortFilter').value, sort: $('sortFilter').value === 'title' ? 'asc' : 'desc', sfw: 'true', 'sfw-strict': 'true' };
        if (chosenQuery) params.q = chosenQuery;
        if ($('typeFilter').value) params.type = $('typeFilter').value;
        if ($('genreFilter').value) params.genres = $('genreFilter').value;
        const result = await api(chosenQuery || $('typeFilter').value || $('genreFilter').value ? '/anime' : '/top/anime', params);
        render(result.data || []);
        const pagination = result.pagination || {};
        hasNext = Boolean(pagination.has_next_page);
        $('prev').disabled = page <= 1; $('next').disabled = !hasNext;
        $('resultCount').textContent = pagination.items?.total ? `${pagination.items.total.toLocaleString()} títulos` : `${(result.data || []).length} títulos`;
        if (!result.data?.length) showStatus('No hay coincidencias con esos filtros. Prueba con un término distinto.');
    } catch (err) { render([]); showStatus(`${err.message} Comprueba tu conexión o consulta el estado de Tenrai.`, true); }
}
async function loadGenres() { try { const r = await api('/genres/anime'); const items = r.data || []; items.forEach(g => { const opt = document.createElement('option'); opt.value = g.mal_id; opt.textContent = g.name; $('genreFilter').appendChild(opt); }); } catch (e) {/* El buscador sigue funcionando aunque los géneros no carguen. */ } }
async function showDetails(id) { $('modalContent').innerHTML = '<div class="empty">Cargando detalles del anime...</div>'; $('modal').classList.add('open'); document.body.style.overflow = 'hidden'; try { const r = await api(`/anime/${id}/full`); const a = r.data; if (!a) throw new Error('No se encontraron detalles.'); const genres = listOf(a); const synopsis = a.synopsis || 'Todavía no hay una sinopsis disponible para este título.'; const studios = (a.studios || []).map(s => s.name).join(', ') || 'No disponible'; const themes = (a.themes || []).map(s => s.name).join(', ') || 'No disponible'; $('modalContent').innerHTML = `<div class="detail"><div><img src="${escapeHTML(imageOf(a))}" alt="Portada de ${escapeHTML(titleOf(a))}" onerror="this.onerror=null;this.src=fallbackImage"></div><div><div class="eyebrow">FICHA DE ANIME</div><h2>${escapeHTML(titleOf(a))}</h2><div class="jtitle">${escapeHTML(a.title_japanese || '')} ${a.year ? '· ' + escapeHTML(String(a.year)) : ''}</div><div class="stats"><div class="stat"><small>★ PUNTUACIÓN</small><strong>${escapeHTML(scoreOf(a))}/10</strong></div><div class="stat"><small>RANKING</small><strong>${a.rank ? '#' + escapeHTML(String(a.rank)) : '—'}</strong></div><div class="stat"><small>EPISODIOS</small><strong>${escapeHTML(String(a.episodes ?? '—'))}</strong></div></div><div class="genres">${genres.map(g => `<span class="genre">${escapeHTML(g)}</span>`).join('')}</div><p>${escapeHTML(synopsis)}</p><p><strong>Formato:</strong> ${escapeHTML(a.type || '—')} · <strong>Estado:</strong> ${escapeHTML(a.status || '—')}<br><strong>Temporada:</strong> ${escapeHTML(a.season || '—')} ${a.year ? ' ' + escapeHTML(String(a.year)) : ''}<br><strong>Estudio:</strong> ${escapeHTML(studios)}<br><strong>Temas:</strong> ${escapeHTML(themes)}</p><a href="${escapeHTML(a.url || 'https://myanimelist.net/')}" target="_blank" rel="noopener">Ver ficha original ↗</a></div></div>`; } catch (err) { $('modalContent').innerHTML = `<div class="empty"><div class="emoji">⚠️</div>${escapeHTML(err.message)}<p>Inténtalo de nuevo en unos segundos.</p></div>`; } }
let randomBusy = false, useRandomEndpoint = true;
function isSafe(a) { return !/^Rx/i.test(a.rating || '') && !(a.explicit_genres || []).length && !(a.genres || []).some(g => /hentai|erotica/i.test(g.name)); }
async function randomAnime() {
    if (randomBusy) return; randomBusy = true; $('randomBtn').disabled = true;
    $('modalContent').innerHTML = '<div class="empty"><div class="emoji">🎲</div>Sacando un anime al azar...</div>'; $('modal').classList.add('open'); document.body.style.overflow = 'hidden';
    try {
        let pick = null;
        for (let i = 0; i < 4 && !pick; i++) {
            let c = null;
            if (useRandomEndpoint) { try { c = (await api('/random/anime', { sfw: 'true' })).data || null; } catch (e) { if (e.status && e.status !== 429) useRandomEndpoint = false; } }
            if (!c) { const r = await api('/top/anime', { page: 1 + Math.floor(Math.random() * 40), limit: 25, sfw: 'true', 'sfw-strict': 'true' }); const l = r.data || []; c = l[Math.floor(Math.random() * l.length)] || null; }
            if (c && isSafe(c)) pick = c;
        }
        if (!$('modal').classList.contains('open')) return;
        if (!pick) throw new Error('No se pudo elegir un anime. Inténtalo de nuevo.');
        await showDetails(pick.mal_id);
    } catch (err) {
        if ($('modal').classList.contains('open')) $('modalContent').innerHTML = `<div class="empty"><div class="emoji">⚠️</div>${escapeHTML(err.message)}<p>Inténtalo de nuevo en unos segundos.</p></div>`;
    } finally { randomBusy = false; $('randomBtn').disabled = false; }
}
$('randomBtn').addEventListener('click', randomAnime);
$('searchForm').addEventListener('submit', e => { e.preventDefault(); loadAnime({ search: $('query').value.trim(), reset: true }); });
$('typeFilter').addEventListener('change', () => loadAnime({ search: $('query').value.trim(), reset: true }));
$('sortFilter').addEventListener('change', () => loadAnime({ search: $('query').value.trim(), reset: true }));
$('genreFilter').addEventListener('change', () => loadAnime({ search: $('query').value.trim(), reset: true }));
$('prev').addEventListener('click', () => { if (page > 1) { page--; loadAnime({ search: $('query').value.trim() }); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
$('next').addEventListener('click', () => { if (hasNext) { page++; loadAnime({ search: $('query').value.trim() }); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
$('results').addEventListener('click', e => { const card = e.target.closest('[data-id]'); if (card) showDetails(card.dataset.id); });
$('results').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-id]')) { e.preventDefault(); showDetails(e.target.dataset.id); } });
function closeModal() { $('modal').classList.remove('open'); document.body.style.overflow = ''; }
$('closeModal').addEventListener('click', closeModal); $('modal').addEventListener('click', e => { if (e.target === $('modal')) closeModal(); }); document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
(async () => { await loadGenres(); await loadAnime({ search: '', reset: true }); })();
