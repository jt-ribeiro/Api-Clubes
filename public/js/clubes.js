// Elementos do DOM
const ligaId = new URLSearchParams(window.location.search).get('ligaId');
const ligaNome = new URLSearchParams(window.location.search).get('ligaNome');
document.getElementById('liga-nome').textContent = `Clubes da Liga: ${ligaNome}`;

const clubFormSection = document.getElementById('clubFormSection');
const clubForm = document.getElementById('clubForm');
const formTitle = document.getElementById('formTitle');
const clubName = document.getElementById('club-name');
const clubLocation = document.getElementById('club-location');
const clubId = document.getElementById('club-id');
const cancelForm = document.getElementById('cancelForm');

// Função para exibir o formulário de adição
const showAddForm = () => {
    formTitle.textContent = 'Adicionar Clube';
    clubName.value = '';
    clubLocation.value = '';
    clubId.value = '';
    clubFormSection.style.display = 'block';
};

// Função para exibir o formulário de edição
const showEditForm = (clube) => {
    formTitle.textContent = 'Editar Clube';
    clubName.value = clube.nome;
    clubLocation.value = clube.localizacao;
    clubId.value = clube.id;
    clubFormSection.style.display = 'block';
};

// Função para ocultar o formulário
const hideForm = () => {
    clubFormSection.style.display = 'none';
};

// Função para carregar clubes
const loadClubes = () => {
    const clubesContainer = document.getElementById('clubes-container');
    fetch(`/clubes/liga?ligaId=${ligaId}`)
        .then((response) => {
            if (!response.ok) throw new Error('Erro ao buscar clubes');
            return response.json();
        })
        .then((data) => {
            clubesContainer.innerHTML = '';
            if (data.length === 0) {
                clubesContainer.innerHTML = '<p style="text-align: center; color: #f00;">Nenhum clube encontrado.</p>';
                return;
            }
            data.forEach((clube) => {
                const clubeCard = document.createElement('div');
                clubeCard.className = 'clube-card';
                clubeCard.innerHTML = `
                    <h3>${clube.nome}</h3>
                    <p><strong>Localização:</strong> ${clube.localizacao}</p>
                    <div class="clube-actions">
                        <button class="btn-edit" title="Editar">✏️</button>
                        <button class="btn-delete" title="Excluir">❌</button>
                    </div>
                `;
                // Evento para redirecionar ao clicar no clube
                clubeCard.addEventListener('click', () => {
                    window.location.href = `/jogadores.html?clubeId=${clube.id}&clubeNome=${encodeURIComponent(clube.nome)}`;
                });
                // Eventos para edição e exclusão
                clubeCard.querySelector('.btn-edit').addEventListener('click', (event) => {
                    event.stopPropagation(); // Evitar conflito com o clique no clube
                    showEditForm(clube);
                });
                clubeCard.querySelector('.btn-delete').addEventListener('click', (event) => {
                    event.stopPropagation(); // Evitar conflito com o clique no clube
                    deleteClube(clube.id);
                });
                clubesContainer.appendChild(clubeCard);
            });
        })
        .catch((error) => console.error('Erro ao carregar clubes:', error));
};

// Função para enviar o formulário (adicionar ou editar clube)
const saveClube = (event) => {
    event.preventDefault();
    const method = clubId.value ? 'PUT' : 'POST';
    const url = clubId.value ? `/clubes/${clubId.value}` : '/clubes';
    const body = {
        nome: clubName.value,
        localizacao: clubLocation.value,
        liga_id: ligaId,
    };

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (!response.ok) throw new Error('Erro ao salvar clube');
            hideForm();
            loadClubes();
        })
        .catch((error) => console.error('Erro ao salvar clube:', error));
};

// Função para excluir clube
const deleteClube = (id) => {
    if (confirm('Tem certeza que deseja excluir este clube?')) {
        fetch(`/clubes/${id}`, { method: 'DELETE' })
            .then((response) => {
                if (!response.ok) throw new Error('Erro ao excluir clube');
                loadClubes();
            })
            .catch((error) => console.error('Erro ao excluir clube:', error));
    }
};

// Eventos
document.getElementById('showAddForm').addEventListener('click', showAddForm);
clubForm.addEventListener('submit', saveClube);
cancelForm.addEventListener('click', hideForm);

// Carregar clubes ao carregar a página
document.addEventListener('DOMContentLoaded', loadClubes);

// Botão voltar
document.getElementById('voltar').addEventListener('click', () => window.history.back());
