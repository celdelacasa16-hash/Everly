
const botonCerrar = document.getElementById("cerrar");
const campoBusqueda = document.getElementById("barrabusqueda");
const contenedorSugerencias = document.getElementById("sugerencias-busqueda");
const listaSugerencias = document.getElementById("lista-sugerencias");

// Sirve para que las imágenes y enlaces funcionen tanto en la página principal
// como en las páginas que están dentro de la carpeta "HTML".
function obtenerRutaCorrecta(ruta, esEnlace = false) {
    if (!ruta) return "";

    // Verificamos si la URL actual contiene "/HTML/" para saber si estamos en una subpágina
    const estamosEnSubpagina = window.location.pathname.includes("/HTML/");

    if (esEnlace && estamosEnSubpagina) {
        // Si es un enlace y estamos en HTML/, quitamos "HTML/" para que el link sea relativo
        return ruta.replace("HTML/", "");
    }

    // Si estamos en una subpágina, necesitamos subir un nivel con "../" para llegar a las imágenes
    return estamosEnSubpagina ? "../" + ruta : ruta;
}

// EVENTO 1: Cuando el usuario escribe o borra texto
campoBusqueda.addEventListener("keyup", () => {
    if (campoBusqueda.value.length > 0) {
        botonCerrar.style.display = "block"; // Mostramos la X si hay texto
    } else {
        botonCerrar.style.display = "none";  // Ocultamos la X si está vacío
    }
});

// EVENTO 2: Cuando el usuario hace clic en la "X" para borrar
botonCerrar.addEventListener("click", () => {
    campoBusqueda.value = "";              // Borramos el texto
    botonCerrar.style.display = "none";    // Ocultamos el botón
});

// EVENTO 3: Mientras el usuario escribe, buscamos productos en el catálogo
campoBusqueda.addEventListener("input", (evento) => {
    const textoBuscado = evento.target.value.toLowerCase().trim();

    if (textoBuscado.length > 0) {
        // Filtramos la lista 'catalogoProductos' buscando nombres que contengan el texto
        const coincidencias = catalogoProductos.filter(producto =>
            producto.nombre.toLowerCase().includes(textoBuscado)
        ).slice(0, 10); // Solo mostramos los primeros 10 para no llenar la pantalla

        if (coincidencias.length > 0) {
            contenedorSugerencias.style.display = "block"; // Mostramos el menú de sugerencias
            listaSugerencias.innerHTML = "";               // Limpiamos sugerencias viejas

            // Creamos un elemento de lista (<li>) por cada producto encontrado
            coincidencias.forEach(producto => {
                const item = document.createElement("li");
                item.className = "sugerencia-item";
                item.innerHTML = `
                    <img src="${obtenerRutaCorrecta(producto.imagen)}" alt="${producto.nombre}">
                    <span>${producto.nombre}</span>
                `;
                // Al hacer clic en la sugerencia, nos lleva a la página del producto
                item.onclick = () => {
                    window.location.href = obtenerRutaCorrecta(producto.link, true);
                };
                listaSugerencias.appendChild(item);
            });
        } else {
            contenedorSugerencias.style.display = "none"; // No hay coincidencias
        }
    } else {
        contenedorSugerencias.style.display = "none"; // El campo está vacío
    }
});
