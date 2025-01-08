document.addEventListener('DOMContentLoaded', () => {
    const ligasContainer = document.getElementById('outputLigas');
    const fetchLigasButton = document.getElementById('fetchLigas');
    const createLigaForm = document.getElementById('createLigaForm');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const modal = document.getElementById('modal');

// Abrir o modal ao clicar no botão
if (openModalButton) {
    openModalButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
}

// Fechar o modal ao clicar no botão de fechar
if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Fechar o modal ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

    // Função para carregar todas as ligas
    const loadLigas = () => {
        if (!ligasContainer) return;
        ligasContainer.innerHTML = '<p>🔄 Carregando ligas...</p>';

        fetch('/ligas')
            .then(response => response.json())
            .then(data => {
                ligasContainer.innerHTML = '<h3>🏆 Ligas:</h3>';
                const list = document.createElement('ul');
                data.forEach(liga => {
                    const item = document.createElement('li');
                    item.innerHTML = `
                        <span>${liga.nome}</span>
                        <span>
                            <button class="edit-liga" data-id="${liga.id}" title="Editar">✏️</button>
                            <button class="delete-liga" data-id="${liga.id}" title="Excluir">❌</button>
                        </span>
                    `;
                    item.style.display = 'flex';
                    item.style.justifyContent = 'space-between';
                    item.style.alignItems = 'center';
                    list.appendChild(item);
                });
                ligasContainer.appendChild(list);

                // Habilitar o botão "Criar Liga" após o carregamento
                if (openModalButton) openModalButton.disabled = false;

                // Adicionar funcionalidade de editar
                document.querySelectorAll('.edit-liga').forEach(button => {
                    button.addEventListener('click', () => {
                        const id = button.getAttribute('data-id');
                        const novoNome = prompt('Digite o novo nome da liga:');
                        const novaDescricao = prompt('Digite a nova descrição da liga:');
                        if (novoNome && novaDescricao) {
                            fetch(`/ligas/${id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ nome: novoNome, descricao: novaDescricao }),
                            })
                                .then(response => response.text())
                                .then(() => loadLigas())
                                .catch(error => console.error('Erro ao atualizar liga:', error));
                        }
                    });
                });

                // Adicionar funcionalidade de excluir
                document.querySelectorAll('.delete-liga').forEach(button => {
                    button.addEventListener('click', () => {
                        const id = button.getAttribute('data-id');
                        if (confirm('Tem certeza que deseja excluir esta liga?')) {
                            fetch(`/ligas/${id}`, { method: 'DELETE' })
                                .then(response => response.text())
                                .then(() => loadLigas())
                                .catch(error => console.error('Erro ao excluir liga:', error));
                        }
                    });
                });
            })
            .catch(error => {
                ligasContainer.innerHTML = `<p style="color: red;">❌ ${error.message}</p>`;
            });
    };

    // Criar nova liga
    if (createLigaForm) {
        createLigaForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const nome = document.getElementById('nome').value;
            const descricao = document.getElementById('descricao').value;

            fetch('/ligas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, descricao }),
            })
                .then(response => response.text())
                .then(() => {
                    createLigaForm.reset();
                    modal.style.display = 'none'; // Fechar o modal
                    loadLigas(); // Atualizar a lista de ligas
                })
                .catch(error => console.error('Erro ao criar liga:', error));
        });
    }

    // Carregar ligas ao carregar a página
    if (fetchLigasButton) {
        fetchLigasButton.addEventListener('click', loadLigas);
    } else {
        loadLigas(); // Se o botão não existir, carregue diretamente
    }
});
