// supabase-config.js - Configuração e Inicialização do Cliente Supabase

// Recupera as credenciais do localStorage ou usa as padrão do projeto
let SUPABASE_URL = localStorage.getItem('supabase_url') || 'https://lgkwvynotzuasvtyjbap.supabase.co';
let SUPABASE_KEY = localStorage.getItem('supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna3d2eW5vdHp1YXN2dHlqYmFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE3NTU5OCwiZXhwIjoyMDk5NzUxNTk4fQ.R2-RW_E0nHf_mnMi3ybJaoc9TyDteMSUcELc1ytwGhU';
let supabaseClient = null;

// Verifica se as credenciais estão salvas e inicializa o cliente
if (SUPABASE_URL && SUPABASE_KEY) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.error("Erro ao inicializar Supabase: ", e);
    }
}

// Função para salvar credenciais e inicializar o cliente
function saveSupabaseCredentials(url, key) {
    if (!url || !key) return false;
    
    // Limpa strings
    url = url.trim();
    key = key.trim();
    
    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_key', key);
    
    SUPABASE_URL = url;
    SUPABASE_KEY = key;
    
    try {
        supabaseClient = window.supabase.createClient(url, key);
        return true;
    } catch (e) {
        console.error("Falha ao inicializar o Supabase com essas chaves:", e);
        return false;
    }
}

// Função para limpar as credenciais salvas
function clearSupabaseCredentials() {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_key');
    SUPABASE_URL = '';
    SUPABASE_KEY = '';
    supabaseClient = null;
    window.location.reload();
}

// Cria o modal de credenciais se não estiver configurado
function checkSupabaseConnection() {
    if (!supabaseClient) {
        showSupabaseModal();
    } else {
        const modal = document.getElementById('supabase-modal');
        if (modal) modal.classList.add('hidden');
    }
}

// Exibe o modal para inserir as credenciais
function showSupabaseModal() {
    // Remove modal anterior se houver
    const oldModal = document.getElementById('supabase-modal');
    if (oldModal) oldModal.remove();

    const modalHTML = `
        <div id="supabase-modal" class="supabase-modal">
            <div class="glass-card supabase-credentials-box">
                <h2 style="font-family: var(--font-heading); margin-bottom: 12px; font-weight: 700;">Conectar ao seu Supabase</h2>
                <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
                    Para que o aplicativo funcione com persistência e atualizações em tempo real (Realtime), conecte-o ao seu banco de dados Supabase. 
                    <br><br>
                    <strong>Como obter:</strong> Vá em <em>Settings > API</em> no painel do seu projeto Supabase e copie a URL do projeto e a chave Anon Public. Rode também o script <code style="background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: #fff;">setup.sql</code> no seu SQL Editor.
                </p>
                <div class="input-group">
                    <label for="modal-supabase-url">Project URL (API URL)</label>
                    <input type="text" id="modal-supabase-url" class="input-control" placeholder="https://xxxxxx.supabase.co" value="${SUPABASE_URL}">
                </div>
                <div class="input-group">
                    <label for="modal-supabase-key">API Anon Key (Public Key)</label>
                    <input type="password" id="modal-supabase-key" class="input-control" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${SUPABASE_KEY}">
                </div>
                <div style="display: flex; gap: 10px; margin-top: 24px;">
                    <button id="btn-save-supabase" class="btn-primary">Salvar e Conectar</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('btn-save-supabase').addEventListener('click', () => {
        const url = document.getElementById('modal-supabase-url').value;
        const key = document.getElementById('modal-supabase-key').value;
        
        if (saveSupabaseCredentials(url, key)) {
            document.getElementById('supabase-modal').classList.add('hidden');
            // Recarrega a página atual para aplicar a conexão do Supabase
            window.location.reload();
        } else {
            alert('Erro ao configurar as credenciais. Verifique os dados inseridos.');
        }
    });
}
