document.getElementById('login-boton').addEventListener('click', () => {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                if (email && password) {
                    localStorage.setItem('isLoggedIn', 'true');
                    document.getElementById('mensaje-exito').style.display = 'block';
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                } else {
                    mensajeError.classList.display = "block"; 
                }
            });