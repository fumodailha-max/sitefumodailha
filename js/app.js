import { db, collection, getDocs } from './firebase-config.js';

const produtosContainer = document.getElementById('produtos');

async function carregarProdutos() {
    produtosContainer.innerHTML = '<p class="loading-text">Buscando fumaça...</p>';
    
    const querySnapshot = await getDocs(collection(db, "produtos"));
    
    produtosContainer.innerHTML = ''; // Limpa o loading

    querySnapshot.forEach((doc) => {
        const prod = doc.data();
        
        // Cria o HTML do Card
        const card = `
            <div class="product-card">
                <img src="${prod.imagemUrl}" alt="${prod.nome}">
                <h3>${prod.nome}</h3>
                <p>${prod.descricao}</p>
                <p class="price">R$ ${prod.preco.toFixed(2)}</p>
                <button class="btn-comprar">Ver Detalhes</button>
            </div>
        `;
        produtosContainer.innerHTML += card;
    });
}

// Inicia
carregarProdutos();
