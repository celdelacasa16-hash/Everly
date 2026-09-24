

// Cargamos el carrito desde el almacenamiento del navegador (LocalStorage)
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function initCarrito() {
    // Usamos un solo "escuchador" de clics para toda la página
    document.addEventListener('click', (evento) => {

        // 1. Abrir o cerrar el carrito al hacer clic en el icono
        const iconoCarrito = evento.target.closest('#icono');
        if (iconoCarrito) {
            evento.preventDefault();
            const modalCarrito = document.getElementById('carrito-elementos');
            if (modalCarrito) {
                modalCarrito.classList.toggle('oculto');
            }
        }

        // 2. Botón de "Proceder al pago"
        if (evento.target.closest('.proceder-compra')) {
            const estamosEnSubpagina = window.location.pathname.includes("/HTML/");
            window.location.href = estamosEnSubpagina ? 'pago.html' : 'HTML/pago.html';
        }

        // 3. Botones de "Agregar al carrito"
        if (evento.target.classList.contains('agregar') || evento.target.classList.contains('compra')) {
            const boton = evento.target;
            const nombre = boton.getAttribute('data-nombre');
            const precio = parseFloat(boton.getAttribute('data-precio'));
            const imagen = boton.getAttribute('data-imagen');

            if (nombre && !isNaN(precio)) {
                agregarAlCarrito(nombre, precio, imagen);
            }
        }

        // 4. Botones de cantidad (+, -, eliminar)
        const elementoClickeado = evento.target;
        if (elementoClickeado.classList.contains('btn-eliminar')) {
            eliminarDelCarrito(elementoClickeado.getAttribute('data-index'));
        } else if (elementoClickeado.classList.contains('btn-mas')) {
            cambiarCantidad(elementoClickeado.getAttribute('data-index'), 1);
        } else if (elementoClickeado.classList.contains('btn-menos')) {
            cambiarCantidad(elementoClickeado.getAttribute('data-index'), -1);
        }
    });

    // Cerrar el carrito si el usuario hace clic fuera de él
    document.addEventListener('click', (evento) => {
        const modalCarrito = document.getElementById('carrito-elementos');
        if (!modalCarrito || modalCarrito.classList.contains('oculto')) return;

        // --- SOLUCIÓN AL CIERRE AUTOMÁTICO ---
        const clicEnControles = evento.target.closest('.btn-mas') ||
                               evento.target.closest('.btn-menos') ||
                               evento.target.closest('.btn-eliminar');

        const clicEnCarrusel = evento.target.closest('.carrucel');
        const clicDentroDelCarrito = modalCarrito.contains(evento.target);
        const clicEnElIcono = document.getElementById('icono')?.contains(evento.target);

        if (!clicDentroDelCarrito && !clicEnElIcono && !clicEnCarrusel && !clicEnControles) {
            modalCarrito.classList.add('oculto');
        }
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            document.getElementById('carrito-elementos')?.classList.add('oculto');
        }
    });

    actualizarInterfazCarrito();

    try { vincularProductos(); } catch (e) { console.log("Error en vincularProductos"); }
    try { vincularCategorias(); } catch (e) { console.log("Error en vincularCategorias"); }
    try { configurarLogin(); } catch (e) { console.log("Error en configurarLogin"); }
    try { verificarSesion(); } catch (e) { console.log("Error en verificarSesion"); }
}

function agregarAlCarrito(nombre, precio, imagen) {
    const productoExistente = carrito.find(p => p.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, imagen, cantidad: 1 });
    }
    guardarYActualizar();
    alert("Se agregó un producto al carrito");
}

function cambiarCantidad(indice, cambio) {
    if (!carrito[indice]) return;
    carrito[indice].cantidad += cambio;
    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }
    guardarYActualizar();
}

function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    guardarYActualizar();
}

function guardarYActualizar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarInterfazCarrito();
}

function actualizarInterfazCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    if (!listaCarrito || !totalCarrito) return;

    listaCarrito.innerHTML = '';
    let sumaTotal = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li>El carrito está vacío</li>';
        totalCarrito.textContent = 'Total: $0.00';
    } else {
        carrito.forEach((producto, indice) => {
            const subtotal = producto.precio * producto.cantidad;
            sumaTotal += subtotal;
            const estamosEnSubpagina = window.location.pathname.includes("/HTML/");
            const rutaImagen = estamosEnSubpagina ? `../${producto.imagen.replace(/^\.\.\//, '')}` : producto.imagen.replace(/^\.\.\//, '');
            const elementoLista = document.createElement('li');
            elementoLista.innerHTML = `
                <img src="${rutaImagen}" alt="${producto.nombre}" class="img-miniatura">
                <div class="detalles">
                    <span><strong>${producto.nombre}</strong></span>
                    <span>$${producto.precio.toFixed(2)} c/u</span>
                    <div class="control-cantidad">
                        <button class="btn-menos" data-index="${indice}">-</button>
                        <span class="cantidad-numero">${producto.cantidad}</span>
                        <button class="btn-mas" data-index="${indice}">+</button>
                    </div>
                </div>
                <span class="subtotal">$${subtotal.toFixed(2)}</span>
                <button class="btn-eliminar" data-index="${indice}">&times;</button>
            `;
            listaCarrito.appendChild(elementoLista);
        });
        totalCarrito.textContent = `Total: $${sumaTotal.toFixed(2)}`;
    }
}

function vincularProductos() {
    document.querySelectorAll('.producto img').forEach(img => {
        const contenedor = img.closest('.producto');
        const titulo = contenedor?.querySelector('h3')?.textContent.trim();
        if (!titulo) return;
        const estamosEnSubpagina = window.location.pathname.includes("/HTML/");
        const linkFinal = `${estamosEnSubpagina ? "producto.html" : "HTML/producto.html"}?nombre=${encodeURIComponent(titulo)}`;
        img.style.cursor = 'pointer';
        img.onclick = () => { window.location.href = linkFinal; };
        const enlace = contenedor.querySelector('a');
        if (enlace) enlace.href = linkFinal;
    });
}

function vincularCategorias() {
    const mapaCategorias = {
        'Interiores': 'HTML/Muebles.html', 'Zapatos': 'HTML/Calzado.html',
        'Relojes': 'HTML/accesorios.html', 'Televisores': 'HTML/Tecnologia.html',
        'Audifonos': 'HTML/accesorios.html', 'Telefonos': 'HTML/Tecnologia.html'
    };
    document.querySelectorAll('.ecategorias').forEach(cat => {
        const titulo = cat.querySelector('h3')?.textContent.trim();
        const linkCorrecto = mapaCategorias[titulo];
        if (linkCorrecto) {
            cat.querySelector('a').href = linkCorrecto;
            const img = cat.querySelector('img');
            if (img) img.onclick = () => { window.location.href = linkCorrecto; };
        }
    });
}

function configurarLogin() {
    const linkLogin = document.querySelector('a[href*="login.html"]');
    if (linkLogin) {
        linkLogin.setAttribute('target', '_blank');
        linkLogin.setAttribute('rel', 'noopener noreferrer');
    }
}

function verificarSesion() {
    const estaLogueado = localStorage.getItem('usuarioLogueado') === 'true';
    const email = localStorage.getItem('usuarioEmail');
    if (estaLogueado && email) {
        const linkLogin = document.querySelector('a[href*="login.html"]');
        if (linkLogin) {
            linkLogin.style.position = 'relative';
            const tooltip = document.createElement('span');
            tooltip.textContent = `@${email}`;
            tooltip.className = 'login-tooltip';
            Object.assign(tooltip.style, {
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: 'transparent', color: 'white', fontSize: '12px',
                fontWeight: 'bold', whiteSpace: 'nowrap', opacity: '0',
                transition: 'opacity 0.3s ease', pointerEvents: 'none', zIndex: '1000'
            });
            linkLogin.appendChild(tooltip);
            linkLogin.addEventListener('mouseover', () => { tooltip.style.opacity = '1'; });
            linkLogin.addEventListener('mouseout', () => { tooltip.style.opacity = '0'; });
        }
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initCarrito();
} else {
    document.addEventListener('DOMContentLoaded', initCarrito);
}


   document.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('proceder-compra')) {
                if (localStorage.getItem('isLoggedIn') !== 'true') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    alert('Debe iniciar sesion para proceder al pago');
                    window.location.href = '../HTML/login.html';
                }
            }
        });