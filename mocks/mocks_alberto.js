// Clase Mock enfocada en activar y desactivar etiquetas
class ActivarDesactivarMock {
  activarEtiqueta(nombre) {
    return {
      status: "success",
      mensaje: `Etiqueta '${nombre}' activada correctamente`,
      etiqueta: {
        nombre: nombre,
        activo: true
      }
    };
  }

  desactivarEtiqueta(nombre) {
    return {
      status: "success",
      mensaje: `Etiqueta '${nombre}' desactivada correctamente`,
      etiqueta: {
        nombre: nombre,
        activo: false
      }
    };
  }
}

// Instancia del mock
const impl = new ActivarDesactivarMock();

// Función para testear el mock
function testearActivarDesactivar() {
  const resultadoActivar = impl.activarEtiqueta("Etiqueta 1");
  const resultadoDesactivar = impl.desactivarEtiqueta("Etiqueta 2");

  console.log(resultadoActivar);
  console.log();
  console.log(resultadoDesactivar);
}

testearActivarDesactivar();