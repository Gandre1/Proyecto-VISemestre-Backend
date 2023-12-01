class FormularioInicio {
  constructor(formulario) {
    this.dia = formulario.dia;
    this.hora = formulario.hora;
    this.estrategias = formulario.estrategias;
    this.alistamiento = formulario.alistamiento;
  }
}

class FormularioDesarrollo {
  constructor(formulario) {
    this.dia = formulario.dia;
    this.hora = formulario.hora;
    this.estrategias = formulario.estrategias;
    this.alistamiento = formulario.alistamiento;
  }
}

class FormularioFinalizacion {
  constructor(formulario) {
    this.dia = formulario.dia;
    this.hora = formulario.hora;
    this.estrategias = formulario.estrategias;
    this.alistamiento = formulario.alistamiento;
  }
}

class ResponseFormularioInicio {
  constructor(formulario) {
    this.id_relacion = formulario.id_relacion
    this.id = formulario.id;
    this.dia = formulario.dia;
    this.hora = formulario.hora;
    this.estrategias = formulario.estrategia;
    this.alistamiento = formulario.alistamiento;
  }
}
class ResponseFormularioInicioFull {
  constructor(formulario) {
    this.id = formulario.id_formulario_relacion;

    this.id_formulario_inicio = formulario.id_formulario_inicio;
    this.dia_formulario_inicio = formulario.dia_formulario_inicio;
    this.hora_formulario_incio = formulario.hora_formulario_incio;
    this.estrategia_inicio = formulario.estrategia_inicio;
    this.alistamiento_inicio = formulario.alistamiento_inicio;

    this.id_formulario_desarrollo = formulario.id_formulario_desarrollo;
    this.estrategia_desarrollo = formulario.estrategia_desarrollo;
    this.alistamiento_desarrollo = formulario.alistamiento_desarrollo;
    this.dia_formulario_desarrollo = formulario.dia_formulario_desarrollo;
    this.hora_formulario_desarollo = formulario.hora_formulario_desarollo;

    this.id_formulario_finalizacion = formulario.id_formulario_finalizacion;
    this.estrategia_finalizacion = formulario.estrategia_finalizacion;
    this.alistamientos_finalizacion = formulario.alistamientos_finalizacion;
    this.dia_formulario_finalizacion = formulario.dia_formulario_finalizacion;
    this.hora_formulario_finalizacion = formulario.dia_formulario_finalizacion;
  }
}

class ResponseEstrategias {
  constructor(formulario){

    this.formulario_id = formulario.formulario_id
    this.estrategia = formulario.estrategia

  }
}
class ResponseAlistamiento {
  constructor(formulario){
    this.formulario_id = formulario.formulario_id
    this.alistamiento = formulario.alistamiento
  }
}

export {
  FormularioInicio,
  FormularioDesarrollo,
  FormularioFinalizacion,
  ResponseFormularioInicio,
  ResponseFormularioInicioFull,
  ResponseEstrategias,
  ResponseAlistamiento
};
