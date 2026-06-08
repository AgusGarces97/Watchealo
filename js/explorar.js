const params = new URLSearchParams(window.location.search);

const busquedaURL = params.get("busqueda");

const inputExplorar = document.getElementById("buscarExplorar");

const contenedorExplorar = document.getElementById("contenedor-explorar");
const buscarExplorar = document.getElementById("buscarExplorar");
const filtroGenero = document.getElementById("filtroGenero");
const filtroTipo = document.getElementById("filtroTipo");
const ordenarExplorar = document.getElementById("ordenarExplorar");

let peliculasSeriesExplorar = [];

fetch("../json/pelis_y_series.json")
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        peliculasSeriesExplorar = datos;

        if(busquedaURL){

            inputExplorar.value = busquedaURL;

            aplicarFiltros();

        }
        else{
            mostrarResultados(peliculasSeriesExplorar);
        }
        
    })
    .catch(function(error) {
        console.error("Error al cargar explorar:", error);
    });


buscarExplorar.addEventListener("input", aplicarFiltros);
filtroGenero.addEventListener("change", aplicarFiltros);
filtroTipo.addEventListener("change", aplicarFiltros);
ordenarExplorar.addEventListener("change", aplicarFiltros);


function aplicarFiltros() {

    const textoBusqueda = buscarExplorar.value.toLowerCase();
    const generoSeleccionado = filtroGenero.value.toLowerCase();
    const tipoSeleccionado = filtroTipo.value;
    const ordenSeleccionado = ordenarExplorar.value;

    let resultados = peliculasSeriesExplorar.filter(function(pelicula) {

        const coincideTitulo = pelicula.titulo.toLowerCase().includes(textoBusqueda);

        const coincideGenero = generoSeleccionado === "" ||
            pelicula.genero.toLowerCase().includes(generoSeleccionado);

        let coincideTipo = true;

        if (tipoSeleccionado === "Película") {
            coincideTipo = pelicula.caps === "Película";
        }

        if (tipoSeleccionado === "Serie") {
            coincideTipo = pelicula.caps !== "Película";
        }

        return coincideTitulo && coincideGenero && coincideTipo;
    });


    if (ordenSeleccionado === "az") {
        resultados.sort(function(a, b) {
            return a.titulo.localeCompare(b.titulo);
        });
    }

    if (ordenSeleccionado === "puntuacion") {
        resultados.sort(function(a, b) {
            return b.puntuacion - a.puntuacion;
        });
    }

    mostrarResultados(resultados);
}

function mostrarResultados(lista) {

    contenedorExplorar.innerHTML = "";

    if (lista.length === 0) {
        contenedorExplorar.innerHTML = `
            <div class="col-12">
                <p class="text-center text-muted">
                    No se encontraron resultados con esos filtros.
                </p>
            </div>
        `;
        return;
    }

    lista.forEach(function(pelicula) {
        
        contenedorExplorar.innerHTML += crearTarjetaExplorar(pelicula);
    });
}


function crearTarjetaExplorar(pelicula) {
    const listaPelis = JSON.parse(localStorage.getItem('peliculas_series'));
        return `
        <div class="col">
            <a href="detalle.html?id=${pelicula.id}" class="text-decoration-none">

                <div class="card pelicula-card">

                    <div class="pelicula-img-wrap">
                        <img src="${pelicula.portada}" class="card-img-top pelicula-img" alt="${pelicula.titulo}">
                    </div>

                    <div class="card-body pelicula-info">
                        <span class="card-title pelicula-titulo">${pelicula.titulo}</span>

                        <span class="pelicula-rating">
                            <i class="bi bi-star-fill"></i> ${pelicula.puntuacion}
                        </span>
                    </div>

                </div>

            </a>
        </div>
    `;
    
}