<template>
    <div class="auth-content">
        <div class="background">
            <div class="layer">

            </div>
        </div>
        <div class="auth-modal">
            <div class="auth-modal-content">
                <img src="@/assets/logo.png" width="200" alt="Logo" />
                <hr>
                <div class="auth-title">{{ showSignup ? 'Cadastro' : 'Login' }}</div>

                <input v-if="showSignup" v-model="user.name" type="text" placeholder="Nome">
                <TheMask v-if="showSignup" :mask="['###.###.###-##', '##.###.###/####-##']" 
                    v-model="user.cgc" type="text" placeholder="CPF/CNPJ"></TheMask>
                <input v-model="user.email" name="email" type="text" placeholder="E-mail">
                <input v-model="user.password" name="password" type="password" placeholder="Senha">
                <input v-if="showSignup" v-model="user.confirmPassword"
                    type="password" placeholder="Confirme a Senha">

                <button v-if="showSignup" @click="signup">Registrar</button>
                <button v-else @click="signin">Entrar</button>

                <a href @click.prevent="showSignup = !showSignup">
                    <span v-if="showSignup">Já tem cadastro? Acesse o Login!</span>
                    <span v-else>Não tem cadastro? Registre-se aqui!</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from '@/global'
import axios from 'axios'
import { TheMask } from 'vue-the-mask'

export default {
    name: 'Auth',
    components: { TheMask },
    data: function() {
        return {
            showSignup: false,
            user: {}
        }
    },
    methods: {
        signin() {
            axios.post(`${baseApiUrl}/signin`, this.user)
                .then(res => {
                    this.$store.commit('setUser', res.data)
                    localStorage.setItem(userKey, JSON.stringify(res.data))
                    this.$router.push({ path: '/' })
                })
                .catch(showError)
        },
        signup() {
            axios.post(`${baseApiUrl}/signup`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.user = {}
                    this.showSignup = false
                })
                .catch(showError)
        }
    }
}
</script>

<style>
    .auth-content {
        height: 100%;
        display: grid;
        grid-template-columns: 78% 1fr;
		grid-template-areas:
			"side login";
    }

    .background {
        background-image: url("https://image.freepik.com/free-photo/handshake-close-up-executives_1098-1384.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        grid-area: side;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .layer {
        background-color: rgba(128, 181, 230, 0.7);
        width: 100%;
        height: 100%;
        grid-area: side;
    }

    .auth-modal {
        background-color: #e5faf8;
        width: 100%;
        height: 100%;
        grid-area: login;
        padding: 35px;
        box-shadow: -9px 0px 37px -8px rgba(131,147,153,1);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .auth-modal-content {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        align-items: center;
        align-self: center;
        justify-content: center;
    }
    
    .auth-title {
        font-size: 1.2rem;
        font-weight: 100;
        margin-top: 10px;
        margin-bottom: 15px;
    }

    .auth-modal input {
        border: 1px solid #BBB;
        width: 100%;
        margin-bottom: 15px;
        padding: 3px 8px;
        outline: none;
    }

    .auth-modal button {
        align-self: flex-end;
        background-color: #2460ae;
        color: #FFF;
        padding: 5px 15px;
    }

    .auth-modal a {
        margin-top: 35px;
    }

    .auth-modal hr {
        border: 0;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(to right,
            rgba(120, 120, 120, 0),
            rgba(120, 120, 120, 0.75),
            rgba(120, 120, 120, 0));
    }
</style>
