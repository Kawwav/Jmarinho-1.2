// Substitui o supabaseClient.js — fala com o backend PHP próprio.
const API_URL = '/api'

async function request(path, options = {}) {
  const ehFormData = options.body instanceof FormData

  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include', // manda o cookie de sessão junto
    headers: ehFormData ? {} : { 'Content-Type': 'application/json' },
    ...options,
  })

  const dados = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(dados.erro || 'Erro na requisição.')
  }
  return dados
}

export const api = {
  // ── Autenticação ──────────────────────────────
  login: (email, senha) =>
    request('/auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  logout: () => request('/auth.php?action=logout', { method: 'POST' }),

  checkSessao: () => request('/auth.php?action=check'),

  // ── Imóveis ───────────────────────────────────
  listarImoveis: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/imoveis.php${qs ? '?' + qs : ''}`)
  },

  buscarImovel: (id) => request(`/imoveis.php?id=${id}`),

  criarImovel: (dados) =>
    request('/imoveis.php', { method: 'POST', body: JSON.stringify(dados) }),

  atualizarImovel: (id, dados) =>
    request(`/imoveis.php?id=${id}`, { method: 'PUT', body: JSON.stringify(dados) }),

  removerImovel: (id) =>
    request(`/imoveis.php?id=${id}`, { method: 'DELETE' }),

  // ── Upload de imagem ──────────────────────────
  uploadImagem: (file) => {
    const formData = new FormData()
    formData.append('imagem', file)
    return request('/upload.php', { method: 'POST', body: formData })
  },
}
