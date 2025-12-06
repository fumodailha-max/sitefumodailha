import { db, collection, getDocs } from './firebase-config.js';

const produtosContainer = document.getElementById('produtos');

async function carregarProdutos() {
    produtosContainer.innerHTML = '<p class="loading-text">Carregando estoque...</p>';
    
    try {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        produtosContainer.innerHTML = ''; // Limpa o loading

        if (querySnapshot.empty) {
            produtosContainer.innerHTML = '<p class="loading-text">Nenhum produto cadastrado ainda.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const prod = doc.data();
            
            // ATUALIZADO: Estrutura HTML mais profissional
            const card = `
                <div class="product-card">
                    <div class="card-image-wrapper">
                        <img src="${prod.imagemUrl}" alt="${prod.nome}" loading="lazy">
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
    } catch (error) {
        console.error("Erro ao carregar:", error);
        produtosContainer.innerHTML = '<p class="loading-text" style="color:red">Erro ao carregar produtos.</p>';
    }
}

// Inicia
carregarProdutos();
