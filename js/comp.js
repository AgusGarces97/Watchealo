/* Mostrar cuadro de búsqueda */
const cuadroBusqueda = document.getElementById('cuadroBusqueda');
const busqueda = document.getElementById('busqueda');

busqueda.addEventListener('click', () => {
    cuadroBusqueda.classList.toggle('mostrar');
});

/* Rotar ícon del toggle */
const collapse = document.getElementById('navbarNav');
const icono = document.querySelector('.icono-hamb');

collapse.addEventListener('show.bs.collapse', () => {
    icono.classList.add('rotado');
});

collapse.addEventListener('hide.bs.collapse', () => {
    icono.classList.remove('rotado');
});