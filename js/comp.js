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

class PeliculaSerie {
    constructor(id, titulo, portada, genero, sinopsis, caps, duracion, puntuacion, creador, actores, banner) {
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
    }
}


class Usuario {
    constructor(username, email, contraseña, fechaNac, fotoPerfil, banner, biografia, pelis_puntuadas) {
        this.username = username;
        this.email = email;
        this.contraseña = contraseña;
        this.fechaNac = fechaNac;
        this.fotoPerfil = fotoPerfil;
        this.banner = banner;
        this.biografia = biografia;
        this.pelis_puntuadas = pelis_puntuadas;
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
                let pelicula = new PeliculaSerie(
                    p.id,
                    p.titulo,
                    p.portada,
                    p.genero,
                    p.sinopsis,
                    p.caps,
                    p.duracion,
                    p.puntuacion,
                    p.creador,
                    p.actores,
                    p.banner
                );

                Arreglo_Pelis_Series.push(pelicula);
            });


            // DETALLE.HTML dinámico
            // Lee el id de la URL. Ejemplo: detalle.html?id=dark
            if (document.getElementById("titulo")) {
                const parametros = new URLSearchParams(window.location.search);
                const idPelicula = parametros.get("id") || "the-walking-dead"; //Mostratá the-walking-dead por defecto si no encuentra el id de la película.

                renderizarDetalles(idPelicula);
            }


            // PERFIL.HTML
            if (document.querySelector(".contenedor_favoritos")) {
                renderizarFavoritosPerfil();
                cargarFotoPerfil();
                cargarBannerPerfil();
                cargarBiografia();
                cargarNombreUsuario();
            }

        })
        .catch(err => console.error("Error cargando el JSON:", err));
});


// FUNCIÓN PARA PINTAR LOS DATOS EN DETALLE.HTML
function renderizarDetalles(id_pelicula) {

    const peliEncontrada = Arreglo_Pelis_Series.find(peli => peli.id === id_pelicula);

    if (peliEncontrada) {

        if (portadaDetalle) {
            portadaDetalle.src = peliEncontrada.portada;
            portadaDetalle.alt = peliEncontrada.titulo;
        }

        if (bannerDetalle) {
            bannerDetalle.src = peliEncontrada.banner;
            bannerDetalle.alt = peliEncontrada.titulo;
        }

        if (tituloDetalle) {
            tituloDetalle.innerHTML = `<h1>${peliEncontrada.titulo}</h1>`;
        }

        if (generoDetalle) {
            generoDetalle.innerHTML = `<h3>${peliEncontrada.genero}</h3>`;
        }

        if (sinopsisDetalle) {
            sinopsisDetalle.innerHTML = `<p>${peliEncontrada.sinopsis}</p>`;
        }

        if (capsDetalle) {
            capsDetalle.innerHTML = `<p>${peliEncontrada.caps}</p>`;
        }

        if (puntuacionDetalle) {
            puntuacionDetalle.innerHTML = `<p>${peliEncontrada.puntuacion}</p>`;
        }

        if (creadorDetalle) {
            creadorDetalle.innerHTML = `<p>${peliEncontrada.creador}</p>`;
        }

        if (duracionDetalle) {
            duracionDetalle.innerHTML = `<p>${peliEncontrada.duracion}</p>`;
        }

        if (actoresDetalle) {
            const listaActores = peliEncontrada.actores.join(', ');
            actoresDetalle.innerHTML = `<p>${listaActores}</p>`;
        }


        // FAVORITOS DINÁMICOS
        // Antes siempre agregaba the-walking-dead. Ahora agrega la peli/serie actual.
        const btnFavs = document.getElementById("btn-favs");

        if (btnFavs) {
            btnFavs.onclick = function() {
                agregarAFavoritos(peliEncontrada.id);
            };
        }


        // MODAL DE RESEÑA DINÁMICO
        const inputTituloReseña = document.getElementById("reseña-peli-titulo");

        if (inputTituloReseña) {
            inputTituloReseña.value = peliEncontrada.titulo;
        }

    } else {
        console.error("No se encontró ninguna película con el ID: " + id_pelicula);

        if (tituloDetalle) {
            tituloDetalle.innerHTML = `<h1>No se encontró la película o serie</h1>`;
        }

        if (sinopsisDetalle) {
            sinopsisDetalle.innerHTML = `<p>Volvé a listas o explorar e intentá nuevamente.</p>`;
        }
    }
}


// ==========================================
//   LÓGICA DE FAVORITOS LOCALSTORAGE
// ==========================================

function agregarAFavoritos(id_pelicula) {
    let favoritos = JSON.parse(localStorage.getItem('mis_favoritos')) || [];

    if (!favoritos.includes(id_pelicula)) {
        favoritos.push(id_pelicula);
        localStorage.setItem('mis_favoritos', JSON.stringify(favoritos));
        alert("¡Agregada a tus favoritos en tu perfil!");
    } else {
        alert("Esta serie ya está en tus favoritos.");
    }
}


function renderizarFavoritosPerfil() {
    const contenedorFavoritos = document.querySelector(".contenedor_favoritos");

    if (!contenedorFavoritos) return;

    let favoritos = JSON.parse(localStorage.getItem('mis_favoritos')) || [];

    contenedorFavoritos.innerHTML = "";

    if (favoritos.length === 0) {
        contenedorFavoritos.innerHTML = `<p class="text-muted">Aún no agregaste series o películas a tus favoritos.</p>`;
        return;
    }

    favoritos.forEach(idFav => {
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

                if (usuarioLogeado) {
                    usuarioLogeado.fotoPerfil = imagenBase64;
                    localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado));
                }
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

                if (usuarioLogeado) {
                    usuarioLogeado.banner = imagenBase64;
                    localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado));
                }
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

            const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));

            if (usuarioLogeado) {
                usuarioLogeado.biografia = nuevoTexto;
                localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado));
            }

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

            contNombreUsuario.innerHTML = `
                <h2 class="fw-bold" id="username">${nuevoNombre}</h2>
            `;

            localStorage.setItem('nombre_usuario', nuevoNombre);

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
        const nombreGuardado = localStorage.getItem('nombre_usuario');

        if (nombreGuardado) {
            elUsername.textContent = nombreGuardado;
        }
    }
}


// ==========================================
//   BOTÓN PARA EDITAR PERFIL GENERAL
// ==========================================

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

            let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

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

const perfilUsername = document.getElementById("username");


function comprobarEstadoSesion() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogeado"));

    if (usuarioActivo) {
        if (conSinLogear) conSinLogear.style.display = "none";
        if (conLogeado) conLogeado.style.display = "block";

        if (perfilUsername) {
            perfilUsername.textContent = `${usuarioActivo.username}`;
        }

    } else {
        if (conSinLogear) conSinLogear.style.display = "block";
        if (conLogeado) conLogeado.style.display = "none";
    }
}


comprobarEstadoSesion();


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


if (btnLogout) {
    btnLogout.addEventListener("click", (evento) => {
        evento.preventDefault();

        localStorage.removeItem("usuarioLogeado");

        comprobarEstadoSesion();
    });
}


// =========================================================
// PUBLICAR RESEÑA PERSISTENTE EN LOCALSTORAGE
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const formReseña = document.getElementById("formulario-reseña");
    const contenedorReseñas = document.getElementById("contenedor-reseñas-detalle");

    if (contenedorReseñas) {
        const reseñasGuardadas = JSON.parse(localStorage.getItem("reseñas_detalle")) || [];

        reseñasGuardadas.forEach(reseña => {
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
        });
    }


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

            const nuevaReseñaObj = {
                fotoUsuario,
                nombreUsuario,
                estrellasHTML,
                puntuacion,
                comentarioTexto
            };

            const reseñasGuardadas = JSON.parse(localStorage.getItem("reseñas_detalle")) || [];

            reseñasGuardadas.unshift(nuevaReseñaObj);

            localStorage.setItem("reseñas_detalle", JSON.stringify(reseñasGuardadas));

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