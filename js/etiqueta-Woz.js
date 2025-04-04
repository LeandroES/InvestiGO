const form = document.getElementById('form-etiqueta');
const nombreInput = document.getElementById('nombre');
const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]*$/;

// Validación de nombre
nombreInput.addEventListener('input', () => {
    const valor = nombreInput.value.trim();
    if (valor === '' || !regex.test(valor)) {
        nombreInput.classList.add('is-invalid');
        nombreInput.classList.remove('is-valid');
    } else {
        nombreInput.classList.remove('is-invalid');
        nombreInput.classList.add('is-valid');
    }
});

// Descripción: check si hay texto, mensaje si está vacío
const descripcion = document.getElementById('descripcion');
const descCheck = document.getElementById('descCheck');
descripcion.addEventListener('input', () => {
    if (descripcion.value.trim().length > 0) {
        descCheck.classList.remove('d-none');
    } else {
        descCheck.classList.add('d-none');
    }
});

// Color
let colorSeleccionado = null;
const hitbox = document.getElementById('colorHitbox');
const opciones = document.getElementById('colorOptions');
const selector = document.getElementById('selectedColor');
const colorFeedback = document.getElementById('colorFeedback');
const colorCheck = document.getElementById('colorCheck');

hitbox.addEventListener('mouseenter', () => {
    opciones.classList.add('show');
});

opciones.addEventListener('mouseleave', () => {
    opciones.classList.remove('show');
});

opciones.querySelectorAll('.color-bubble').forEach(bubble => {
    bubble.addEventListener('click', () => {
        const selected = bubble.getAttribute('data-color');
        selector.style.backgroundColor = selected;
        colorSeleccionado = selected;
        colorFeedback.classList.add('d-none');
        colorCheck.classList.remove('d-none');
        opciones.classList.remove('show');
    });
});

// Validar al enviar
form.addEventListener('submit', (e) => {
    let valido = true;

    if (!form.checkValidity()) {
        valido = false;
    }

    if (!colorSeleccionado) {
        colorFeedback.classList.remove('d-none');
        colorCheck.classList.add('d-none');
        valido = false;
    }

    if (!valido) {
        e.preventDefault();
        e.stopPropagation();
    }

    form.classList.add('was-validated');
});