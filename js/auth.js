import { auth, signInWithEmailAndPassword } from './firebase-config.js';

const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btnLogin = document.getElementById('btn-login');

        // Feedback visual de carregamento
        btnLogin.innerText = "Entrando...";
        btnLogin.disabled = true;
        errorMsg.style.display = 'none';

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Se der certo, o Firebase salva a sessão e redirecionamos
            window.location.href = "admin.html";
        } catch (error) {
            console.error("Erro no login:", error);
            btnLogin.innerText = "Entrar";
            btnLogin.disabled = false;
            
            errorMsg.style.display = 'block';
            
            // Tratamento de erros comuns em Português
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMsg.innerText = "E-mail ou senha incorretos.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMsg.innerText = "Muitas tentativas. Tente novamente mais tarde.";
            } else {
                errorMsg.innerText = "Erro ao acessar: " + error.code;
            }
        }
    });
}
