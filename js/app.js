import { db, collection, getDocs } from './firebase-config.js';

const produtosContainer = document.getElementById('produtos');
const categoriasContainer = document.getElementById('categorias-nav');

// Variável global para guardar os produtos e não precisar buscar no banco toda hora
let todosProdutos = [];

// ==========================================
// 1. CARREGAR CATEGORIAS E CRIAR BOTÕES
// ==========================================
async function carregarCategorias() {
    try {
        const querySnapshot = await getDocs(collection(db, "categorias"));
        
        // 1. Criar botão "Todos" (Padrão)
        let htmlBotoes = `
            <button class="filter-btn active" data-id="todos">
                Todos
            </button>
        `;

        // 2. Criar botão para cada categoria do banco
        querySnapshot.forEach((doc) => {
            const cat = doc.data();
            htmlBotoes += `
                <button class="filter-btn" data-id="${doc.id}">
                    ${cat.nome}
                </button>
            `;
        });

        categoriasContainer.innerHTML = htmlBotoes;

        // 3. Adicionar eventos de clique nos botões
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove a classe 'active' de todos e adiciona no clicado
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Pega o ID da categoria e filtra
                const catId = e.target.getAttribute('data-id');
                filtrarProdutos(catId);
            });
        });

    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

// ==========================================
// 2. CARREGAR PRODUTOS (DO BANCO)
// ==========================================
async function buscarProdutos() {
    produtosContainer.innerHTML = '<p class="loading-text">Carregando a fumaça...</p>';
    
    try {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        todosProdutos = []; // Limpa a lista

        querySnapshot.forEach((doc) => {
            // Guarda os dados + o ID do produto numa lista na memória
            todosProdutos.push({ id: doc.id, ...doc.data() });
        });

        // Renderiza tudo inicialmente
        renderizarProdutos(todosProdutos);

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        produtosContainer.innerHTML = '<p class="loading-text" style="color:red">Erro ao buscar produtos.</p>';
    }
}

// ==========================================
// 3. FILTRAR PRODUTOS (NA MEMÓRIA)
// ==========================================
function filtrarProdutos(categoriaId) {
    if (categoriaId === 'todos') {
        renderizarProdutos(todosProdutos);
    } else {
        // Filtra apenas os produtos que tem o ID da categoria igual ao botão clicado
        const filtrados = todosProdutos.filter(prod => prod.categoriaId === categoriaId);
        renderizarProdutos(filtrados);
    }
}

// ==========================================
// 4. RENDERIZAR NA TELA (HTML)
// ==========================================
function renderizarProdutos(listaDeProdutos) {
    produtosContainer.innerHTML = ''; // Limpa a tela

    if (listaDeProdutos.length === 0) {
        produtosContainer.innerHTML = '<p class="loading-text">Nenhum produto nesta categoria.</p>';
        return;
    }

    listaDeProdutos.forEach((prod) => {
        // Usa imagem padrão se não tiver url
        const imagem = prod.imagemUrl || "https://placehold.co/600x400/1a1a1a/FFF?text=Sem+Foto";

        const card = `
            <div class="product-card">
                <div class="card-image-wrapper">
                    <img src="${imagem}" alt="${prod.nome}" loading="lazy">
                </div>
                <div class="card-content">
                    <h3>${prod.nome}</h3>
                    <p>${prod.descricao}</p>
                    <p class="price">R$ ${prod.preco.toFixed(2)}</p>
                    <button class="btn-comprar">Ver Detalhes</button>
                </div>
            </div>
        `;
        produtosContainer.innerHTML += card;
    });
}

// Inicia o App
carregarCategorias();
buscarProdutos();
