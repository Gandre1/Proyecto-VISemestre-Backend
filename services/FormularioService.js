import FormularioRepositorio from "../db/repositorios/FormularioRepositorio.js";
import { generarPDF } from "../utils/Funciones.js";

const getFormularioInicio = async () => {
  try {
    const [
      formularioInicio,
      formulariodesarrollo,
      formulariofinalizacion,
      alistamientoInicio,
      alistamientosDesarrollo,
      AlistamientoFinalizacion,
      EstrategiaInicio,
      EstrategiaDesarrollo,
      EstrategiaFinalizacion,
    ] = await Promise.all([
      FormularioRepositorio.TraerFormularioInicio(),
      FormularioRepositorio.TraerFormularioDesarrollo(),
      FormularioRepositorio.TraerFormularioFinalizacion(),
      FormularioRepositorio.getAlistamientosInicio(),
      FormularioRepositorio.getAlistamientosDesarrollo(),
      FormularioRepositorio.getAlistamientosFinalizacion(),
      FormularioRepositorio.getEstrategiasInicio(),
      FormularioRepositorio.getEstrategiasDesarrollo(),
      FormularioRepositorio.getEstrategiasFinalizacion(),
    ]);

    const informacionRelacionadaIncio = relacionarInformacion(formularioInicio, EstrategiaInicio, alistamientoInicio);
    const informacionRelacionadaDesarrollo = relacionarInformacion(formulariodesarrollo, EstrategiaDesarrollo, alistamientosDesarrollo);
    const informacionRelacionadaFinalizacion = relacionarInformacion(formulariofinalizacion, EstrategiaFinalizacion, AlistamientoFinalizacion);

    const formularioFull = relacionarInformacionFull(informacionRelacionadaIncio, informacionRelacionadaDesarrollo, informacionRelacionadaFinalizacion);

    return formularioFull;
  } catch (error) {
    throw error;
  }

};

const getFormularioByid = async (id) => {
  try {
    const [
      formularioInicio,
      formulariodesarrollo,
      formulariofinalizacion,
      alistamientoInicio,
      alistamientosDesarrollo,
      AlistamientoFinalizacion,
      EstrategiaInicio,
      EstrategiaDesarrollo,
      EstrategiaFinalizacion,
    ] = await Promise.all([
      FormularioRepositorio.TraerFormularioInicio(),
      FormularioRepositorio.TraerFormularioDesarrollo(),
      FormularioRepositorio.TraerFormularioFinalizacion(),
      FormularioRepositorio.getAlistamientosInicio(),
      FormularioRepositorio.getAlistamientosDesarrollo(),
      FormularioRepositorio.getAlistamientosFinalizacion(),
      FormularioRepositorio.getEstrategiasInicio(),
      FormularioRepositorio.getEstrategiasDesarrollo(),
      FormularioRepositorio.getEstrategiasFinalizacion(),
    ]);

    const informacionRelacionadaIncio = relacionarInformacion(formularioInicio, EstrategiaInicio, alistamientoInicio);
    const informacionRelacionadaDesarrollo = relacionarInformacion(formulariodesarrollo, EstrategiaDesarrollo, alistamientosDesarrollo);
    const informacionRelacionadaFinalizacion = relacionarInformacion(formulariofinalizacion, EstrategiaFinalizacion, AlistamientoFinalizacion);

    const formularioFull = relacionarInformacionFullById(id, informacionRelacionadaIncio, informacionRelacionadaDesarrollo, informacionRelacionadaFinalizacion);
    return formularioFull;
  } catch (error) {
    throw error;
  }
};
const getFormularioDesarrollo = () => {
  return new Promise((resolver, rechazar) => {
    resolver(FormularioRepositorio.TraerFormularioDesarrollo());
  });
};
const getFormularioFinalizacion = () => {
  return new Promise((resolver, rechazar) => {
    resolver(FormularioRepositorio.TraerFormularioFinalizacion());
  });
};

const descargarDocumento = async (id) => {
  try {
    const document = await FormularioRepositorio.findById(id);

    if (document == null) {
      throw new Error("No se ha encontrado el documento");
    }

    return await generarPDF(document);
  } catch (error) {
    throw new Error(error.message);
  }
};

function relacionarInformacion(formulario, estrategia, alistamiento) {
  return formulario.map(form => {
    const estrategiaRelacionada = estrategia.filter(est => est.formulario_id === form.id_formulario);
    const alistamientoRelacionado = alistamiento.filter(alist => alist.formulario_id === form.id_formulario);
    return {
      formulario: form,
      estrategia: estrategiaRelacionada.length === 1 ? estrategiaRelacionada[0].estrategia : estrategiaRelacionada.map(est => est.estrategia),
      alistamiento: alistamientoRelacionado.length === 1 ? alistamientoRelacionado[0].alistamiento : alistamientoRelacionado.map(est => est.alistamiento)
    };
  });
}

function relacionarInformacionFull(formulariosInicio, formulariosDesarrollo, formulariosFinal) {
  return formulariosInicio.map(formInicio => {
    const idRelacion = formInicio.formulario.id_relacion;
    const desarrollo = formulariosDesarrollo.filter(est => est.formulario.id_relacion === idRelacion);
    const finalizacion = formulariosFinal.filter(alist => alist.formulario.id_relacion === idRelacion);
    
    return {
      formularioInicio: formInicio,
      formulariosDesarrollo: desarrollo,
      formularioFinal: finalizacion
    };
  });
}

function relacionarInformacionFullById(id,formulariosInicio, formulariosDesarrollo, formulariosFinal) {
    const idRelacion = id;

    const inicio = formulariosInicio.filter(est => est.formulario.id_relacion == idRelacion);
    const desarrollo = formulariosDesarrollo.filter(est => est.formulario.id_relacion == idRelacion);
    const finalizacion = formulariosFinal.filter(alist => alist.formulario.id_relacion == idRelacion);

    if (inicio.length === 0) {
      return;     
    }

    return {
      formularioInicio: inicio.length == 1? inicio[0] : inicio,
      formulariosDesarrollo: desarrollo.length == 1? desarrollo[0] : desarrollo,
      formularioFinal: finalizacion.length == 1? desarrollo[0] : desarrollo
    };
}

const findByIdInicio = async (id) => {
  return new Promise((resolver, rechazar) => {
    resolver(FormularioRepositorio.findByIdInicio(id));
  });
};
const findByIdDesarrollo = async (id) => {
  return new Promise((resolver, rechazar) => {
    resolver(FormularioRepositorio.findByIdDesarrollo(id));
  });
};
const findByIdFinalizacion = async (id) => {
  return new Promise((resolver, rechazar) => {
    resolver(FormularioRepositorio.findByIdFinalizacion(id));
  });
};

const crearFormularioInicio = (documento) => {
  return new Promise(async (resolver, rechazar) => {
    try {
      const nuevoDocumento = await FormularioRepositorio.CrearFormularioInicio(
        documento
      );
      resolver(nuevoDocumento);
    } catch (error) {
      rechazar(error.message);
    }
  });
};
const CrearFormularioFinalizacion = (documento) => {
  return new Promise(async (resolver, rechazar) => {
    try {
      const nuevoDocumento =
        await FormularioRepositorio.CrearFormularioFinalizacion(documento);
      resolver(nuevoDocumento);
    } catch (error) {
      rechazar(error.message);
    }
  });
};
const crearFormularioDesarrollo = (documento) => {
  return new Promise(async (resolver, rechazar) => {
    try {
      const nuevoDocumento =
        await FormularioRepositorio.CrearFormularioDesarrollo(documento);
      resolver(nuevoDocumento);
    } catch (error) {
      rechazar(error.message);
    }
  });
};

const crearFormulario = (documento) =>{
  return new Promise(async (resolver, rechazar) => {
    try {
      const idInicio = await FormularioRepositorio.CrearFormularioInicio(documento.formularioInicio);
      const idDesarrollo = await FormularioRepositorio.CrearFormularioDesarrollo(documento.formularioDesarrollo)
      const idFinalizacion = await FormularioRepositorio.CrearFormularioFinalizacion(documento.formularioFinalizacion)
      const formularioCreado = await FormularioRepositorio.crearRelacionFormulario(idInicio,idDesarrollo,idFinalizacion);
      resolver(formularioCreado);
    } catch (error) {
      rechazar(error.message);
    }
  });

}

const eliminarFormulario = async (id) => {
  try {
    console.log(`Intentando eliminar el formulario con ID: ${id}`);
    const resultado = await FormularioRepositorio.EliminarFormulario(id);
    console.log(`Resultado de la eliminación: ${resultado}`);
    return resultado;
  } catch (error) {
    console.error(`Error al eliminar el formulario: ${error.message}`);
    throw error;
  }
};

export default {
  descargarDocumento,
  getFormularioInicio,
  getFormularioDesarrollo,
  getFormularioFinalizacion,
  crearFormularioInicio,
  crearFormularioDesarrollo,
  CrearFormularioFinalizacion,
  findByIdInicio,
  findByIdDesarrollo,
  findByIdFinalizacion,
  crearFormulario,
  getFormularioByid,
  eliminarFormulario,
};
