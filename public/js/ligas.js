document.addEventListener('DOMContentLoaded', () => {
    const ligasContainer = document.getElementById('outputLigas');
    const fetchLigasButton = document.getElementById('fetchLigas');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const modal = document.getElementById('modal');
    const createLigaForm = document.getElementById('createLigaForm');

    // Ocultar o modal ao carregar a página
    modal.style.display = 'none';

    // Abrir o modal ao clicar no botão "Criar Liga"
    if (openModalButton) {
        openModalButton.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    // Fechar o modal ao clicar no botão "✖"
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
        console.log('Tentando carregar ligas...');
        ligasContainer.innerHTML = '<p>🔄 Carregando ligas...</p>';
    
        fetch('/ligas')
            .then((response) => {
                console.log('Resposta recebida:', response);
                if (!response.ok) throw new Error('Erro ao carregar ligas');
                return response.json();
            })
            .then((data) => {
                console.log('Dados recebidos:', data);
                ligasContainer.innerHTML = '<h3>🏆 Ligas:</h3>';
                const list = document.createElement('ul');
                data.forEach((liga) => {
                    const item = document.createElement('li');
                    item.innerHTML = `
                        <span>${liga.nome}</span>
                        <span>
                            <button class="edit-liga" data-id="${liga.id}" title="Editar">✏️</button>
                            <button class="delete-liga" data-id="${liga.id}" title="Excluir">❌</button>
                        </span>
                    `;
                    item.style.cursor = 'pointer';
                    item.style.display = 'flex';
                    item.style.justifyContent = 'space-between';
                    item.style.alignItems = 'center';
    
                    // Adicionar evento de clique para redirecionar para clubes.html
                    item.addEventListener('click', () => {
                        window.location.href = `/clubes.html?ligaId=${liga.id}&ligaNome=${encodeURIComponent(liga.nome)}`;
                    });
    
                    list.appendChild(item);
    
                    // Botões de editar e excluir não devem conflitar com o clique geral
                    item.querySelector('.edit-liga').addEventListener('click', (event) => {
                        event.stopPropagation();
                        const id = event.target.getAttribute('data-id');
                        const novoNome = prompt('Digite o novo nome da liga:');
                        const novaDescricao = prompt('Digite a nova descrição da liga:');
                        if (novoNome && novaDescricao) {
                            fetch(`/ligas/${id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ nome: novoNome, descricao: novaDescricao }),
                            })
                                .then((response) => {
                                    if (!response.ok) throw new Error('Erro ao atualizar liga');
                                    return response.text();
                                })
                                .then(() => loadLigas())
                                .catch((error) => console.error('Erro ao atualizar liga:', error));
                        }
                    });
    
                    item.querySelector('.delete-liga').addEventListener('click', (event) => {
                        event.stopPropagation();
                        const id = event.target.getAttribute('data-id');
                        if (confirm('Tem certeza que deseja excluir esta liga?')) {
                            fetch(`/ligas/${id}`, { method: 'DELETE' })
                                .then((response) => {
                                    if (!response.ok) throw new Error('Erro ao excluir liga');
                                    return response.text();
                                })
                                .then(() => loadLigas())
                                .catch((error) => console.error('Erro ao excluir liga:', error));
                        }
                    });
                });
                ligasContainer.appendChild(list);
            })
            .catch((error) => {
                console.error('Erro ao carregar ligas:', error);
                ligasContainer.innerHTML = `<p style="color: red;">❌ ${error.message}</p>`;
            });
    };

    // Associar a função "loadLigas" ao botão "Carregar Ligas"
    if (fetchLigasButton) {
        fetchLigasButton.addEventListener('click', loadLigas);
    }

    // Função para criar uma nova liga
    if (createLigaForm) {
        createLigaForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Obter os dados do formulário
            const nome = document.getElementById('nome').value;
            const descricao = document.getElementById('descricao').value;

            fetch('/ligas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, descricao }),
            })
                .then((response) => {
                    if (!response.ok) throw new Error('Erro ao criar liga');
                    return response.text();
                })
                .then(() => {
                    createLigaForm.reset();
                    modal.style.display = 'none';
                    loadLigas();
                })
                .catch((error) => console.error('Erro ao criar liga:', error));
        });
    }
});


