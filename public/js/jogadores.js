// Elementos do DOM
const clubeId = new URLSearchParams(window.location.search).get('clubeId');
const clubeNome = new URLSearchParams(window.location.search).get('clubeNome');
document.getElementById('clube-nome').textContent = `Jogadores do Clube: ${clubeNome}`;

const playerFormSection = document.getElementById('playerFormSection');
const playerForm = document.getElementById('playerForm');
const formTitle = document.getElementById('formTitle');
const playerName = document.getElementById('player-name');
const playerPosition = document.getElementById('player-position');
const playerId = document.getElementById('player-id');
const cancelForm = document.getElementById('cancelForm');

// Função para exibir o formulário de adição
const showAddForm = () => {
    formTitle.textContent = 'Adicionar Jogador';
    playerName.value = '';
    playerPosition.value = '';
    playerId.value = '';
    playerFormSection.style.display = 'block';
};

// Função para exibir o formulário de edição
const showEditForm = (jogador) => {
    formTitle.textContent = 'Editar Jogador';
    playerName.value = jogador.nome;
    playerPosition.value = jogador.posicao;
    playerId.value = jogador.id;
    playerFormSection.style.display = 'block';
};

// Função para ocultar o formulário
const hideForm = () => {
    playerFormSection.style.display = 'none';
};

// Função para carregar jogadores
const loadJogadores = () => {
    const jogadoresContainer = document.getElementById('jogadores-container');
    fetch(`/jogadores/clube/${clubeId}`)
        .then((response) => {
            if (!response.ok) throw new Error('Erro ao buscar jogadores');
            return response.json();
        })
        .then((data) => {
            jogadoresContainer.innerHTML = '';
            if (data.length === 0) {
                jogadoresContainer.innerHTML = '<p style="text-align: center; color: #f00;">Nenhum jogador encontrado.</p>';
                return;
            }
            data.forEach((jogador) => {
                const jogadorCard = document.createElement('div');
                jogadorCard.className = 'jogador-card';
                jogadorCard.innerHTML = `
                    <h3>${jogador.nome}</h3>
                    <p><strong>Posição:</strong> ${jogador.posicao}</p>
                    <div class="jogador-actions">
                        <button class="btn-edit" title="Editar">✏️</button>
                        <button class="btn-delete" title="Excluir">❌</button>
                    </div>
                `;
                jogadorCard.querySelector('.btn-edit').addEventListener('click', () => showEditForm(jogador));
                jogadorCard.querySelector('.btn-delete').addEventListener('click', () => deleteJogador(jogador.id));
                jogadoresContainer.appendChild(jogadorCard);
            });
        })
        .catch((error) => console.error('Erro ao carregar jogadores:', error));
};

// Função para enviar o formulário (adicionar ou editar jogador)
const saveJogador = (event) => {
    event.preventDefault();
    const method = playerId.value ? 'PUT' : 'POST';
    const url = playerId.value ? `/jogadores/${playerId.value}` : '/jogadores';
    const body = {
        nome: playerName.value,
        posicao: playerPosition.value,
        clube_id: clubeId,
    };

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (!response.ok) throw new Error('Erro ao salvar jogador');
            hideForm();
            loadJogadores();
        })
        .catch((error) => console.error('Erro ao salvar jogador:', error));
};

// Função para excluir jogador
const deleteJogador = (id) => {
    if (confirm('Tem certeza que deseja excluir este jogador?')) {
        fetch(`/jogadores/${id}`, { method: 'DELETE' })
            .then((response) => {
                if (!response.ok) throw new Error('Erro ao excluir jogador');
                loadJogadores();
            })
            .catch((error) => console.error('Erro ao excluir jogador:', error));
    }
};

// Eventos
document.getElementById('showAddForm').addEventListener('click', showAddForm);
playerForm.addEventListener('submit', saveJogador);
cancelForm.addEventListener('click', hideForm);

// Carregar jogadores ao carregar a página
document.addEventListener('DOMContentLoaded', loadJogadores);

// Botão voltar
document.getElementById('voltar').addEventListener('click', () => window.history.back());
