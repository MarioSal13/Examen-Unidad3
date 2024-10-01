const { createApp, ref, onMounted } = Vue;

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTU2OTBkZjg3ZGQ4YjQ1ZmQ0OGM2MjEzNzgzMjAxMiIsIm5iZiI6MTcyNzU3NTA0Mi4zMDg0NDYsInN1YiI6IjY2ZjJmNmRjMDIyMDhjNjdjODhkOWJjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AeGm_NWqjLKptJznk1e5rGNSPdNkaxJZB6EBkPYB_Mc";

createApp({
    setup() {
        var userName = ref('');
        var passw = ref('');
        var isLoggedIn = ref(false);

        onMounted(() => {
            const userSession = sessionStorage.getItem('Usuario');
            if (userSession) {
                isLoggedIn.value = true;
                window.location.href = '/home.html';
            }
        });

        return {
            userName,
            passw,
            isLoggedIn
        };
    },
    methods: {
        async onSubmit() {

            document.getElementById('loading').style.display = "flex";

            try {
                const tokenUrl = 'https://api.themoviedb.org/3/authentication/token/new';
                const tokenResponse = await fetch(tokenUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!tokenResponse.ok) {
                    throw new Error(`Error al generar el token: ${tokenResponse.status}`);
                }

                const tokenData = await tokenResponse.json();
                const requestToken = tokenData.request_token;

                const loginUrl = 'https://api.themoviedb.org/3/authentication/token/validate_with_login';
                const loginResponse = await fetch(loginUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`, 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.userName,
                        password: this.passw,
                        request_token: requestToken
                    })
                });

                if (!loginResponse.ok) {
                    throw new Error(`Error en la autenticación: ${loginResponse.status}`);
                }

                const loginResult = await loginResponse.json();

                // Ocultar el spinner
                document.getElementById('loading').style.display = "none";

                if (loginResult.success) {
                    this.isLoggedIn = true;
                    // Guardar usuario y token en sessionStorage
                    sessionStorage.setItem('Usuario', JSON.stringify({
                        nombre: this.userName,
                        token: requestToken
                    }));

                    // Obtener el session_id
                    const sessionUrl = 'https://api.themoviedb.org/3/authentication/session/new';
                    const sessionResponse = await fetch(sessionUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ request_token: requestToken })
                    });

                    if (!sessionResponse.ok) {
                        throw new Error(`Error al obtener session_id: ${sessionResponse.status}`);
                    }

                    const sessionData = await sessionResponse.json();
                    const session_id = sessionData.session_id;

                    // Guardar session_id en sessionStorage
                    sessionStorage.setItem('session_id', session_id);
                    
                    // Obtener account_id
                    const accountUrl = 'https://api.themoviedb.org/3/account?session_id=' + session_id;
                    const accountResponse = await fetch(accountUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!accountResponse.ok) {
                        throw new Error(`Error al obtener account_id: ${accountResponse.status}`);
                    }

                    const accountData = await accountResponse.json();
                    const account_id = accountData.id;

                    // Guardar account_id en sessionStorage
                    sessionStorage.setItem('account_id', account_id);

                    window.location.href = '/home.html';
                } else {
                    console.log("Credenciales inválidas.");
                }
            } catch (error) {
                console.error(error.message);
                this.showModal("Error: ", "Usuario o Contraseña incorrectos.");
                document.getElementById('loading').style.display = "none";
            }
        },
        showModal(title, message) {
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-message').innerText = message;
            document.getElementById('modal').style.display = "block";
    
            setTimeout(() => {
                document.getElementById('modal').style.display = "none";
            }, 1500);
        }
    }
}).mount('#app');