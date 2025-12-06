import { db, storage, auth, collection, addDoc, getDocs, ref, uploadBytes, getDownloadURL, onAuthStateChanged } from './firebase-config.js';

// Verifica se está logado. Se não, chuta pro login
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

// 1. Carregar Categorias no Select
const catSelect = document.getElementById('prod-categoria');

async function carregarCategorias() {
    const querySnapshot = await getDocs(collection(db, "categorias"));
    catSelect.innerHTML = '<option value="">Selecione...</option>';
    querySnapshot.forEach((doc) => {
        catSelect.innerHTML += `<option value="${doc.id}">${doc.data().nome}</option>`;
    });
}
carregarCategorias();

// 2. Adicionar Nova Categoria
document.getElementById('btn-add-cat').addEventListener('click', async () => {
    const nomeCat = document.getElementById('cat-nome').value;
    if(nomeCat) {
        await addDoc(collection(db, "categorias"), { nome: nomeCat });
        alert("Categoria criada!");
        carregarCategorias(); // Atualiza o select
    }
});

// 3. Adicionar Produto (Com Imagem)
document.getElementById('btn-add-prod').addEventListener('click', async () => {
    const nome = document.getElementById('prod-nome').value;
    const preco = document.getElementById('prod-preco').value;
    const desc = document.getElementById('prod-desc').value;
    const catId = document.getElementById('prod-categoria').value;
    const imgFile = document.getElementById('prod-img').files[0];

    if (!imgFile || !nome || !preco) {
        alert("Preencha tudo e selecione uma imagem!");
        return;
    }

    document.getElementById('upload-status').innerText = "Enviando imagem...";

    try {
        // A. Upload da Imagem pro Storage
        const storageRef = ref(storage, 'produtos/' + imgFile.name + Date.now());
        await uploadBytes(storageRef, imgFile);
        const urlImagem = await getDownloadURL(storageRef);

        // B. Salvar dados no Firestore
        await addDoc(collection(db, "produtos"), {
            nome: nome,
            preco: parseFloat(preco),
            descricao: desc,
            categoriaId: catId,
            imagemUrl: urlImagem,
            dataCriacao: new Date()
        });

        alert("Produto cadastrado com sucesso!");
        document.getElementById('upload-status').innerText = "";
        // Limpar campos...
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao salvar: " + error.message);
    }
});
