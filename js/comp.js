

// INICIO 
// HEADER
const navbar = document.querySelector(".navbar");
const navItems = document.querySelectorAll(".btn-nav")

window.addEventListener("scroll", () => {
    
    if (window.scrollY > 0) {
        navbar.classList.add("navbar-scroll");
        navItems.classList.add("btn-navScroll");
    } 
    
    else {
        navbar.classList.remove("navbar-scroll");
        navbar.classList.add("transition-scroll");
    }

});

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

// BUSQUEDA NAVBAR

const formBusqueda = document.getElementById("busquedaNav");


formBusqueda.addEventListener("submit", (e) => {

    e.preventDefault();

    const texto = cuadroBusqueda.value.trim();

    if(texto !== ""){

        window.location.href =
        `explorar.html?busqueda=${encodeURIComponent(texto)}`;

    }

});

//================================================
//======================= CLASES =================
//================================================

class PeliculaSerie{
    constructor(id, titulo, portada, genero, sinopsis, caps, duracion, puntuacion, creador, actores, banner, reseñas, puntuacionTotal, director){
        this.id = id;
        this.titulo = titulo;
        this.portada = portada;
        this.genero = genero;
        this.sinopsis = sinopsis;
        this.caps = caps;
        this.duracion = duracion;
        this.puntuacion = puntuacion;
        this.creador = creador;
        this.actores = actores;
        this.banner = banner;
        this.reseñas = reseñas;
        this.puntuacionTotal = puntuacionTotal;
        this.director = director;
    }
}


class Usuario{
    constructor(username, email, contraseña, fechaNac, fotoPerfil, banner, biografia, pelis_puntuadas, reseñas, favoritos){
        this.username = username;
        this.email = email;
        this.contraseña = contraseña;
        this.fechaNac = fechaNac;
        this.fotoPerfil = fotoPerfil;
        this.banner = banner;
        this.biografia = biografia;
        this.pelis_puntuadas = pelis_puntuadas;
        this.reseñas = reseñas;
        this.favoritos = favoritos;
    }
}

// =========================================================
// PRECARGA DE DATOS DESDE ARCHIVOS JSON A LOCALSTORAGE
// =========================================================

//Función para cargar usuarios.json
async function precargarUsuarios() {
    // Solo actuamos si NO existe la clave "usuarios" en el localStorage
    if (!localStorage.getItem("usuarios")) {
        try {
            // NOTA: Ajustá la ruta según dónde tengas guardado el JSON (ej: '../json/usuarios.json')
            const respuesta = await fetch("../json/usuarios.json"); 
            
            if (!respuesta.ok) {
                throw new Error(`Error al leer usuarios.json: ${respuesta.status}`);
            }
            
            const datosUsuarios = await respuesta.json();
            
            // Guardamos el array completo convertido a texto
            localStorage.setItem("usuarios", JSON.stringify(datosUsuarios));
            console.log("¡Usuarios precargados con éxito en localStorage!");
            
        } catch (error) {
            console.error("Hubo un problema al precargar los usuarios:", error);
        }
    }
}

// Función para cargar pelis_y_series.json
async function precargarPelisYSeries() {
    // Solo actuamos si NO existe la clave "peliculas_series" en el localStorage
    if (!localStorage.getItem("peliculas_series")) {
        try {
            // NOTA: Ajustá la ruta si el archivo está en otra carpeta (ej: 'pelis_y_series.json')
            const respuesta = await fetch("../json/pelis_y_series.json");
            
            if (!respuesta.ok) {
                throw new Error(`Error al leer pelis_y_series.json: ${respuesta.status}`);
            }
            
            const datosPelisSeries = await respuesta.json(); //captura los objetos del json
            
            // Guardamos el array de películas/series en el localStorage
            localStorage.setItem("peliculas_series", JSON.stringify(datosPelisSeries));
            
        } catch (error) {
            console.error("Hubo un problema al precargar películas y series:", error);
        }
    }
}



// =========================================================
// EJECUCIÓN AL CARGAR LA PÁGINA
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    // Llamamos a las funciones de precarga apenas el HTML esté listo
    precargarUsuarios();
    precargarPelisYSeries();
    
});

/* Carga de Datos de Película */

let Arreglo_Pelis_Series = [];

// Captura de elementos del DOM
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
const estrenoDetalle = document.getElementById("fecha-salida");
const directorDetalle = document.getElementById("director");
const trailerDetalle = document.getElementById("linkTrailer");


// EJECUCIÓN AUTOMÁTICA AL CARGAR LA PÁGINA
// ENCARGADO DE RENDERIZAR LOS DETALLES DE LA PESTAÑA DETALLES.HTML Y PERFIL.HTML
window.addEventListener('load', () => {

    // Traer los datos del JSON
    fetch('../json/pelis_y_series.json')
        .then(res => res.json())
        .then(datosJSON => {
            
            // Llenamos el arreglo con instancias de la clase
            Arreglo_Pelis_Series = []; // Aseguramos vaciado limpio
            datosJSON.forEach(p => {
                let pelicula = new PeliculaSerie(p.id, p.titulo, p.portada, p.genero, p.sinopsis, p.caps, p.duracion, p.puntuacion, p.creador, p.actores, p.banner, p.reseñas, p.puntuacionTotal, p.director);
                Arreglo_Pelis_Series.push(pelicula);
            });

            // COMPROBACIÓN DE PÁGINA:
            // Si existe 'tituloDetalle', estamos en detalle.html
            if (document.getElementById("titulo")) {
                renderizarDetalles();
            }
            
            // Si existe el contenedor de favoritos, estamos en perfil.html
            if (document.querySelector(".contenedor_favoritos")) {
                renderizarFavoritosPerfil();
                cargarFotoPerfil();
                cargarBannerPerfil();
                cargarBiografia();
                cargarNombreUsuario();
                cargarReseñasPerfil();
            }


        })
        .catch(err => console.error("Error cargando el JSON:", err));
});

// FUNCIÓN PARA PINTAR LOS DATOS EN LA PESTAÑA DETALLES
function renderizarDetalles() {


    // 1. Obtenemos los parámetros de la URL actual
    const urlParams = new URLSearchParams(window.location.search);

    // 2. Capturamos el valor específico del parámetro 'id'
    const idPelicula = urlParams.get('id');

    // Buscamos directamente el objeto que coincida con el id
    let ListaPeliculasSeries = JSON.parse(localStorage.getItem('peliculas_series'));
    const peliEncontrada = ListaPeliculasSeries.find(peli => peli.id === idPelicula);

    // TODA LA LOGICA PARA CALCULAR EL PROMEDIO DE PUNTUACIONES DE LA PELICULA O SERIE
    let sumatotal = 0;
    let puntaje = 0;
    for(i=0; i<peliEncontrada.puntuacion.length; i++){
        sumatotal += parseFloat(peliEncontrada.puntuacion[i].puntaje);
        
    }

    if(sumatotal === 0){
        puntaje = 0.00;
    }else{
        puntaje = sumatotal / peliEncontrada.puntuacion.length;
    }

    peliEncontrada.puntuacionTotal = puntaje.toFixed(2);

    /////////////////////////////////////////////////////////////////////////////////////
    verificarFavoritoAlCargar();
    if (peliEncontrada) {
        portadaDetalle.src = peliEncontrada.portada;
        bannerDetalle.src = peliEncontrada.banner;
        
        tituloDetalle.innerHTML = `<h1>${peliEncontrada.titulo}</h1>`;
        generoDetalle.innerHTML = `<h3>${peliEncontrada.genero}</h3>`;
        sinopsisDetalle.innerHTML = `<p>${peliEncontrada.sinopsis}</p>`;
        capsDetalle.innerHTML = `<p>${peliEncontrada.caps}</p>`;
        puntuacionDetalle.innerHTML = `<p><i class="bi bi-star-fill"></i> ${peliEncontrada.puntuacionTotal}</p>`;
        creadorDetalle.innerHTML = `<p>${peliEncontrada.creador}</p>`;
        duracionDetalle.innerHTML = `<p>${peliEncontrada.duracion}</p>`;
        estrenoDetalle.innerHTML = `<p>${peliEncontrada.fechaEstreno}</p>`;
        directorDetalle.innerHTML = `<p>${peliEncontrada.director}</p>`;
        trailerDetalle.setAttribute('href',`${peliEncontrada.trailer}`);
        
        const listaActores = peliEncontrada.actores.join(', ');
        actoresDetalle.innerHTML = `<p>${listaActores}</p>`;
    } else {
        console.error("No se encontró ninguna película con el ID: " + id_pelicula);
    }

    const reseñasGuardadas = JSON.parse(localStorage.getItem('reseñasTodaPagina'));


    // DETECTA CUALES SON LAS RESEÑAS DE ESA PELICULA Y MOSTRARLAS DE ACUERDO A ESO
    const contenedorReseñas = document.getElementById('contenedor-reseñas-detalle');

    if(contenedorReseñas){
        contenedorReseñas.innerHTML = "";
    }
    

    if(peliEncontrada.reseñas.length === 0){
        contenedorReseñas.innerHTML = `
        <p> No hay reseñas cargadas </p>
        `;
        return;
    }
    if(reseñasGuardadas){
        reseñasGuardadas.forEach(reseña => {
                for(i=0; i<peliEncontrada.reseñas.length; i++){
                    if(reseña.id === peliEncontrada.reseñas[i]){
                        const tarjetaHTML = `
                            <div class="card border-0 p-3 mb-3" style="background-color: rgba(255,255,255,0.02); border-left: 3px solid var(--celeste) !important; border-radius: 10px;">
                                <div class="d-flex align-items-center mb-2">
                                    <img src="${reseña.fotoUsuario}" alt="Avatar ${reseña.nombreUsuario}" class="rounded-circle me-3" width="45" height="45" style="object-fit: cover; border: 2px solid var(--celeste);">
                                    <div>
                                        <h6 class="mb-0 fw-bold text-white">${reseña.nombreUsuario}</h6>
                                        <div class="d-flex align-items-center mt-1">
                                            <div class="me-2">${reseña.estrellasHTML}</div>
                                            <small class="text-muted">(${reseña.puntuacion}/10 pts)</small>
                                        </div>
                                    </div>
                                </div>
                                <p class="mb-0 mt-2 text-white-50" style="font-size: 0.95rem; line-height: 1.5;">
                                    ${reseña.comentarioTexto}
                                </p>
                            </div>
                        `;
                        contenedorReseñas.insertAdjacentHTML("beforeend", tarjetaHTML);
                    }
                }
        });
    }
    
    ////////////////////////////////////////////////////////////////////////////////

    let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    // Cambiar la estrella a estrella llena (Aun no funciona)
    for(i=0; i<usuarioLogeado.favoritos.length; i++){
        if(peliEncontrada.titulo === usuarioLogeado.favoritos[i]){
            document.getElementById('btn-favs').innerHTML = `
                <i class="bi bi-star-filled"></i>
            `;
        }
    }
    

}

// ==========================================
//   LÓGICA DE FAVORITOS (LOCALSTORAGE)
// ==========================================

function abrirModal() {
    document.getElementById("modal-aviso-favoritos").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal-aviso-favoritos").style.display = "none";
}

function abrirModalFavoritos() {
    document.getElementById("modal-agregadoAFavoritos").style.display = "flex";
}

function cerrarModalAgregados(){
    document.getElementById("modal-agregadoAFavoritos").style.display = "none";
}

function abrirModalQuitar() {
    document.getElementById("modal-quitadoFavoritos").style.display = "flex";
}

function cerrarModalQuitado(){
    document.getElementById("modal-quitadoFavoritos").style.display = "none";
}

// FUNCIÓN PARA AGREGAR/QUITAR FAVORITOS DESDE DETALLE.HTML
function agregarAFavoritos() {
    
    // 1. Obtenemos los parámetros de la URL actual
    const urlParams = new URLSearchParams(window.location.search);

    // 2. Capturamos el valor específico del parámetro 'id'
    const idPelicula = urlParams.get('id');

    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));

    if(!usuarioLogeado){
        abrirModal(); // Abre tu modal personalizado de aviso
        return;
    }

    // [NUEVO] Seleccionamos el ícono de la estrella dentro del botón
    const iconoEstrella = document.querySelector('#btn-favs i');

    // Validamos que no se duplique la película (Caso: AGREGAR A FAVORITOS)
    if (!usuarioLogeado.favoritos.includes(idPelicula)) {

        // Agrego la id de la pelicula a la propiedad de favoritos del usuarioLogeado
        usuarioLogeado.favoritos.push(idPelicula);
        
        // Actualizo al usuarioLogeado en el localStorage
        localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
        
        // Actualizo esto también para la lista de todos los usuarios (Corregido con let)
        for(let i = 0; i < listaUsuarios.length; i++){
            if(listaUsuarios[i].email === usuarioLogeado.email){
                listaUsuarios[i].favoritos = usuarioLogeado.favoritos;
            }
        }
        localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

        // [NUEVO] Cambiamos el diseño visual del ícono a RELLENO
        if (iconoEstrella) {
            iconoEstrella.classList.remove('bi-star');
            iconoEstrella.classList.add('bi-star-fill');
        }

        abrirModalFavoritos();

    } else { // Caso: QUITAR DE FAVORITOS
        
        // Buscamos y removemos el ID del array (Corregido con let)
        for(let i = 0; i < usuarioLogeado.favoritos.length; i++){
            if(idPelicula === usuarioLogeado.favoritos[i]){
                usuarioLogeado.favoritos.splice(i, 1);
            }
        }
        
        // Actualizo al usuarioLogeado en el localStorage
        localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
        
        // Actualizo esto también para la lista de todos los usuarios (Corregido con let)
        for(let i = 0; i < listaUsuarios.length; i++){
            if(listaUsuarios[i].email === usuarioLogeado.email){
                listaUsuarios[i].favoritos = usuarioLogeado.favoritos;
            }
        }
        localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
        
        // [NUEVO] Volvemos a poner el ícono VACÍO
        if (iconoEstrella) {
            iconoEstrella.classList.remove('bi-star-fill');
            iconoEstrella.classList.add('bi-star');
        }

        abrirModalQuitar();
    }
}

// FUNCIÓN PARA REVISAR EL ESTADO INICIAL DE LA ESTRELLA
function verificarFavoritoAlCargar() {
    // 1. Obtenemos el ID de la película actual desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idPelicula = urlParams.get('id');

    // 2. Traemos al usuario logeado desde el localStorage
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));

    // 3. Verificamos: ¿Hay usuario, tiene la propiedad favoritos y ya incluye esta ID?
    if (usuarioLogeado && usuarioLogeado.favoritos && usuarioLogeado.favoritos.includes(idPelicula)) {
        
        // Si todo es verdadero, buscamos la estrella y la pintamos rellena
        const iconoEstrella = document.querySelector('#btn-favs i');
        if (iconoEstrella) {
            iconoEstrella.classList.remove('bi-star');
            iconoEstrella.classList.add('bi-star-fill');
        }
    }
}

// FUNCIÓN PARA RENDERIZAR FAVORITOS EN PERFIL.HTML
// — Al hacer hover sobre la portada muestra el nombre de la peli —
function renderizarFavoritosPerfil() {
    const contenedorFavoritos = document.querySelector(".contenedor_favoritos");
    if (!contenedorFavoritos) return;

    contenedorFavoritos.innerHTML = "";

    let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));

    if (!usuarioLogeado || usuarioLogeado.favoritos.length === 0) {
        contenedorFavoritos.innerHTML = `
            <div class="favoritos-vacio w-100">
                <i class="bi bi-star" style="font-size:1.6rem; opacity:0.3; display:block; margin-bottom:.5rem;"></i>
                Todavía no agregaste favoritos.
            </div>`;
        return;
    }

    usuarioLogeado.favoritos.forEach(idFav => {
        const peli = Arreglo_Pelis_Series.find(p => p.id === idFav);
        if (!peli) return;

        const col = document.createElement("div");
        col.className = "col-4 col-sm-3 col-md-2 mb-3";
        col.innerHTML = `
            <a href="detalle.html?id=${peli.id}" class="favorito-item">
                <img src="${peli.portada}" alt="${peli.titulo}">
                <span class="favorito-badge-fav"><i class="bi bi-star-fill"></i></span>
                <span class="favorito-titulo-hover">${peli.titulo}</span>
            </a>
        `;
        contenedorFavoritos.appendChild(col);
    });
}

////////////////////////////////////////////////////


// ==========================================
//   LÓGICA PARA CAMBIAR FOTO DE PERFIL
// ==========================================

// Comprobamos si estamos en perfil.html buscando los elementos clave
const btnCambiarPfp = document.getElementById('btn-cambiar-pfp');
const inputPfp = document.getElementById('input-pfp');
const vistaPfp = document.getElementById('vista-pfp');

if (btnCambiarPfp && inputPfp && vistaPfp) {

    // 1. Al hacer click en el botón de la cámara, disparamos el click del input oculto
    btnCambiarPfp.addEventListener('click', () => {
        inputPfp.click();
    });

    // 2. Escuchamos cuando el usuario selecciona efectivamente un archivo
    inputPfp.addEventListener('change', (evento) => {
        const archivo = evento.target.files[0];

        if (archivo) {
            const lector = new FileReader();

            // Cuando la lectura termine con éxito, procesamos el resultado
            lector.onload = function(e) {
                const imagenBase64 = e.target.result; //Crea una constante para guardar la imagen seleccionada "imagenBase64"

                // Cambiamos la vista previa en el DOM inmediatamente
                vistaPfp.src = imagenBase64;

                // Asigno esa nueva imagen a la propiedad fotoPerfil del usuarioLogeado
                const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
                usuarioLogeado.fotoPerfil = imagenBase64;
                //Guardo ese cambio en el localStorage
                localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado)); 

            };

            // Leemos el archivo local convirtiéndolo a una cadena de texto Base64
            lector.readAsDataURL(archivo);

            
        }
    });
}

// 3. FUNCIÓN PARA CARGAR LA FOTO GUARDADA AL ENTRAR A LA PÁGINA
function cargarFotoPerfil() {
    if (vistaPfp) {
        const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
        if (usuarioLogeado) {
            vistaPfp.src = usuarioLogeado.fotoPerfil || "../img/default-avatar.png";
        }
    }
}


// ==========================================
//   LÓGICA PARA CAMBIAR EL BANNER
// ==========================================

// Capturamos los elementos del banner
const btnCambiarBanner = document.getElementById('btn-cambiar-banner');
const inputBanner = document.getElementById('input-banner');
const vistaBanner = document.getElementById('vista-banner');

if (btnCambiarBanner && inputBanner && vistaBanner) {

    // 1. Al hacer click en el botón, disparamos el input file oculto
    btnCambiarBanner.addEventListener('click', () => {
        inputBanner.click();
    });

    // 2. Escuchamos cuando se selecciona la nueva imagen
    inputBanner.addEventListener('change', (evento) => {
        const archivo = evento.target.files[0];

        if (archivo) {
            const lector = new FileReader();

            lector.onload = function(e) {
                const imagenBase64 = e.target.result;

                // Actualizamos la vista previa en el momento
                vistaBanner.src = imagenBase64;
                // Asigno esa nueva imagen a la propiedad banner del usuarioLogeado
                const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
                usuarioLogeado.banner = imagenBase64;
                // Guardo ese cambio en el localStorage
                localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado)); 
            };

            lector.readAsDataURL(archivo);
        }
    });
}

// 3. FUNCIÓN PARA CARGAR EL BANNER GUARDADO AL ENTRAR A LA PÁGINA
function cargarBannerPerfil() {
    if (vistaBanner) {
        const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
        if (usuarioLogeado) {
            vistaBanner.src = usuarioLogeado.banner || "../img/banner-default.jpg";
        }
    }
}


// ==========================================
//   LÓGICA INTERACTIVA DE BIOGRAFÍA (IN-PLACE)
// ==========================================

const btnEditarBio = document.getElementById('btn-editar-bio');
const contenedorBioInteractivo = document.getElementById('contenedor-bio-interactivo');

let editando = false; // Variable de estado para controlar el modo
let modoEdicionActivo = false;

if (btnEditarBio && contenedorBioInteractivo) {

    btnEditarBio.addEventListener('click', () => {
        if (!modoEdicionActivo) return;
        if (!editando) {
            // --- MODO EDICIÓN ---
            editando = true;
            
            // 1. Capturamos el texto que tiene actualmente el párrafo
            const textoActualEl = document.getElementById('texto-bio');
            const textoActual = textoActualEl ? textoActualEl.innerText : "";

            // 2. Reemplazamos el contenido por un textarea con el texto cargado
            contenedorBioInteractivo.innerHTML = `
                <textarea id="texto-bio-editando" class="textarea-bio-edicion" rows="4">${textoActual}</textarea>
            `;

            // 3. Cambiamos el aspecto del botón a modo "Guardar"
            btnEditarBio.innerHTML = `<i class="bi bi-check-lg"></i> Guardar`;
            btnEditarBio.classList.replace('btn-outline-info', 'btn-success');
            btnEditarBio.style.borderColor = '#198754';
            btnEditarBio.style.color = '#fff';

        } else {
            // --- MODO GUARDAR ---
            editando = false;

            // 1. Capturamos lo que escribió el usuario en el textarea
            const textareaEl = document.getElementById('texto-bio-editando');
            let nuevoTexto = textareaEl ? textareaEl.value : "";

            // Candado por si lo deja completamente vacío
            if (nuevoTexto.trim() === "") {
                nuevoTexto = "¡Hola! Contanos un poco sobre tus gustos en series y películas...";
            }

            // 2. Restauramos la estructura original del párrafo (<p>) inyectando el nuevo valor
            contenedorBioInteractivo.innerHTML = `
                <p class="text-white border border-white p-3 rounded mb-0" id="texto-bio">${nuevoTexto}</p>
            `;

            // Asigno esa nueva biografía a la propiedad biografía del usuarioLogeado
            const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
            usuarioLogeado.biografia = textareaEl.value;
            console.log(usuarioLogeado.biografia);
            // Guardo el Cambio de manera permanente
            localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado)); 

            // 4. Devolvemos el botón a su estado original de "Editar"
            btnEditarBio.innerHTML = `<i class="bi bi-pencil-fill"></i> Editar`;
            btnEditarBio.classList.replace('btn-success', 'btn-outline-info');
            btnEditarBio.style.borderColor = 'var(--celeste)';
            btnEditarBio.style.color = 'var(--celeste)';
        }
    });
}

// FUNCIÓN PARA CARGAR LA BIOGRAFÍA EN ALMACENAMIENTO (Se mantiene igual)
function cargarBiografia() {
    const textoBio = document.getElementById('texto-bio');
    if (textoBio) {
        const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
        if (usuarioLogeado) {
            textoBio.innerText = usuarioLogeado.biografia;
        }
    }
}

// ==========================================
//   LÓGICA INTERACTIVA DE USERNAME
// ==========================================

const botonUserName = document.getElementById("btn-cambiar-username");
const contNombreUsuario = document.getElementById("cont_nombre_de_usuario");

let editandoUsername = false; 

if (botonUserName && contNombreUsuario) {
    botonUserName.addEventListener("click", () => {
        if (!modoEdicionActivo) return;
        if (!editandoUsername) {
            // --- MODO EDICIÓN ---
            editandoUsername = true;

            // 1. Capturamos el h2 actual
            const elUsername = document.getElementById("username");
            const textoActual = elUsername ? elUsername.textContent.trim() : "Nombre de Usuario";

            // 2. Solo reemplazamos lo que está ADENTRO del div contenedor por el input
            contNombreUsuario.innerHTML = `
                <input type="text" id="username-input" class="form-control text-start w-75 fw-bold fs-4 mb-2" value="${textoActual}" maxlength="25">
            `;

            // 3. Cambiamos visualmente el botón a modo "Guardar"
            botonUserName.innerHTML = `<i class="bi bi-check-lg"></i> Guardar Nombre`;
            botonUserName.classList.replace('btn-outline-info', 'btn-success');
            botonUserName.style.borderColor = '#198754';
            botonUserName.style.color = '#fff';
            

            
 
        } else {
            // --- MODO GUARDAR ---
            editandoUsername = false;

            // 1. Capturamos el valor que escribió el usuario
            const inputUsername = document.getElementById("username-input");
            let nuevoNombre = inputUsername ? inputUsername.value.trim() : "";

            const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
            const listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));

            // 2. VALIDACIÓN: ¿Existe otro usuario con ese nombre?
            // Usamos .some() para ver si existe algún usuario (u) que:
            // A. Tenga el mismo nombre que el nuevoNombre
            // B. No sea el mismo usuario que está editando (para poder guardar si no cambió el nombre)
            const nombreDuplicado = listaUsuarios.some(u => 
                u.username === nuevoNombre && u.username !== usuarioLogeado.username
            );

            if (nombreDuplicado) {
                alert("Ya hay un usuario con ese nombre");
                // --- MODO GUARDAR ---
                editandoUsername = false;
                // 2. Volvemos a inyectar el h2 estático adentro del div contenedor
                contNombreUsuario.innerHTML = `
                <h2 class="fw-bold" id="username">${usuarioLogeado.username}</h2>
                `;
                // 4. Devolvemos el botón a su estado original celeste
                botonUserName.innerHTML = `<i class="bi bi-pencil-fill"></i> Cambiar Nombre de Usuario`;
                botonUserName.classList.replace('btn-success', 'btn-outline-info');
                botonUserName.style.borderColor = 'var(--celeste)';
                botonUserName.style.color = 'var(--celeste)';
                return; // Detenemos la ejecución aca
            }

            if (nuevoNombre === "") {
                nuevoNombre = "Nombre de Usuario";
            }
            // 2. Volvemos a inyectar el h2 estático adentro del div contenedor
            contNombreUsuario.innerHTML = `
                <h2 class="fw-bold" id="username">${nuevoNombre}</h2>
            `;

            // Asigno ese nuevo username a la propiedad username del usuarioLogeado
            usuarioLogeado.username = nuevoNombre;
            // Guardo ese cambio en el localStorage
            localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado)); 

            for(i=0; i<listaUsuarios.length; i++){
                if(usuarioLogeado.email === listaUsuarios[i].email){
                    listaUsuarios[i] = usuarioLogeado;
                }
            }
            localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

            // 4. Devolvemos el botón a su estado original celeste
            botonUserName.innerHTML = `<i class="bi bi-pencil-fill"></i> Cambiar Nombre de Usuario`;
            botonUserName.classList.replace('btn-success', 'btn-outline-info');
            botonUserName.style.borderColor = 'var(--celeste)';
            botonUserName.style.color = 'var(--celeste)';
        }
    });
}

// FUNCIÓN PARA CARGAR EL NOMBRE EN EL LOAD
function cargarNombreUsuario() {
    const elUsername = document.getElementById("username");
    if (elUsername) {
        const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
        if (usuarioLogeado) {
            elUsername.textContent = usuarioLogeado.username;
        }
    }
}





// BOTON PARA EDITAR PERFIL GENERAL
const editarPerfil = document.getElementById("btn-editar-perfil-general");

if (editarPerfil) {
    editarPerfil.addEventListener("click", () => {

        if (!modoEdicionActivo) {
            // ── ACTIVAR MODO EDICIÓN ──
            modoEdicionActivo = true;
            btnEditarBio.style.display = "block";
            btnCambiarBanner.style.display = "block";
            btnCambiarPfp.style.display = "block";
            botonUserName.style.display = "block";
            editarPerfil.innerHTML = `<i class="bi bi-x-lg"></i> Salir de Edición`;

        } else {
            // ── DESACTIVAR MODO EDICIÓN ──
            // Primero guardar lo que esté en edición (con modoEdicionActivo aún en true)
            if (editando) {
                btnEditarBio.click();
            }
            if (editandoUsername) {
                botonUserName.click();
            }
            // Recién ahora desactivamos
            modoEdicionActivo = false;
            btnEditarBio.style.display = "none";
            btnCambiarBanner.style.display = "none";
            btnCambiarPfp.style.display = "none";
            botonUserName.style.display = "none";
            editarPerfil.innerHTML = `<i class="bi bi-pencil-square"></i> Editar Perfil`;
        }
    });
}

// =========================================================
// CONTROLES DE FORMULARIO DE REGISTRO
// =========================================================


const userName = document.getElementById("input-username");
const errorUserName = document.getElementById("username-aviso");
const email = document.getElementById("input-email");
const errorEmail = document.getElementById("email-aviso");
const contraseña = document.getElementById("input-password");
const errorContraseña = document.getElementById("password-aviso");
const confirmContraseña = document.getElementById("input-confirmPassword");
const errorConfirmContraseña = document.getElementById("confirmPassword-aviso");
const fechaNac = document.getElementById("input-fechaNac");
const errorFechaNac = document.getElementById("fechaNac-aviso");
const terminos = document.getElementById("input-terminos");
const errorTerminos = document.getElementById("terminos-aviso");

let algunError = false;


// CONTROL DE USERNAME (Protegido para que no rompa en otras páginas)
if (userName) {
    userName.addEventListener("change", () => {
        const listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
        for(i=0; i<listaUsuarios.length; i++){
            if (userName.value.trim().length <= 1 || userName.value.trim() === listaUsuarios[i].username) {
            errorUserName.style.display = "block";
            errorUserName.innerHTML = `
                <p class="text-danger mb-1"><i class="bi bi-exclamation-circle-fill"></i> El nombre de usuario tiene menos de 2 caracteres o ya está en uso</p>
            `;
            userName.style.border = "3px solid red";
            algunError = true;
            break;
            } else {
                errorUserName.style.display = "block";
                errorUserName.innerHTML = `
                    <p class="text-success mb-1"><i class="bi bi-check-circle-fill"></i> Nombre de usuario disponible y correcto</p>
                `;
                userName.style.border = "3px solid green";
                algunError = false;
            }
        }
        
    });
}

// CONTROL DE EMAIL
if(email){
    email.addEventListener("change", () => {
    // Expresión regular estándar para verificar texto + @ + texto + . + texto
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));

    for(i=0; i<listaUsuarios.length; i++){
        if (!regexEmail.test(email.value.trim()) || listaUsuarios[i].email === email.value.trim()) {
        errorEmail.style.display = "block";
        errorEmail.innerHTML = `
            <p class="text-danger"><i class="bi bi-exclaminations-circle"></i> La dirección de correo electrónico no es válida (ej: usuario@correo.com)</p>
        `;
        email.style.border = "3px solid red";
        algunError = true;
        break;
        } else {
            errorEmail.style.display = "block";
            errorEmail.innerHTML = `
                <p class="text-success"><i class="bi bi-check-circle-fill"></i> Correo electrónico correcto</p>
            `;
            email.style.border = "3px solid green";
            algunError = false;
        }
    }
    
});
}

// CONTROL DE CONTRASEÑA (Mínimo 6 caracteres)
if(contraseña){
    
    contraseña.addEventListener("change", () => {
    if (contraseña.value.length < 6) {
        errorContraseña.style.display = "block";
        errorContraseña.innerHTML = `
            <p class="text-danger"><i class="bi bi-exclaminations-circle"></i> La contraseña debe tener al menos 6 caracteres </p>
        `;
        contraseña.style.border = "3px solid red";
        algunError = true;
    } else {
        errorContraseña.style.display = "block";
        errorContraseña.innerHTML = `
            <p class="text-success"><i class="bi bi-check-circle-fill"></i> Contraseña segura </p>
        `;
        contraseña.style.border = "3px solid green";
        algunError = false;
    }

    // Si el usuario cambia la contraseña principal, volvemos a chequear que la confirmación coincida
    if (confirmContraseña.value !== "") {
        confirmContraseña.dispatchEvent(new Event('change'));
    }
});
}

// CONTROL DE CONFIRMAR CONTRASEÑA (Debe ser idéntica a la primera)
if(confirmContraseña){
    
confirmContraseña.addEventListener("change", () => {
        if (confirmContraseña.value !== contraseña.value || confirmContraseña.value === "") {
            errorConfirmContraseña.style.display = "block";
            errorConfirmContraseña.innerHTML = `
                <p class="text-danger mb-1"><i class="bi bi-exclamation-circle-fill"></i> Las contraseñas no coinciden.</p>
            `;
            confirmContraseña.style.border = "3px solid red";
            algunError = true;
        } else {
            errorConfirmContraseña.style.display = "block";
            errorConfirmContraseña.innerHTML = `
                <p class="text-success mb-1"><i class="bi bi-check-circle-fill"></i> Las contraseñas coinciden correctamente.</p>
            `;
            confirmContraseña.style.border = "3px solid green";
            algunError = false;
        }
});
}

// CONTROL DE FECHA DE NACIMIENTO (Validar que no esté vacía y que sea mayor de edad)
if(fechaNac){
    
fechaNac.addEventListener("change", () => {
    
    // 2. Convertimos el string "YYYY-MM-DD" en un objeto Date real de JS de forma segura
    const [anio, mes, dia] = fechaNac.value.split("-").map(Number);
    const fechaNacimiento = new Date(anio, mes - 1, dia); // Los meses en JS van de 0 a 11

    // 3. Calculamos la fecha límite (Hoy hace 18 años)
    const hoy = new Date();
    const fechaLimite = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());

    if (fechaNac.value === "" || fechaNacimiento > fechaLimite) {
        errorFechaNac.style.display = "block";
        errorFechaNac.innerHTML = `
            <p class="text-danger"><i class="bi bi-exclaminations-circle"></i> Por favor, seleccione una fecha de nacimiento válida(+18) </p>
        `;
        fechaNac.style.border = "3px solid red";
        algunError = true;
    } else {
        // Validación opcional: Verificar si es mayor de 13 o 18 años si lo requirieras
        errorFechaNac.style.display = "block";
        errorFechaNac.innerHTML = `
            <p class="text-success"><i class="bi bi-check-circle-fill"></i> Fecha válida </p>
        `;
        fechaNac.style.border = "3px solid green";
        algunError = false;
    }
});
}

// CONTROL DE TÉRMINOS Y CONDICIONES (Checkboxes usan evento 'change')
if(terminos){
    
terminos.addEventListener("change", () => {
    if (!terminos.checked) {
        errorTerminos.style.display = "block";
        errorTerminos.innerHTML = `
            <p class="text-danger"><i class="bi bi-exclaminations-circle"></i> Debe aceptar los términos y condiciones para continuar </p>
        `;
        algunError = true;
    } else {
        errorTerminos.style.display = "none"; // Ocultamos el aviso si está todo OK
        algunError = false;
    }
});

}

// =========================================================
// FUNCIÓN AUXILIAR PARA MOSTRAR EL MODAL DE AVISO
// =========================================================
function mostrarAviso(titulo, mensajeHTML, esExito = false) {
    const modalElemento = document.getElementById("modalAvisoSistema");
    const modalTitulo = document.getElementById("modalAvisoLabel");
    const modalBody = document.getElementById("modalAvisoBody");

    if (modalElemento && modalTitulo && modalBody) {
        modalTitulo.innerHTML = titulo;
        modalBody.innerHTML = mensajeHTML;

        // Inicializamos y mostramos el modal de aviso usando Bootstrap
        const miModal = new bootstrap.Modal(modalElemento);
        miModal.show();

        // SI ES ÉXITO: Cuando el usuario cierre el aviso, cerramos también el formulario de registro de fondo
        if (esExito) {
            modalElemento.addEventListener('hidden.bs.modal', () => {
                // Cambiá "modal_registro" por el ID exacto que tenga tu modal de formulario si es diferente
                const modalFormulario = document.getElementById("modal_registro") || document.querySelector(".modal.show");
                if (modalFormulario) {
                    const instanciaForm = bootstrap.Modal.getInstance(modalFormulario);
                    if (instanciaForm) instanciaForm.hide();
                }
            }, { once: true }); // El evento se ejecuta una sola vez y se limpia
        }
    }
}

// =========================================================
// MODAL DE CONFIRMACIÓN REUTILIZABLE
// =========================================================
function mostrarConfirmacion(titulo, mensajeHTML, callbackAceptar) {
    const modalEl = document.getElementById("modalConfirmacion");
    if (!modalEl) return;

    document.getElementById("modalConfirmTitulo").innerHTML = titulo;
    document.getElementById("modalConfirmBody").innerHTML = mensajeHTML;

    const btnAceptar = document.getElementById("btnConfirmAceptar");

    // Clonar el botón para limpiar listeners anteriores
    const btnNuevo = btnAceptar.cloneNode(true);
    btnAceptar.parentNode.replaceChild(btnNuevo, btnAceptar);

    const miModal = new bootstrap.Modal(modalEl);

    btnNuevo.addEventListener("click", () => {
        miModal.hide();
        callbackAceptar();
    });

    miModal.show();
}


// =========================================================
// VALIDADOR FINAL DEL FORMULARIO
// =========================================================
const formRegistro = document.getElementById("formulario_registro");
const btnCrearCuenta = document.getElementById("boton-crear");

if(btnCrearCuenta){
    btnCrearCuenta.addEventListener("click", ()=>{

    userName.dispatchEvent(new Event('change'));
    email.dispatchEvent(new Event('change'));
    contraseña.dispatchEvent(new Event('change'));
    confirmContraseña.dispatchEvent(new Event('change'));
    fechaNac.dispatchEvent(new Event('change'));
    terminos.dispatchEvent(new Event('change'));

    
    
    if(algunError){
        mostrarAviso(
                `<i class="bi bi-shield-exclamation text-danger"></i> Registro Incompleto`,
                `<p class="mb-0 fs-5 text-center">Por favor, revise los campos marcados en <span class="text-danger fw-bold">rojo</span> antes de continuar.</p>`,
                false
            );
               
    }else{
    
    // =========================================================
    // GUARDAR EN LOCALSTORAGE
    // =========================================================

    // Obtener la lista de usuarios ya registrados (si no existe, inicializa un array vacío)
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // CONTROL DE DUPLICADOS: Validar si el username o email ya existen
    const usuarioExiste = listaUsuarios.some(user => user.username === userName.value);
    const emailExiste = listaUsuarios.some(user => user.email === email.value);

    if (usuarioExiste) {
        mostrarAviso(
            `<i class="bi bi-exclamation-triangle-fill text-warning"></i> Error de registro`,
            `<p class="mb-0 fs-5 text-center">El nombre de usuario <b>${userName.value}</b> ya está en uso.</p>`,
            false
        );
        userName.style.border = "3px solid red";
        return; // Frenamos el registro aquí
    }

    if (emailExiste) {
        mostrarAviso(
            `<i class="bi bi-exclamation-triangle-fill text-warning"></i> Error de registro`,
            `<p class="mb-0 fs-5 text-center">El correo electrónico <b>${email.value}</b> ya está registrado.</p>`,
            false
        );
        email.style.border = "3px solid red";
        return; // Frenamos el registro aquí
    }

    // Si no está duplicado, creamos el nuevo objeto usando tu clase Usuario
    const nuevoUsuario = new Usuario(
        userName.value,
        email.value,
        contraseña.value,
        fechaNac.value,
        "../img/pfp-default.webp",
        "../img/banner-default.jpg",
        "¡Hola! Contanos un poco sobre tus gustos en series y películas...",
        [],
        [],
        []
    );

    // Agregamos el nuevo usuario al arreglo
    listaUsuarios.push(nuevoUsuario);

    // Guardamos el arreglo actualizado en el localStorage
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

    // =========================================================
    // CONTINÚA LÓGICA VISUAL (Cerrar modal, avisos, etc.)
    // =========================================================
    mostrarAviso(
        `<i class="bi bi-patch-check-fill text-success"></i> ¡Bienvenido/a!`,
        `<p class="mb-0 fs-5 text-center">¡Tu registro en <span style="color: var(--celeste);" class="fw-bold">Watchealo</span> se completó de manera exitosa!</p>`,
        true
    );

    const modalElemento = document.getElementById("FormularioRegistro");
    const modalBootstrap = bootstrap.Modal.getInstance(modalElemento);
    
    if (modalBootstrap) {
        modalBootstrap.hide();
    }

    // Limpiamos los bordes y reseteamos el formulario
    errorUserName.style.display = "none";
    errorEmail.style.display = "none";
    errorContraseña.style.display = "none";
    errorConfirmContraseña.style.display = "none";
    errorFechaNac.style.display = "none";
    
    formRegistro.reset();

    // CAMBIO DE CONTENIDO A LOGEADO
    document.getElementById("contenido-sin-logear").style.display = "none";
    document.getElementById("contenido-logeado").style.display = "block"; 
    
    // Guardar también qué usuario inició sesión actualmente:
    localStorage.setItem("usuarioLogeado", JSON.stringify(nuevoUsuario));

    comprobarEstadoSesion();
    renderizarFavoritosPerfil();
    cargarReseñasPerfil();
    }
});
}


// =========================================================
// GESTIÓN DE SESIÓN (LOGIN, PERSISTENCIA Y LOGOUT)
// =========================================================

// Captura de elementos del DOM basándonos en tu perfil.html
const formLogin = document.getElementById("formulario_login");
const loginUser = document.getElementById("login-username");
const loginPass = document.getElementById("login-password");
const btnLogout = document.getElementById("btn-cerrar-sesion");

// Contenedores principales de vistas
const conSinLogear = document.getElementById("contenido-sin-logear");
const conLogeado = document.getElementById("contenido-logeado");

// Campos del Perfil a rellenar dinámicamente
const perfilUsername = document.getElementById("username"); //nombre de usuario
const perfilBiografia = document.getElementById('texto-bio'); // biografía

/**
 * Controla qué vista mostrar (Login o Perfil) según el localStorage
 */
function comprobarEstadoSesion() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogeado"));

    if (usuarioActivo) {
        // Ocultamos formulario de login y mostramos el perfil del usuario
        if (conSinLogear) conSinLogear.style.display = "none";
        if (conLogeado) conLogeado.style.display = "block";
        
        // Inyectamos el nombre del usuario logeado en el <h2> del perfil
        if (perfilUsername && vistaBanner && vistaPfp) {
            perfilUsername.textContent = usuarioActivo.username;
            vistaBanner.src = usuarioActivo.banner;
            vistaPfp.src = usuarioActivo.fotoPerfil;
            perfilBiografia.textContent = usuarioActivo.biografia;
        }
    } else {
        // Si no hay sesión, forzamos mostrar el login y ocultar el perfil
        if (conSinLogear) conSinLogear.style.display = "block";
        if (conLogeado) conLogeado.style.display = "none";
    }
}

// LLAMADO INMEDIATO: Se ejecuta al cargar o actualizar la página (F5)
comprobarEstadoSesion();


// ESCUCHA DEL ENVÍO DEL FORMULARIO DE LOGIN
if (formLogin) {
    formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault(); // Evita que la página se recargue por defecto

        const valorUser = loginUser.value.trim();
        const valorPass = loginPass.value.trim();

        // Traemos el array completo de usuarios del localStorage
        const baseUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Buscamos coincidencia por Username ó por Email, y que coincida la contraseña
        const usuarioValido = baseUsuarios.find(u => 
            (u.username === valorUser || u.email === valorUser) && u.contraseña === valorPass
        );

        if (usuarioValido) {
            // Guardamos la sesión del usuario de forma persistente
            if (!usuarioValido.fotoPerfil) {
                usuarioValido.fotoPerfil = "../img/default-avatar.png";
            }
            localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioValido));
            
            // Reseteamos el formulario
            formLogin.reset();

            // Usamos tu función nativa para mostrar avisos lindos del sistema
            mostrarAviso(
                `<i class="bi bi-check-circle-fill text-success"></i> ¡Ingreso Exitoso!`,
                `<p class="mb-0 fs-5 text-center">Hola de nuevo, <span class="fw-bold text-info">${usuarioValido.username}</span>. Cargando tu perfil...</p>`,
                true
            );

            // Para que cargue las reseñas del perfil apenas inicie sesion
            cargarReseñasPerfil();

            // Para que cargue los favoritos del perfil apenas inicie sesion
            renderizarFavoritosPerfil();

            // Refrescamos la interfaz para mostrar el perfil instantáneamente
            comprobarEstadoSesion();
        } else {
            // Credenciales incorrectas
            mostrarAviso(
                `<i class="bi bi-shield-x text-danger"></i> Error de Ingreso`,
                `<p class="mb-0 fs-5 text-center">El usuario/correo o la contraseña no son correctos.</p>`,
                false
            );
            loginPass.value = ""; // Limpiamos la contraseña por comodidad
        }
    });
}


// ESCUCHA DEL BOTÓN CERRAR SESIÓN
if (btnLogout) {
    btnLogout.addEventListener("click", (evento) => {
        evento.preventDefault();

        mostrarConfirmacion(
            `<i class="bi bi-box-arrow-right"></i> Cerrar sesión`,
            `<p class="mb-0 fs-6">¿Seguro/a que querés cerrar sesión?</p>`,
            () => {
                let usuariosCargados = JSON.parse(localStorage.getItem("usuarios")) || [];
                const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));

                for (i = 0; i < usuariosCargados.length; i++) {
                    if (usuarioLogeado.email === usuariosCargados[i].email) {
                        usuariosCargados[i] = usuarioLogeado;
                    }
                }

                localStorage.setItem("usuarios", JSON.stringify(usuariosCargados));
                localStorage.removeItem("usuarioLogeado");

                document.getElementById("contenedor-reseñas-perfil").innerHTML = "";
                document.getElementById("contenedor-favoritos").innerHTML = "";
                localStorage.removeItem("mis_favoritos");

                comprobarEstadoSesion();
            }
        );
    });
}


class Reseña{
    constructor(id, fotoUsuario, nombreUsuario, estrellasHTML, puntuacion, comentarioTexto){
        this.id = id;
        this.fotoUsuario = fotoUsuario;
        this.nombreUsuario = nombreUsuario;
        this.estrellasHTML = estrellasHTML;
        this.puntuacion = puntuacion;
        this.comentarioTexto = comentarioTexto;
    }
}


// =========================================================
// PUBLICAR RESEÑA (PERSISTENTE EN LOCALSTORAGE)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const formReseña = document.getElementById("formulario-reseña");
    const contenedorReseñas = document.getElementById("contenedor-reseñas-detalle");
    
    // ESCUCHAR EL ENVÍO DE NUEVAS RESEÑAS
    if (formReseña) {
        formReseña.addEventListener("submit", (e) => {
            e.preventDefault();
            
            
            // Validar sesión activa
            const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
            if (!usuarioLogeado) {
                alert("Debes iniciar sesión para publicar una reseña.");
                return;
            }
            
            // Obtener puntuación
            const radioSeleccionado = document.querySelector('input[name="puntuacion"]:checked');
            if (!radioSeleccionado) {
                alert("Por favor, selecciona una puntuación con estrellas.");
                return;
            }
            const puntuacion = parseInt(radioSeleccionado.value);
            
            // Capturar comentario y datos de usuario
            const comentarioTexto = document.getElementById("reseña-comentario").value;
            const nombreUsuario = usuarioLogeado.username;
            const fotoUsuario = usuarioLogeado.fotoPerfil || "../img/default-avatar.png"; 

            // Construir las estrellas interactivas
            let estrellasHTML = "";
            let estrellasLlenas = Math.floor(puntuacion / 2);
            let tieneMediaEstrella = (puntuacion % 2) !== 0;

            for (let i = 0; i < estrellasLlenas; i++) {
                estrellasHTML += '<i class="bi bi-star-fill me-1" style="color: var(--celeste);"></i>';
            }
            if (tieneMediaEstrella) {
                estrellasHTML += '<i class="bi bi-star-half me-1" style="color: var(--celeste);"></i>';
                estrellasLlenas++; 
            }
            for (let i = estrellasLlenas; i < 5; i++) {
                estrellasHTML += '<i class="bi bi-star text-muted me-1"></i>';
            }

            // 1. Intentamos obtener el contador actual. 
            // Si no existe (es la primera vez), usamos 0.
            let contador = localStorage.getItem('miContador');

            // Convertimos a número. Si era null, el contador empieza en 0.
            contador = contador ? parseInt(contador) : 0;

            // 2. Incrementamos el contador
            contador++;

            // 3. Guardamos el nuevo valor en el localStorage
            localStorage.setItem('miContador', contador);

            // GUARDAR EN LOCALSTORAGE (La más nueva al principio)
            const nuevaReseñaObj = new Reseña(contador, fotoUsuario,nombreUsuario,estrellasHTML,puntuacion, comentarioTexto);


            const ListaPeliculasSeries = JSON.parse(localStorage.getItem("peliculas_series"));
            // 1. Obtenemos los parámetros de la URL actual
            const urlParams = new URLSearchParams(window.location.search);

            // 2. Capturamos el valor específico del parámetro 'id'
            const idPelicula = urlParams.get('id');

            // GUARDO LA ID DE LA RESEÑA EN LA PROPIEDAD DE LA PELICULA O SERIE
            for(i=0; i<ListaPeliculasSeries.length; i++){
                if(ListaPeliculasSeries[i].id === idPelicula){
                    ListaPeliculasSeries[i].reseñas.push(nuevaReseñaObj.id);
                }
            }

            // Actualizo estos datos en el LOCAL STORAGE
            localStorage.setItem("peliculas_series", JSON.stringify(ListaPeliculasSeries));

            const reseñasGuardadas = JSON.parse(localStorage.getItem("reseñasTodaPagina")) || [];
            reseñasGuardadas.unshift(nuevaReseñaObj);
            localStorage.setItem("reseñasTodaPagina", JSON.stringify(reseñasGuardadas));

            // VINCULO LA RESEÑA AL USUARIO LOGEADO Y ACTUALIZO AL USUARIO LOGEADO
            usuarioLogeado.reseñas.push(nuevaReseñaObj.id);
            localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));

            const usuariosCargados = JSON.parse(localStorage.getItem('usuarios'));

            // AHORA ACTUALIZO EN LISTA DE USUARIOS
            for(i=0; i<usuariosCargados.length; i++){
            if (usuarioLogeado.email === usuariosCargados[i].email){
                usuariosCargados[i] = usuarioLogeado;
            }   
        }
        
        // Guardo el cambio en el localStorage antes de removerlo
        localStorage.setItem("usuarios", JSON.stringify(usuariosCargados));

            // CONSTRUIR E INYECTAR LA TARJETA EN VIVO (Inmediato)
            const nuevaTarjetaReseña = `
                <div class="card border-0 p-3 mb-3" style="background-color: rgba(255,255,255,0.02); border-left: 3px solid var(--celeste) !important; border-radius: 10px;">
                    <div class="d-flex align-items-center mb-2">
                        <img src="${fotoUsuario}" alt="Avatar ${nombreUsuario}" class="rounded-circle me-3" width="45" height="45" style="object-fit: cover; border: 2px solid var(--celeste);">
                        <div>
                            <h6 class="mb-0 fw-bold text-white">${nombreUsuario}</h6>
                            <div class="d-flex align-items-center mt-1">
                                <div class="me-2">${estrellasHTML}</div>
                                <small class="text-muted">(${puntuacion}/10 pts)</small>
                            </div>
                        </div>
                    </div>
                    <p class="mb-0 mt-2 text-white-50" style="font-size: 0.95rem; line-height: 1.5;">
                        ${comentarioTexto}
                    </p>
                </div>
            `;

            if (contenedorReseñas) {
                contenedorReseñas.insertAdjacentHTML("afterbegin", nuevaTarjetaReseña);
            }

            // Resetear el formulario y cerrar el modal limpiamente
            formReseña.reset();
            const modalElemento = document.getElementById("modalDejarReseña");
            if (modalElemento) {
                const instanciaModal = bootstrap.Modal.getInstance(modalElemento);
                if (instanciaModal) {
                    instanciaModal.hide();
                }
            }
        });
    }
});





// FUNCIÓN PARA CARGAR LAS RESEÑAS EN EL PERFIL
// — Muestra la portada de la película en lugar de la foto de perfil —
function cargarReseñasPerfil() {
    const contenedorReseñasPerfil = document.getElementById("contenedor-reseñas-perfil");
    if (!contenedorReseñasPerfil) return;

    contenedorReseñasPerfil.innerHTML = "";

    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const todasReseñas   = JSON.parse(localStorage.getItem('reseñasTodaPagina'));
    const listaPelis     = JSON.parse(localStorage.getItem('peliculas_series')) || [];

    if (!usuarioLogeado) return;

    if (usuarioLogeado.reseñas.length === 0) {
        contenedorReseñasPerfil.innerHTML = `
            <div class="reseñas-vacio">
                <i class="bi bi-chat-square-text" style="font-size:1.6rem; opacity:0.3; display:block; margin-bottom:.5rem;"></i>
                Todavía no escribiste ninguna reseña.
            </div>`;
        return;
    }


    usuarioLogeado.reseñas.forEach(idReseña => {
        const reseñaEncontrada = todasReseñas.find(r => r.id === idReseña);
        if (!reseñaEncontrada) return;

        // Buscar la película a la que pertenece esta reseña
        const peliDeReseña = listaPelis.find(p =>
            Array.isArray(p.reseñas) && p.reseñas.includes(idReseña)
        );

        const portadaSrc   = peliDeReseña ? peliDeReseña.portada : "../img/pfp-default.webp";
        const tituloPeli   = peliDeReseña ? peliDeReseña.titulo  : "Película desconocida";
        const linkDetalle  = peliDeReseña ? `detalle.html?id=${peliDeReseña.id}` : "#";

        const tarjeta = `
            <div class="reseña-card">
                <div class="reseña-header">
                    <a href="${linkDetalle}" title="${tituloPeli}">
                        <img src="${portadaSrc}" alt="${tituloPeli}" class="reseña-portada">
                    </a>
                    <div class="reseña-meta">
                        <p class="reseña-titulo-peli">${tituloPeli}</p>
                        <div class="reseña-estrellas">
                            ${reseñaEncontrada.estrellasHTML}
                            <span class="reseña-puntaje">(${reseñaEncontrada.puntuacion}/10)</span>
                        </div>
                    </div>
                </div>
                <p class="reseña-texto">${reseñaEncontrada.comentarioTexto}</p>
                <button class="btn-eliminar-reseña" data-id="${reseñaEncontrada.id}">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        `;

        contenedorReseñasPerfil.insertAdjacentHTML("beforeend", tarjeta);
    });
    
}




// ========================================
// TODA LA LOGICA PARA BORRAR UNA RESEÑA
// ========================================

// Seleccionas el contenedor padre una sola vez
const contenedorReseñas = document.getElementById("contenedor-reseñas-perfil");

if(contenedorReseñas){
    contenedorReseñas.addEventListener("click", (e) => {
    // .closest busca hacia arriba si el elemento clickeado es o contiene el botón
    const btn = e.target.closest(".btn-eliminar-reseña");

    // Si el usuario hizo clic en un botón con esa clase...
    if (btn) {
        const idReseña = btn.dataset.id;

        mostrarConfirmacion(
            `<i class="bi bi-trash3 text-danger"></i> Eliminar reseña`,
            `<p class="mb-0 fs-6">¿Estás seguro/a de que querés eliminar esta reseña? Esta acción no se puede deshacer.</p>`,
            () => {
                let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
                let listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
                let listaPeliculas = JSON.parse(localStorage.getItem('peliculas_series'));
                let listaReseñas = JSON.parse(localStorage.getItem('reseñasTodaPagina'));

                usuarioLogeado.reseñas = usuarioLogeado.reseñas.filter(id => id !== parseInt(idReseña));
                localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));

                listaUsuarios = listaUsuarios.map(u => {
                    if (u.email === usuarioLogeado.email) return usuarioLogeado;
                    return u;
                });
                localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

                listaPeliculas.forEach(peli => {
                    if (peli.reseñas) {
                        peli.reseñas = peli.reseñas.filter(id => id !== parseInt(idReseña));
                    }
                });
                localStorage.setItem('peliculas_series', JSON.stringify(listaPeliculas));

                listaReseñas = listaReseñas.filter(r => r.id !== parseInt(idReseña));
                localStorage.setItem('reseñasTodaPagina', JSON.stringify(listaReseñas));

                cargarReseñasPerfil();
                mostrarAviso(
                    `<i class="bi bi-check-circle-fill text-success"></i> Reseña eliminada`,
                    `<p class="mb-0 fs-5 text-center">Tu reseña fue eliminada correctamente.</p>`,
                    false
                );
            }
        );
    }
});
}


function mostrarMejorPuntuados() {
    const contenedor = document.getElementById("contenedor-mejor-puntuados");
    const listaPelis = JSON.parse(localStorage.getItem('peliculas_series'));

    if (!contenedor || !listaPelis) return;

    // Ordenamos y tomamos solo los primeros 10
    const listaTop10 = listaPelis.slice(0, 10).sort((a, b) => b.puntuacionTotal - a.puntuacionTotal);

    // Generamos el HTML usando map
    const tarjetasHTML = listaTop10.map((pelicula, index) => {
        return `
        <div class="col">
            <a href="detalle.html?id=${pelicula.id}" class="text-decoration-none">
                <div class="card pelicula-card">
                    <span class="ranking-label">${index + 1}</span>
                    <div class="pelicula-img-wrap">
                        <img src="${pelicula.portada}" class="card-img-top pelicula-img" alt="${pelicula.titulo}">
                    </div>
                    <div class="card-body pelicula-info">
                        <span class="card-title pelicula-titulo">${pelicula.titulo}</span>
                        <span class="pelicula-rating"><i class="bi bi-star-fill"></i> ${pelicula.puntuacionTotal}</span>
                    </div>
                </div>
            </a>
        </div>`;
    }).join('');

    // Inyectamos todo dentro de una sola fila
    contenedor.innerHTML = `<div class="row g-3 row-cols-2 row-cols-md-5">${tarjetasHTML}</div>`;
}

mostrarMejorPuntuados();
document.addEventListener('load', mostrarMejorPuntuados());

function mostrarMasRecientes(){
    const contenedorCarrusel = document.getElementById("contenedor-carrusel");
    const listaPelis = JSON.parse(localStorage.getItem('peliculas_series'));

    let listaPelisOrdenada = listaPelis.slice();
    
    
        // Función auxiliar para convertir "dd-mm-yyyy" a un objeto Date
            const convertirAFecha = (fechaStr) => {
            const [dia, mes, anio] = fechaStr.split('-').map(Number);
            // Nota: en JS los meses van de 0 a 11, por eso restamos 1 al mes
            return new Date(anio, mes - 1, dia);
            };

        // Ordenar de más reciente a más antigua
        listaPelisOrdenada.sort((a, b) => {
        return convertirAFecha(b.fechaEstreno) - convertirAFecha(a.fechaEstreno);
        });
    
    if(contenedorCarrusel){
        contenedorCarrusel.innerHTML = "";
    for (let i = 0; i < 4; i++) {

    const claseActive = i === 0 ? "active" : "";

    const tarjetaHTML = `
        <!-- SLIDE -->
        <div class="carousel-item ${claseActive}">
            <img class="backdrop"
                 src="${listaPelisOrdenada[i].banner}"
                 alt="${listaPelisOrdenada[i].titulo}">

            <span class="badge-trailer">Tráiler Oficial</span>

            <div class="badge-rating">
                <i class="bi bi-star-fill"></i>
                ${listaPelisOrdenada[i].puntuacionTotal}
            </div>

            <a class="btn-play"
               href="${listaPelisOrdenada[i].trailer}"
               target="_blank"
               title="Ver tráiler">
                <i class="bi bi-play-fill"></i>
            </a>

            <div class="carousel-caption">
                <div class="caption-inner">

                    <a href="detalle.html?id=${listaPelisOrdenada[i].id}"
                       class="text-decoration-none portada-carrusel">

                        <img class="caption-poster"
                             src="${listaPelisOrdenada[i].portada}"
                             alt="${listaPelisOrdenada[i].titulo}">
                    </a>

                    <div class="caption-info">

                        <p class="caption-genre">
                            ${listaPelisOrdenada[i].genero}
                        </p>

                        <h5 class="caption-title">
                            ${listaPelisOrdenada[i].titulo}
                        </h5>

                        <div class="caption-meta">
                            <span>
                                <i class="bi bi-calendar3"></i>
                                ${listaPelisOrdenada[i].fechaEstreno}
                            </span>

                            <span>
                                <i class="bi bi-clock"></i>
                                ${listaPelisOrdenada[i].duracion}
                            </span>

                            <span>
                                <i class="bi bi-camera-video"></i>
                                ${listaPelisOrdenada[i].director}
                            </span>
                        </div>

                        <p class="caption-desc">
                            ${listaPelisOrdenada[i].sinopsis}
                        </p>

                    </div>
                </div>
            </div>
        </div>
    `;

    contenedorCarrusel.insertAdjacentHTML("beforeend", tarjetaHTML);
}
const elementoCarrusel = document.getElementById("Carousel");

if (elementoCarrusel) {
    const carruselBootstrap = bootstrap.Carousel.getOrCreateInstance(
        elementoCarrusel,
        {
            interval: 6000,
            ride: "carousel",
            wrap: true,
            pause: false
        }
    );

    carruselBootstrap.cycle();
}
    }
    
    
}

mostrarMasRecientes();

class PeliPuntuada{
    constructor(idPeli, puntaje){
        this.idPeli = idPeli;
        this.puntaje = puntaje;
    }
}

class PuntuacionPeli{
    constructor(email, puntaje){
        this.email = email;
        this.puntaje = puntaje;
    }
}

const botonPuntuar = document.getElementById("btn-puntuar");
const botonEnviarPuntuacion = document.getElementById("btn-enviar-puntuacion");
const botonCancelarPuntuacion = document.getElementById("btn-cancelar-puntuacion");

if(botonPuntuar){
    botonPuntuar.addEventListener('click', () => {
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
    const Puntuacion = document.getElementById('inputPuntuacion').value;
    const listaPeliculas = JSON.parse(localStorage.getItem('peliculas_series'));
        
    if(!usuarioLogeado){
        alert("Debe logearse para poder puntuar");
        return;
    }

    
    // 1. Obtenemos los parámetros de la URL actual
    const urlParams = new URLSearchParams(window.location.search);
    // 2. Capturamos el valor específico del parámetro 'id'
    const idPelicula = urlParams.get('id');

    for(i=0; i<usuarioLogeado.pelis_puntuadas.length; i++){
        if(idPelicula === usuarioLogeado.pelis_puntuadas[i].idPeli){
            document.getElementById('modalPuntuar').style.display = 'flex';
            document.getElementById('inputPuntuacion').value = usuarioLogeado.pelis_puntuadas[i].puntaje;
            return;
        }
    }
    document.getElementById('inputPuntuacion').value = "";
    document.getElementById('modalPuntuar').style.display = 'flex'; 
});
}



if(botonCancelarPuntuacion){
    botonCancelarPuntuacion.addEventListener('click', ()=>{
    document.getElementById('modalPuntuar').style.display = 'none';
    document.getElementById('inputPuntuacion').value = "";
});
}


if(botonEnviarPuntuacion){
    botonEnviarPuntuacion.addEventListener('click', ()=>{
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
    const Puntuacion = document.getElementById('inputPuntuacion').value;
    const listaPeliculas = JSON.parse(localStorage.getItem('peliculas_series'));

    if(Puntuacion < 0 || Puntuacion > 10 || Puntuacion == ""){
        alert("La Puntuación debe estar entre 0 y 10, y debe ser un numero");
        return;
    }

    // 1. Obtenemos los parámetros de la URL actual
    const urlParams = new URLSearchParams(window.location.search);
    // 2. Capturamos el valor específico del parámetro 'id'
    const idPelicula = urlParams.get('id');

    // CASO DE QUE LA PELI YA HAYA SIDO PUNTUADA
    for(i=0; i<usuarioLogeado.pelis_puntuadas.length; i++){
        if(idPelicula === usuarioLogeado.pelis_puntuadas[i].idPeli){
            // A) Guardar la Puntuacion en "pelis-puntuadas" del usuario
            let Peli_Puntuada = new PeliPuntuada(idPelicula, Puntuacion);
            usuarioLogeado.pelis_puntuadas[i] = Peli_Puntuada;

            localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));

            for(i=0; i<listaUsuarios.length; i++){
                if(listaUsuarios[i].email === usuarioLogeado.email){
                    listaUsuarios[i] = usuarioLogeado; //VER SI SIRVE SOBREESCRIBIR, SINO ASIGNAMOS SOLAMENTE LA PROPIEDAD
                }
            }
            localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
            ////////////////////////////////////////////////////////////////////////////////////

            // B) Guardar la Puntuacion en el arreglo de puntuaciones de la peli o serie
            let Puntaje = new PuntuacionPeli(usuarioLogeado.email, Puntuacion);
            for(i=0; i<listaPeliculas.length; i++){
                if(idPelicula === listaPeliculas[i].id){
                    for(j=0; j<listaPeliculas[i].puntuacion.length; j++){
                        if(listaPeliculas[i].puntuacion[j].email === usuarioLogeado.email){
                            listaPeliculas[i].puntuacion[j] = Puntaje;
                            //
                        }
                        
                    }

                    // AL ENCONTRAR LA PELICULA DE LA URL, TAMBIEN ASIGNAMOS LA puntuacionTotal
                    let sumaTotal = 0;
                    for(c=0; c<listaPeliculas[i].puntuacion.length; c++){
                        sumaTotal += parseFloat(listaPeliculas[i].puntuacion[c].puntaje);
                    }
                    let promedio = sumaTotal/listaPeliculas[i].puntuacion.length;
                    listaPeliculas[i].puntuacionTotal = promedio;
                    
                }
            }

            

            localStorage.setItem('peliculas_series', JSON.stringify(listaPeliculas));
            document.getElementById('modalPuntuar').style.display = 'none';
            renderizarDetalles();
            
            return;
        }
    }

    // A) Guardar la Puntuacion en "pelis-puntuadas" del usuario
    let Peli_Puntuada = new PeliPuntuada(idPelicula, Puntuacion);

    usuarioLogeado.pelis_puntuadas.push(Peli_Puntuada);
    localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));

    for(i=0; i<listaUsuarios.length; i++){
        if(listaUsuarios[i].email === usuarioLogeado.email){
            listaUsuarios[i] = usuarioLogeado; //VER SI SIRVE SOBREESCRIBIR, SINO ASIGNAMOS SOLAMENTE LA PROPIEDAD
        }
    }
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

    // B) Guardar la Puntuacion en el arreglo de puntuaciones de la peli o serie
    let Puntaje = new PuntuacionPeli(usuarioLogeado.email, Puntuacion);
    for(i=0; i<listaPeliculas.length; i++){
        if(idPelicula === listaPeliculas[i].id){
            listaPeliculas[i].puntuacion.push(Puntaje);

            // AL ENCONTRAR LA PELICULA DE LA URL, TAMBIEN ASIGNAMOS LA puntuacionTotal
            let sumaTotal = 0;
                    for(c=0; c<listaPeliculas[i].puntuacion.length; c++){
                        sumaTotal += parseFloat(listaPeliculas[i].puntuacion[c].puntaje);
                    }
                    let promedio = parseFloat(sumaTotal/listaPeliculas[i].puntuacion.length);
                    listaPeliculas[i].puntuacionTotal = promedio;
                    
        }
    }

    localStorage.setItem('peliculas_series', JSON.stringify(listaPeliculas));

    document.getElementById('modalPuntuar').style.display = 'none';
    renderizarDetalles();
    
});


}
