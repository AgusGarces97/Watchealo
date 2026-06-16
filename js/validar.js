const formContacto = document.getElementById('formContacto');
const confirmacion = document.getElementById('confirmacion');
const inputNombre  = document.getElementById('inputNombre');
const inputEmail   = document.getElementById('inputEmail');
const inputMensaje = document.getElementById('inputMensaje');

/* ── Solo letras y espacios en nombre ── */
inputNombre.addEventListener('input', () => {
    inputNombre.value = inputNombre.value.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, '');
});

/* ── Validaciones ── */
function validarNombre() {
    const valor = inputNombre.value.trim();
    const ok = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(valor) && valor.includes(' ');
    inputNombre.classList.toggle('is-invalid', !ok);
    inputNombre.classList.toggle('is-valid', ok);
    return ok;
}

function validarEmail() {
    const valor = inputEmail.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.com$/i.test(valor);
    inputEmail.classList.toggle('is-invalid', !ok);
    inputEmail.classList.toggle('is-valid', ok);
    return ok;
}

function validarMensaje() {
    const valor = inputMensaje.value.trim();
    const ok = valor.length > 0;
    inputMensaje.classList.toggle('is-invalid', !ok);
    inputMensaje.classList.toggle('is-valid', ok);
    return ok;
}

/* ── Rojo solo al salir, verde también mientras escribís (si ya fue validado) ── */
inputNombre.addEventListener('blur',  validarNombre);
inputEmail.addEventListener('blur',   validarEmail);
inputMensaje.addEventListener('blur', validarMensaje);

inputNombre.addEventListener('input',  () => { if (inputNombre.classList.contains('is-invalid') || inputNombre.classList.contains('is-valid')) validarNombre(); });
inputEmail.addEventListener('input',   () => { if (inputEmail.classList.contains('is-invalid')  || inputEmail.classList.contains('is-valid'))  validarEmail(); });
inputMensaje.addEventListener('input', () => { if (inputMensaje.classList.contains('is-invalid') || inputMensaje.classList.contains('is-valid')) validarMensaje(); });

/* ── Submit ── */
const enviarContacto = document.getElementById('boton-enviar-contacto');

enviarContacto.addEventListener('click', () => {
    // 1. Validamos los campos de texto usando && comunes
    const camposValidos = validarNombre() && validarEmail() && validarMensaje();
    
    // 2. Obtenemos la respuesta del reCAPTCHA
    const captchaResponse = grecaptcha.getResponse();

    // 3. Si los campos están bien, pero NO marcó el captcha, avisamos del ERROR
    if (camposValidos && captchaResponse.length === 0) {
        mostrarAvisoDetalle(
            `<span>¡Atención! <i class="bi bi-exclamation-triangle"></i></span>`, 
            `<span>Por favor, completa el reCAPTCHA para demostrar que no eres un robot.</span>`,
            false // No es éxito, es un aviso de bloqueo
        );
        return; // Frena el envío
    }

    // 4. Si todo está correcto (campos y captcha)
    if (camposValidos && captchaResponse.length > 0) {
        formContacto.style.display = 'none';
        confirmacion.classList.add('visible');
        
        // Enviamos y reseteamos
        formContacto.submit();
        formContacto.reset();
        grecaptcha.reset(); // Opcional: resetea el captcha visualmente por si acaso
    }
});

// =========================================================
// FUNCIÓN AUXILIAR PARA MOSTRAR EL MODAL DE AVISO
// =========================================================
function mostrarAvisoDetalle(titulo, mensajeHTML, esExito = false) {
    const modalElemento = document.getElementById("modalAvisoSistemaDetalle");
    const modalTitulo = document.getElementById("modalAvisoLabelDetalle");
    const modalBody = document.getElementById("modalAvisoBodyDetalle");

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