// Mock de la función insertarEtiqueta
function insertarEtiqueta(nombre, color, descripcion, activo) {
    // Cambiar para devolver resultados con error
    let resultadoTipo = 1;

    if ( resultadoTipo === 1) {
        return {
            status: "success",
            mensaje: "Etiqueta creada correctamente",
            etiqueta: {
                nombre: "Etiqueta 1",
                descripcion: "Descripción de la etiqueta 1",
                color: "#00FF02",
                activo: true
            }
        };
    } else {
        return {
            status: "error",
            mensaje: "Ya existe una etiqueta con ese nombre"
        };
    }
}
  
// Mock de la función actualizarEtiqueta
function actualizarEtiqueta(nombreOriginal, nuevoNombre, nuevaDescripcion, nuevoActivo) {
    // Cambiar para devolver resultados con error
    let resultadoTipo = 1;
    
    if ( resultadoTipo === 1) {
        return {
            status: "success",
            mensaje: "Etiqueta actualizada correctamente",
            etiqueta: {
                nombre: "Etiqueta 2 Actualizada",
                descripcion: "Nuevo texto largo",
                color: "#00FF01",
                activo: true
            }
        };
    } else if (resultadoTipo === 2) {
        return {
            status: "error",
            mensaje: "Etiqueta 2 no encontrada",
        };
    } else {
        return {
            status: "error",
            mensaje: "Ya existe una etiqua con ese nombre",
        };
    }
}
  

function testearMocks() {
    const resultadoInsertar = insertarEtiqueta("Etiqueta 1", "#00FF02", "Descripción de la etiqueta 1", true);
    const resultadoActualizar = actualizarEtiqueta("Etiqueta 2", "#00FF03", "Descripción nueva de la etiqueta 2", true);
    console.log(resultadoInsertar);
    console.log();
    console.log(resultadoActualizar);
  }

  testearMocks();