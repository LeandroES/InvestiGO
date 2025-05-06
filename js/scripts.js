<script>
      // Variables globales para la paginación
      let paginaActual = 1;
      let totalEtiquetas = 0;
      let totalPaginas = 0;
      let etiquetasFiltradas = [];
      let etiquetasOriginales = [];
      let registrosPorPagina = 10;

      // Función para manejar errores generales
      function mostrarError(mensaje) {
        const errorModal = new bootstrap.Modal(document.getElementById('modalError'));
        document.getElementById('mensajeError').textContent = mensaje;
        errorModal.show();
      }

      // Función para cargar las etiquetas
      function cargarEtiquetas() {
        const tablaEtiquetas = document.getElementById('tablaEtiquetas');
        tablaEtiquetas.innerHTML = `
          <tr>
            <td colspan="5" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="text-muted mb-0 mt-2">Cargando etiquetas...</p>
            </td>
          </tr>
        `;
        
        google.script.run
          .withSuccessHandler(function(response) {
            if (response.success) {
              if (response.etiquetas.length === 0) {
                tablaEtiquetas.innerHTML = `
                  <tr>
                    <td colspan="5" class="text-center">
                      <p class="text-muted mb-0">No hay etiquetas registradas</p>
                    </td>
                  </tr>
                `;
                document.getElementById('paginacion').innerHTML = '';
                document.getElementById('infoRegistros').textContent = 'Mostrando 0 de 0 registros';
                return;
              }
              
              // Guardar todas las etiquetas originales
              etiquetasOriginales = response.etiquetas;
              etiquetasFiltradas = response.etiquetas;
              totalEtiquetas = etiquetasFiltradas.length;
              
              // Actualizar la paginación
              actualizarPaginacion();
              
              // Mostrar la primera página
              mostrarPagina(1);
            } else {
              tablaEtiquetas.innerHTML = `
                <tr>
                  <td colspan="5" class="text-center">
                    <p class="text-danger mb-0">Error al cargar las etiquetas: ${response.error || 'Error desconocido'}</p>
                  </td>
                </tr>
              `;
              document.getElementById('paginacion').innerHTML = '';
              document.getElementById('infoRegistros').textContent = 'Mostrando 0 de 0 registros';
            }
          })
          .withFailureHandler(function(error) {
            tablaEtiquetas.innerHTML = `
              <tr>
                <td colspan="5" class="text-center">
                  <p class="text-danger mb-0">Error al cargar las etiquetas: ${error}</p>
                </td>
              </tr>
            `;
            document.getElementById('paginacion').innerHTML = '';
            document.getElementById('infoRegistros').textContent = 'Mostrando 0 de 0 registros';
          })
          .obtenerEtiquetas();
      }
      
      // Función para mostrar una página específica
      function mostrarPagina(numeroPagina) {
        paginaActual = numeroPagina;
        const tablaEtiquetas = document.getElementById('tablaEtiquetas');
        
        // Calcular índices de inicio y fin para la página actual
        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = Math.min(inicio + registrosPorPagina, etiquetasFiltradas.length);
        
        // Si no hay etiquetas para mostrar
        if (etiquetasFiltradas.length === 0) {
          tablaEtiquetas.innerHTML = `
            <tr>
              <td colspan="5" class="text-center">
                <p class="text-muted mb-0">No hay etiquetas registradas</p>
              </td>
            </tr>
          `;
          document.getElementById('infoRegistros').textContent = 'Mostrando 0 de 0 registros';
          return;
        }
        
        // Limpiar la tabla
        tablaEtiquetas.innerHTML = '';
        
        // Mostrar etiquetas para la página actual
        for (let i = inicio; i < fin; i++) {
          const etiqueta = etiquetasFiltradas[i];
          const fechaCreacion = etiqueta.fechaCreacion || '-';
          const fila = document.createElement('tr');
          
          fila.setAttribute('data-id', etiqueta.id);
          fila.setAttribute('data-nombre', etiqueta.nombre);
          fila.setAttribute('data-descripcion', etiqueta.descripcion || '');
          fila.setAttribute('data-color', etiqueta.color || '#ccc');
          fila.setAttribute('data-activo', etiqueta.activo ? 'true' : 'false');
          
          fila.innerHTML = `
            <td><span class="color-dot" style="background-color: ${etiqueta.color || '#ccc'};"></span>${etiqueta.nombre}</td>
            <td class="text-start">${etiqueta.descripcion || ''}</td>
            <td><span class="pencil-icon edit-btn" title="Editar"></span></td>
            <td>${fechaCreacion}</td>
            <td>
              <div class="form-check form-switch d-inline-block switch">
                <input class="form-check-input toggle-activo" type="checkbox" role="switch" ${etiqueta.activo ? 'checked' : ''}>
              </div>
            </td>
          `;
          
          tablaEtiquetas.appendChild(fila);
        }
        
        // Actualizar la información de registros
        document.getElementById('infoRegistros').textContent = `Mostrando ${inicio + 1} a ${fin} de ${totalEtiquetas} registros`;
        
        // Actualizar elementos de paginación activos
        document.querySelectorAll('#paginacion .page-item').forEach(item => {
          item.classList.remove('active');
          if (item.querySelector('.page-link') && parseInt(item.querySelector('.page-link').getAttribute('data-page')) === paginaActual) {
            item.classList.add('active');
          }
        });
        
        // Agregar eventos a los botones de editar
        document.querySelectorAll('.edit-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const fila = this.closest('tr');
            const id = fila.getAttribute('data-id');
            const nombre = fila.getAttribute('data-nombre');
            const descripcion = fila.getAttribute('data-descripcion');
            const color = fila.getAttribute('data-color');
            
            abrirModalEditar(id, nombre, descripcion, color);
          });
        });
        
        // Agregar eventos a los switches de activación
        document.querySelectorAll('.toggle-activo').forEach(toggle => {
          toggle.addEventListener('change', function() {
            const fila = this.closest('tr');
            const nombre = fila.getAttribute('data-nombre');
            const nuevoEstado = this.checked;
            
            if (!nuevoEstado) {
              // Si se está desactivando, mostrar confirmación
              const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacionDesactivacion'));
              modalConfirmacion.show();
              
              // Guardar referencia al toggle para restaurar su estado si se cancela
              window.toggleActual = this;
              
              // Configurar evento para el botón de confirmación
              document.getElementById('btnConfirmarDesactivacion').onclick = function() {
                cambiarEstadoEtiqueta(nombre, nuevoEstado);
                modalConfirmacion.hide();
              };
              
              // Configurar evento para el botón de cancelar
              document.getElementById('btnCancelarDesactivacion').onclick = function() {
                window.toggleActual.checked = !window.toggleActual.checked;
                modalConfirmacion.hide();
              };
            } else {
              // Si se está activando, cambiar sin confirmación
              cambiarEstadoEtiqueta(nombre, nuevoEstado);
            }
          });
        });
      }
      
      // Función para actualizar los controles de paginación
      function actualizarPaginacion() {
        totalPaginas = Math.ceil(etiquetasFiltradas.length / registrosPorPagina);
        const paginacion = document.getElementById('paginacion');
        
        // Limpiar paginación anterior
        paginacion.innerHTML = '';
        
        // Si no hay páginas, no mostrar paginación
        if (totalPaginas <= 1) {
          return;
        }
        
        // Agregar botón para ir a la primera página
        paginacion.innerHTML += `
          <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="1" aria-label="Primera">
              <span aria-hidden="true">&laquo;&laquo;</span>
            </a>
          </li>
        `;
        
        // Agregar botón para ir a la página anterior
        paginacion.innerHTML += `
          <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${paginaActual - 1}" aria-label="Anterior">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        `;
        
        // Determinar el rango de páginas a mostrar
        let startPage = Math.max(1, paginaActual - 2);
        let endPage = Math.min(totalPaginas, startPage + 4);
        
        // Ajustar si estamos cerca del final
        if (endPage - startPage < 4) {
          startPage = Math.max(1, endPage - 4);
        }
        
        // Agregar botones para cada página en el rango
        for (let i = startPage; i <= endPage; i++) {
          paginacion.innerHTML += `
            <li class="page-item ${i === paginaActual ? 'active' : ''}">
              <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
          `;
        }
        
        // Agregar botón para ir a la página siguiente
        paginacion.innerHTML += `
          <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${paginaActual + 1}" aria-label="Siguiente">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        `;
        
        // Agregar botón para ir a la última página
        paginacion.innerHTML += `
          <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${totalPaginas}" aria-label="Última">
              <span aria-hidden="true">&raquo;&raquo;</span>
            </a>
          </li>
        `;
        
        // Agregar eventos a los botones de paginación
        document.querySelectorAll('#paginacion .page-link').forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            mostrarPagina(page);
          });
        });
      }
      
      // Función para filtrar etiquetas
      function filtrarEtiquetas(texto) {
        if (!texto || texto.trim() === '') {
          etiquetasFiltradas = [...etiquetasOriginales];
        } else {
          texto = texto.toLowerCase().trim();
          etiquetasFiltradas = etiquetasOriginales.filter(etiqueta => 
            (etiqueta.nombre && etiqueta.nombre.toLowerCase().includes(texto)) ||
            (etiqueta.descripcion && etiqueta.descripcion.toLowerCase().includes(texto)) ||
            (etiqueta.activo && 'activo'.includes(texto)) ||
            (!etiqueta.activo && 'inactivo'.includes(texto))
          );
        }
        
        totalEtiquetas = etiquetasFiltradas.length;
        actualizarPaginacion();
        mostrarPagina(1);  // Volver a la primera página después de filtrar
      }
      
      // Función para abrir el modal de creación
      function abrirModalCrear() {
        document.getElementById('formEtiqueta').reset();
        document.getElementById('etiquetaId').value = '';
        document.getElementById('accionEtiqueta').value = 'crear';
        document.getElementById('nombreOriginal').value = '';
        document.getElementById('tituloModalEtiqueta').textContent = 'Crear Etiqueta';
        document.getElementById('selectedColor').style.backgroundColor = '#ccc';
        
        // Quitar validaciones anteriores
        document.getElementById('formEtiqueta').classList.remove('was-validated');
        
        const modal = new bootstrap.Modal(document.getElementById('modalEtiqueta'));
        modal.show();
      }
      
      // Función para abrir el modal de edición
      function abrirModalEditar(id, nombre, descripcion, color) {
        document.getElementById('formEtiqueta').reset();
        document.getElementById('etiquetaId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('descripcion').value = descripcion;
        document.getElementById('selectedColor').style.backgroundColor = color;
        document.getElementById('accionEtiqueta').value = 'editar';
        document.getElementById('nombreOriginal').value = nombre;
        document.getElementById('tituloModalEtiqueta').textContent = 'Editar Etiqueta';
        
        // Quitar validaciones anteriores
        document.getElementById('formEtiqueta').classList.remove('was-validated');
        
        const modal = new bootstrap.Modal(document.getElementById('modalEtiqueta'));
        modal.show();
      }
      
      // Función para cambiar el estado de una etiqueta
      function cambiarEstadoEtiqueta(nombre, activo) {
        google.script.run
          .withSuccessHandler(function(response) {
            if (response.success) {
              const modalExito = new bootstrap.Modal(
                document.getElementById(
                  activo ? 'modalEtiquetaActualizada' : 'modalEtiquetaDesactiva'
                )
              );
              modalExito.show();
              
              // Cerrar después de 1 segundo
              setTimeout(function() {
                modalExito.hide();
                cargarEtiquetas();
              }, 1000);
            } else {
              mostrarError(response.error || 'Error al cambiar el estado de la etiqueta');
            }
          })
          .withFailureHandler(function(error) {
            mostrarError(error);
          })
          .cambiarEstadoEtiqueta(nombre, activo);
      }
      
      // Función para mostrar confirmación al cancelar
      function confirmarSalida() {
        const form = document.getElementById('formEtiqueta');
        // Verificar si se ingresaron datos
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        
        if (nombre || descripcion) {
          // Si hay datos, mostrar confirmación
          const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacionGuardado'));
          modalConfirmacion.show();
          
          // Configurar evento para el botón de confirmación
          document.getElementById('btnConfirmarSalida').onclick = function() {
            const modalEtiqueta = bootstrap.Modal.getInstance(document.getElementById('modalEtiqueta'));
            modalEtiqueta.hide();
            modalConfirmacion.hide();
          };
        } else {
          // Si no hay datos, cerrar directamente
          const modalEtiqueta = bootstrap.Modal.getInstance(document.getElementById('modalEtiqueta'));
          modalEtiqueta.hide();
        }
      }
      
      // Cuando el documento está listo
      document.addEventListener('DOMContentLoaded', function() {
        // Cargar las etiquetas al inicio
        cargarEtiquetas();
        
        // Evento para el botón de crear etiqueta
        document.getElementById('btnCrearEtiqueta').addEventListener('click', abrirModalCrear);
        
        // Evento para el botón de cancelar en el formulario
        document.getElementById('btnCancelarEtiqueta').addEventListener('click', confirmarSalida);
        
        // Eventos para la búsqueda
        document.getElementById('busquedaGeneral').addEventListener('input', function() {
          filtrarEtiquetas(this.value);
        });
        
        // Evento para cambiar registros por página
        document.getElementById('registrosPorPagina').addEventListener('change', function() {
          registrosPorPagina = parseInt(this.value);
          actualizarPaginacion();
          mostrarPagina(1);  // Volver a la primera página
        });
        
        // Configurar evento para envío del formulario
        document.getElementById('formEtiqueta').addEventListener('submit', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const form = this;
          form.classList.add('was-validated');
          
          // Validar manualmente el color
          const colorSelected = document.getElementById('selectedColor').style.backgroundColor;
          if (colorSelected === 'rgb(204, 204, 204)') {
            document.getElementById('colorFeedback').classList.remove('d-none');
            document.getElementById('colorCheck').classList.add('d-none');
            return;
          } else {
            document.getElementById('colorFeedback').classList.add('d-none');
            document.getElementById('colorCheck').classList.remove('d-none');
          }
          
          if (form.checkValidity()) {
            const id = document.getElementById('etiquetaId').value;
            const nombre = document.getElementById('nombre').value;
            const descripcion = document.getElementById('descripcion').value;
            const color = document.getElementById('selectedColor').style.backgroundColor;
            const accion = document.getElementById('accionEtiqueta').value;
            
            const etiqueta = {
              id: id,
              nombre: nombre,
              descripcion: descripcion,
              color: color
            };
            
            // Deshabilitar el botón de guardar mientras se procesa
            document.getElementById('btnGuardarEtiqueta').disabled = true;
            
            if (accion === 'crear') {
              google.script.run
                .withSuccessHandler(manejarRespuestaGuardar)
                .withFailureHandler(manejarErrorGuardar)
                .guardarEtiqueta(etiqueta);
            } else {
              google.script.run
                .withSuccessHandler(manejarRespuestaActualizar)
                .withFailureHandler(manejarErrorGuardar)
                .actualizarEtiqueta(etiqueta);
            }
          }
        });
        
        // Configurar evento para los botones de color
        document.getElementById('colorHitbox').addEventListener('click', function() {
          document.getElementById('colorOptions').classList.toggle('show');
        });
        
        // Cerrar el selector de color cuando se hace clic fuera
        window.addEventListener('click', function(e) {
          if (!e.target.closest('#colorHitbox') && !e.target.closest('#colorOptions')) {
            document.getElementById('colorOptions').classList.remove('show');
          }
        });
        
        // Eventos para seleccionar un color
        document.querySelectorAll('#colorOptions .color-bubble').forEach(bubble => {
          bubble.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            document.getElementById('selectedColor').style.backgroundColor = color;
            document.getElementById('colorOptions').classList.remove('show');
            
            // Validar el color
            document.getElementById('colorFeedback').classList.add('d-none');
            document.getElementById('colorCheck').classList.remove('d-none');
          });
        });
      });
      
      // Función para manejar la respuesta exitosa al guardar
      function manejarRespuestaGuardar(response) {
        // Rehabilitar el botón de guardar
        document.getElementById('btnGuardarEtiqueta').disabled = false;
        
        if (response.success) {
          // Cerrar el modal de etiqueta
          const modalEtiqueta = bootstrap.Modal.getInstance(document.getElementById('modalEtiqueta'));
          modalEtiqueta.hide();
          
          // Mostrar modal de éxito
          const modalExito = new bootstrap.Modal(document.getElementById('modalEtiquetaGuardada'));
          modalExito.show();
          
          // Cerrar después de 1 segundo
          setTimeout(function() {
            modalExito.hide();
            cargarEtiquetas();
          }, 1000);
        } else {
          // Mostrar error en el formulario
          if (response.error === 'Ya existe una etiqueta con este nombre') {
            document.getElementById('nombre').setCustomValidity('Duplicado');
            document.getElementById('feedbackNombre').textContent = response.error;
            document.getElementById('formEtiqueta').classList.add('was-validated');
          } else {
            mostrarError(response.error || 'Error al guardar la etiqueta');
          }
        }
      }
      
      // Función para manejar la respuesta exitosa al actualizar
      function manejarRespuestaActualizar(response) {
        // Rehabilitar el botón de guardar
        document.getElementById('btnGuardarEtiqueta').disabled = false;
        
        if (response.success) {
          // Cerrar el modal de etiqueta
          const modalEtiqueta = bootstrap.Modal.getInstance(document.getElementById('modalEtiqueta'));
          modalEtiqueta.hide();
          
          // Mostrar modal de éxito
          const modalExito = new bootstrap.Modal(document.getElementById('modalEtiquetaActualizada'));
          modalExito.show();
          
          // Cerrar después de 1 segundo
          setTimeout(function() {
            modalExito.hide();
            cargarEtiquetas();
          }, 1000);
        } else {
          // Mostrar error en el formulario
          if (response.error === 'Ya existe una etiqueta con este nombre') {
            document.getElementById('nombre').setCustomValidity('Duplicado');
            document.getElementById('feedbackNombre').textContent = response.error;
            document.getElementById('formEtiqueta').classList.add('was-validated');
          } else {
            mostrarError(response.error || 'Error al actualizar la etiqueta');
          }
        }
      }
      
      // Función para manejar errores al guardar o actualizar
      function manejarErrorGuardar(error) {
        // Rehabilitar el botón de guardar
        document.getElementById('btnGuardarEtiqueta').disabled = false;
        mostrarError(error);
      }    
</script>
