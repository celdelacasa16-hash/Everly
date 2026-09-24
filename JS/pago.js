
        // Logica estetica para cargar el resumen del carrito en la pagina de pago
        window.onload = () => {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const resumenDiv = document.getElementById('resumen-items');
            const totalSpan = document.getElementById('total-final');

            function resolveImagePath(path) {
                if (!path) return '';
                const rootPath = path.replace(/^\.\.\//, '');
                const isSubpage = window.location.pathname.includes("/HTML/");
                return isSubpage ? `../${rootPath}` : rootPath;
            }

            if (carrito.length === 0) {
                resumenDiv.innerHTML = '<p>No hay productos en el carrito</p>';
                totalSpan.textContent = '$0.00';
                return;
            }

            let total = 0;
            resumenDiv.innerHTML = '';

            carrito.forEach(prod => {
                const subtotal = prod.precio * prod.cantidad;
                total += subtotal;
                resumenDiv.innerHTML += `
                    <div class="item-resumen">
                        <img src="${resolveImagePath(prod.imagen)}" alt="${prod.nombre}">
                        <div class="info-item">
                            <span class="nombre-item">${prod.nombre}</span>
                            <span class="cant-item">x${prod.cantidad}</span>
                        </div>
                        <span class="precio-item">$${subtotal.toFixed(2)}</span>
                    </div>
                `;
            });

            totalSpan.textContent = `$${total.toFixed(2)}`;
        };

        function confirmarPago() {
            alert("Simulacion Exitosa! Su pago ha sido procesado. Gracias por comprar en Everly.");
            window.location.href = "../index.html";
        }