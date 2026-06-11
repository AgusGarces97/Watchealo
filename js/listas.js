// Capturamos el contenedor del HTML donde se van a insertar todas las listas/carruseles.
// En listas.html existe este div: <div id="contenedor-listas"></div>
const contenedorListas = document.getElementById("contenedor-listas");


// Creamos un arreglo con las categorías que queremos mostrar en la página.
// Cada nombre debe coincidir con alguna palabra que aparezca en el campo "genero" del JSON.
const categorias = [
    "Terror",
    "Drama",
    "Ciencia Ficción",
    "Acción",
    "Comedia",
    "Romance",
    "Suspenso"
];


// Guardamos acá todas las películas y series que vienen del JSON.
let peliculasSeriesGuardadas = [];

const listaPeliculas = JSON.parse(localStorage.getItem('peliculas_series'));
peliculasSeriesGuardadas = listaPeliculas;
renderizarListas();

/*

// Leemos el archivo JSON donde están guardadas las películas y series.
fetch("../json/pelis_y_series.json")

    // Convertimos la respuesta del fetch a formato JSON.
    .then(function(respuesta) {
        return respuesta.json();
    })

    // Una vez que tenemos los datos del JSON, los guardamos y renderizamos las listas.
    .then(function(peliculasSeries) {

        peliculasSeriesGuardadas = peliculasSeries;

        renderizarListas();

    })

    // Si ocurre un error al cargar el JSON, lo mostramos en la consola.
    .catch(function(error) {
        console.error("Error al cargar las listas:", error);
    });
*/

// Esta función vuelve a armar todas las listas.
// Sirve para cargar la página y también para recalcular cuando cambia el tamaño de pantalla.
function renderizarListas() {

    contenedorListas.innerHTML = "";

    categorias.forEach(function(categoria, index) {

        // Filtramos las películas/series que pertenecen a esa categoría.
        const peliculasFiltradas = peliculasSeriesGuardadas.filter(function(pelicula) {
            return pelicula.genero.toLowerCase().includes(categoria.toLowerCase());
        });

        // Si esa categoría tiene al menos una película o serie, creamos su carrusel.
        if (peliculasFiltradas.length > 0) {
            crearCarrusel(categoria, peliculasFiltradas, index + 1);
        }

    });

}


// Esta función define cuántas tarjetas tiene que tener cada slide según el tamaño de pantalla.
// Esto evita que queden huecos cuando la pantalla se achica.
function obtenerCantidadPorSlide() {

    if (window.innerWidth < 768) {
        return 4; // Celular: se ven 2 columnas x 2 filas.
    }

    if (window.innerWidth < 992) {
        return 3; // Tablet: se ven 3 tarjetas.
    }

    return 5; // Computadora: se ven 5 tarjetas.
}


// Esta función crea un carrusel completo para una categoría.
// Recibe el nombre de la categoría, las películas filtradas y un número para identificar el carrusel.
function crearCarrusel(nombreCategoria, peliculas, numeroCarrusel) {

    // Definimos cuántas tarjetas queremos mostrar por cada slide según la pantalla.
    const cantidadPorSlide = obtenerCantidadPorSlide();

    // Creamos un arreglo vacío donde vamos a guardar los grupos de películas.
    const grupos = [];


    // Recorremos las películas según la cantidad indicada.
    // Cada grupo se guarda como un slide del carrusel.
    for (let i = 0; i < peliculas.length; i += cantidadPorSlide) {
        grupos.push(peliculas.slice(i, i + cantidadPorSlide));
    }


    // Capturamos el último grupo creado.
    const ultimoGrupo = grupos[grupos.length - 1];

    // Si el último grupo tiene menos tarjetas que las necesarias, lo completamos.
    // Esto evita que queden espacios vacíos en el último slide del carrusel.
    if (ultimoGrupo && ultimoGrupo.length < cantidadPorSlide) {
        let indice = 0;

        // Mientras el último grupo no esté completo,
        // agregamos películas repetidas desde el principio de la misma categoría.
        while (ultimoGrupo.length < cantidadPorSlide) {
            ultimoGrupo.push(peliculas[indice]);
            indice++;

            // Si llegamos al final del arreglo, volvemos al principio.
            if (indice >= peliculas.length) {
                indice = 0;
            }
        }
    }


    // Creamos un id único para cada carrusel.
    // Ejemplo: carouselLista1, carouselLista2, carouselLista3, etc.
    const idCarrusel = "carouselLista" + numeroCarrusel;

    // Creamos un div desde JavaScript donde se insertará toda la estructura del carrusel.
    const seccion = document.createElement("div");

    // Esta variable va a guardar todos los slides del carrusel.
    let slides = "";


    // Recorremos cada grupo para crear un slide.
    grupos.forEach(function(grupo, indice) {

        // Esta variable guarda las tarjetas que van dentro de cada slide.
        let tarjetas = "";

        // Recorremos las películas de cada grupo y creamos una tarjeta por cada una.
        grupo.forEach(function(pelicula) {
            tarjetas += crearTarjeta(pelicula);
        });

        // Creamos la estructura de cada slide del carrusel.
        // El primer slide lleva la clase "active" para que Bootstrap lo muestre al cargar la página.
        slides += `
            <div class="carousel-item ${indice === 0 ? "active" : ""}">
                <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                    ${tarjetas}
                </div>
            </div>
        `;
    });


    // Esta variable va a guardar las flechas del carrusel.
    let botonesCarrusel = "";

    // Solo mostramos las flechas si existe más de un slide.
    if (grupos.length > 1) {
        botonesCarrusel = `
            <button class="carousel-control-prev" type="button" data-bs-target="#${idCarrusel}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
            </button>

            <button class="carousel-control-next" type="button" data-bs-target="#${idCarrusel}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
            </button>
        `;
    }


    // Armamos todo el bloque HTML de la categoría:
    // título de la categoría + carrusel + slides + flechas.
    seccion.innerHTML = `
        <div class="row">
        <div class="row mb-2">
            <div class="col-12">
                <h2 class="fs-4">${nombreCategoria}</h2>
            </div>
        </div>
        
            <div id="${idCarrusel}" class="carousel slide carrusel-listas mb-5" data-bs-ride="false">

                <div class="carousel-inner">
                    ${slides}
                </div>

                ${botonesCarrusel}

            </div>
        </div>
    `;

    // Insertamos la sección completa dentro del contenedor principal de listas.html.
    contenedorListas.appendChild(seccion);
}


// Esta función crea una tarjeta individual para cada película o serie.
function crearTarjeta(pelicula) {
    return `
        <div class="col">

            <!-- Al hacer click en la tarjeta, se abre detalle.html con el id de la película/serie -->
            <a href="detalle.html?id=${pelicula.id}" class="text-decoration-none">

                <div class="card pelicula-card">

                    <div class="pelicula-img-wrap">
                        <img src="${pelicula.portada}" class="card-img-top pelicula-img" alt="${pelicula.titulo}">
                    </div>

                    <div class="card-body pelicula-info">
                        <span class="card-title pelicula-titulo">${pelicula.titulo}</span>

                        <span class="pelicula-rating">
                            <i class="bi bi-star-fill"></i> ${pelicula.puntuacionTotal}
                        </span>
                    </div>

                </div>

            </a>
        </div>
    `;
}


// Si el usuario cambia el tamaño de la ventana, volvemos a calcular las tarjetas.
// Esto ayuda cuando achicás o agrandás la pantalla desde la compu.
let temporizadorResize;

window.addEventListener("resize", function() {
    clearTimeout(temporizadorResize);

    temporizadorResize = setTimeout(function() {
        renderizarListas();
    }, 300);
});