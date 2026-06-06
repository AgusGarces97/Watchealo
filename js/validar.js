/* Formulario de contacto — validación con Bootstrap */
const formContacto   = document.getElementById('formContacto');
const confirmacion   = document.getElementById('confirmacion');

formContacto.addEventListener('submit', (e) => {
    e.preventDefault();

    // Activa los estilos de validación de Bootstrap
    formContacto.classList.add('was-validated');

    // Si todos los campos son válidos
    if (formContacto.checkValidity()) {
        // Ocultamos el form y mostramos la confirmación
        formContacto.style.display = 'none';
        confirmacion.classList.add('visible');
    }
});