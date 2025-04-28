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

const editarModal = new bootstrap.Modal(document.getElementById('editarEtiquetaModal'));
let colorSeleccionadoEditar = null;

document.querySelectorAll('.edit-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const fila = btn.closest('tr');
    document.getElementById('editNombre').value = fila.dataset.nombre || '';
    document.getElementById('editDescripcion').value = fila.dataset.descripcion || '';
    document.getElementById('editSelectedColor').style.backgroundColor = fila.dataset.color || '#ccc';
    colorSeleccionadoEditar = fila.dataset.color || null;
    editarModal.show();
  });
});

const formEditar = document.getElementById('form-editar-etiqueta');
const editNombreInput = document.getElementById('editNombre');
const editDescripcion = document.getElementById('editDescripcion');
const editDescCheck = document.getElementById('editDescCheck');
const editColorOptions = document.getElementById('editColorOptions');
const editColorHitbox = document.getElementById('editColorHitbox');
const editSelectedColor = document.getElementById('editSelectedColor');
const editColorFeedback = document.getElementById('editColorFeedback');
const editColorCheck = document.getElementById('editColorCheck');

// Validaciones
editNombreInput.addEventListener('input', () => {
  const valor = editNombreInput.value.trim();
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]*$/;
  if (valor === '' || !regex.test(valor)) {
    editNombreInput.classList.add('is-invalid');
    editNombreInput.classList.remove('is-valid');
  } else {
    editNombreInput.classList.remove('is-invalid');
    editNombreInput.classList.add('is-valid');
  }
});

editDescripcion.addEventListener('input', () => {
  if (editDescripcion.value.trim().length > 0) {
    editDescCheck.classList.remove('d-none');
  } else {
    editDescCheck.classList.add('d-none');
  }
});

editColorHitbox.addEventListener('mouseenter', () => {
  editColorOptions.classList.add('show');
});
editColorOptions.addEventListener('mouseleave', () => {
  editColorOptions.classList.remove('show');
});
editColorOptions.querySelectorAll('.color-bubble').forEach(bubble => {
  bubble.addEventListener('click', () => {
    const selected = bubble.getAttribute('data-color');
    editSelectedColor.style.backgroundColor = selected;
    colorSeleccionadoEditar = selected;
    editColorFeedback.classList.add('d-none');
    editColorCheck.classList.remove('d-none');
    editColorOptions.classList.remove('show');
  });
});

formEditar.addEventListener('submit', (e) => {
  let valido = true;
  if (!formEditar.checkValidity()) {
    valido = false;
  }
  if (!colorSeleccionadoEditar) {
    editColorFeedback.classList.remove('d-none');
    editColorCheck.classList.add('d-none');
    valido = false;
  }
  if (!valido) {
    e.preventDefault();
    e.stopPropagation();
  }
  formEditar.classList.add('was-validated');

  // Aquí podrías actualizar la tabla directamente si quieres
});
