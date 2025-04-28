// Mock de la función consultarEtiqueta
function consultarEtiqueta(nombre) {
    // Cambiar para devolver resultados con error
    let resultadoTipo = 1;

    if (resultadoTipo === 1) {
        return {
            status: "success",
            mensaje: "Etiqueta encontrada correctamente",
            etiqueta: {
                nombre: "Etiqueta 1",
                descripcion: "Descripción de la etiqueta 1",
                color: "#00FF02",
                activo: true
            }
        };
    } else if (resultadoTipo === 2) {
        return {
            status: "error",
            mensaje: "Etiqueta no encontrada",
        };
    } else {
        return {
            status: "error",
            mensaje: "Error al consultar la etiqueta",
        };
    }
}

// Función para testear solo el mock de consultarEtiqueta
function testearMockConsultar() {
    const resultadoConsultar = consultarEtiqueta("Etiqueta 1");
    console.log(resultadoConsultar);
}

testearMockConsultar();
