// =============================================================================
// DETALLES DEL PRODUCTO
// Este archivo carga la información específica de un producto y los relacionados.
// =============================================================================

// Definimos qué información queremos mostrar según el tipo de producto
const PLANTILLAS_ESPECIFICACIONES = {
    'Teléfonos': ['Marca', 'Modelo', 'Pantalla', 'Procesador', 'RAM', 'Almacenamiento', 'Batería', 'Cámara', 'Color'],
    'Laptops': ['Marca', 'Modelo', 'Procesador', 'RAM', 'Almacenamiento', 'Pantalla', 'GPU', 'Batería', 'Color'],
    'Bocinas': ['Marca', 'Modelo', 'Potencia', 'Conectividad', 'Autonomía', 'Bluetooth', 'Color'],
    'Televisores': ['Marca', 'Modelo', 'Tamaño', 'Resolución', 'Tecnología de Pantalla', 'Smart TV', 'Color'],
    'Audífonos': ['Marca', 'Modelo', 'Tipo', 'Autonomía', 'Cancelación de Ruido', 'Conectividad', 'Color'],
    'Ropa': ['Marca', 'Talla', 'Material', 'Estilo', 'Género', 'Color'],
    'Zapatos': ['Marca', 'Talla', 'Material', 'Tipo de Suela', 'Género', 'Color'],
    'Muebles': ['Marca', 'Dimensiones', 'Material', 'Estilo', 'Color'],
    'Accesorios': ['Marca', 'Material', 'Dimensiones', 'Compatibilidad', 'Color'],
    'General': ['Marca', 'Color', 'Materiales']
};

// Palabras clave para adivinar automáticamente la categoría del producto
const PALABRAS_CATEGORIA = {
    'Teléfonos': ['iphone', 'galaxy', 'phone', 'xiaomi', 'honor', 'motorola'],
    'Laptops': ['macbook', 'laptop', 'notebook'],
    'Bocinas': ['bocina', 'speaker', 'audio'],
    'Televisores': ['televisor', 'tv', 'smart tv'],
    'Audífonos': ['audifonos', 'earbuds', 'headphones', 'airpods'],
    'Ropa': ['camisa', 'camiseta', 'pantalon', 'vestido', 'ropa'],
    'Zapatos': ['tenis', 'zapatos', 'botas', 'calzado'],
    'Muebles': ['sofa', 'mesa', 'silla', 'cama', 'mueble'],
    'Accesorios': ['reloj', 'lentes', 'bolso', 'accesorio']
};

document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos el nombre del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const nombreProductoUrl = urlParams.get('nombre');

    if (nombreProductoUrl) {
        // Buscamos el producto en el catálogo global usando el nombre
        const productoEncontrado = catalogoProductos.find(p =>
            p.nombre.toLowerCase().trim() === nombreProductoUrl.trim().toLowerCase()
        );

        if (productoEncontrado) {
            cargarInformacionProducto(productoEncontrado);
            cargarProductosRelacionados(productoEncontrado);
        } else {
            document.getElementById('nombre-producto-detalle').textContent = 'Producto no encontrado';
        }
    }
});

function cargarInformacionProducto(producto) {
    // 1. Nombre y Precio
    document.getElementById('nombre-producto-detalle').textContent = producto.nombre;
    document.getElementById('precio-producto-detalle').textContent = `$${producto.precio.toFixed(2)}`;

    // 2. Imagen (usamos ../ porque estamos en la carpeta HTML/)
    const imagenElemento = document.getElementById('img-producto-detalle');
    imagenElemento.src = `../${producto.imagen}`;
    imagenElemento.alt = producto.nombre;

    // 3. Ruta de navegación (Breadcrumbs)
    document.getElementById('ruta-producto').textContent = producto.nombre;

    // Determinamos la categoría para saber qué especificaciones mostrar
    const categoria = adivinarCategoria(producto) || 'General';
    document.getElementById('ruta-categoria').textContent = categoria;

    // 4. Tabla de Especificaciones Dinámicas
    const tablaEspecificaciones = document.getElementById('specs-body');
    if (tablaEspecificaciones) {
        const plantilla = PLANTILLAS_ESPECIFICACIONES[categoria] || PLANTILLAS_ESPECIFICACIONES['General'];
        let contenidoHtml = '';

        plantilla.forEach(especificacion => {
            // Convertimos "Marca" a "marca" para buscarlo en el objeto del producto
            const nombrePropiedad = especificacion.toLowerCase();
            const valor = producto[nombrePropiedad] || (especificacion === 'Marca' ? producto.marca : 'N/A');

            contenidoHtml += `
                <tr>
                    <td>${especificacion}</td>
                    <td>${valor}</td>
                </tr>`;
        });

        // Añadimos filas fijas al final de la tabla
        contenidoHtml += `
            <tr><td>Estado</td><td>Disponible</td></tr>
            <tr><td>Envio</td><td>A domicilio / Retiro en tienda</td></tr>
            <tr><td>Garantia</td><td>Oficial de marca</td></tr>`;

        tablaEspecificaciones.innerHTML = contenidoHtml;
    }

    // 5. Botón de Agregar al Carrito
    const botonAgregar = document.getElementById('btn-agregar-detalle');
    if (botonAgregar) {
        botonAgregar.setAttribute('data-nombre', producto.nombre);
        botonAgregar.setAttribute('data-precio', producto.precio);
        botonAgregar.setAttribute('data-imagen', producto.imagen);
        botonAgregar.classList.add('compra'); // Clase necesaria para que funcion.js lo detecte
    }
}

function adivinarCategoria(producto) {
    const nombre = producto.nombre.toLowerCase();
    const rutaImagen = producto.imagen.toLowerCase();

    // Recorremos las palabras clave para ver si alguna coincide con el nombre o la ruta de la imagen
    for (const [categoria, palabras] of Object.entries(PALABRAS_CATEGORIA)) {
        if (palabras.some(p => nombre.includes(p) || rutaImagen.includes(p))) {
            return categoria;
        }
    }
    return null;
}

function cargarProductosRelacionados(productoActual) {
    const contenedorRelacionados = document.getElementById('relacionados-grid');
    if (!contenedorRelacionados) return;

    const categoriaActual = adivinarCategoria(productoActual);

    // Buscamos productos de la misma categoría que no sean el producto que estamos viendo
    const relacionados = catalogoProductos.filter(p =>
        adivinarCategoria(p) === categoriaActual && p.nombre !== productoActual.nombre
    );

    // Quitamos duplicados
    const listaSinDuplicados = [];
    const nombresVistos = new Set();
    relacionados.forEach(p => {
        if (!nombresVistos.has(p.nombre)) {
            listaSinDuplicados.push(p);
            nombresVistos.add(p.nombre);
        }
    });

    // Si hay muy pocos productos, agregamos algunos de la misma marca
    if (listaSinDuplicados.length < 4) {
        catalogoProductos.forEach(p => {
            if (p.marca === productoActual.marca && p.nombre !== productoActual.nombre && !nombresVistos.has(p.nombre)) {
                listaSinDuplicados.push(p);
                nombresVistos.add(p.nombre);
            }
        });
    }

    // Mezclamos la lista y tomamos solo los primeros 4
    const seleccionados = listaSinDuplicados.sort(() => 0.5 - Math.random()).slice(0, 4);

    if (seleccionados.length === 0) {
        contenedorRelacionados.innerHTML = '<p>No hay productos relacionados disponibles.</p>';
    } else {
        contenedorRelacionados.innerHTML = '';
        seleccionados.forEach(p => {
            const div = document.createElement('div');
            div.className = 'relacionado-item';
            div.innerHTML = `
                <a href="producto.html?nombre=${encodeURIComponent(p.nombre)}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; align-items:center;">
                    <img src="../${p.imagen}" alt="${p.nombre}" style="width:100%; height:auto; border-radius:8px;">
                    <h3>${p.nombre}</h3>
                    <p>$${p.precio.toFixed(2)}</p>
                </a>
            `;
            contenedorRelacionados.appendChild(div);
        });
    }
}
