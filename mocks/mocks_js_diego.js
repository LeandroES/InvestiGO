// Mock de la función insertarEtiqueta
function insertarEtiqueta(nombre, color, descripcion, activo) {
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
}
  
// Mock de la función actualizarEtiqueta
function actualizarEtiqueta(nombreOriginal, nuevoNombre, nuevaDescripcion, nuevoActivo) {
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
  }
  

function testearMocks() {
    const resultadoInsertar = insertarEtiqueta("Etiqueta 1", "#00FF02", "Descripción de la etiqueta 1", true);
    const resultadoActualizar = actualizarEtiqueta("Etiqueta 2", "#00FF03", "Descripción nueva de la etiqueta 2", true);
    console.log(resultadoInsertar);
    console.log();
    console.log(resultadoActualizar);
  }

  testearMocks();