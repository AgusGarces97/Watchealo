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

enviarContacto.addEventListener('click', ()=>{
    const ok = validarNombre() & validarEmail() & validarMensaje();
    // 1. Obtenemos la respuesta del captcha
    const response = grecaptcha.getResponse();

    // 2. Si la respuesta está vacía, el usuario no completó el captcha
    if (response.length === 0) {
        event.preventDefault(); // Evita que se envíe el formulario
        alert("Por favor, completa el captcha para demostrar que no eres un robot.");
        return false;
    }
    
    if (ok) {
        formContacto.style.display = 'none';
        confirmacion.classList.add('visible');
        
        formContacto.submit();
        formContacto.reset()
    }
});





