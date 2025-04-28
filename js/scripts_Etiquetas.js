// 2. Inicializar eventos
function inicializarEventos() {
  // Formulario de nueva etiqueta
  const form = document.getElementById('form-etiqueta');
  const nombreInput = document.getElementById('nombre');
  const descripcion = document.getElementById('descripcion');
  const descCheck = document.getElementById('descCheck');
  const hitbox = document.getElementById('colorHitbox');
  const opciones = document.getElementById('colorOptions');
  const selector = document.getElementById('selectedColor');
  const colorFeedback = document.getElementById('colorFeedback');
  const colorCheck = document.getElementById('colorCheck');
  let colorSeleccionado = null;

  // Formulario de editar etiqueta
  const formEditar = document.getElementById('form-editar-etiqueta');
  const editNombreInput = document.getElementById('editNombre');
  const editDescripcion = document.getElementById('editDescripcion');
  const editDescCheck = document.getElementById('editDescCheck');
  const editColorOptions = document.getElementById('editColorOptions');
  const editColorHitbox = document.getElementById('editColorHitbox');
  const editSelectedColor = document.getElementById('editSelectedColor');
  const editColorFeedback = document.getElementById('editColorFeedback');
  const editColorCheck = document.getElementById('editColorCheck');
  let colorSeleccionadoEditar = null;

  const editarModal = new bootstrap.Modal(document.getElementById('editarEtiquetaModal'));

  if (!form || !formEditar) {
    console.error('Formularios no encontrados.');
    return;
  }

  // Validación nombre en creación
  nombreInput.addEventListener('input', () => {
    const valor = nombreInput.value.trim();
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]*$/;
    if (valor === '' || !regex.test(valor)) {
      nombreInput.classList.add('is-invalid');
      nombreInput.classList.remove('is-valid');
    } else {
      nombreInput.classList.remove('is-invalid');
      nombreInput.classList.add('is-valid');
    }
  });

  // Validación descripción en creación
  descripcion.addEventListener('input', () => {
    if (descripcion.value.trim().length > 0) {
      descCheck.classList.remove('d-none');
    } else {
      descCheck.classList.add('d-none');
    }
  });

  // Selector de color en creación
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

  // Validar al enviar nueva etiqueta
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

  // Click en botón editar
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

  // Validación nombre en edición
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

  // Validación descripción en edición
  editDescripcion.addEventListener('input', () => {
    if (editDescripcion.value.trim().length > 0) {
      editDescCheck.classList.remove('d-none');
    } else {
      editDescCheck.classList.add('d-none');
    }
  });

  // Selector de color en edición
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

  // Validar al enviar formulario de edición
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

    // Aquí podrías mostrar un toast de éxito 🚀
  });
}
//Etiqueta Actualizada funcionalidad
document.addEventListener('DOMContentLoaded', function() {
  // Cargar modales dinámicamente
  fetch('https://leandroes.github.io/InvestiGO/modales/modales.html')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar modales.html');
      return response.text();
    })
    .then(html => {
      document.getElementById('modalesContainer').innerHTML = html;

      // Una vez cargados los modales, inicializamos TODO
      inicializarEventos();
    })
    .catch(error => {
      console.error('Error cargando modales:', error);
    });
});
//////////////////////////////////////////////////////////////////
// Función para inicializar eventos

document.addEventListener('DOMContentLoaded', function() {
  // Primero cargar modales dinámicamente
  fetch('https://leandroes.github.io/InvestiGO/modales/modales.html')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar modales.html');
      return response.text();
    })
    .then(html => {
      document.getElementById('modalesContainer').innerHTML = html;

      // ⏳ Esperar un pequeño tiempo para asegurar que todo esté en el DOM
      setTimeout(inicializarEventos, 100);
    })
    .catch(error => {
      console.error('Error cargando modales:', error);
    });
});

function inicializarEventos() {
  const editarModalElement = document.getElementById('editarEtiquetaModal');
  const actualizadaModalElement = document.getElementById('etiquetaActualizadaModal');

  if (!editarModalElement || !actualizadaModalElement) {
    console.error('No se encontraron los modales.');
    return;
  }

  const editarModal = new bootstrap.Modal(editarModalElement);
  const actualizadaModal = new bootstrap.Modal(actualizadaModalElement);

  // Inicializar eventos en lápices
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fila = btn.closest('tr');

      document.getElementById('editNombre').value = fila.dataset.nombre || '';
      document.getElementById('editDescripcion').value = fila.dataset.descripcion || '';
      document.getElementById('editSelectedColor').style.backgroundColor = fila.dataset.color || '#ccc';

      editarModal.show();
    });
  });

  // Guardar cambios en edición
  const formEditar = document.getElementById('form-editar-etiqueta');
  if (formEditar) {
    formEditar.addEventListener('submit', function(event) {
      event.preventDefault();
      event.stopPropagation();

      editarModal.hide();

      setTimeout(() => {
        actualizadaModal.show();
      }, 400);
    });
  }
}



