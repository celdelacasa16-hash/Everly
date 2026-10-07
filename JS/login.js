const emailCorrecto = "Primerodesarrolloa@gmail.com";
const passwordCorrecto = "12345678r";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBoton = document.getElementById("login-boton");
const mensajeExito = document.getElementById("mensaje-exito");

loginBoton.addEventListener("click", function(evento) {
    evento.preventDefault();

    let emailIngresado = email.value;
    let passwordIngresado = password.value;

    if (emailIngresado === emailCorrecto && passwordIngresado === passwordCorrecto) {
        // Guardar la sesión en localStorage
        localStorage.setItem('usuarioLogueado', 'true');
        localStorage.setItem('usuarioEmail', emailIngresado);

        mensajeExito.classList.add("mostrar");

        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1500);
    } else {
        alert("Correo o contraseña incorrectos");
    }
});

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('usuarioEmail');
    window.location.reload(); // Recarga la página para actualizar la interfaz
}


