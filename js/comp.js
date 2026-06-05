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


/* Carga de Datos de Película */



class PeliculaSerie{
    constructor(id, titulo, portada, genero, sinopsis, caps, duracion, puntuacion, creador, actores, banner){
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

// EJECUCIÓN AUTOMÁTICA AL CARGAR LA PÁGINA
window.addEventListener('load', () => {

    // Traer los datos del JSON
    fetch('../json/pelis_y_series.json')
        .then(res => res.json())
        .then(datosJSON => {
            
            // Llenamos el arreglo con instancias de la clase
            Arreglo_Pelis_Series = []; // Aseguramos vaciado limpio
            datosJSON.forEach(p => {
                let pelicula = new PeliculaSerie(p.id, p.titulo, p.portada, p.genero, p.sinopsis, p.caps, p.duracion, p.puntuacion, p.creador, p.actores, p.banner);
                Arreglo_Pelis_Series.push(pelicula);
            });

            // COMPROBACIÓN DE PÁGINA:
            // Si existe 'tituloDetalle', estamos en detalle.html
            if (document.getElementById("titulo")) {
                renderizarDetalles("the-walking-dead");
            }
            
            // Si existe el contenedor de favoritos, estamos en perfil.html
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

// FUNCIÓN PARA PINTAR LOS DATOS
function renderizarDetalles(id_pelicula) {
    // Buscamos directamente el objeto que coincida con el id
    const peliEncontrada = Arreglo_Pelis_Series.find(peli => peli.id === id_pelicula);

    if (peliEncontrada) {
        portadaDetalle.src = peliEncontrada.portada;
        bannerDetalle.src = peliEncontrada.banner;
        
        tituloDetalle.innerHTML = `<h1>${peliEncontrada.titulo}</h1>`;
        generoDetalle.innerHTML = `<h3>${peliEncontrada.genero}</h3>`;
        sinopsisDetalle.innerHTML = `<p>${peliEncontrada.sinopsis}</p>`;
        capsDetalle.innerHTML = `<p>${peliEncontrada.caps}</p>`;
        puntuacionDetalle.innerHTML = `<p>${peliEncontrada.puntuacion}</p>`;
        creadorDetalle.innerHTML = `<p>${peliEncontrada.creador}</p>`;
        duracionDetalle.innerHTML = `<p>${peliEncontrada.duracion}</p>`;
        
        const listaActores = peliEncontrada.actores.join(', ');
        actoresDetalle.innerHTML = `<p>${listaActores}</p>`;
    } else {
        console.error("No se encontró ninguna película con el ID: " + id_pelicula);
    }
}

// ==========================================
//   LÓGICA DE FAVORITOS (LOCALSTORAGE)
// ==========================================

// 1. FUNCIÓN PARA AGREGAR DESDE DETALLE.HTML
function agregarAFavoritos(id_pelicula) {
    // Obtenemos los favoritos actuales del localStorage (si no hay ninguno, inicializamos array vacío)
    let favoritos = JSON.parse(localStorage.getItem('mis_favoritos')) || [];

    // Validamos que no se duplique la película
    if (!favoritos.includes(id_pelicula)) {
        favoritos.push(id_pelicula);
        localStorage.setItem('mis_favoritos', JSON.stringify(favoritos));
        alert("¡Agregada a tus favoritos en tu perfil!");
    } else {
        alert("Esta serie ya está en tus favoritos.");
    }
}

// 2. FUNCIÓN PARA RENDERIZAR EN PERFIL.HTML
function renderizarFavoritosPerfil() {
    const contenedorFavoritos = document.querySelector(".contenedor_favoritos");
    
    // Si no estamos en la página de perfil (porque no existe ese contenedor), salimos de la función
    if (!contenedorFavoritos) return;

    // Traemos los IDs guardados
    let favoritos = JSON.parse(localStorage.getItem('mis_favoritos')) || [];
    contenedorFavoritos.innerHTML = ""; // Limpiamos carga previa

    if (favoritos.length === 0) {
        contenedorFavoritos.innerHTML = `<p class="text-muted">Aún no agregaste series o películas a tus favoritos.</p>`;
        return;
    }

    // Recorremos los IDs guardados y buscamos sus datos en el arreglo global
    favoritos.forEach(idFav => {
        const peli = Arreglo_Pelis_Series.find(p => p.id === idFav);
        
        if (peli) {
            // Creamos una columna responsiva de Bootstrap para cada portada de favorito
            const col = document.createElement("div");
            col.className = "col-4 col-sm-3 col-md-2 mb-3"; 
            col.innerHTML = `
                <a href="detalle.html">
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
                const imagenBase64 = e.target.result;

                // Cambiamos la vista previa en el DOM inmediatamente
                vistaPfp.src = imagenBase64;

                // Guardamos la imagen en el localStorage
                localStorage.setItem('pfp_usuario', imagenBase64);
            };

            // Leemos el archivo local convirtiéndolo a una cadena de texto Base64
            lector.readAsDataURL(archivo);
        }
    });
}

// 3. FUNCIÓN PARA CARGAR LA FOTO GUARDADA AL ENTRAR A LA PÁGINA
function cargarFotoPerfil() {
    if (vistaPfp) {
        const fotoGuardada = localStorage.getItem('pfp_usuario');
        if (fotoGuardada) {
            vistaPfp.src = fotoGuardada;
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

                // Guardamos en localStorage
                localStorage.setItem('banner_usuario', imagenBase64);
            };

            lector.readAsDataURL(archivo);
        }
    });
}

// 3. FUNCIÓN PARA CARGAR EL BANNER GUARDADO AL ENTRAR A LA PÁGINA
function cargarBannerPerfil() {
    if (vistaBanner) {
        const bannerGuardado = localStorage.getItem('banner_usuario');
        if (bannerGuardado) {
            vistaBanner.src = bannerGuardado;
        }
    }
}


// ==========================================
//   LÓGICA INTERACTIVA DE BIOGRAFÍA (IN-PLACE)
// ==========================================

const btnEditarBio = document.getElementById('btn-editar-bio');
const contenedorBioInteractivo = document.getElementById('contenedor-bio-interactivo');

let editando = false; // Variable de estado para controlar el modo

if (btnEditarBio && contenedorBioInteractivo) {

    btnEditarBio.addEventListener('click', () => {
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

            // 3. Guardamos el cambio de forma permanente
            localStorage.setItem('biografia_usuario', nuevoTexto);

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
        const bioGuardada = localStorage.getItem('biografia_usuario');
        if (bioGuardada) {
            textoBio.innerText = bioGuardada;
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

            if (nuevoNombre === "") {
                nuevoNombre = "Nombre de Usuario";
            }

            // 2. Volvemos a inyectar el h2 estático adentro del div contenedor
            contNombreUsuario.innerHTML = `
                <h2 class="fw-bold" id="username">${nuevoNombre}</h2>
            `;

            // 3. Guardamos de forma permanente
            localStorage.setItem('nombre_usuario', nuevoNombre);

            // 4. Devolvemos el botón a su estado original celeste
            botonUserName.innerHTML = `<i class="bi bi-pencil-fill"></i> Cambiar Nombre de Usuario`;
            botonUserName.classList.replace('btn-success', 'btn-outline-info');
            botonUserName.style.borderColor = 'var(--celeste)';
            botonUserName.style.color = 'var(--celeste)';
        }
    });
}

// FUNCIÓN PARA CARGAR EL NOMBRE EN EL LOAD (Mantenela igual)
function cargarNombreUsuario() {
    const elUsername = document.getElementById("username");
    if (elUsername) {
        const nombreGuardado = localStorage.getItem('nombre_usuario');
        if (nombreGuardado) {
            elUsername.textContent = nombreGuardado;
        }
    }
}


// BOTON PARA EDITAR PERFIL GENERAL
const editarPerfil = document.getElementById("btn-editar-perfil-general");

if (editarPerfil) {
    editarPerfil.addEventListener("click", () => {
        if (btnEditarBio.style.display == "block" &&
            btnCambiarBanner.style.display == "block" &&
            btnCambiarPfp.style.display == "block" &&
            botonUserName.style.display == "block") {
            
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

// CONTROL DE EMAIL
email.addEventListener("change", () => {
    // Expresión regular estándar para verificar texto + @ + texto + . + texto
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

// CONTROL DE CONTRASEÑA (Mínimo 6 caracteres)
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

    // Si el usuario cambia la contraseña principal, volvemos a chequear que la confirmación coincida
    if (confirmContraseña.value !== "") {
        confirmContraseña.dispatchEvent(new Event('change'));
    }
});

// 3. CONTROL DE CONFIRMAR CONTRASEÑA (Debe ser idéntica a la primera)
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

// 4. CONTROL DE FECHA DE NACIMIENTO (Validar que no esté vacía y que sea mayor de edad opcional)
fechaNac.addEventListener("change", () => {
    if (fechaNac.value === "") {
        errorFechaNac.style.display = "block";
        errorFechaNac.innerHTML = `
            <p class="text-danger"><i class="bi bi-exclaminations-circle"></i> Por favor, seleccione su fecha de nacimiento </p>
        `;
        fechaNac.style.border = "3px solid red";
        algunError = true;
    } else {
        // Validación opcional: Verificar si es mayor de 13 o 18 años si lo requirieras
        errorFechaNac.style.display = "block";
        errorFechaNac.innerHTML = `
            <p class="text-success"><i class="bi bi-check-circle"></i> Fecha válida </p>
        `;
        fechaNac.style.border = "3px solid green";
        algunError = false;
    }
});

// 5. CONTROL DE TÉRMINOS Y CONDICIONES (Checkboxes usan evento 'change')
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
// VALIDADOR FINAL DEL FORMULARIO
// =========================================================
const formRegistro = document.getElementById("formulario_registro");
const btnCrearCuenta = document.getElementById("boton-crear");

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
        errorUserName.style.display = "none";
        errorEmail.style.display = "none";
        errorContraseña.style.display = "none";
        errorConfirmContraseña.style.display = "none";
        errorFechaNac.style.display = "none";
        formRegistro.reset();

        // CAMBIO DE CONTENIDO SIN LOGEAR A CONTENIDO LOGEADO FALTA MANTENER LA SESION
        document.getElementById("contenido-sin-logear").style.display = "none";
        document.getElementById("contenido-logeado").style.display = "block";

    }
});




