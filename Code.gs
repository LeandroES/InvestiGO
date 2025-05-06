/**
 * Función principal que crea la aplicación web
 * @return {HtmlOutput} La página web renderizada
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('InvestiGO - Gestionar Etiquetas')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Incluye un archivo HTML en otro
 * @param {string} filename - Nombre del archivo a incluir
 * @return {string} Contenido del archivo HTML
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Obtiene los estilos CSS
 * @return {string} Contenido del archivo CSS
 */
function obtenerEstilos() {
  return HtmlService.createHtmlOutputFromFile('styles').getContent();
}

/**
 * Obtiene los modales HTML
 * @return {string} Contenido del archivo de modales
 */
function obtenerModales() {
  return HtmlService.createHtmlOutputFromFile('modales').getContent();
}

/**
 * Obtiene todas las etiquetas desde la base de datos
 * @return {Object} Objeto con las etiquetas y estado de la operación
 */
function obtenerEtiquetas() {
  try {
    // Obtener todas las etiquetas leyendo directamente la hoja
    const sheet = SheetsDB.getEtiquetasSheet();
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    // Si no hay datos (solo encabezados)
    if (lastRow <= 1) {
      return {
        success: true,
        etiquetas: []
      };
    }
    
    // Obtener todos los datos (omitir encabezado)
    const datos = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    
    // Mapear a objetos etiqueta
    const etiquetas = datos.map((fila, index) => ({
      id: index + 2, // ID basado en número de fila
      nombre: fila[0] || '',
      color: fila[1] || '#cccccc',
      descripcion: fila[2] || '',
      activo: fila[3] !== false,
      fechaCreacion: fila[4] || new Date().toISOString()
    }));
    
    // Ordenar alfabéticamente
    etiquetas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
    return {
      success: true,
      etiquetas: etiquetas
    };
    
  } catch (error) {
    console.error('Error al obtener etiquetas:', error);
    return {
      success: false,
      error: error.toString(),
      codigoError: error.name || "ETIQUETAS_002"
    };
  }
}

/**
 * Guarda una nueva etiqueta en la base de datos
 * @param {Object} etiqueta - Objeto con los datos de la etiqueta
 * @return {Object} Resultado de la operación
 */
function guardarEtiqueta(etiqueta) {
  try {
    // Validar datos
    if (!etiqueta.nombre) {
      return {
        success: false,
        error: 'El nombre de la etiqueta es obligatorio'
      };
    }
    
    // Usar la función de la biblioteca para insertar
    const resultado = SheetsDB.insertarEtiqueta(
      etiqueta.nombre,
      etiqueta.color || '#cccccc',
      etiqueta.descripcion || '',
      etiqueta.activo !== false
    );
    
    if (resultado.status === "success") {
      return {
        success: true,
        etiqueta: resultado.etiqueta
      };
    } else {
      return {
        success: false,
        error: resultado.mensaje,
        codigoError: resultado.codigo
      };
    }
  } catch (error) {
    console.error('Error al guardar etiqueta:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Actualiza una etiqueta existente utilizando su nombre
 * @param {object} etiqueta - Objeto con los datos de la etiqueta a actualizar
 * @return {object} Resultado de la operación
 */
function actualizarEtiqueta(etiqueta) {
  try {
    // Validación del nombre
    if (!etiqueta.nombre) {
      return {
        success: false,
        error: 'El nombre de la etiqueta es obligatorio'
      };
    }

    // Definir nombre original y normalizar
    const nombreOriginal = etiqueta.nombreOriginal || etiqueta.nombre;
    
    // Verificar si la etiqueta existe
    const resultadoConsulta = SheetsDB.buscarEtiqueta(nombreOriginal);
    if (!resultadoConsulta || resultadoConsulta.status !== "success") {
      return {
        success: false,
        error: `No se encontró la etiqueta con nombre "${nombreOriginal}"`,
        codigoError: resultadoConsulta ? resultadoConsulta.codigo : 'NOTFOUND'
      };
    }

    // Verificar si se está cambiando el nombre
    const nuevoNombre = etiqueta.nombre !== nombreOriginal ? etiqueta.nombre : undefined;

    console.log(nuevoNombre);
    console.log(nombreOriginal);

    // Llamar a la función SheetsDB.actualizarEtiqueta
    const resultadoActualizacion = SheetsDB.actualizarEtiqueta(
      nombreOriginal,
      nuevoNombre,
      etiqueta.descripcion,
      etiqueta.color,
      etiqueta.activo
    );

    if (resultadoActualizacion.status === "success") {
      return {
        success: true,
        etiqueta: resultadoActualizacion.etiqueta
      };
    } else {
      return {
        success: false,
        error: resultadoActualizacion.mensaje,
        codigoError: resultadoActualizacion.codigo
      };
    }
  } catch (error) {
    console.error('Error al actualizar etiqueta:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Cambia el estado de activación de una etiqueta
 * @param {string} nombre - Nombre de la etiqueta
 * @param {boolean} activo - Nuevo estado de activación
 * @return {Object} Resultado de la operación
 */
function cambiarEstadoEtiqueta(nombre, activo) {
  try {
    // Validar datos
    if (!nombre) {
      return {
        success: false,
        error: 'El nombre de la etiqueta es obligatorio'
      };
    }
    
    // Primero verificar que la etiqueta existe
    const etiqueta = SheetsDB.consultarEtiqueta(nombre);
    if (!etiqueta || etiqueta.status !== "success") {
      return {
        success: false,
        error: `No se encontró la etiqueta con nombre "${nombre}"`,
        codigoError: etiqueta ? etiqueta.codigo : 'NOTFOUND'
      };
    }
    
    // Usar la función apropiada de la biblioteca según el estado deseado
    let resultado;
    if (activo) {
      resultado = SheetsDB.activarEtiqueta(nombre);
    } else {
      resultado = SheetsDB.desactivarEtiqueta(nombre);
    }
    
    if (resultado.status === "success") {
      return {
        success: true,
        etiqueta: resultado.etiqueta
      };
    } else {
      return {
        success: false,
        error: resultado.mensaje,
        codigoError: resultado.codigo
      };
    }
  } catch (error) {
    console.error('Error al cambiar estado de etiqueta:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
