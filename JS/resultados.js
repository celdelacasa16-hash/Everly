  // RESULTADOS DE BÚSQUEDA

  document.addEventListener("DOMContentLoaded", () => {
      // Obtenemos los datos de la URL (ejemplo: ?q=zapatos&marca=nike)
      const parametrosUrl = new URLSearchParams(window.location.search);
      const terminoBusqueda = parametrosUrl.get('q');
      const marcaBuscada = parametrosUrl.get('marca');
      const categoriaBuscada = parametrosUrl.get('cat');

      const contenedorResultados = document.getElementById("lista-resultados");
      const tituloPagina = document.getElementById("titulo-busqueda");

      // Diccionario de palabras clave para ayudar a filtrar categorías
      const palabrasClaveCategoria = {
          telefonos: ["iphone", "galaxy", "phone", "smartphone"],
          laptops: ["macbook", "laptop", "notebook"],
          bocinas: ["bocina", "speaker", "audio"],
          televisores: ["tv", "televisor", "screen"],
          audifonos: ["audifonos", "airpods", "buds"]
      };

      let productosFinales = [];
      let textoTitulo = "";

      // CASO 1: El usuario buscó por MARCA
      if (marcaBuscada) {
          textoTitulo = `Productos de la marca: ${marcaBuscada}`;
          productosFinales = catalogoProductos.filter(producto => {
              // CORRECCIÓN: Verificamos si la marca del producto coincide con la buscada
              const coincideMarca = producto.marca && producto.marca.toLowerCase() === marcaBuscada.toLowerCase();

              // Si también hay una categoría, filtramos por ambas cosas
              if (categoriaBuscada) {
                  const palabras = palabrasClaveCategoria[categoriaBuscada] || [];
                  const coincideCategoria = palabras.some(p => producto.nombre.toLowerCase().includes(p));
                  return coincideMarca && coincideCategoria;
              }
              return coincideMarca;
          });
      }
      // CASO 2: El usuario buscó por PALABRA CLAVE (lupa)
      else if (terminoBusqueda) {
          textoTitulo = `Resultados para: "${terminoBusqueda}"`;
          productosFinales = catalogoProductos.filter(producto =>
              producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
          );
      }
      // CASO 3: No hay nada que buscar
      else {
          if (contenedorResultados) {
              contenedorResultados.innerHTML = "<p style='text-align:center; width:100%;'>No se encontró ningún término de búsqueda.</p>";
          }
          return;
      }

      // Ponemos el título en la página
      if (textoTitulo && tituloPagina) tituloPagina.innerText = textoTitulo;

      // Si no encontramos nada, avisamos al usuario
      if (!contenedorResultados) return;

      if (productosFinales.length === 0) {
          contenedorResultados.innerHTML = "<p style='text-align:center; width:100%;'>Lo sentimos, no hay productos que coincidan.</p>";
      } else {
          // Dibujamos cada producto encontrado
          productosFinales.forEach(producto => {
              const divProducto = document.createElement("div");
              divProducto.className = "producto";

              // Ajustamos rutas para que funcionen en la carpeta HTML/
              const rutaImagen = "../" + producto.imagen;
              const rutaLink = producto.link ? producto.link.replace("HTML/", "") : "producto.html?nombre=" + encodeURIComponent(producto.nombre);

              divProducto.innerHTML = `
                  <div class="img-wrapper">
                      <a href="${rutaLink}"><img src="${rutaImagen}" alt="${producto.nombre}"></a>
                  </div>
                  <button class="agregar" type="button" data-nombre="${producto.nombre}" data-precio="${producto.precio}"
  data-imagen="${rutaImagen}">Agregar al carrito</button>
                  <h3>${producto.nombre}</h3>
                  <p>${producto.precio}$</p>
              `;
              contenedorResultados.appendChild(divProducto);
          });
      }
  });