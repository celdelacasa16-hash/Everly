function toggleSubCategorias(){
    var panel = document.getElementById('subcategorias');
    var overlay = document.getElementById('subcat-overlay');
    var boton = document.getElementById('btn-hamburguesa');

    if(!panel || !overlay || !boton) return;

    panel.classList.toggle('subcat-abierta');
    overlay.classList.toggle('activo');
    boton.classList.toggle('activo');
    document.body.classList.toggle('sin-scroll');
}
