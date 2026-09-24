const grande = document.querySelector('.grande');
const puntos = document.querySelectorAll('.punto');

// clic en puntos
puntos.forEach((cadaPunto, i) => {
    puntos[i].addEventListener('click', () => {

        let posicion = i;
        let operacion = posicion * -20; // 100% / 5 imágenes = 20% por imagen

        grande.style.transform = `translateX(${operacion}%)`;

        puntos.forEach((cadaPunto, i) => {
            puntos[i].classList.remove('activo');
        });
        puntos[i].classList.add('activo');

    });
});

let indiceActual = 0;

setInterval(() => {
    indiceActual = (indiceActual + 1) % puntos.length;
    puntos[indiceActual].click();
}, 4000);
