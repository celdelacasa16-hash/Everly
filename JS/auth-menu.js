document.addEventListener("DOMContentLoaded", function() {
    const authLink = document.getElementById("auth-link");
    const userDropdown = document.getElementById("user-dropdown");
    const logoutBtn = document.getElementById("logout-btn");
    const userNameDisplay = document.getElementById("user-name-display");
    const isLogged = localStorage.getItem("usuarioLogueado") === "true";

    if (!authLink) return; // Evitar errores en páginas que no tengan el icono de usuario

    if (isLogged) {
        // El icono ahora despliega el menú
        authLink.href = "#";
        authLink.onclick = function(e) {
            e.preventDefault();
            if (userDropdown) {
                userDropdown.classList.toggle("mostrar");
            }
        };

        if (userNameDisplay) {
            userNameDisplay.textContent = "";
        }

        // El botón interno es el que cierra la sesión
        if (logoutBtn) {
            logoutBtn.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem("usuarioLogueado");
                localStorage.removeItem("usuarioEmail");
                alert("Sesión cerrada correctamente");
                window.location.reload();
            };
            // Mostrar el correo al pasar el ratón sobre el botón de cerrar sesión
            logoutBtn.title = localStorage.getItem("usuarioEmail") || "";
        }
    } else {
        // Si no está logueado, el icono lleva al login
        // Ajustamos la ruta dependiendo de si estamos en la raíz o en la carpeta HTML
        const currentPath = window.location.pathname;
        if (currentPath.includes("/HTML/")) {
            authLink.href = "login.html";
        } else {
            authLink.href = "HTML/login.html";
        }
        if (userNameDisplay) {
            userNameDisplay.textContent = "";
        }
    }

    // Cerrar el menú si se hace clic fuera de él
    window.onclick = function(event) {
        if (authLink && event.target !== authLink && !authLink.contains(event.target)) {
            if (userDropdown && userDropdown.classList.contains("mostrar")) {
                userDropdown.classList.remove("mostrar");
            }
        }
    };
});