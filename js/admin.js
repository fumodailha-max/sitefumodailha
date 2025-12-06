import { db, storage, auth, collection, addDoc, getDocs, ref, uploadBytes, getDownloadURL, onAuthStateChanged, signOut } from './firebase-config.js';

// Elementos do DOM
const catSelect = document.getElementById('prod-categoria');
const btnLogout = document.getElementById('btn-logout');

// ==========================================
// 1. VERIFICAÇÃO DE SEGURANÇA (O CORAÇÃO DO FIX)
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Se tem usuário, e SÓ AGORA, carregamos as coisas
        console.log("Usuário logado:", user.email);
        carregarCategorias();
    } else {
        // Se não tem usuário, chuta pro login
        window.location.href = "login.html";
    }
});

// Logout
if(btnLogout) {
    btnLogout.addEventListener('click', () => {
        signOut(auth).then(() => {
            alert("Saiu!");
            window.location.href = "login.html";
        });
    });
}

// ==========================================
// 2. FUNÇÕES DO SISTEMA
// ==========================================

// Função para Carregar Categorias no Select
async function carregarCategorias() {
    try {
        const querySnapshot = await getDocs(collection(db, "categorias"));
        catSelect.innerHTML = '<option value="">Selecione a Categoria</option>';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Cria a opção no select
            const option = document.createElement('option');
            option.value = doc.id; // Usa o ID do documento
            option.textContent = data.nome;
            catSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        alert("Erro de permissão: Você está logado como admin?");
    }
}

// Botão: Criar Nova Categoria
const btnAddCat = document.getElementById('btn-add-cat');
if(btnAddCat) {
    btnAddCat.addEventListener('click', async () => {
        const nomeCat = document.getElementById('cat-nome').value;
        if(nomeCat) {
            try {
                await addDoc(collection(db, "categorias"), { nome: nomeCat });
                alert("Categoria criada com sucesso!");
                document.getElementById('cat-nome').value = ""; // Limpa campo
                carregarCategorias(); // Recarrega a lista
            } catch (error) {
                console.error("Erro ao criar categoria:", error);
                alert("Erro: " + error.message);
            }
        } else {
            alert("Digite um nome para a categoria!");
        }
    });
}

// Botão: Adicionar Produto
const btnAddProd = document.getElementById('btn-add-prod');
if(btnAddProd) {
    btnAddProd.addEventListener('click', async () => {
        const nome = document.getElementById('prod-nome').value;
        const preco = document.getElementById('prod-preco').value;
        const desc = document.getElementById('prod-desc').value;
        const catId = document.getElementById('prod-categoria').value;
        const imgFile = document.getElementById('prod-img').files[0];
        const statusMsg = document.getElementById('upload-status');

        if (!imgFile || !nome || !preco || !catId) {
            alert("Preencha todos os campos e selecione uma imagem!");
            return;
        }

        statusMsg.innerText = "Enviando imagem... Aguarde.";

        try {
            // A. Upload da Imagem
            const storageRef = ref(storage, 'produtos/' + Date.now() + '-' + imgFile.name);
            await uploadBytes(storageRef, imgFile);
            const urlImagem = await getDownloadURL(storageRef);

            // B. Salvar no Banco de Dados
            await addDoc(collection(db, "produtos"), {
                nome: nome,
                preco: parseFloat(preco),
                descricao: desc,
                categoriaId: catId,
                imagemUrl: urlImagem,
                dataCriacao: new Date()
            });

            alert("Produto cadastrado com sucesso!");
            statusMsg.innerText = "";
            // Limpar formulário (opcional)
            document.getElementById('prod-nome').value = "";
            document.getElementById('prod-img').value = "";
            
        } catch (error) {
            console.error("Erro:", error);
            statusMsg.innerText = "Erro ao salvar.";
            alert("Erro ao salvar: " + error.message);
        }
    });
}
