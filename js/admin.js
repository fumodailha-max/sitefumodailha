import { db, storage, auth, collection, addDoc, getDocs, ref, uploadBytes, getDownloadURL, onAuthStateChanged, signOut } from './firebase-config.js';

// Elementos do DOM
const catSelect = document.getElementById('prod-categoria');
const btnLogout = document.getElementById('btn-logout');

// ==========================================
// 1. VERIFICAÇÃO DE SEGURANÇA
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Admin logado:", user.email);
        carregarCategorias();
    } else {
        window.location.href = "login.html";
    }
});

// Logout
if(btnLogout) {
    btnLogout.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = "login.html";
        });
    });
}

// ==========================================
// 2. FUNÇÕES DO SISTEMA
// ==========================================

// Carregar Categorias
async function carregarCategorias() {
    try {
        const querySnapshot = await getDocs(collection(db, "categorias"));
        catSelect.innerHTML = '<option value="">Selecione a Categoria</option>';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = data.nome;
            catSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

// Criar Categoria
const btnAddCat = document.getElementById('btn-add-cat');
if(btnAddCat) {
    btnAddCat.addEventListener('click', async () => {
        const nomeCat = document.getElementById('cat-nome').value;
        if(nomeCat) {
            try {
                await addDoc(collection(db, "categorias"), { nome: nomeCat });
                alert("Categoria criada!");
                document.getElementById('cat-nome').value = "";
                carregarCategorias();
            } catch (error) {
                alert("Erro ao criar categoria: " + error.message);
            }
        } else {
            alert("Dê um nome para a categoria!");
        }
    });
}

// ==========================================
// 3. ADICIONAR PRODUTO (MODIFICADO)
// ==========================================
const btnAddProd = document.getElementById('btn-add-prod');
if(btnAddProd) {
    btnAddProd.addEventListener('click', async () => {
        const nome = document.getElementById('prod-nome').value;
        const preco = document.getElementById('prod-preco').value;
        const desc = document.getElementById('prod-desc').value;
        const catId = document.getElementById('prod-categoria').value;
        const imgFile = document.getElementById('prod-img').files[0];
        const statusMsg = document.getElementById('upload-status');

        // VALIDAÇÃO: Removi a obrigação da imagem (!imgFile)
        if (!nome || !preco || !catId) {
            alert("Preencha pelo menos Nome, Preço e Categoria!");
            return;
        }

        statusMsg.innerText = "Processando...";

        try {
            // Define uma imagem padrão (Placeholder cinza escuro para combinar com o tema)
            let urlImagem = "https://placehold.co/600x400/1a1a1a/FFF?text=Sem+Foto";

            // Só tenta fazer upload SE o usuário selecionou um arquivo
            if (imgFile) {
                statusMsg.innerText = "Enviando imagem...";
                const storageRef = ref(storage, 'produtos/' + Date.now() + '-' + imgFile.name);
                await uploadBytes(storageRef, imgFile);
                urlImagem = await getDownloadURL(storageRef);
            }

            // Salva no Banco de Dados
            await addDoc(collection(db, "produtos"), {
                nome: nome,
                preco: parseFloat(preco),
                descricao: desc,
                categoriaId: catId,
                imagemUrl: urlImagem, // Vai a url do upload OU a url padrão
                dataCriacao: new Date()
            });

            alert("Produto cadastrado com sucesso!");
            statusMsg.innerText = "";
            
            // Limpar formulário
            document.getElementById('prod-nome').value = "";
            document.getElementById('prod-preco').value = "";
            document.getElementById('prod-desc').value = "";
            document.getElementById('prod-img').value = ""; // Reseta o input file
            
        } catch (error) {
            console.error("Erro:", error);
            statusMsg.innerText = "Erro ao salvar.";
            alert("Erro: " + error.message);
        }
    });
}
