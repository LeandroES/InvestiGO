
  //Scripts - Carlos
  
  // Función para actualizar el texto del botón Finalizar
  function actualizarBotonFinalizar() {
  const etiquetasSeleccionadas = document.querySelectorAll('.form-check.selected');
  const btnFinalizar = document.getElementById('btnFinalizar');
  
  if (etiquetasSeleccionadas.length > 0) {
    btnFinalizar.textContent = 'Etiquetar y finalizar';
  } else {
    btnFinalizar.textContent = 'Omitir y finalizar';
  }
  }
  
  // Inicializar el texto del botón al cargar
  document.addEventListener('DOMContentLoaded', function() {
  actualizarBotonFinalizar();
  });
  
  // Funcionalidad para seleccionar etiquetas al hacer clic en toda la caja
  document.querySelectorAll('.form-check').forEach(etiqueta => {
  etiqueta.addEventListener('click', function() {
    this.classList.toggle('selected');
    actualizarBotonFinalizar(); // Actualizar texto del botón
  });
  });
  
  // Funcionalidad para el botón "Crear nueva etiqueta"
  document.getElementById('btnNuevaEtiqueta').addEventListener('click', function() {
  // Ocultar el modal actual
  const modalEtiquetas = bootstrap.Modal.getInstance(document.getElementById('modalEtiquetas'));
  modalEtiquetas.hide();
  
  // Mostrar el modal para crear nueva etiqueta
  const modalNuevaEtiqueta = new bootstrap.Modal(document.getElementById('modalNuevaEtiqueta'));
  modalNuevaEtiqueta.show();
  });
  
  // Funcionalidad para el botón "Guardar" en el modal de nueva etiqueta
  document.getElementById('btnGuardarEtiqueta').addEventListener('click', function() {
  const nombreEtiqueta = document.getElementById('nombreEtiqueta').value.trim();
  const colorEtiqueta = document.getElementById('colorEtiqueta').value;
  
  if (nombreEtiqueta) {
    // Crear nueva etiqueta
    const checkboxColumns = document.querySelector('.checkbox-columns');
    const nuevoId = 'etiqueta' + (document.querySelectorAll('.form-check').length + 1);
    
    const nuevoElemento = document.createElement('div');
    nuevoElemento.className = 'form-check selected';
    nuevoElemento.setAttribute('data-id', nuevoId);
    nuevoElemento.innerHTML = `
        <label class="form-check-label" for="${nuevoId}">
            <span class="tag-button" style="background-color: ${colorEtiqueta};"></span>
            ${nombreEtiqueta}
        </label>
    `;
    
    checkboxColumns.appendChild(nuevoElemento);
    
    // Agregar evento de clic a la nueva etiqueta
    nuevoElemento.addEventListener('click', function() {
        this.classList.toggle('selected');
        actualizarBotonFinalizar(); // Actualizar texto del botón
    });
    
    // Cerrar el modal de nueva etiqueta
    const modalNuevaEtiqueta = bootstrap.Modal.getInstance(document.getElementById('modalNuevaEtiqueta'));
    modalNuevaEtiqueta.hide();
    
    // Limpiar los campos
    document.getElementById('nombreEtiqueta').value = '';
    
    // Volver a mostrar el modal de etiquetas
    const modalEtiquetas = new bootstrap.Modal(document.getElementById('modalEtiquetas'));
    modalEtiquetas.show();
    
    // Actualizar el botón ya que la nueva etiqueta viene seleccionada
    actualizarBotonFinalizar();
  }
  });
  
  // Funcionalidad para el buscador de etiquetas
  document.getElementById('searchEtiquetas').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const etiquetas = document.querySelectorAll('#etiquetasContainer .form-check');
  let visibleCount = 0;
  
  etiquetas.forEach(function(etiqueta) {
    const label = etiqueta.querySelector('label').textContent.trim().toLowerCase();
    if (label.includes(searchTerm)) {
        etiqueta.style.display = '';
        visibleCount++;
    } else {
        etiqueta.style.display = 'none';
    }
  });
  
  // Mostrar mensaje cuando no hay resultados
  document.getElementById('noResults').style.display = visibleCount === 0 ? 'block' : 'none';
  });
  
  //Scripts- Abel
  
  // Inicialización de variables
    let plantillas = {};
  
  // Función para cargar las plantillas desde el servidor
  function cargarPlantillas() {
    google.script.run.withSuccessHandler(function(resultado) {
    plantillas = resultado;
  // Asegurar que cada plantilla tenga un array de instancias
    Object.keys(plantillas).forEach(key => {
        if (!plantillas[key].instancias) {
          plantillas[key].instancias = [];
        }
    });
    renderizarPlantillas();
    inicializarModales();
  }).self_obtenerPlantillas();
  }
  
  //Boton de VerMás
  function inicializarModales() {
          console.log('=== INICIO inicializarModales ===');
          console.log('Estado del DOM:', document.readyState);
          
          const verMasLinks = document.querySelectorAll('.ver-mas');
          console.log('Links "Ver más" encontrados:', verMasLinks.length);
          
          const verEtiquetasModal = document.getElementById('verEtiquetasModal');
          console.log('Modal de etiquetas encontrado:', !!verEtiquetasModal);
          
          const etiquetasModalBody = document.querySelector('#verEtiquetasModal .modal-body');
          console.log('Cuerpo del modal encontrado:', !!etiquetasModalBody);
          
          if (verMasLinks.length > 0 && verEtiquetasModal && etiquetasModalBody) {
            console.log('Inicializando modal...');
            const modal = new bootstrap.Modal(verEtiquetasModal);
            
            verMasLinks.forEach((link, index) => {
              console.log(`Configurando evento para link ${index}`);
              link.addEventListener('click', function() {
                console.log('Click en ver más detectado');
                const fila = this.closest('tr');
                if (!fila) {
                  console.error('No se encontró la fila');
                  return;
                }
                
                const nombrePlantilla = fila.querySelector('td:first-child').textContent.trim();
                console.log('Nombre de la plantilla:', nombrePlantilla);
                
                console.log('Mostrando modal...');
                modal.show();
                
                etiquetasModalBody.innerHTML = '';
                const loadingMessage = document.createElement('div');
                loadingMessage.className = 'empty-message';
                loadingMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando etiquetas...';
                etiquetasModalBody.appendChild(loadingMessage);
                
                console.log('Llamando a obtenerEtiquetas...');
                google.script.run
                  .withSuccessHandler(function(etiquetasResult) {
                    console.log('Etiquetas recibidas:', etiquetasResult);
                    
                    const etiquetas = etiquetasResult.etiquetas;
                    console.log('Etiquetas disponibles:', etiquetas);
                    
                    const plantilla = Object.values(plantillas).find(p => p.nombre === nombrePlantilla);
                    console.log('Plantilla encontrada:', plantilla);
                    
                    if (plantilla && plantilla.idEtiqueta && plantilla.idEtiqueta.length > 0) {
                      console.log('Etiquetas de la plantilla:', plantilla.idEtiqueta);
                      
                      etiquetasModalBody.innerHTML = `
                        <div class="search-container">
                          <i class="bi bi-search"></i>
                          <input type="text" id="searchEtiquetas" class="form-control search-input" placeholder="Buscar etiquetas...">
                        </div>
                        <div class="etiquetas-container">
                          <div class="etiquetas-vermas-lista columnas-2" id="etiquetasContainer"></div>
                          <div id="noResults" class="no-results" style="display: none;">No se encontraron etiquetas que coincidan con la búsqueda</div>
                          <div id="emptyTags" class="empty-message" style="display: none;">Esta plantilla no tiene etiquetas asignadas</div>
                        </div>
                      `;
                      
                      // Buscar el contenedor de etiquetas dentro del modal visible
                      const modalVisible = document.querySelector('.modal.show, .modal.fade.show');
                      let etiquetasContainer = null;
                      if (modalVisible) {
                          etiquetasContainer = modalVisible.querySelector('#etiquetasContainer');
                      }
                      console.log('etiquetasContainer:', etiquetasContainer, 'parent:', etiquetasContainer?.parentElement, 'is visible:', !!(etiquetasContainer && etiquetasContainer.offsetParent !== null));

                      if (!etiquetasContainer) {
                          if (modalVisible) {
                              modalVisible.querySelector('.modal-body').innerHTML += '<div style="color:red;">Error: No se encontró el contenedor de etiquetas</div>';
                          }
                          console.error('No se encontró el contenedor de etiquetas dentro del modal visible');
                          return;
                      }

                      // Limpiar el contenedor antes de agregar
                      etiquetasContainer.innerHTML = '';
                      
                      let count = 0;
                      plantilla.idEtiqueta.forEach(etiquetaNombre => {
                        console.log('Procesando etiqueta:', etiquetaNombre);
                        const etiquetaInfo = etiquetas.find(e => 
                          e.nombre.toLowerCase() === etiquetaNombre.toLowerCase()
                        );
                        console.log('Información de la etiqueta:', etiquetaInfo);
                        
                          const formCheck = document.createElement('div');
                          formCheck.className = 'form-check';
                          
                          const label = document.createElement('label');
                          label.className = 'form-check-label';
                          label.style.cssText = 'cursor: pointer; display: block; width: 100%;';
                          
                          const tagButton = document.createElement('span');
                          tagButton.className = 'tag-button';
                          tagButton.style.cssText = `
                            position: relative;
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            border: 2px solid #ffffff;
                            box-shadow: 0 0 5px rgba(0,0,0,0.2);
                            transition: all 0.2s;
                            margin-right: 8px;
                            vertical-align: middle;
                            background-color: ${etiquetaInfo ? etiquetaInfo.color : '#dc3545'};
                          `;
                          
                          label.appendChild(tagButton);
                          label.appendChild(document.createTextNode(etiquetaNombre));
                          formCheck.appendChild(label);
                          etiquetasContainer.appendChild(formCheck);
                          count++;
                          console.log('Etiqueta agregada:', etiquetaNombre);
                      });
                      
                      console.log('Total de etiquetas agregadas:', count, 'Elementos en el DOM:', etiquetasContainer.children.length);
                      
                      // Agregar funcionalidad de búsqueda
                      const searchInput = document.getElementById('searchEtiquetas');
                      const noResults = document.getElementById('noResults');
                      
                      searchInput.addEventListener('input', function() {
                        const searchTerm = this.value.toLowerCase();
                        const formChecks = etiquetasContainer.querySelectorAll('.form-check');
                        let visibleCount = 0;
                        
                        formChecks.forEach(check => {
                          const text = check.textContent.toLowerCase();
                          check.style.display = text.includes(searchTerm) ? 'block' : 'none';
                          if (text.includes(searchTerm)) visibleCount++;
                        });
                        
                        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
                      });
                    } else {
                      console.log('No hay etiquetas para mostrar');
                      etiquetasModalBody.innerHTML = '<div class="empty-message">Esta plantilla no tiene etiquetas asignadas</div>';
                    }
                  })
                  .withFailureHandler(function(error) {
                    console.error('Error al obtener las etiquetas:', error);
                    etiquetasModalBody.innerHTML = '<div class="empty-message" style="color: red;">Error al cargar las etiquetas</div>';
                  })
                  .self_obtenerEtiquetas();
              });
            });
          } else {
            console.error('No se encontraron los elementos necesarios para el modal de etiquetas:', {
              verMasLinks: verMasLinks.length,
              verEtiquetasModal: !!verEtiquetasModal,
              etiquetasModalBody: !!etiquetasModalBody
            });
          }
          console.log('=== FIN inicializarModales ===');
        }
  
  
       // Función para renderizar las plantillas en la tabla
        function renderizarPlantillas() {
          console.log('=== INICIO renderizarPlantillas ===');
          
          // Obtener las etiquetas con sus colores
          google.script.run
            .withSuccessHandler(function(resultado) {
                  console.log('Etiquetas recibidas del servidor:', resultado);
              const etiquetasConColores = resultado.etiquetas;
              
                  // Convertir el objeto plantillas en un array para Bootstrap Table
                  const datosTabla = Object.values(plantillas).map(plantilla => {
                      return {
                          id: plantilla.id,
                          nombre: plantilla.nombre,
                          tipo: plantilla.tipo,
                          etiquetas: plantilla.idEtiqueta || [],
                          usos: plantilla.nroInstancias || 0,
                          fecha: plantilla.fechaDeCreacion,
                          estado: plantilla.estado
                      };
                  });
                  
                  // Inicializar la tabla si no está inicializada
                  if (!$('#table').data('bootstrap.table')) {
                      $('#table').bootstrapTable({
                          pagination: true,
                          pageSize: 10,
                          pageList: [10, 25, 50, 100, 'all'],
                          search: false,
                          showColumns: false,
                          showRefresh: false,
                          showToggle: false,
                          showFullscreen: false,
                          showColumnsToggleAll: false,
                          maintainMetaData: true,
                          rememberOrder: true,
                          sidePagination: 'client',
                          sortName: 'nombre',
                          sortOrder: 'asc',
                          formatShowingRows: function(pageFrom, pageTo, totalRows) {
                              return `Mostrando ${pageFrom} a ${pageTo} de ${totalRows} filas`;
                          },
                          formatRecordsPerPage: function(pageNumber) {
                              return `${pageNumber} filas por página`;
                          },
                          formatNoMatches: function() {
                              return 'No se encontraron resultados';
                          },
                          formatSearch: function() {
                              return 'Buscar';
                          },
                          formatLoadingMessage: function() {
                              return 'Cargando...';
                          },
                          formatPaginationSwitch: function() {
                              return 'Ocultar/Mostrar paginación';
                          },
                          formatRefresh: function() {
                              return 'Actualizar';
                          },
                          formatToggle: function() {
                              return 'Cambiar vista';
                          },
                          formatColumns: function() {
                              return 'Columnas';
                          },
                          formatAllRows: function() {
                              return 'Todo';
                          },
                          columns: [{
                              field: 'nombre',
                              title: 'Nombre',
                              sortable: true,
                              width: '40%'
                          }, {
                              field: 'tipo',
                              title: 'Tipo',
                              sortable: true,
                              halign: 'center',
                              align: 'center',
                              width: '10%',
                              formatter: function(value) {
                                  if (value === 'sheets') {
                                      return '<div class="icon-google-sheets" style="display: inline-block; width: 18px; height: 24px;"></div>';
                                  } else if (value === 'docs') {
                                      return '<div class="icon-google-docs" style="display: inline-block; width: 18px; height: 24px;"></div>';
                                  }
                                  return value;
                              }
                          }, {
                              field: 'etiquetas',
                              title: 'Etiquetas',
                              sortable: true,
                              halign: 'center',
                              width: '25%',
                              formatter: function(value) {
                                  let html = '';
                                  for (let i = 0; i < Math.min(2, value.length); i++) {
                                      const etiquetaInfo = etiquetasConColores.find(e => e.nombre === value[i]);
                                      const color = etiquetaInfo ? etiquetaInfo.color : '#6c757d';
                                      html += `<span class="badge custom-badge" style="background-color: ${color}; color: #fff;">${value[i]}</span> `;
                                  }
                                  if (value.length > 2) {
                                      html += '<a href="#" class="ver-mas" data-bs-toggle="modal" data-bs-target="#verEtiquetasModal">...</a>';
                                  }
                                  return html;
                              }
                          }, {
                              field: 'usos',
                              title: 'Instancias',
                              sortable: true,
                              halign: 'center',
                              align: 'center',
                              width: '10%',
                              formatter: function(value, row) {
                                  return `<div class="d-flex justify-content-center">
                                      <button class="btn btn-sm btn-detalles d-flex align-items-center gap-1"
                                          onclick="mostrarDetalles('${value}', '${row.nombre.replace(/'/g, "\\'")}')"
                                          data-bs-toggle="modal" data-bs-target="#detallesModal">
                                          <span class="uso-count">${value}</span>
                                          <i class="fas fa-info-circle"></i>
                                      </button>
                                  </div>`;
                              }
                          }, {
                              field: 'fecha',
                              title: 'Fecha',
                              sortable: true,
                              halign: 'center',
                              align: 'center',
                              width: '10%',
                              formatter: function(value) {
                                  const fecha = new Date(value);
                const horas = fecha.getHours().toString().padStart(2, '0');
                const minutos = fecha.getMinutes().toString().padStart(2, '0');
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = fecha.toLocaleString('es', { month: 'short' });
                const año = fecha.getFullYear();
                                  return `${horas}:${minutos} - ${dia} ${mes} ${año}`;
                              }
                          }, {
                              field: 'operate',
                              title: 'Editar',
                              width: '2%',
                              formatter: function(value, row) {
                                  return `<div class="d-flex justify-content-center">
                                      <i class="fas fa-edit pencil-icon" data-bs-toggle="modal" data-bs-target="#editarPlantillaModal" data-id="${row.id}"></i>
                                  </div>`;
                              }
                          }, {
                              field: 'estado',
                              title: 'Estado',
                              halign: 'center',
                              align: 'center',
                              width: '3%',
                              formatter: function(value, row) {
                                  return `<div class="d-flex justify-content-center">
                                      <div class="form-check form-switch me-2">
                                          <input class="form-check-input" type="checkbox" id="estadoSwitch${row.id}" data-id="${row.id}" ${value ? 'checked' : ''}>
                                      </div>
                                  </div>`;
                              }
                          }]
                      });
                  }
                  
                  // Cargar los datos en la tabla
                  $('#table').bootstrapTable('load', datosTabla);
              
              // Inicializar los modales después de renderizar
              inicializarModales();
                  
                  console.log('=== FIN renderizarPlantillas ===');
            })
            .self_obtenerEtiquetas();
        }
  
  // Función para manejar cambios de estado
  function cambiarEstado(element) {
          const id = element.getAttribute('data-id');
          const nuevoEstado = element.checked;
          
          // Llamar a la función del servidor para actualizar el estado
          google.script.run
            .withSuccessHandler(function(resultado) {
              console.log('cambiarEstadoPlantillaBD\t' + resultado.status + '\t' + JSON.stringify(resultado));
              // Actualizar el estado en el objeto plantillas
              if (plantillas[id]) {
                plantillas[id].estado = nuevoEstado;
              }
            })
            .cambiarEstadoPlantilla(id, nuevoEstado);
  }
  
  // Función para buscar plantillas solo por nombre
  function buscarPlantillas() {
      try {
          const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
          const datosOriginales = Object.values(plantillas);

          let datosAMostrar = datosOriginales;
          if (searchTerm !== '') {
              datosAMostrar = datosOriginales.filter(plantilla => {
                  const nombre = plantilla.nombre ? plantilla.nombre.toLowerCase() : '';
                  return nombre.includes(searchTerm);
              });
          }

          $('#table').bootstrapTable('load', datosAMostrar);

          // Siempre volver a la página 1 después de cargar los datos
          setTimeout(() => {
              $('#table').bootstrapTable('selectPage', 1);
          }, 100);

      } catch (error) {
          console.error('Error en la búsqueda:', error);
          $('#table').bootstrapTable('load', Object.values(plantillas));
      }
    }
  
  // Iniciar la carga de plantillas cuando la página esté lista
  document.addEventListener('DOMContentLoaded', function() {
          cargarPlantillas();
          
      // Añadir evento para buscar en tiempo real
      document.getElementById('searchInput').addEventListener('input', buscarPlantillas);
  });
  
   // Script para validar URLs y manejar interacciones
  document.addEventListener('DOMContentLoaded', function() {
    const enlaceInput = document.getElementById('enlaceInput');
    const btnCargarPlantilla = document.getElementById('btnCargarPlantilla');
    const urlError = document.getElementById('urlError');    
    // Inicializar todos los switches con el color adecuado
    const allSwitches = document.querySelectorAll('.form-check-input');
    allSwitches.forEach(switchEl => {
      // Establecer color rojo por defecto (OFF)
      switchEl.style.backgroundColor = '#dc3545';
      switchEl.style.borderColor = '#dc3545';
                  
      // Agregar evento para cambiar color al cambiar estado
      switchEl.addEventListener('change', function() {
        if (this.checked) {
          this.style.backgroundColor = '#198754';
          this.style.borderColor = '#198754';
        } else {
          this.style.backgroundColor = '#dc3545';
          this.style.borderColor = '#dc3545';
        }
      });
    });           
    
    function esUrlValida(url) {
    try {
      const patterns = [
        /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[^/]+\/edit(\?[^#]*)?(#.*)?$/,
        /^https:\/\/docs\.google\.com\/document\/d\/[^/]+\/edit(\?[^#]*)?(#.*)?$/,
        /^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/view(\?[^#]*)?(#.*)?$/,
        /^https:\/\/drive\.google\.com\/open\?id=[^&]+(&[^#]*)?(#.*)?$/
      ];
      return patterns.some(pattern => pattern.test(url));
    } catch (error) {
      console.error('Error en esUrlValida:', error);
      return false;
    }
    }           
    // Verifica el estado del botón cuando se abre el modal
    const cargarPlantillaModal = document.getElementById('cargarPlantillaModal');
    cargarPlantillaModal.addEventListener('shown.bs.modal', function() {
      validateInput();
      enlaceInput.focus();
    });
              
    function validateInput() {
      const value = enlaceInput.value.trim();
                  
      if (!value) {
          btnCargarPlantilla.disabled = true;
          urlError.style.display = 'none';
          return;
      }
                  
      if (esUrlValida(value)) {
          btnCargarPlantilla.disabled = false;
          urlError.style.display = 'none';
      } else {
          btnCargarPlantilla.disabled = true;
          urlError.style.display = 'block';
      }
    }
  // Escucha eventos de entrada en el campo de texto
    enlaceInput.addEventListener('input', validateInput);
              
    // Resetea el campo cuando se cierra el modal
    cargarPlantillaModal.addEventListener('hidden.bs.modal', function() {
      enlaceInput.value = '';
      btnCargarPlantilla.disabled = true;
      urlError.style.display = 'none';
    });
    // Implementación de la funcionalidad de búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
              
    function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      // Implementar la lógica de búsqueda aquí
      console.log('Buscando:', searchTerm);
                  
      // Ejemplo básico de filtrado de tabla (puede adaptarse según necesidades)
      const table = document.getElementById('table');
      const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                  
      for (let i = 0; i < rows.length; i++) {
        const rowText = rows[i].textContent.toLowerCase();
        if (searchTerm === '' || rowText.includes(searchTerm)) {
          rows[i].style.display = '';
        } else {
          rows[i].style.display = 'none';
        }
      }
    }
              
    // Eventos para la búsqueda
    searchButton.addEventListener('click', performSearch);
              
    searchInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        performSearch();
      }
    });
  
    // Implementación de "Ver más" para etiquetas
    function inicializarModalEtiquetas() {
      console.log('Inicializando modal de etiquetas...');
      const verMasLinks = document.querySelectorAll('.ver-mas');
      const verEtiquetasModal = document.getElementById('verEtiquetasModal');
      const etiquetasModalBody = document.getElementById('etiquetasModalBody');
                  
      console.log('Elementos encontrados:', {
        verMasLinks: verMasLinks.length,
        verEtiquetasModal: !!verEtiquetasModal,
        etiquetasModalBody: !!etiquetasModalBody
      });
                  
      if (verMasLinks.length > 0 && verEtiquetasModal && etiquetasModalBody) {
        console.log('Inicializando modal...');
        const modal = new bootstrap.Modal(verEtiquetasModal);
              
      verMasLinks.forEach((link, index) => {
          console.log(`Configurando evento para link ${index}`);
      link.addEventListener('click', function() {
          console.log('Click en ver más detectado');
          const fila = this.closest('tr');
          if (!fila) {
            console.error('No se encontró la fila');
            return;
          }
          
          const nombrePlantilla = fila.querySelector('td:first-child').textContent.trim();
          console.log('Nombre de la plantilla:', nombrePlantilla); 
          // Limpiar el contenido previo del modal
      etiquetasModalBody.innerHTML = '';
      
      // Mostrar el modal inmediatamente
      console.log('Mostrando modal...');
      modal.show();
      // Mostrar mensaje de carga
      const loadingMessage = document.createElement('div');
      loadingMessage.style.cssText = `
                                  text-align: center;
                                  padding: 20px;
                                  color: #666;
                              `;
                              loadingMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando etiquetas...';
                              etiquetasModalBody.appendChild(loadingMessage);
                              
                              console.log('Llamando a obtenerPlantillas...');
                              google.script.run
                                  .withSuccessHandler(function(plantillas) {
                                      console.log('Respuesta del servidor:', plantillas);
                                      
                                      if (!plantillas) {
                                          console.error('No se recibió respuesta del servidor');
                                          return;
                                      }
                                      
                                      // Buscar la plantilla específica por nombre
                                      const plantilla = Object.values(plantillas).find(p => p.nombre === nombrePlantilla);
                                      
                                      if (!plantilla) {
                                          console.error('No se encontró la plantilla:', nombrePlantilla);
                                          return;
                                      }
                                      
                                      // Limpiar el mensaje de carga
                                      etiquetasModalBody.innerHTML = '';
                                      
                                      if (plantilla.idEtiqueta && plantilla.idEtiqueta.length > 0) {
                                          console.log('Etiquetas encontradas:', plantilla.idEtiqueta);
                                          // Colores predefinidos para las etiquetas
                                          const colores = [
                                              '#ff5733', '#33b5ff', '#5bff33', '#ff33f5', '#33fff5', '#ffc233',
                                              '#9d33ff', '#3341ff', '#ff3352', '#33ffab', '#ff8c33', '#33b0ff'
                                          ];
                                          
                                          const container = document.createElement('div');
                                          container.style.cssText = `
                                              display: flex;
                                              flex-wrap: wrap;
                                              gap: 10px;
                                              padding: 10px;
                                          `;
                                          
                                          plantilla.idEtiqueta.forEach((etiqueta, index) => {
                                              const tagItem = document.createElement('div');
                                              tagItem.className = 'tag-item';
                                              tagItem.style.backgroundColor = colores[index % colores.length];
                                              
                                              const tagLabel = document.createElement('span');
                                              tagLabel.className = 'tag-label';
                                              tagLabel.textContent = etiqueta;
                                              tagLabel.style.color = '#fff';
                                              
                                              tagItem.appendChild(tagLabel);
                                              container.appendChild(tagItem);
                                          });
                                          
                                          etiquetasModalBody.appendChild(container);
                  } else {
                                          console.log('No hay etiquetas para mostrar');
                                          const emptyMessage = document.createElement('div');
                                          emptyMessage.style.cssText = `
                                              text-align: center;
                                              padding: 20px;
                                              color: #666;
                                          `;
                                          emptyMessage.textContent = 'Esta plantilla no tiene etiquetas asignadas';
                                          etiquetasModalBody.appendChild(emptyMessage);
                                      }
                                  })
                                  .withFailureHandler(function(error) {
                                      console.error('Error al obtener las etiquetas:', error);
                                      etiquetasModalBody.innerHTML = '';
                                      const errorMessage = document.createElement('div');
                                      errorMessage.style.cssText = `
                                          text-align: center;
                                          padding: 20px;
                                          color: red;
                                      `;
                                      errorMessage.textContent = 'Error al cargar las etiquetas';
                                      etiquetasModalBody.appendChild(errorMessage);
                                  })
                                  .self_obtenerPlantillas();
                          });
                      });
                  } else {
                      console.error('No se encontraron los elementos necesarios para el modal de etiquetas:', {
                          verMasLinks: verMasLinks.length,
                          verEtiquetasModal: !!verEtiquetasModal,
                          etiquetasModalBody: !!etiquetasModalBody
                      });
                  }
              }
  
              // Esperar a que el DOM esté completamente cargado
              if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', inicializarModalEtiquetas);
              } else {
                  inicializarModalEtiquetas();
              }
    });
              
        function generarColorHexAleatorio() {
          const colores = [
            '#ff5733', '#33b5ff', '#5bff33', '#ff33f5', '#33fff5', '#ffc233',
            '#9d33ff', '#3341ff', '#ff3352', '#33ffab', '#ff8c33', '#33b0ff'
          ];
          return colores[Math.floor(Math.random() * colores.length)];
        }
  
        document.addEventListener('DOMContentLoaded', function() {
          document.querySelectorAll('.custom-badge').forEach(function(badge) {
            const color = generarColorHexAleatorio();
            badge.style.backgroundColor = color;
            badge.style.color = '#fff';
          });
        });
  
              // Función para manejar la edición de plantillas
          document.addEventListener('DOMContentLoaded', function() {
              // Referenciar el modal de edición
              const editarPlantillaModal = document.getElementById('editarPlantillaModal');
              const nombrePlantillaInput = document.getElementById('nombrePlantilla');
              
              // Crear el elemento para los mensajes de error si no existe
              let errorMensaje = document.querySelector('.error-mensaje');
              if (!errorMensaje) {
                  errorMensaje = document.createElement('div');
                  errorMensaje.className = 'error-mensaje text-danger mt-1';
                  errorMensaje.style.display = 'none';
                  nombrePlantillaInput.parentNode.appendChild(errorMensaje);
              }
              
              // Variable para almacenar la fila actual que se está editando
              let filaActual = null;
              
              // Validación para caracteres especiales
              nombrePlantillaInput.addEventListener('input', function() {
                  const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/;
                  const valor = this.value.trim();
                  
                  if (!regex.test(valor) && valor !== '') {
                      errorMensaje.textContent = "No se admiten caracteres especiales";
                      errorMensaje.style.display = 'block';
                      this.classList.add('is-invalid');
                  } else {
                      errorMensaje.style.display = 'none';
                      this.classList.remove('is-invalid');
                  }
              });
              
              // Importante: Escuchar el evento 'show.bs.modal' que se dispara cuando Bootstrap abre el modal
              editarPlantillaModal.addEventListener('show.bs.modal', function(event) {
              // Obtener el elemento que desencadenó el modal
              const trigger = event.relatedTarget;
              // Obtener la fila que contiene el icono de edición
              filaActual = trigger.closest('tr');
              if (filaActual) {
                  // Obtener el nombre de la plantilla
                  const nombrePlantilla = filaActual.querySelector('td:first-child').textContent.trim();
                  // Obtener todas las etiquetas de la plantilla desde el objeto plantillas
                  const plantilla = Object.values(plantillas).find(p => p.nombre === nombrePlantilla);
                  const etiquetasRow = plantilla ? plantilla.idEtiqueta || [] : [];
                  // Limpiar errores previos
                  errorMensaje.style.display = 'none';
                  nombrePlantillaInput.classList.remove('is-invalid');
                  // Llenar el formulario con el nombre de la plantilla actual
                  nombrePlantillaInput.value = nombrePlantilla;
                  // Actualizar título del modal para indicar qué plantilla se está editando
                  document.getElementById('editarPlantillaModalLabel').textContent = 'Editar Plantilla';
                  // Generar contenedor de etiquetas con estilo mejorado
                  let etiquetasContainer = editarPlantillaModal.querySelector('.form-check-lista.columnas-2');
                  if (!etiquetasContainer) {
                      // Si no existe, créalo y agrégalo
                      const nuevoContenedor = document.createElement('div');
                      nuevoContenedor.className = 'form-check-lista columnas-2';
                      nuevoContenedor.id = 'etiquetasContainer';
                      editarPlantillaModal.querySelector('.etiquetas-container').appendChild(nuevoContenedor);
                      etiquetasContainer = nuevoContenedor;
                  }
                  etiquetasContainer.innerHTML = '';
                  // Obtener las etiquetas del servidor
                  google.script.run
                      .withSuccessHandler(function(resultado) {
                          const etiquetas = resultado.etiquetas;
                          console.log('Etiquetas disponibles para editar:', etiquetas);
                          etiquetas.forEach(etiqueta => {
                              const isSelected = etiquetasRow.includes(etiqueta.nombre);
                              const formCheck = document.createElement('div');
                              formCheck.className = 'form-check' + (isSelected ? ' selected' : '');
                              formCheck.setAttribute('data-id', etiqueta.id);
                              formCheck.innerHTML = `
                                  <label class="form-check-label" for="${etiqueta.id}">
                                      <span class="tag-button" style="background-color: ${etiqueta.color};"></span>
                                      ${etiqueta.nombre}
                                  </label>
                              `;
                              etiquetasContainer.appendChild(formCheck);
                              console.log('Etiqueta agregada (editar):', etiqueta.nombre);
                          });
                          // Permitir seleccionar/deseleccionar etiquetas al hacer clic
                          etiquetasContainer.querySelectorAll('.form-check').forEach(etiqueta => {
                              etiqueta.addEventListener('click', function() {
                                  this.classList.toggle('selected');
                              });
                          });
                          console.log('Total de etiquetas agregadas (editar):', etiquetasContainer.children.length);
                      })
                      .self_obtenerEtiquetas();
              }
          });
              
              // Manejar el botón de añadir etiqueta
              document.getElementById('btnAddTag').addEventListener('click', function() {
                  const editModal = bootstrap.Modal.getInstance(document.getElementById('editarPlantillaModal'));
                  editModal.hide();
                  
                  const tagModal = new bootstrap.Modal(document.getElementById('nuevaEtiquetaModal'));
                  tagModal.show();
              });
  
              // Manejar la adición de una nueva etiqueta
              document.getElementById('btnAgregarEtiqueta').addEventListener('click', function() {
                  const nuevaEtiqueta = document.getElementById('nuevaEtiqueta').value.trim();
                  const colorEtiqueta = document.getElementById('colorEtiqueta').value;
                  
                  if (nuevaEtiqueta) {
                      google.script.run
                          .withSuccessHandler(function(resultado) {
                              console.log('asociarEtiquetasAPlantillaBD\t' + resultado.status + '\t' + JSON.stringify(resultado));
                              // Cerrar el modal actual
                              const tagModal = bootstrap.Modal.getInstance(document.getElementById('nuevaEtiquetaModal'));
                              tagModal.hide();
                              
                              // Limpiar el campo
                              document.getElementById('nuevaEtiqueta').value = '';
                              
                              // Reabrir el modal de edición
                              setTimeout(() => {
                                  const editModal = new bootstrap.Modal(document.getElementById('editarPlantillaModal'));
                                  editModal.show();
                                  
                                  // Recargar los datos
                                  google.script.run
                                      .withSuccessHandler(function(resultado) {
                                          plantillas = resultado;
                                          renderizarPlantillas();
                                      })
                                      .self_obtenerPlantillas();
                              }, 300);
                          })
                          .crearEtiqueta(nuevaEtiqueta, colorEtiqueta);
                  }
              });
  
              // Manejar el guardado de cambios
              document.getElementById('btnGuardarCambios').addEventListener('click', function() {
                  // Verificar si hay errores de validación
                  if (nombrePlantillaInput.classList.contains('is-invalid')) {
                      return; // No permitir guardar si hay errores
                  }
                  
                  // Recopilar datos del formulario
                  const nombrePlantilla = nombrePlantillaInput.value.trim();
                  const etiquetasSeleccionadas = [];
                  
                  // Obtener las etiquetas seleccionadas
                  document.querySelectorAll('#etiquetasContainer .form-check.selected').forEach(etiqueta => {
                    const etiquetaTexto = etiqueta.querySelector('label').textContent.trim();
                    etiquetasSeleccionadas.push(etiquetaTexto);
                  });
                  
                  // Actualizar la información en la tabla (si hay una fila seleccionada)
                  if (filaActual) {
                    const nombreOriginal = filaActual.querySelector('td:first-child').textContent.trim();
                    const plantillaKey = Object.keys(plantillas).find(key => plantillas[key].nombre === nombreOriginal);
                    
                    if (plantillaKey) {
                      // Crear una promesa para manejar todas las operaciones
                      const actualizarPlantilla = new Promise((resolve) => {
                          let operacionesCompletadas = 0;
                          const totalOperaciones = 2; // Nombre y etiquetas
                          
                          // Si el nombre cambió, actualizar el nombre
                          if (nombrePlantilla !== nombreOriginal) {
                              google.script.run
                                  .withSuccessHandler(function(resultado) {
                                      console.log('editarNombrePlantillaBD\t' + resultado.status + '\t' + JSON.stringify(resultado));
                                      plantillas[plantillaKey].nombre = nombrePlantilla;
                                      operacionesCompletadas++;
                                      if (operacionesCompletadas === totalOperaciones) resolve();
                                  })
                                  .editarPlantilla(plantillaKey, nombrePlantilla, plantillas[plantillaKey].tipo);
                          } else {
                              operacionesCompletadas++;
                              if (operacionesCompletadas === totalOperaciones) resolve();
                          }
                          
                          // Si las etiquetas cambiaron, actualizar las etiquetas
                          if (JSON.stringify(plantillas[plantillaKey].idEtiqueta) !== JSON.stringify(etiquetasSeleccionadas)) {
                              google.script.run
                                  .withSuccessHandler(function(resultado) {
                                      console.log('editarEtiquetasPlantillaBD\t' + resultado.status + '\t' + JSON.stringify(resultado));
                                      plantillas[plantillaKey].idEtiqueta = etiquetasSeleccionadas;
                                      operacionesCompletadas++;
                                      if (operacionesCompletadas === totalOperaciones) resolve();
                                  })
                                  .editarPlantilla(plantillaKey, plantillas[plantillaKey].nombre, plantillas[plantillaKey].tipo, etiquetasSeleccionadas);
                          } else {
                              operacionesCompletadas++;
                              if (operacionesCompletadas === totalOperaciones) resolve();
                          }
                      });
                      
                      // Una vez que todas las operaciones se completen, actualizar la vista
                      actualizarPlantilla.then(() => {
                          // Obtener los datos actualizados del servidor
                          google.script.run
                              .withSuccessHandler(function(resultado) {
                                  plantillas = resultado;
                                  renderizarPlantillas();
                                  
                                  // Cerrar el modal después de actualizar la vista
                                  const modal = bootstrap.Modal.getInstance(editarPlantillaModal);
                                  if (modal) {
                                      document.activeElement.blur();
                                      modal.hide();
                                  }
                                  
                                  // Mostrar mensaje de éxito
                                  mostrarNotificacion('Cambios guardados correctamente', 'success');
                              })
                              .self_obtenerPlantillas();
                      });
                    }
                  }
              });
              
              // Corregir problema de foco cuando se cierra el modal
              editarPlantillaModal.addEventListener('hidden.bs.modal', function () {
                  // Asegurarse de que el foco no quede en ningún elemento del modal
                  document.body.focus();
              });
              
              // Función para mostrar notificaciones
              function mostrarNotificacion(mensaje, tipo = 'success') {
                  const notificacion = document.createElement('div');
                  notificacion.className = `alert alert-${tipo} notification-toast`;
                  notificacion.innerHTML = `<i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${mensaje}`;
                  document.body.appendChild(notificacion);
                  
                  // Estilos para la notificación
                  notificacion.style.position = 'fixed';
                  notificacion.style.bottom = '20px';
                  notificacion.style.right = '20px';
                  notificacion.style.zIndex = '9999';
                  notificacion.style.minWidth = '250px';
                  notificacion.style.padding = '10px 15px';
                  notificacion.style.opacity = '0';
                  notificacion.style.transition = 'opacity 0.3s ease-in-out';
                  
                  // Mostrar y luego ocultar la notificación
                  setTimeout(() => {
                      notificacion.style.opacity = '1';
                      setTimeout(() => {
                          notificacion.style.opacity = '0';
                          setTimeout(() => {
                              document.body.removeChild(notificacion);
                          }, 300);
                      }, 3000);
                  }, 100);
              }
          });
  
  
        document.addEventListener('DOMContentLoaded', function() {
            // Variable para guardar el modal desde el que vinimos
            let modalPrevio = null;
            
            // Manejar click en botones de cancelar
            document.querySelectorAll('button[data-bs-target="#confirmacionModal"]').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Guardar referencia al modal actual antes de abrir el de confirmación
                    modalPrevio = this.closest('.modal');
                    // Cerrar el modal actual
                    if (modalPrevio) {
                        const bsModal = bootstrap.Modal.getInstance(modalPrevio);
                        if (bsModal) {
                            bsModal.hide();
                        }
                    }
                    // Mostrar el modal de confirmación
                    const confirmModal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
                    confirmModal.show();
                });
            });
            
            // Botón "No" del modal de confirmación
            document.getElementById('btnNo').addEventListener('click', function() {
                // Cerrar el modal de confirmación
                const confirmModal = document.getElementById('confirmacionModal');
                const bsConfirmModal = bootstrap.Modal.getInstance(confirmModal);
                bsConfirmModal.hide();
                
                // Limpiar backdrops extras
                setTimeout(function() {
                    const backdrops = document.querySelectorAll('.modal-backdrop');
                    if (backdrops.length > 0) {
                        backdrops.forEach(b => b.remove());
                    }
                    
                    // Eliminar clases que Bootstrap añade al body
                    document.body.classList.remove('modal-open');
                    document.body.style.removeProperty('overflow');
                    document.body.style.removeProperty('padding-right');
                    
                    // Volver a mostrar el modal anterior
                    if (modalPrevio) {
                        const modalAnterior = new bootstrap.Modal(modalPrevio);
                        modalAnterior.show();
                    }
                }, 300);
            });
            
            // Botón "Sí" del modal de confirmación
            document.getElementById('btnSi').addEventListener('click', function() {
                // Cerrar el modal de confirmación
                const confirmModal = document.getElementById('confirmacionModal');
                const bsConfirmModal = bootstrap.Modal.getInstance(confirmModal);
                bsConfirmModal.hide();
                
                // Limpiar todos los backdrops
                setTimeout(function() {
                    const backdrops = document.querySelectorAll('.modal-backdrop');
                    if (backdrops.length > 0) {
                        backdrops.forEach(b => b.remove());
                    }
                    
                    // Eliminar clases que Bootstrap añade al body
                    document.body.classList.remove('modal-open');
                    document.body.style.removeProperty('overflow');
                    document.body.style.removeProperty('padding-right');
                    
                    // Si había un modal previo, limpiar sus datos
                    if (modalPrevio) {
                        const form = modalPrevio.querySelector('form');
                        if (form) {
                            form.reset();
                        }
                        const inputs = modalPrevio.querySelectorAll('input');
                        inputs.forEach(input => {
                            input.classList.remove('is-invalid');
                        });
                        const errorMessages = modalPrevio.querySelectorAll('.error-mensaje');
                        errorMessages.forEach(msg => {
                            msg.style.display = 'none';
                        });
                    }
                }, 300);
            });
        });
  
  // Función para cargar los modales desde el servidor
        function cargarModales() {
          console.log('=== INICIO cargarModales ===');
          console.log('Estado del DOM:', document.readyState);
          console.log('Contenedor de modales antes de cargar:', document.getElementById('modalesContainer'));
          
          google.script.run
            .withSuccessHandler(function(contenido) {
              console.log('=== SUCCESS cargarModales ===');
              console.log('Contenido recibido:', contenido ? 'Sí' : 'No');
              
              const modalesContainer = document.getElementById('modalesContainer');
              console.log('Contenedor de modales después de recibir contenido:', modalesContainer);
              
              if (modalesContainer) {
                console.log('Insertando contenido en el contenedor de modales...');
                modalesContainer.innerHTML = contenido;
                
                // Verificar elementos después de insertar
                console.log('Verificando elementos después de insertar contenido:');
                console.log('verEtiquetasModal:', document.getElementById('verEtiquetasModal'));
                console.log('etiquetasModalBody:', document.getElementById('etiquetasModalBody'));
                
                // Esperar un momento para asegurar que el DOM se haya actualizado
                setTimeout(function() {
                  console.log('=== INICIO setTimeout cargarModales ===');
                  console.log('Verificando elementos en setTimeout:');
                  console.log('verEtiquetasModal:', document.getElementById('verEtiquetasModal'));
                  console.log('etiquetasModalBody:', document.getElementById('etiquetasModalBody'));
                  
                  inicializarModales();
                  renderizarPlantillas();
                  
                  console.log('=== FIN setTimeout cargarModales ===');
                }, 100);
              } else {
                console.error('No se encontró el contenedor de modales');
              }
              
              console.log('=== FIN SUCCESS cargarModales ===');
            })
            .withFailureHandler(function(error) {
              console.error('Error al cargar los modales:', error);
            })
            .obtenerModales();
          
          console.log('=== FIN cargarModales ===');
        }
  
   // Función para manejar la visualización de detalles
        function mostrarDetalles(usos, nombre) {
          console.log('=== INICIO mostrarDetalles ===');
          console.log('Parámetros recibidos:', { usos, nombre });
          
          const detallesModal = document.getElementById('detallesModal');
          const detallesNombre = document.getElementById('detallesNombre');
          const detallesBody = document.getElementById('detallesBody');
          
          if (!detallesModal) {
              console.error('No se encontró el modal detallesModal');
              return;
          }
          if (!detallesNombre) {
              console.error('No se encontró el elemento detallesNombre');
              return;
          }
          if (!detallesBody) {
              console.error('No se encontró el elemento detallesBody');
              return;
          }
          
          detallesNombre.textContent = nombre;
          detallesBody.innerHTML = '';
          
          // Buscar la plantilla en el objeto plantillas
          console.log('Objeto plantillas:', plantillas);
          const plantilla = Object.values(plantillas).find(p => p.nombre === nombre);
          console.log('Plantilla encontrada:', plantilla);
          
          if (plantilla && plantilla.instancias && plantilla.instancias.length > 0) {
            console.log('Instancias encontradas:', plantilla.instancias);
            
            plantilla.instancias.forEach((instancia, index) => {
              console.log(`Procesando instancia ${index}:`, instancia);
              
              const tr = document.createElement('tr');
              
              // Columna Nombre
              const tdNombre = document.createElement('td');
              tdNombre.textContent = instancia.nombre;
              tr.appendChild(tdNombre);
              
                  // Columna Autores
                  const tdAutores = document.createElement('td');
              const autores = instancia.autoresInstancias || instancia.autoresInstancia || [];
                  tdAutores.textContent = Array.isArray(autores) ? autores.join(', ') : autores;
                  tr.appendChild(tdAutores);
              
                  // Columna Fecha de Creación
              const tdFecha = document.createElement('td');
                  tdFecha.textContent = instancia.fechaCreación || 'No especificada';
              tr.appendChild(tdFecha);
              
              detallesBody.appendChild(tr);
            });
          } else {
              console.warn('No se encontraron instancias o la plantilla no tiene instancias.');
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 3;
            td.textContent = 'No hay instancias registradas';
            td.className = 'text-center';
            tr.appendChild(td);
            detallesBody.appendChild(tr);
          }
          
          // Mostrar el modal
          try {
          const modal = new bootstrap.Modal(detallesModal);
              modal.show();
              console.log('Modal mostrado correctamente');
          } catch (e) {
              console.error('Error al mostrar el modal:', e);
          }
          
          // Agregar evento para limpiar el backdrop cuando se cierre el modal
          detallesModal.addEventListener('hidden.bs.modal', function () {
            // Eliminar todos los backdrops
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            
            // Eliminar clases que Bootstrap añade al body
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
          });
          
          console.log('=== FIN mostrarDetalles ===');
        }   

document.addEventListener('DOMContentLoaded', function() {
    // Configuración del modal de confirmación
    const confirmacionModal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
    
    // Botón "Sí" - Cierra ambos modales
    document.getElementById('btnSi').addEventListener('click', function() {
      // Cierra primero el modal de confirmación
      confirmacionModal.hide();
      
      // Luego cierra el modal original después de un pequeño retraso
      setTimeout(() => {
        const modalOriginal = bootstrap.Modal.getInstance(document.querySelector('.modal.show'));
        if (modalOriginal) modalOriginal.hide();
      }, 100);
    });
    
    // Botón "No" - Solo cierra el modal de confirmación
    document.getElementById('btnNo').addEventListener('click', function() {
      confirmacionModal.hide();
    });
    
    // Opcional: Limpiar eventos al cerrar el modal
    confirmacionModal._element.addEventListener('hidden.bs.modal', function() {
      // Puedes agregar lógica adicional aquí si es necesario
    });
  });


function validarYcargarPlantilla() {
const urlInput = document.getElementById('enlaceInput');
const url = urlInput.value.trim();
const errorElement = document.getElementById('urlError');
const btnCargar = document.getElementById('btnCargarPlantilla');

try {
  // Resetear estados
  errorElement.classList.add('d-none');
  urlInput.classList.remove('is-invalid');
  
  // Validaciones
  if (!url) throw new Error('Por favor ingrese una URL');
  if (!esUrlValida(url)) throw new Error('URL no válida aea');
  if (!url.includes('docs.google.com') && !url.includes('drive.google.com')) {
    throw new Error('Solo se aceptan enlaces de Google Docs o Google Sheets');
  }

  // Feedback visual
  btnCargar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';
  btnCargar.disabled = true;

  // Procesar enlace
  checkFileTypeAndRedirect(url);

} catch (error) {
  console.log('errorsito:', error);
  mostrarError(error.message);
  urlInput.classList.add('is-invalid');
  console.error('Error en validarYcargarPlantilla:', error);
  
  // Restablecer botón
  btnCargar.innerHTML = 'Cargar Plantilla';
  btnCargar.disabled = false;
}
}

function checkFileTypeAndRedirect(fileUrl) {
try {
  // Validación básica
  if (!fileUrl) throw new Error('No se recibió el enlace');

  // Determinar tipo de archivo
  const isGoogleSheets = fileUrl.includes("docs.google.com/spreadsheets");
  
  // Actualizar UI
  const iconElement = document.getElementById("icon-google");
  const textElement = document.getElementById("file-type");
  
  if (!iconElement || !textElement) {
    throw new Error('Elementos de UI no encontrados');
  }

  if (isGoogleSheets) {
    iconElement.className = "bi bi-file-earmark-spreadsheet";
    iconElement.style.cssText = 'display: inline-block; width: 18px; height: 24px; margin-right: 12px;';
    textElement.textContent = "Google Sheets";
  } else {
    iconElement.className = "bi bi-file-earmark-text";
    iconElement.style.cssText = 'display: inline-block; width: 18px; height: 24px; margin-right: 12px;';
    textElement.textContent = "Google Docs";
  }

  // Cerrar modal actual con verificación
  const currentModal = bootstrap.Modal.getInstance(document.getElementById('cargarPlantillaModal'));
  if (currentModal) {
    currentModal.hide();
  }

  // Determinar modal destino según tipo de archivo
  const targetModalId = isGoogleSheets ? 'modalErrores' : 'modalEvaluacion';
  const targetModal = document.getElementById(targetModalId);
  
  if (!targetModal) {
    throw new Error(`No se encontró el modal con ID: ${targetModalId}`);
  }

  // Mostrar modal destino después de breve retraso
  setTimeout(() => {
    new bootstrap.Modal(targetModal).show();
  }, 300);

} catch (error) {
  console.error('Error en checkFileTypeAndRedirect:', error);
  mostrarError(error.message);
  
  // Reabrir modal original si hay error
  setTimeout(() => {
    new bootstrap.Modal(document.getElementById('cargarPlantillaModal')).show();
  }, 300);
  
} finally {
  // Restablecer botón siempre
  const btn = document.getElementById('btnCargarPlantilla');
  if (btn) {
    btn.innerHTML = 'Cargar Plantilla';
    btn.disabled = false;
  }
}
}

function esUrlValida(url) {
try {
  const patterns = [
    /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[^/]+\/edit(\?[^#]*)?(#.*)?$/,
    /^https:\/\/docs\.google\.com\/document\/d\/[^/]+\/edit(\?[^#]*)?(#.*)?$/,
    /^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/view(\?[^#]*)?(#.*)?$/,
    /^https:\/\/drive\.google\.com\/open\?id=[^&]+(&[^#]*)?(#.*)?$/
  ];
  return patterns.some(pattern => pattern.test(url));
} catch (error) {
  console.error('Error en esUrlValida:', error);
  return false;
}
}

function mostrarError(mensaje) {
try {
  const errorElement = document.getElementById('urlError');
  if (errorElement) {
    errorElement.textContent = mensaje;
    errorElement.classList.remove('d-none');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      errorElement.classList.add('d-none');
    }, 5000);
  }
} catch (error) {
  console.error('Error al mostrar mensaje de error:', error);
}
}
  
// Scripts for dynamic modal functionality
document.getElementById('btnCargarPlantilla').addEventListener('click', function() {
  const urlInput = document.getElementById('enlaceInput').value.trim();
  
  // Función mejorada para extraer el ID de la URL
  function extraerIdDeUrl(url) {
    if (!url) return null;
    
    // Patrones para URLs de Google Drive/Docs/Sheets
    const patrones = [
      /\/d\/([a-zA-Z0-9-_]+)/,                     // Formato estándar: /d/ID
      /\/document\/d\/([a-zA-Z0-9-_]+)/,           // Docs: /document/d/ID
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,       // Sheets: /spreadsheets/d/ID
      /[&?]id=([a-zA-Z0-9-_]+)/,                   // Formato con parámetro id=ID
      /^([a-zA-Z0-9-_]+)$/                         // Si ya es un ID directamente
    ];
    
    // Probar cada patrón hasta encontrar un match
    for (const patron of patrones) {
      const match = url.match(patron);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }
  
  // Validar la URL primero
  if (!esUrlValida(urlInput)) {
    const urlError = document.getElementById('urlError');
    urlError.textContent = 'Error: La URL no es válida';
    urlError.style.display = 'block';
    return;
  }
  
  // Extraer el ID de la URL
  const documentId = extraerIdDeUrl(urlInput);
  
  if (!documentId) {
    const urlError = document.getElementById('urlError');
    urlError.textContent = 'Error: No se pudo extraer el ID del documento de la URL';
    urlError.style.display = 'block';
    return;
  }

  // Ocultar el modal de carga de plantilla y mostrar el loading
  const modalCargarPlantilla = bootstrap.Modal.getInstance(document.getElementById('cargarPlantillaModal'));
  modalCargarPlantilla.hide();
  
  // Mostrar el modal de loading
  const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
  loadingModal.show();
  
  // Llamar a la función de verificación con el ID extraído
  console.log('Iniciando verificación de documento...');
  google.script.run
    .withSuccessHandler(function(result) {
      console.log('SuccessHandler - Resultado recibido:', result);
      
      // Ocultar el modal de loading
      const loadingModalInstance = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
      if (loadingModalInstance) {
        loadingModalInstance.hide();
      }
      
      if (result && result.status && result.permisoConcedido) {
        console.log('Documento verificado correctamente');
        // Almacenar el ID del documento en el campo oculto
        document.getElementById('document-id').value = result.idDocumento;
        
        // Actualizar elementos del modal
        const iconElement = document.getElementById('icon-google');
        const fileTypeElement = document.getElementById('file-type');
        const fileNameElement = document.getElementById('document-name');
        
        // Configurar icono y tipo de archivo según el tipo de documento
        if (result.tipoDocumento === 'Docs') {
          iconElement.className = 'icon-google-docs';
          fileTypeElement.textContent = 'Google Docs';
        } else if (result.tipoDocumento === 'Sheets') {
          iconElement.className = 'icon-google-sheets';
          fileTypeElement.textContent = 'Google Sheets';
        }
        
        // Estilos del icono
        iconElement.style.cssText = 'display: inline-block; width: 18px; height: 24px; margin-right: 12px;';
        
        // Actualizar nombre del documento
        fileNameElement.textContent = result.nombreDocumento;
        
        // Mostrar modal de información del documento
        const modalCargaArch = new bootstrap.Modal(document.getElementById('modalCargaArch'));
        modalCargaArch.show();
      } else {
        console.error('Error en la verificación:', result);
        // Mostrar el modal de carga de plantilla nuevamente
        modalCargarPlantilla.show();
        const urlError = document.getElementById('urlError');
        urlError.textContent = result?.mensaje || 'Error al verificar el documento';
        urlError.style.display = 'block';
      }
    })
    .withFailureHandler(function(error) {
      console.error('FailureHandler - Error:', error);
      
      // Ocultar el modal de loading
      const loadingModalInstance = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
      if (loadingModalInstance) {
        loadingModalInstance.hide();
      }
      
      // Mostrar el modal de carga de plantilla nuevamente
      modalCargarPlantilla.show();
      const urlError = document.getElementById('urlError');
      urlError.textContent = 'Error al verificar el documento: ' + (error.message || 'Error desconocido');
      urlError.style.display = 'block';
    })
    .self_verificarPermisoDocumentoDrive(documentId);
});

// Event listener para el botón Continuar en modalCargaArch
document.addEventListener('DOMContentLoaded', function() {
  const btnContinuar = document.querySelector('#modalCargaArch .btn-primary');
  btnContinuar.addEventListener('click', function() {
    // Obtener el ID del documento desde el input hidden
    const documentId = document.getElementById('document-id').value;
    console.log('documentId:', documentId);
    
    if (documentId) {
      handleDocumentLoad(documentId);
    } else {
      console.error('No se encontró el ID del documento');
    }
  });
});

// Función para manejar el flujo de modales después de cargar el documento
function handleDocumentLoad(documentId) {
  // Obtener datos del documento actual
  const currentDocName = document.getElementById('document-name').textContent;
  const currentDocType = document.getElementById('file-type').textContent;
  
  // Actualizar datos en los modales de evaluación y errores
  document.getElementById('document-name-evaluacion').textContent = currentDocName;
  document.getElementById('file-type-evaluacion').textContent = currentDocType;
  document.getElementById('document-name-errores').textContent = currentDocName;
  document.getElementById('file-type-errores').textContent = currentDocType;

  // Actualizar iconos según el tipo de documento
  const iconEvaluacion = document.getElementById('icon-evaluacion');
  const iconErrores = document.getElementById('icon-errores');
  
  if (currentDocType === 'Google Sheets') {
    iconEvaluacion.className = 'bi bi-file-earmark-spreadsheet fs-1 text-success me-3 icon-google-sheets';
    iconErrores.className = 'bi bi-file-earmark-spreadsheet fs-1 text-success me-3 icon-google-sheets';
  } else {
    iconEvaluacion.className = 'bi bi-file-earmark-text fs-1 text-success me-3 icon-google-docs';
    iconErrores.className = 'bi bi-file-earmark-text fs-1 text-success me-3 icon-google-docs';
  }

  // Determinar qué función llamar basado en el tipo de documento
  const leerDocumentoFunction = currentDocType === 'Google Sheets' ? 'self_leerValidarSubrayarSheets' : 'leerDocumentoDoc';
  
  // Ocultar el modal actual y mostrar el loading
  const modalCargaArch = bootstrap.Modal.getInstance(document.getElementById('modalCargaArch'));
  if (modalCargaArch) {
    modalCargaArch.hide();
  }
  
  // Mostrar el modal de loading
  const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
  loadingModal.show();
  
  // Llamar a la función correspondiente con google.script.run
  google.script.run
    .withSuccessHandler(function(response) {
      console.log('response: ', response);
      
      // Agregar el tipo de documento a la respuesta
      const responseWithType = {
        ...response,
        tipoDocumento: currentDocType,
        nombreDocumento: currentDocName
      };

      // Guardar la respuesta en sessionStorage
      sessionStorage.setItem('documentResponse', JSON.stringify(responseWithType));
      
      // Actualizar contadores de marcadores
      document.getElementById('marcadores-detectados').textContent = `Marcadores Detectados: ${response.totalMarcadores}`;
      document.getElementById('marcadores-detectados-errores').textContent = `Marcadores Detectados: ${response.totalMarcadores}`;
      
      // Construir y actualizar el enlace del documento
      const link_base = "https://docs.google.com/";
      const tipo_doc = currentDocType === 'Google Sheets' ? 'spreadsheets' : 'document';
      const linkDocumento = `${link_base}${tipo_doc}/d/${documentId}/edit`;
      
      // Actualizar los enlaces en ambos modales
      document.querySelector('#modalEvaluacion .card-container').setAttribute('data-document-link', linkDocumento);
      document.querySelector('#modalErrores .card-container').setAttribute('data-document-link', linkDocumento);
      
      // Ocultar el modal de loading y limpiar backdrops
      const loadingModalInstance = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
      if (loadingModalInstance) {
        loadingModalInstance.hide();
      }
      
      // Limpiar backdrops y clases del body antes de mostrar el siguiente modal
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
        
        // Verificar si hay errores y mostrar el modal correspondiente
        if (!(response.totalErroresSintacticos === 0 || response.totalErroresSintacticos === 0)) {
          console.log('hay errores');
          // Actualizar contadores de errores
          document.getElementById('marcadores-duplicados').textContent = `Marcadores Duplicados: ${response.totalErroresDuplicados}`;
          document.getElementById('errores-sintaxis').textContent = `Error de sintaxis: ${response.totalErroresSintacticos}`;
          
          // Mostrar modal de errores
          const modalErrores = new bootstrap.Modal(document.getElementById('modalErrores'));
          modalErrores.show();
        } else {
          console.log('no hay errores');
          // Mostrar modal de evaluación
          const modalEvaluacion = new bootstrap.Modal(document.getElementById('modalEvaluacion'));
          modalEvaluacion.show();
        }
      }, 300);
    })
    .withFailureHandler(function(error) {
      console.error('Error al procesar el documento:', error);
      
      // Ocultar el modal de loading
      const loadingModalInstance = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
      if (loadingModalInstance) {
        loadingModalInstance.hide();
      }
      
      // Limpiar backdrops y clases del body
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
        
        // Mostrar mensaje de error
        const modalCargaArch = new bootstrap.Modal(document.getElementById('modalCargaArch'));
        modalCargaArch.show();
        const urlError = document.getElementById('urlError');
        urlError.textContent = 'Error al procesar el documento: ' + (error.message || 'Error desconocido');
        urlError.style.display = 'block';
      }, 300);
    })
    [leerDocumentoFunction](documentId);
}

// Función para cargar etiquetas
function cargarEtiquetas() {
  const modalEtiquetas = document.getElementById('modalEtiquetas');
  const etiquetasContainer = modalEtiquetas.querySelector('#etiquetasContainer');
  
  if (!etiquetasContainer) {
    console.error('No se encontró el contenedor de etiquetas en el modal');
    return;
  }

  // Deshabilitar botones mientras carga
  const btnNuevaEtiqueta = document.getElementById('btnNuevaEtiqueta');
  const btnFinalizar = document.getElementById('btnFinalizar');
  const btnCerrar = modalEtiquetas.querySelector('.btn-secondary');
  const searchInput = document.getElementById('searchEtiquetas');

  btnNuevaEtiqueta.disabled = true;
  btnFinalizar.disabled = true;
  btnCerrar.disabled = true;
  searchInput.disabled = true;

  // Mostrar mensaje de carga
  etiquetasContainer.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border text-primary mb-2" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="text-muted mb-0">Cargando etiquetas...</p>
    </div>
  `;

  google.script.run
    .withSuccessHandler(function(etiquetasResponse) {
      etiquetasContainer.innerHTML = ''; // Limpiar mensaje de carga

      etiquetasResponse.etiquetas.forEach(etiqueta => {
        const formCheck = document.createElement('div');
        formCheck.className = 'form-check';
        formCheck.setAttribute('data-id', etiqueta.id);
        
        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.style.cssText = 'display: flex; align-items: center; width: 100%; text-align: left;';
        
        const tagButton = document.createElement('span');
        tagButton.className = 'tag-button';
        tagButton.style.cssText = `
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          margin-right: 8px;
          background-color: ${etiqueta.color};
        `;
        
        label.appendChild(tagButton);
        label.appendChild(document.createTextNode(etiqueta.nombre));
        formCheck.appendChild(label);
        
        // Agregar evento de clic para seleccionar/deseleccionar
        formCheck.addEventListener('click', function() {
          this.classList.toggle('selected');
          actualizarBotonFinalizar();
        });
        
        etiquetasContainer.appendChild(formCheck);
      });

      // Inicializar el texto del botón
      actualizarBotonFinalizar();

      // Re-habilitar botones después de cargar exitosamente
      btnNuevaEtiqueta.disabled = false;
      btnFinalizar.disabled = false;
      btnCerrar.disabled = false;
      searchInput.disabled = false;
    })
    .withFailureHandler(function(error) {
      // Mostrar mensaje de error
      etiquetasContainer.innerHTML = `
        <div class="text-center py-4">
          <i class="fas fa-exclamation-circle text-danger mb-2" style="font-size: 2rem;"></i>
          <p class="text-danger mb-0">Error al cargar las etiquetas</p>
        </div>
      `;
      console.error('Error al cargar etiquetas:', error);

      // Re-habilitar botones después del error
      btnNuevaEtiqueta.disabled = false;
      btnFinalizar.disabled = false;
      btnCerrar.disabled = false;
      searchInput.disabled = false;
    })
    .self_obtenerEtiquetas();
}

// Event listeners para los botones Continuar
document.addEventListener('DOMContentLoaded', function() {
  // Botón Continuar del modal de evaluación
  document.querySelector('#modalEvaluacion .btn-primary').addEventListener('click', function() {
    // Ocultar el modal de evaluación
    const modalEvaluacion = bootstrap.Modal.getInstance(document.getElementById('modalEvaluacion'));
    if (modalEvaluacion) {
      modalEvaluacion.hide();
    }
    
    // Mostrar el modal de loading
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();
    
    // Limpiar backdrops y clases del body
    setTimeout(() => {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
      
      // Ocultar el loading y mostrar el modal de etiquetas
      const loadingModalInstance = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
      if (loadingModalInstance) {
        loadingModalInstance.hide();
      }
      
      const modalEtiquetas = new bootstrap.Modal(document.getElementById('modalEtiquetas'));
      modalEtiquetas.show();
      cargarEtiquetas();
    }, 300);
  });

  // Botón Continuar del modal de errores
  const btnContinuarErrores = document.querySelector('#modalErrores .btn-primary');
  btnContinuarErrores.disabled = true;
  btnContinuarErrores.classList.add('disabled');
  btnContinuarErrores.title = 'No se puede continuar con errores en el documento';
});

// Event listener para el botón Finalizar en modalEtiquetas
document.getElementById('btnFinalizar').addEventListener('click', function() {
  // Obtener datos del sessionStorage
  const documentResponse = JSON.parse(sessionStorage.getItem('documentResponse'));
  if (!documentResponse) {
    mostrarErrorToast('No se encontraron datos en sessionStorage');
    return;
  }
  console.log('documentResponse:', documentResponse);

  // Obtener etiquetas seleccionadas
  const etiquetasSeleccionadas = Array.from(document.querySelectorAll('#etiquetasContainer .form-check.selected'))
    .map(etiqueta => etiqueta.getAttribute('data-id'));

  // Función para mostrar toast de error
  function mostrarErrorToast(mensaje) {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.innerHTML = `
      <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="fas fa-exclamation-circle me-2"></i>
            ${mensaje}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);
    
    const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
    toast.show();
    
    toastContainer.querySelector('.toast').addEventListener('hidden.bs.toast', function () {
      document.body.removeChild(toastContainer);
    });
  }

  // Función para mostrar toast de éxito
  function mostrarExitoToast(mensaje) {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.innerHTML = `
      <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="fas fa-check-circle me-2"></i>
            ${mensaje}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);
    
    const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
    toast.show();
    
    toastContainer.querySelector('.toast').addEventListener('hidden.bs.toast', function () {
      document.body.removeChild(toastContainer);
    });
  }

  // Función para actualizar el mensaje del modal de loading
  function actualizarMensajeLoading(paso, mensaje) {
    const loadingMensaje = document.getElementById('loadingMensajeEstado');
    if (loadingMensaje) {
      loadingMensaje.textContent = mensaje;
    }
    
    // Actualizar también la barra de progreso si existe
    const progresoActual = document.getElementById('loadingProgreso');
    if (progresoActual) {
      // Calcular progreso (5 pasos en total)
      const porcentaje = (paso / 5) * 100;
      progresoActual.style.width = porcentaje + '%';
      progresoActual.setAttribute('aria-valuenow', porcentaje);
    }
  }

  // Función para ocultar modal de loading
  function ocultarModalLoading() {
    const loadingModal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
    if (loadingModal) {
      loadingModal.hide();
    }
  }

  // Función para manejar errores y limpiar
  function manejarError(mensaje) {
    ocultarModalLoading();
    mostrarErrorToast(mensaje);
    cargarPlantillas(); // Recargar plantillas en caso de error
  }

  // Mostrar el modal de loading
  const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
  loadingModal.show();
  actualizarMensajeLoading(0, 'Iniciando proceso...');

  // Paso 0: Crear carpeta
  actualizarMensajeLoading(1, 'Paso 1/5: Creando carpeta en Drive...');
  google.script.run
    .withSuccessHandler(function(carpetaResult) {
      if (!carpetaResult || !carpetaResult.idCarpeta) {
        manejarError('Error al crear la carpeta');
        return;
      }
      
      console.log('Carpeta creada:', carpetaResult);

      // Determinar qué funciones usar según el tipo de documento
      const esSheet = documentResponse.tipoDocumento === 'Google Sheets';
      const funcionCopiaOriginal = esSheet ? 'self_crearCopiaOriginalSheet' : 'self_crearCopiaOriginalDoc';
      const funcionCopiaSinMarcadores = esSheet ? 'self_crearCopiaSinMarcadoresSheet' : 'self_crearCopiaSinMarcadoresDoc';

      // Paso 1: Crear copia original
      actualizarMensajeLoading(2, 'Paso 2/5: Creando copia original del documento...');
      google.script.run
        .withSuccessHandler(function(copiaOriginalResult) {
          if (!copiaOriginalResult || !copiaOriginalResult.id) {
            manejarError('Error al crear copia original');
            return;
          }
          console.log('Copia original creada:', copiaOriginalResult);

          // Paso 2: Crear copia sin marcadores
          actualizarMensajeLoading(3, 'Paso 3/5: Creando copia sin marcadores...');
          google.script.run
            .withSuccessHandler(function(copiaSinMarcadoresResult) {
              if (!copiaSinMarcadoresResult || !copiaSinMarcadoresResult.id) {
                manejarError('Error al crear copia sin marcadores');
                return;
              }
              console.log('Copia sin marcadores creada:', copiaSinMarcadoresResult);

              // Paso 3: Guardar documento de instrucciones
              actualizarMensajeLoading(4, 'Paso 4/5: Guardando documento de instrucciones...');
              google.script.run
                .withSuccessHandler(function(docInstruccionesResult) {
                  if (!docInstruccionesResult || !docInstruccionesResult.id) {
                    manejarError('Error al guardar el documento de instrucciones');
                    return;
                  }
                  console.log('Documento de instrucciones guardado:', docInstruccionesResult);

                  // Paso 4: Guardar plantilla en la base de datos
                  actualizarMensajeLoading(5, 'Paso 5/5: Guardando plantilla en la base de datos...');
                  google.script.run
                    .withSuccessHandler(function(resultadoBD) {
                      if (!resultadoBD || !resultadoBD.status) {
                        manejarError('Error al guardar la plantilla en la base de datos');
                        return;
                      }
                      console.log('Plantilla guardada en BD:', resultadoBD);

                      // Paso 5: Asociar etiquetas si hay alguna seleccionada
                      if (etiquetasSeleccionadas && etiquetasSeleccionadas.length > 0) {
                        actualizarMensajeLoading(5, 'Finalizando: Asociando etiquetas...');
                        google.script.run
                          .withSuccessHandler(function(resAsociar) {
                            console.log('Etiquetas asociadas:', resAsociar);
                            ocultarModalLoading();
                            mostrarExitoToast('Plantilla creada y etiquetas asociadas correctamente');
                            // Recargar la tabla de plantillas
                            cargarPlantillas();
                          })
                          .withFailureHandler(function(error) {
                            manejarError('Plantilla creada, pero error al asociar etiquetas: ' + error);
                          })
                          .self_asociarEtiquetasAPlantillaBD(resultadoBD.idPlantillaBD, etiquetasSeleccionadas);
                      } else {
                        ocultarModalLoading();
                        mostrarExitoToast('Plantilla creada correctamente (sin etiquetas asociadas)');
                        cargarPlantillas();
                      }

                      // Cerrar el modal de etiquetas
                      const modalEtiquetas = document.getElementById('modalEtiquetas');
                      if (modalEtiquetas) {
                        const bsModal = bootstrap.Modal.getInstance(modalEtiquetas);
                        if (bsModal) {
                          bsModal.hide();
                        }
                      }
                      // Limpiar el backdrop
                      setTimeout(() => {
                        const backdrops = document.querySelectorAll('.modal-backdrop');
                        backdrops.forEach(backdrop => backdrop.remove());
                        document.body.classList.remove('modal-open');
                        document.body.style.removeProperty('overflow');
                        document.body.style.removeProperty('padding-right');
                      }, 300);
                    })
                    .withFailureHandler(function(error) {
                      manejarError('Error al guardar en la base de datos: ' + error);
                    })
                    .self_guardarNuevaPlantillaBD(
                      documentResponse.nombreDocumento,
                      copiaOriginalResult.id,
                      copiaSinMarcadoresResult.id,
                      docInstruccionesResult.id,
                      documentResponse.tipoDocumento === "Google Sheets" ? "sheets" : "docs"
                    );
                })
                .withFailureHandler(function(error) {
                  manejarError('Error al guardar el documento de instrucciones: ' + error);
                })
                .self_guardarDocumentoDeInstruccionesGenerado(
                  documentResponse,
                  carpetaResult.idCarpeta,
                  ('Instrucciones - ' + documentResponse.nombreDocumento).replace(/\s+/g, '_'),
                  'VIEW'
                );
            })
            .withFailureHandler(function(error) {
              manejarError('Error al crear copia sin marcadores: ' + error);
            })
            [funcionCopiaSinMarcadores](
              documentResponse.documento.id,
              carpetaResult.idCarpeta,
              ('sinMarcadores - ' + documentResponse.nombreDocumento),
              'lectura'
            );
        })
        .withFailureHandler(function(error) {
          manejarError('Error al crear copia original: ' + error);
        })
        [funcionCopiaOriginal](
          documentResponse.documento.id,
          carpetaResult.idCarpeta,
          ('original - ' + documentResponse.nombreDocumento)
        );
    })
    .withFailureHandler(function(error) {
      manejarError('Error al crear la carpeta: ' + error);
    })
    .self_crearCarpetaDrive(documentResponse.nombreDocumento.replace(/\s+/g, '_'));
});


document.addEventListener('DOMContentLoaded', () => {
   const tabla = document.getElementById('plantillasTableBody');
 
   function cargarEtiquetasUnicas() {
     const etiquetasSet = new Set();
     tabla.querySelectorAll('tr').forEach(row => {
       const celda = row.querySelector('td:nth-child(3)');
       if (celda) {
         celda.textContent.split(',').forEach(et => etiquetasSet.add(et.trim()));
       }
     });
 
     const contenedor = document.getElementById('filtroEtiquetasContainer');
     contenedor.innerHTML = '';
     etiquetasSet.forEach(etiqueta => {
       const div = document.createElement('div');
       div.className = 'form-check';
       div.innerHTML = `
         <input class="form-check-input filtro-checkbox" type="checkbox" value="${etiqueta}" id="etq-${etiqueta}">
         <label class="form-check-label" for="etq-${etiqueta}">${etiqueta}</label>
       `;
       contenedor.appendChild(div);
     });
   }
 
   document.getElementById('modalFiltroEtiquetas').addEventListener('show.bs.modal', cargarEtiquetasUnicas);
 
   document.getElementById('searchFiltroEtiquetas').addEventListener('input', function () {
     const term = this.value.toLowerCase();
     let visibles = 0;
 
     document.querySelectorAll('#filtroEtiquetasContainer .form-check').forEach(div => {
       const label = div.textContent.toLowerCase();
       const visible = label.includes(term);
       div.style.display = visible ? 'block' : 'none';
       if (visible) visibles++;
     });
 
     document.getElementById('noFiltroResults').style.display = visibles === 0 ? 'block' : 'none';
   });
 
   document.getElementById('btnAplicarFiltroEtiquetas').addEventListener('click', () => {
     const seleccionadas = Array.from(document.querySelectorAll('.filtro-checkbox:checked')).map(cb => cb.value);
 
     tabla.querySelectorAll('tr').forEach(row => {
       const celda = row.querySelector('td:nth-child(3)');
       if (!celda) return;
       const etiquetas = celda.textContent.split(',').map(et => et.trim());
       const mostrar = seleccionadas.length === 0 || etiquetas.some(et => seleccionadas.includes(et));
       row.style.display = mostrar ? '' : 'none';
     });
 
     bootstrap.Modal.getInstance(document.getElementById('modalFiltroEtiquetas')).hide();
   });
 });
