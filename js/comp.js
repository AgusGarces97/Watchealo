// INICIO - Más vistos

/* Bookmark toggle */
document.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('guardado');
    });
});


//================================================
//======================= CLASES =================
//================================================

class PeliculaSerie{
    constructor(id, titulo, portada, genero, sinopsis, caps, duracion, puntuacion, creador, actores, banner, reseñas){
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

async function precargarUsuarios() {
    if (!localStorage.getItem("usuarios")) {
        try {
            const respuesta = await fetch("../json/usuarios.json");

            if (!respuesta.ok) {
                throw new Error(`Error al leer usuarios.json: ${respuesta.status}`);
            }

            const datosUsuarios = await respuesta.json();

            localStorage.setItem("usuarios", JSON.stringify(datosUsuarios));
            console.log("¡Usuarios precargados con éxito en localStorage!");

        } catch (error) {
            console.error("Hubo un problema al precargar los usuarios:", error);
        }
    }
}


async function precargarPelisYSeries() {
    if (!localStorage.getItem("peliculas_series")) {
        try {
            const respuesta = await fetch("../json/pelis_y_series.json");

            if (!respuesta.ok) {
                throw new Error(`Error al leer pelis_y_series.json: ${respuesta.status}`);
            }

            const datosPelisSeries = await respuesta.json();

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
    precargarUsuarios();
    precargarPelisYSeries();
});


// =========================================================
// BUSCADOR DEL NAVBAR
// =========================================================

const cuadroBusqueda = document.getElementById('cuadroBusqueda');
const busqueda = document.getElementById('busqueda');

if (cuadroBusqueda && busqueda) {
    busqueda.addEventListener('click', () => {
        cuadroBusqueda.classList.toggle('mostrar');
    });
}


// =========================================================
// ÍCONO HAMBURGUESA
// =========================================================

const collapse = document.getElementById('navbarNav');
const icono = document.querySelector('.icono-hamb');

if (collapse && icono) {
    collapse.addEventListener('show.bs.collapse', () => {
        icono.classList.add('rotado');
    });

    collapse.addEventListener('hide.bs.collapse', () => {
        icono.classList.remove('rotado');
    });
}


// =========================================================
// CARGA DE DATOS DE PELÍCULA / SERIE
// =========================================================

let Arreglo_Pelis_Series = [];

// Captura de elementos del DOM para detalle.html
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


// EJECUCIÓN AUTOMÁTICA AL CARGAR LA PÁGINA
window.addEventListener('load', () => {

    fetch('../json/pelis_y_series.json')
        .then(res => res.json())
        .then(datosJSON => {

            Arreglo_Pelis_Series = [];

            datosJSON.forEach(p => {
                let pelicula = new PeliculaSerie(p.id, p.titulo, p.portada, p.genero, p.sinopsis, p.caps, p.duracion, p.puntuacion, p.creador, p.actores, p.banner, p.reseñas);
                Arreglo_Pelis_Series.push(pelicula);
            });


            // DETALLE.HTML dinámico
            // Lee el id de la URL. Ejemplo: detalle.html?id=dark
            if (document.getElementById("titulo")) {
                renderizarDetalles();
            }


            // PERFIL.HTML
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
    for(i=0; i<peliEncontrada.puntuacion.length; i++){
        sumatotal += peliEncontrada.puntuacion[i]; 
    }
    let puntaje = sumatotal / peliEncontrada.puntuacion.length;
    /////////////////////////////////////////////////////////////////////////////////////

    if (peliEncontrada) {
        portadaDetalle.src = peliEncontrada.portada;
        bannerDetalle.src = peliEncontrada.banner;
        
        tituloDetalle.innerHTML = `<h1>${peliEncontrada.titulo}</h1>`;
        generoDetalle.innerHTML = `<h3>${peliEncontrada.genero}</h3>`;
        sinopsisDetalle.innerHTML = `<p>${peliEncontrada.sinopsis}</p>`;
        capsDetalle.innerHTML = `<p>${peliEncontrada.caps}</p>`;
        puntuacionDetalle.innerHTML = `<p>${puntaje.toFixed(2)}</p>`;
        creadorDetalle.innerHTML = `<p>${peliEncontrada.creador}</p>`;
        duracionDetalle.innerHTML = `<p>${peliEncontrada.duracion}</p>`;
        
        const listaActores = peliEncontrada.actores.join(', ');
        actoresDetalle.innerHTML = `<p>${listaActores}</p>`;
    } else {
        console.error("No se encontró ninguna película con el ID: " + id_pelicula);

        if (tituloDetalle) {
            tituloDetalle.innerHTML = `<h1>No se encontró la película o serie</h1>`;
        }

        if (sinopsisDetalle) {
            sinopsisDetalle.innerHTML = `<p>Volvé a listas o explorar e intentá nuevamente.</p>`;
        }
    }

    const reseñasGuardadas = JSON.parse(localStorage.getItem('reseñasTodaPagina'));


    // DETECTA CUALES SON LAS RESEÑAS DE ESA PELICULA Y MOSTRARLAS DE ACUERDO A ESO
    const contenedorReseñas = document.getElementById('contenedor-reseñas-detalle');
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
//   LÓGICA DE FAVORITOS LOCALSTORAGE
// ==========================================

// FUNCIÓN PARA AGREGAR FAVORITOS DESDE DETALLE.HTML
function agregarAFavoritos() {
    
    // 1. Obtenemos los parámetros de la URL actual
    const urlParams = new URLSearchParams(window.location.search);

    // 2. Capturamos el valor específico del parámetro 'id'
    const idPelicula = urlParams.get('id');

    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));

    // Validamos que no se duplique la película
    if (!usuarioLogeado.favoritos.includes(idPelicula)) {

        // Agrego la id de la pelicula a la propiedad de favoritos del usuarioLogeado
        usuarioLogeado.favoritos.push(idPelicula);
        // Actualizo al usuarioLogeado en el localStorage
        localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
        //Actualizo esto tambien para la lista de todos los usuarios
        for(i=0; i<listaUsuarios.length; i++){
            if(listaUsuarios[i].email === usuarioLogeado.email){
                listaUsuarios[i].favoritos = usuarioLogeado.favoritos;
            }
        }
        localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
        ////////////////////////////////////////////////////////////////
        alert("¡Agregada a tus favoritos en tu perfil!");
    } else {
        alert("Esta serie ya está en tus favoritos.");
    }

}


// FUNCIÓN PARA RENDERIZAR FAVORITOS EN PERFIL.HTML
function renderizarFavoritosPerfil() {
    const contenedorFavoritos = document.querySelector(".contenedor_favoritos");

    if (!contenedorFavoritos) return;

    contenedorFavoritos.innerHTML = ""; // Limpiamos carga previa

    let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));

    if (usuarioLogeado.favoritos.length === 0) {
        contenedorFavoritos.innerHTML = `<p class="text-muted">Aún no agregaste series o películas a tus favoritos.</p>`;
        return;
    }

    // Recorremos los IDs guardados y buscamos sus datos en el arreglo global
    usuarioLogeado.favoritos.forEach(idFav => {
        const peli = Arreglo_Pelis_Series.find(p => p.id === idFav);

        if (peli) {
            const col = document.createElement("div");
            col.className = "col-4 col-sm-3 col-md-2 mb-3";

            col.innerHTML = `
                <a href="detalle.html?id=${peli.id}">
                    <img src="${peli.portada}" alt="${peli.titulo}" class="img-fluid rounded img" style="cursor:pointer; border: 1px solid var(--celeste);">
                </a>
            `;

            contenedorFavoritos.appendChild(col);
        }
    });
}


// ==========================================
//   LÓGICA PARA CAMBIAR FOTO DE PERFIL
// ==========================================

const btnCambiarPfp = document.getElementById('btn-cambiar-pfp');
const inputPfp = document.getElementById('input-pfp');
const vistaPfp = document.getElementById('vista-pfp');

if (btnCambiarPfp && inputPfp && vistaPfp) {

    btnCambiarPfp.addEventListener('click', () => {
        inputPfp.click();
    });

    inputPfp.addEventListener('change', (evento) => {
        const archivo = evento.target.files[0];

        if (archivo) {
            const lector = new FileReader();

            lector.onload = function(e) {
                const imagenBase64 = e.target.result;

                vistaPfp.src = imagenBase64;

                const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
                usuarioLogeado.fotoPerfil = imagenBase64;
                //Guardo ese cambio en el localStorage
                localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado)); 

            };

            lector.readAsDataURL(archivo);
        }
    });
}


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

const btnCambiarBanner = document.getElementById('btn-cambiar-banner');
const inputBanner = document.getElementById('input-banner');
const vistaBanner = document.getElementById('vista-banner');

if (btnCambiarBanner && inputBanner && vistaBanner) {

    btnCambiarBanner.addEventListener('click', () => {
        inputBanner.click();
    });

    inputBanner.addEventListener('change', (evento) => {
        const archivo = evento.target.files[0];

        if (archivo) {
            const lector = new FileReader();

            lector.onload = function(e) {
                const imagenBase64 = e.target.result;

                vistaBanner.src = imagenBase64;

                const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
                usuarioLogeado.banner = imagenBase64;
                // Guardo ese cambio en el localStorage
                localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado)); 
            };

            lector.readAsDataURL(archivo);
        }
    });
}


function cargarBannerPerfil() {
    if (vistaBanner) {
        const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));

        if (usuarioLogeado) {
            vistaBanner.src = usuarioLogeado.banner || "../img/banner-default.jpg";
        }
    }
}


// ==========================================
//   LÓGICA INTERACTIVA DE BIOGRAFÍA
// ==========================================

const btnEditarBio = document.getElementById('btn-editar-bio');
const contenedorBioInteractivo = document.getElementById('contenedor-bio-interactivo');

let editando = false;

if (btnEditarBio && contenedorBioInteractivo) {

    btnEditarBio.addEventListener('click', () => {
        if (!editando) {

            editando = true;

            const textoActualEl = document.getElementById('texto-bio');
            const textoActual = textoActualEl ? textoActualEl.innerText : "";

            contenedorBioInteractivo.innerHTML = `
                <textarea id="texto-bio-editando" class="textarea-bio-edicion" rows="4">${textoActual}</textarea>
            `;

            btnEditarBio.innerHTML = `<i class="bi bi-check-lg"></i> Guardar`;
            btnEditarBio.classList.replace('btn-outline-info', 'btn-success');
            btnEditarBio.style.borderColor = '#198754';
            btnEditarBio.style.color = '#fff';

        } else {

            editando = false;

            const textareaEl = document.getElementById('texto-bio-editando');
            let nuevoTexto = textareaEl ? textareaEl.value : "";

            if (nuevoTexto.trim() === "") {
                nuevoTexto = "¡Hola! Contanos un poco sobre tus gustos en series y películas...";
            }

            contenedorBioInteractivo.innerHTML = `
                <p class="text-white border border-white p-3 rounded mb-0" id="texto-bio">${nuevoTexto}</p>
            `;

            // Asigno esa nueva biografía a la propiedad biografía del usuarioLogeado
            const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
            usuarioLogeado.biografia = textareaEl.value;
            console.log(usuarioLogeado.biografia);
            // Guardo el Cambio de manera permanente
            localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado)); 

            btnEditarBio.innerHTML = `<i class="bi bi-pencil-fill"></i> Editar`;
            btnEditarBio.classList.replace('btn-success', 'btn-outline-info');
            btnEditarBio.style.borderColor = 'var(--celeste)';
            btnEditarBio.style.color = 'var(--celeste)';
        }
    });
}


function cargarBiografia() {
    const textoBio = document.getElementById('texto-bio');

    if (textoBio) {
        const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
        if (usuarioLogeado) {
            textoBio.innerText = usuarioLogeado.biografia || "¡Hola! Contanos un poco sobre tus gustos en series y películas...";
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
        if (!editandoUsername) {

            editandoUsername = true;

            const elUsername = document.getElementById("username");
            const textoActual = elUsername ? elUsername.textContent.trim() : "Nombre de Usuario";

            contNombreUsuario.innerHTML = `
                <input type="text" id="username-input" class="form-control text-start w-75 fw-bold fs-4 mb-2" value="${textoActual}" maxlength="25">
            `;

            botonUserName.innerHTML = `<i class="bi bi-check-lg"></i> Guardar Nombre`;
            botonUserName.classList.replace('btn-outline-info', 'btn-success');
            botonUserName.style.borderColor = '#198754';
            botonUserName.style.color = '#fff'; 
 
        } else {

            editandoUsername = false;

            const inputUsername = document.getElementById("username-input");
            let nuevoNombre = inputUsername ? inputUsername.value.trim() : "";

            if (nuevoNombre === "") {
                nuevoNombre = "Nombre de Usuario";
            }
            console.log(nuevoNombre);
            // 2. Volvemos a inyectar el h2 estático adentro del div contenedor
            contNombreUsuario.innerHTML = `
                <h2 class="fw-bold" id="username">${nuevoNombre}</h2>
            `;

            // Asigno ese nuevo username a la propiedad username del usuarioLogeado
            const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
            usuarioLogeado.username = nuevoNombre;
            // Guardo ese cambio en el localStorage
            localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado)); 

            // 3. Guardamos de forma permanente
            //localStorage.setItem('nombre_usuario', nuevoNombre);

            botonUserName.innerHTML = `<i class="bi bi-pencil-fill"></i> Cambiar Nombre de Usuario`;
            botonUserName.classList.replace('btn-success', 'btn-outline-info');
            botonUserName.style.borderColor = 'var(--celeste)';
            botonUserName.style.color = 'var(--celeste)';
        }
    });
}


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
        if (
            btnEditarBio &&
            btnCambiarBanner &&
            btnCambiarPfp &&
            botonUserName
        ) {
            const estanVisibles =
                btnEditarBio.style.display == "block" &&
                btnCambiarBanner.style.display == "block" &&
                btnCambiarPfp.style.display == "block" &&
                botonUserName.style.display == "block";

            if (estanVisibles) {
                btnEditarBio.style.display = "none";
                btnCambiarBanner.style.display = "none";
                btnCambiarPfp.style.display = "none";
                botonUserName.style.display = "none";
            } else {
                btnEditarBio.style.display = "block";
                btnCambiarBanner.style.display = "block";
                btnCambiarPfp.style.display = "block";
                botonUserName.style.display = "block";
            }
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


// CONTROL DE USERNAME
if (userName) {
    userName.addEventListener("change", () => {
        if (userName.value.trim().length <= 1) {
            errorUserName.style.display = "block";
            errorUserName.innerHTML = `
                <p class="text-danger mb-1"><i class="bi bi-exclamation-circle-fill"></i> El nombre de usuario debe tener al menos 2 caracteres.</p>
            `;
            userName.style.border = "3px solid red";
            algunError = true;
        } else {
            errorUserName.style.display = "block";
            errorUserName.innerHTML = `
                <p class="text-success mb-1"><i class="bi bi-check-circle-fill"></i> Nombre de usuario disponible y correcto.</p>
            `;
            userName.style.border = "3px solid green";
            algunError = false;
        }
    });
}


// CONTROL DE EMAIL
if (email) {
    email.addEventListener("change", () => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(email.value.trim())) {
            errorEmail.style.display = "block";
            errorEmail.innerHTML = `
                <p class="text-danger"><i class="bi bi-exclaminations-circle"></i> La dirección de correo electrónico no es válida (ej: usuario@correo.com)</p>
            `;
            email.style.border = "3px solid red";
            algunError = true;
        } else {
            errorEmail.style.display = "block";
            errorEmail.innerHTML = `
                <p class="text-success"><i class="bi bi-check-circle"></i> Correo electrónico correcto</p>
            `;
            email.style.border = "3px solid green";
            algunError = false;
        }
    });
}


// CONTROL DE CONTRASEÑA
if (contraseña) {
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
                <p class="text-success"><i class="bi bi-check-circle"></i> Contraseña segura </p>
            `;
            contraseña.style.border = "3px solid green";
            algunError = false;
        }

        if (confirmContraseña && confirmContraseña.value !== "") {
            confirmContraseña.dispatchEvent(new Event('change'));
        }
    });
}


// CONTROL DE CONFIRMAR CONTRASEÑA
if (confirmContraseña) {
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


// CONTROL DE FECHA DE NACIMIENTO
if (fechaNac) {
    fechaNac.addEventListener("change", () => {

        const [anio, mes, dia] = fechaNac.value.split("-").map(Number);
        const fechaNacimiento = new Date(anio, mes - 1, dia);

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
            errorFechaNac.style.display = "block";
            errorFechaNac.innerHTML = `
                <p class="text-success"><i class="bi bi-check-circle"></i> Fecha válida </p>
            `;
            fechaNac.style.border = "3px solid green";
            algunError = false;
        }
    });
}


// CONTROL DE TÉRMINOS Y CONDICIONES
if (terminos) {
    terminos.addEventListener("change", () => {
        if (!terminos.checked) {
            errorTerminos.style.display = "block";
            errorTerminos.innerHTML = `
                <p class="text-danger"><i class="bi bi-exclaminations-circle"></i> Debe aceptar los términos y condiciones para continuar </p>
            `;
            algunError = true;
        } else {
            errorTerminos.style.display = "none";
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

        const miModal = new bootstrap.Modal(modalElemento);
        miModal.show();

        if (esExito) {
            modalElemento.addEventListener('hidden.bs.modal', () => {
                const modalFormulario = document.getElementById("modal_registro") || document.querySelector(".modal.show");

                if (modalFormulario) {
                    const instanciaForm = bootstrap.Modal.getInstance(modalFormulario);

                    if (instanciaForm) instanciaForm.hide();
                }
            }, { once: true });
        }
    }
}


// =========================================================
// VALIDADOR FINAL DEL FORMULARIO
// =========================================================

const formRegistro = document.getElementById("formulario_registro");
const btnCrearCuenta = document.getElementById("boton-crear");

if (btnCrearCuenta) {
    btnCrearCuenta.addEventListener("click", () => {

        if (userName) userName.dispatchEvent(new Event('change'));
        if (email) email.dispatchEvent(new Event('change'));
        if (contraseña) contraseña.dispatchEvent(new Event('change'));
        if (confirmContraseña) confirmContraseña.dispatchEvent(new Event('change'));
        if (fechaNac) fechaNac.dispatchEvent(new Event('change'));
        if (terminos) terminos.dispatchEvent(new Event('change'));


        if (algunError) {
            mostrarAviso(
                `<i class="bi bi-shield-exclamation text-danger"></i> Registro Incompleto`,
                `<p class="mb-0 fs-5 text-center">Por favor, revise los campos marcados en <span class="text-danger fw-bold">rojo</span> antes de continuar.</p>`,
                false
            );

        } else {

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

            const usuarioExiste = listaUsuarios.some(user => user.username === userName.value);
            const emailExiste = listaUsuarios.some(user => user.email === email.value);

            if (usuarioExiste) {
                mostrarAviso(
                    `<i class="bi bi-exclamation-triangle-fill text-warning"></i> Error de registro`,
                    `<p class="mb-0 fs-5 text-center">El nombre de usuario <b>${userName.value}</b> ya está en uso.</p>`,
                    false
                );
                userName.style.border = "3px solid red";
                return;
            }

            if (emailExiste) {
                mostrarAviso(
                    `<i class="bi bi-exclamation-triangle-fill text-warning"></i> Error de registro`,
                    `<p class="mb-0 fs-5 text-center">El correo electrónico <b>${email.value}</b> ya está registrado.</p>`,
                    false
                );
                email.style.border = "3px solid red";
                return;
            }

            const nuevoUsuario = new Usuario(
                userName.value,
                email.value,
                contraseña.value,
                fechaNac.value,
                "../img/pfp-default.webp"
            );

            listaUsuarios.push(nuevoUsuario);

            localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

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

            if (errorUserName) errorUserName.style.display = "none";
            if (errorEmail) errorEmail.style.display = "none";
            if (errorContraseña) errorContraseña.style.display = "none";
            if (errorConfirmContraseña) errorConfirmContraseña.style.display = "none";
            if (errorFechaNac) errorFechaNac.style.display = "none";

            if (formRegistro) formRegistro.reset();

            const contenidoSinLogear = document.getElementById("contenido-sin-logear");
            const contenidoLogeado = document.getElementById("contenido-logeado");

            if (contenidoSinLogear) contenidoSinLogear.style.display = "none";
            if (contenidoLogeado) contenidoLogeado.style.display = "block";

            localStorage.setItem("usuarioLogeado", JSON.stringify(nuevoUsuario));
        }
    });
}


// =========================================================
// GESTIÓN DE SESIÓN LOGIN / LOGOUT
// =========================================================

const formLogin = document.getElementById("formulario_login");
const loginUser = document.getElementById("login-username");
const loginPass = document.getElementById("login-password");
const btnLogout = document.getElementById("btn-cerrar-sesion");

const conSinLogear = document.getElementById("contenido-sin-logear");
const conLogeado = document.getElementById("contenido-logeado");

// Campos del Perfil a rellenar dinámicamente
const perfilUsername = document.getElementById("username"); //nombre de usuario
const perfilBiografia = document.getElementById('texto-bio'); // biografía

function comprobarEstadoSesion() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogeado"));

    if (usuarioActivo) {
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
        if (conSinLogear) conSinLogear.style.display = "block";
        if (conLogeado) conLogeado.style.display = "none";
    }
}


comprobarEstadoSesion();


// ESCUCHA DEL ENVÍO DEL FORMULARIO DE LOGIN
if (formLogin) {
    formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const valorUser = loginUser.value.trim();
        const valorPass = loginPass.value.trim();

        const baseUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioValido = baseUsuarios.find(u =>
            (u.username === valorUser || u.email === valorUser) && u.contraseña === valorPass
        );

        if (usuarioValido) {
            if (!usuarioValido.fotoPerfil) {
                usuarioValido.fotoPerfil = "../img/default-avatar.png";
            }

            localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioValido));

            formLogin.reset();

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
            mostrarAviso(
                `<i class="bi bi-shield-x text-danger"></i> Error de Ingreso`,
                `<p class="mb-0 fs-5 text-center">El usuario/correo o la contraseña no son correctos.</p>`,
                false
            );

            loginPass.value = "";
        }
    });
}

// Arreglo para la lista de Usuarios completa
let usuariosCargados = JSON.parse(localStorage.getItem("usuarios")) || [];

// ESCUCHA DEL BOTÓN CERRAR SESIÓN
if (btnLogout) {
    btnLogout.addEventListener("click", (evento) => {
        evento.preventDefault();
        
        const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
        for(i=0; i<usuariosCargados.length; i++){
            if (usuarioLogeado.email === usuariosCargados[i].email){
                usuariosCargados[i] = usuarioLogeado;
            }   
        }
        
        // Guardo el cambio en el localStorage antes de removerlo
        localStorage.setItem("usuarios", JSON.stringify(usuariosCargados));

        // Removemos únicamente la sesión activa del navegador
        localStorage.removeItem("usuarioLogeado");

        // Para que borre las reseñas del perfil apenas cierre sesion
        document.getElementById("contenedor-reseñas-perfil").innerHTML = "";

        // Borrar los favoritos cuando se cierre la sesion
        document.getElementById("contenedor-favoritos").innerHTML = "";
        localStorage.removeItem("mis_favoritos");
        
        // Volvemos a evaluar el estado para bloquear el perfil y mostrar el Login
        comprobarEstadoSesion();
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
// PUBLICAR RESEÑA PERSISTENTE EN LOCALSTORAGE
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const formReseña = document.getElementById("formulario-reseña");
    const contenedorReseñas = document.getElementById("contenedor-reseñas-detalle");
    
    // ESCUCHAR EL ENVÍO DE NUEVAS RESEÑAS
    if (formReseña) {
        formReseña.addEventListener("submit", (e) => {
            e.preventDefault();

            const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));

            if (!usuarioLogeado) {
                alert("Debes iniciar sesión para publicar una reseña.");
                return;
            }

            const radioSeleccionado = document.querySelector('input[name="puntuacion"]:checked');

            if (!radioSeleccionado) {
                alert("Por favor, selecciona una puntuación con estrellas.");
                return;
            }

            const puntuacion = parseInt(radioSeleccionado.value);

            const comentarioTexto = document.getElementById("reseña-comentario").value;
            const nombreUsuario = usuarioLogeado.username;
            const fotoUsuario = usuarioLogeado.fotoPerfil || "../img/default-avatar.png";

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

            // AHORA ACTUALIZO EN LISTA DE USUARIOS
            for(i=0; i<usuariosCargados.length; i++){
            if (usuarioLogeado.email === usuariosCargados[i].email){
                usuariosCargados[i] = usuarioLogeado;
            }   
        }
        
        // Guardo el cambio en el localStorage antes de removerlo
        localStorage.setItem("usuarios", JSON.stringify(usuariosCargados));

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

// Funcion para cargar las reseñas a su perfil correspondiente
function cargarReseñasPerfil(){
    const contenedorReseñasPerfil = document.getElementById("contenedor-reseñas-perfil");
    contenedorReseñasPerfil.innerHTML = "";
    if(contenedorReseñasPerfil){
        const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
        const todasReseñas = JSON.parse(localStorage.getItem('reseñasTodaPagina'));
        if(usuarioLogeado){
            for(i=0; i<usuarioLogeado.reseñas.length; i++){
                let reseñaEncontrada = todasReseñas.find(r => (usuarioLogeado.reseñas[i] === r.id));
                if(reseñaEncontrada){
                    const nuevaTarjetaReseña = `
                            <div class="card border-0 p-3 mb-3" style="background-color: rgba(255,255,255,0.02); border-left: 3px solid var(--celeste) !important; border-radius: 10px;">
                                <div class="d-flex align-items-center mb-2">
                                    <img src="${reseñaEncontrada.fotoUsuario}" alt="Avatar ${reseñaEncontrada.nombreUsuario}" class="rounded-circle me-3" width="45" height="45" style="object-fit: cover; border: 2px solid var(--celeste);">
                                    <div>
                                        <h6 class="mb-0 fw-bold text-white">${reseñaEncontrada.nombreUsuario}</h6>
                                        <div class="d-flex align-items-center mt-1">
                                            <div class="me-2">${reseñaEncontrada.estrellasHTML}</div>
                                            <small class="text-muted">(${reseñaEncontrada.puntuacion}/10 pts)</small>
                                        </div>
                                    </div>
                                </div>
                                <p class="mb-0 mt-2 text-white-50" style="font-size: 0.95rem; line-height: 1.5;">
                                    ${reseñaEncontrada.comentarioTexto}
                                </p>
                            </div>
                    `;
                    if(contenedorReseñasPerfil){
                        contenedorReseñasPerfil.insertAdjacentHTML("afterbegin", nuevaTarjetaReseña);
                    }
                    
                }                
            }
        }else{
            contenedorReseñasPerfil.innerHTML = "";
        }
    }
}



