// Esperamos a que cargue toda la página antes de ejecutar el código.
window.addEventListener("load", function() {

    // Activamos el efecto del buscador del navbar.
    activarBuscador();

    // Activamos la rotación del ícono hamburguesa en mobile.
    activarIconoHamburguesa();

    // Cargamos los datos de la película o serie seleccionada.
    cargarDetalle();

});


// Esta función abre y cierra el input de búsqueda del navbar.
function activarBuscador() {

    const cuadroBusqueda = document.getElementById("cuadroBusqueda");
    const busqueda = document.getElementById("busqueda");

    if (cuadroBusqueda && busqueda) {
        busqueda.addEventListener("click", function() {
            cuadroBusqueda.classList.toggle("mostrar");
        });
    }

}


// Esta función rota el ícono del menú hamburguesa cuando se abre o se cierra.
function activarIconoHamburguesa() {

    const collapse = document.getElementById("navbarNav");
    const icono = document.querySelector(".icono-hamb");

    if (collapse && icono) {

        collapse.addEventListener("show.bs.collapse", function() {
            icono.classList.add("rotado");
        });

        collapse.addEventListener("hide.bs.collapse", function() {
            icono.classList.remove("rotado");
        });

    }

}


// Esta función obtiene el id desde la URL y busca la película/serie en el JSON.
function cargarDetalle() {

    const parametros = new URLSearchParams(window.location.search);

    // Si no llega ningún id por URL, muestra The Walking Dead por defecto.
    const idPelicula = parametros.get("id") || "the-walking-dead";

    fetch("../json/pelis_y_series.json")
        .then(function(respuesta) {
            return respuesta.json();
        })
        .then(function(peliculasSeries) {

            const peliculaEncontrada = peliculasSeries.find(function(pelicula) {
                return pelicula.id === idPelicula;
            });

            if (peliculaEncontrada) {
                mostrarDetalle(peliculaEncontrada);
            } else {
                mostrarErrorDetalle();
            }

        })
        .catch(function(error) {
            console.error("Error al cargar el detalle:", error);
            mostrarErrorDetalle();
        });

}


// Esta función muestra los datos de la película o serie dentro de detalle.html.
function mostrarDetalle(pelicula) {

    const portadaDetalle = document.getElementById("portada_detalle");
    const tituloDetalle = document.getElementById("titulo");
    const generoDetalle = document.getElementById("genero");
    const sinopsisDetalle = document.getElementById("sinopsis");
    const capsDetalle = document.getElementById("caps");
    const puntuacionDetalle = document.getElementById("puntuacion");
    const creadorDetalle = document.getElementById("creador");
    const duracionDetalle = document.getElementById("duracion");
    const actoresDetalle = document.getElementById("actores");
    const bannerDetalle = document.getElementById("banner");
    const btnFavs = document.getElementById("btn-favs");

    const imagenPortada = obtenerImagen(pelicula.portada, "../img/twd_portada.jpg");
    const imagenBanner = obtenerImagen(pelicula.banner, "../img/banner.avif");

    if (portadaDetalle) {
        portadaDetalle.src = imagenPortada;
        portadaDetalle.alt = pelicula.titulo;
    }

    if (bannerDetalle) {
        bannerDetalle.src = imagenBanner;
        bannerDetalle.alt = pelicula.titulo;
    }

    if (tituloDetalle) {
        tituloDetalle.innerHTML = `<h1>${pelicula.titulo}</h1>`;
    }

    if (generoDetalle) {
        generoDetalle.innerHTML = `<h3>${pelicula.genero}</h3>`;
    }

    if (sinopsisDetalle) {
        sinopsisDetalle.innerHTML = `<p>${pelicula.sinopsis}</p>`;
    }

    if (capsDetalle) {
        capsDetalle.textContent = pelicula.caps;
    }

    if (puntuacionDetalle) {
        puntuacionDetalle.textContent = pelicula.puntuacion;
    }

    if (creadorDetalle) {
        creadorDetalle.textContent = pelicula.creador;
    }

    if (duracionDetalle) {
        duracionDetalle.textContent = pelicula.duracion;
    }

    if (actoresDetalle) {
        actoresDetalle.textContent = pelicula.actores.join(", ");
    }

    if (btnFavs) {
        btnFavs.addEventListener("click", function() {
            agregarAFavoritos(pelicula.id);
        });
    }

}


// Esta función muestra un mensaje si no se encuentra la película o serie.
function mostrarErrorDetalle() {

    const tituloDetalle = document.getElementById("titulo");
    const sinopsisDetalle = document.getElementById("sinopsis");

    if (tituloDetalle) {
        tituloDetalle.innerHTML = `<h1>No se encontró la película o serie</h1>`;
    }

    if (sinopsisDetalle) {
        sinopsisDetalle.innerHTML = `<p>Volvé a la página de listas e intentá nuevamente.</p>`;
    }

}


// Esta función evita que se rompa la página si todavía no cargaste una imagen real.
function obtenerImagen(ruta, respaldo) {

    if (!ruta || ruta === "../img/" || ruta.endsWith("/")) {
        return respaldo;
    }

    return ruta;

}


// Esta función guarda favoritos en localStorage.
function agregarAFavoritos(idPelicula) {

    let favoritos = JSON.parse(localStorage.getItem("mis_favoritos")) || [];

    if (!favoritos.includes(idPelicula)) {
        favoritos.push(idPelicula);
        localStorage.setItem("mis_favoritos", JSON.stringify(favoritos));
        alert("¡Agregada a tus favoritos!");
    } else {
        alert("Esta película o serie ya está en tus favoritos.");
    }

}


/* 

CAMBIAR LINK DE CONTACTO 
<a class="nav-link btn-nav" href="inicio.html#Contacto">Contacto</a> 

SACAR EL ONCLICK FIJO DE FAVORITOS
<button type="button" class="btn btn-dark text-warning w-100" id="btn-favs">

AGREGAR
<script src="../js/detalle.js"></script>

*/