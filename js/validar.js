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

    // 3. Si los campos están bien, pero no marcó el captcha, avisamos
    if (camposValidos && captchaResponse.length === 0) {
        alert('Por favor, completa el captcha para demostrar que no eres un robot.');
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