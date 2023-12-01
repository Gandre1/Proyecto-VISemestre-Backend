import {
  ResponseAlistamiento,
  ResponseEstrategias,
  ResponseFormularioInicio,
  ResponseFormularioInicioFull,
} from "../../models/FormularioModels.js";
import { conexion } from "../connection/dbConection.js";

const crearRelacionFormulario = async (
  idInicio,
  idDesarrollo,
  idFinalizacion
) => {
  const con = conexion();

  
  try {
    await con.beginTransaction();

    const insertFormularioInicioQuery =
      "INSERT INTO `relacion_formularios` (`id_formulario_inicio`, `id_formulario_desarrollo`, `id_formulario_finalizacion`) VALUES (?, ?, ?)";

    const formularioInicioResult = await new Promise((resolve, reject) => {
      con.query(
        insertFormularioInicioQuery,
        [idInicio, idDesarrollo, idFinalizacion],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });

    await con.commit();

    return true;
  } catch (err) {
    await con.rollback();
    console.error("Error al insertar documento:", err);
    throw err;
  } finally {
    con.end();
  }
};



const CrearFormularioInicio = async (formulario) => {
  const con = conexion();

  try {
    console.log(formulario);
    await con.beginTransaction();

    const insertFormularioInicioQuery =
      "INSERT INTO `formularioinicio` (`dia`, `hora`) VALUES (?, ?)";

    const formularioInicioResult = await new Promise((resolve, reject) => {
      con.query(
        insertFormularioInicioQuery,
        [formulario.dia, formulario.hora],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });

    const formularioInicioId = formularioInicioResult;

    const insertAlistamientoInicioQuery =
      "INSERT INTO `alistamientoinicio` (`formulario_id`, `alistamiento`) VALUES (?, ?)";

    for (const alistamiento of formulario.alistamiento) {
      await con.query(insertAlistamientoInicioQuery, [
        formularioInicioId,
        alistamiento,
      ]);
    }

    const insertEstrategiaInicioQuery =
      "INSERT INTO `estrategiasinicio` (`formulario_id`, `estrategia`) VALUES (?, ?)";

    for (const estrategia of formulario.estrategias) {
      await con.query(insertEstrategiaInicioQuery, [
        formularioInicioId,
        estrategia,
      ]);
    }
    await con.commit();

    return formularioInicioId;
  } catch (err) {
    await con.rollback();
    console.error("Error al insertar documento:", err);
    throw err;
  } finally {
    con.end();
  }
};

const CrearFormularioDesarrollo = async (formulario) => {
  const con = conexion();

  try {
    await con.beginTransaction();

    const insertFormularioInicioQuery =
      "INSERT INTO `formulariodesarrollo` (`dia`, `hora`) VALUES (?, ?)";

    const formularioInicioResult = await new Promise((resolve, reject) => {
      con.query(
        insertFormularioInicioQuery,
        [formulario.dia, formulario.hora],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });

    const formularioInicioId = formularioInicioResult;

    const insertAlistamientoInicioQuery =
      "INSERT INTO `alistamientodesarrollo` (`formulario_id`, `alistamiento`) VALUES (?, ?)";

    for (const alistamiento of formulario.alistamiento) {
      await con.query(insertAlistamientoInicioQuery, [
        formularioInicioId,
        alistamiento,
      ]);
    }

    const insertEstrategiaInicioQuery =
      "INSERT INTO `estrategiasdesarrollo` (`formulario_id`, `estrategia`) VALUES (?, ?)";

    for (const estrategia of formulario.estrategias) {
      await con.query(insertEstrategiaInicioQuery, [
        formularioInicioId,
        estrategia,
      ]);
    }
    await con.commit();

    return formularioInicioId;
  } catch (err) {
    await con.rollback();
    console.error("Error al insertar documento:", err);
    throw err;
  } finally {
    con.end();
  }
};

const CrearFormularioFinalizacion = async (formulario) => {
  const con = conexion();

  try {
    await con.beginTransaction();

    const insertFormularioInicioQuery =
      "INSERT INTO `formulariofinalizacion` (`dia`, `hora`) VALUES (?, ?)";

    const formularioInicioResult = await new Promise((resolve, reject) => {
      con.query(
        insertFormularioInicioQuery,
        [formulario.dia, formulario.hora],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });

    const formularioInicioId = formularioInicioResult;
    console.log(formularioInicioId);

    const insertAlistamientoInicioQuery =
      "INSERT INTO `alistamientofinalizacion` (`formulario_id`, `alistamiento`) VALUES (?, ?)";

    for (const alistamiento of formulario.alistamiento) {
      await con.query(insertAlistamientoInicioQuery, [
        formularioInicioId,
        alistamiento,
      ]);
    }

    const insertEstrategiaInicioQuery =
      "INSERT INTO `estrategiasfinalizacion` (`formulario_id`, `estrategia`) VALUES (?, ?)";

    for (const estrategia of formulario.estrategias) {
      await con.query(insertEstrategiaInicioQuery, [
        formularioInicioId,
        estrategia,
      ]);
    }
    await con.commit();

    return formularioInicioId;
  } catch (err) {
    await con.rollback();
    console.error("Error al insertar documento:", err);
    throw err;
  } finally {
    con.end();
  }
};

const TraerFormularioInicio = () => {
  return new Promise((resolve, reject) => {
    const con = conexion();

    con.query(
      "SELECT fi.*, ei.estrategia, ai.alistamiento,  rf.id AS id_relacion FROM formularioinicio fi INNER JOIN estrategiasinicio ei ON fi.id = ei.formulario_id INNER JOIN alistamientoinicio ai ON fi.id = ai.formulario_id INNER JOIN relacion_formularios rf on rf.id_formulario_inicio = fi.id",
      async (error, result) => {
        if (error) {
          console.error("Error al obtener documentos:", error);
          con.end();
          reject(error);
          return;
        }
        const documentosAgrupados = {};

        const obtenerDocumentos = () => {
          return new Promise((resolve, reject) => {
            // Mover la declaración del objeto fuera de la función map
            const documentosAgrupados = {};

            const documentosPromesas = result.map(async (documentoRow) => {
              try {
                const documento = new ResponseFormularioInicio(documentoRow);
                const id = documento.id;

                if (id in documentosAgrupados) {
                  documentosAgrupados[id].estrategias.push(
                    documento.estrategias
                  );
                  documentosAgrupados[id].alistamiento.push(
                    documento.alistamiento
                  );
                } else {
                  documentosAgrupados[id] = {
                    id_relacion: documento.id_relacion,
                    id: documento.id,
                    dia: documento.dia,
                    hora: documento.hora,
                    estrategias: [documento.estrategias],
                    alistamiento: [documento.alistamiento],
                  };
                }
                return documento; 
              } catch (error) {
                reject(error);
              }
            });

            Promise.all(documentosPromesas)
              .then(() => resolve(Object.values(documentosAgrupados)))
              .catch((error) => reject(error));
          });
        };

        obtenerDocumentos()
          .then((documentos) => {            
            const respuestaFormateada = documentos.map((documento) => {
              return {
                id_relacion: documento.id_relacion,
                id_formulario: documento.id,
                dia: documento.dia, 
                hora: documento.hora,
              };
            });

            con.end();
            resolve(respuestaFormateada);
          })
          .catch((error) => {
            con.end();
            reject(error);
          });
      }
    );
  });
};

const TraerFormularioDesarrollo = () => {
  return new Promise((resolve, reject) => {
    const con = conexion();

    con.query(
      "SELECT fi.*, ei.estrategia, ai.alistamiento, rf.id as id_relacion FROM formulariodesarrollo fi INNER JOIN estrategiasdesarrollo ei ON fi.id = ei.formulario_id INNER JOIN alistamientodesarrollo ai ON fi.id = ai.formulario_id INNER JOIN relacion_formularios rf on rf.id_formulario_desarrollo = fi.id",
      async (error, result) => {
        if (error) {
          console.error("Error al obtener documentos:", error);
          con.end();
          reject(error);
          return;
        }
        const documentosAgrupados = {};

        const obtenerDocumentos = () => {
          return new Promise((resolve, reject) => {

            const documentosAgrupados = {};

            const documentosPromesas = result.map(async (documentoRow) => {
              try {
                const documento = new ResponseFormularioInicio(documentoRow);
                const id = documento.id; 
                if (id in documentosAgrupados) {
                  documentosAgrupados[id].estrategias.push(
                    documento.estrategias
                  );
                  documentosAgrupados[id].alistamiento.push(
                    documento.alistamiento
                  );
                } else {
                  documentosAgrupados[id] = {
                    id_relacion: documento.id_relacion,
                    id: documento.id,
                    dia: documento.dia,
                    hora: documento.hora,
                    estrategias: [documento.estrategias],
                    alistamiento: [documento.alistamiento],
                  };
                }
                return documento;
              } catch (error) {
                reject(error);
              }
            });

            Promise.all(documentosPromesas)
              .then(() => resolve(Object.values(documentosAgrupados)))
              .catch((error) => reject(error));
          });
        };

        obtenerDocumentos()
          .then((documentos) => {
            const respuestaFormateada = documentos.map((documento) => {
              return {
                id_relacion: documento.id_relacion,
                id_formulario: documento.id,
                dia: documento.dia, 
                hora: documento.hora, 
              };
            });

            con.end();
            resolve(respuestaFormateada);
          })
          .catch((error) => {
            con.end();
            reject(error);
          });
      }
    );
  });
};

const TraerFormularioFinalizacion = () => {
  return new Promise((resolve, reject) => {
    const con = conexion();

    con.query(
      "SELECT fi.*, ei.estrategia, ai.alistamiento, rf.id AS id_relacion FROM formulariofinalizacion fi INNER JOIN estrategiasfinalizacion ei ON fi.id = ei.formulario_id INNER JOIN alistamientofinalizacion ai ON fi.id = ai.formulario_id INNER JOIN relacion_formularios rf on rf.id_formulario_finalizacion = fi.id ",
      async (error, result) => {
        if (error) {
          console.error("Error al obtener documentos:", error);
          con.end();
          reject(error);
          return;
        }
        const documentosAgrupados = {};

        const obtenerDocumentos = () => {
          return new Promise((resolve, reject) => {
            const documentosAgrupados = {};

            const documentosPromesas = result.map(async (documentoRow) => {
              try {
                const documento = new ResponseFormularioInicio(documentoRow);
                const id = documento.id;

                if (id in documentosAgrupados) {
                  documentosAgrupados[id].estrategias.push(
                    documento.estrategias
                  );
                  documentosAgrupados[id].alistamiento.push(
                    documento.alistamiento
                  );
                } else {
                  documentosAgrupados[id] = {
                    id_relacion: documento.id_relacion,
                    id: documento.id,
                    dia: documento.dia,
                    hora: documento.hora,
                    estrategias: [documento.estrategias],
                    alistamiento: [documento.alistamiento],
                  };
                }
                return documento;
              } catch (error) {
                reject(error);
              }
            });

            Promise.all(documentosPromesas)
              .then(() => resolve(Object.values(documentosAgrupados)))
              .catch((error) => reject(error));
          });
        };

        obtenerDocumentos()
          .then((documentos) => {
            const respuestaFormateada = documentos.map((documento) => {
              return {
                id_relacion: documento.id_relacion,
                id_formulario: documento.id,
                dia: documento.dia, 
                hora: documento.hora, 
              };
            });

            con.end();
            resolve(respuestaFormateada);
          })
          .catch((error) => {
            con.end();
            reject(error);
          });
      }
    );
  });
};

const getEstrategiasFinalizacion = () => {
  return new Promise((resolve, reject) => {
    const con = conexion();
    const query =
      "SELECT estrategiasfinalizacion.estrategia, estrategiasfinalizacion.formulario_id FROM formulariofinalizacion INNER JOIN estrategiasfinalizacion ON estrategiasfinalizacion.formulario_id = formulariofinalizacion.id";
    con.query(query, async (error, result) => {
      if (error) {
        console.error("Error al obtener documentos:", error);
        con.end();
        reject(error);
        return;
      }
      const documentosAgrupados = {};

      const obtenerDocumentos = () => {
        return new Promise((resolve, reject) => {
          const documentosAgrupados = {};

          const documentosPromesas = result.map(async (documentoRow) => {
            try {
              const documento = new ResponseEstrategias(documentoRow);

              return documento;
            } catch (error) {
              reject(error);
            }
          });

          Promise.all(documentosPromesas)
            .then((documentos) => resolve(documentos))
            .catch((error) => reject(error));
        });
      };

      obtenerDocumentos()
        .then((documentos) => {
          con.end();
          resolve(documentos);
        })
        .catch((error) => {
          con.end();
          reject(error);
        });
    });
  });
};

const getAlistamientosFinalizacion = () => {
  return new Promise((resolve, reject) => {
    const con = conexion();
    const query =
      "SELECT alistamientofinalizacion.formulario_id, alistamientofinalizacion.alistamiento  FROM formulariofinalizacion INNER JOIN alistamientofinalizacion ON alistamientofinalizacion.formulario_id = formulariofinalizacion.id";
    con.query(query, async (error, result) => {
      if (error) {
        console.error("Error al obtener documentos:", error);
        con.end();
        reject(error);
        return;
      }
      const documentosAgrupados = {};

      const obtenerDocumentos = () => {
        return new Promise((resolve, reject) => {
          const documentosAgrupados = {};

          const documentosPromesas = result.map(async (documentoRow) => {
            try {
              const documento = new ResponseAlistamiento(documentoRow);

              return documento;
            } catch (error) {
              reject(error);
            }
          });

          Promise.all(documentosPromesas)
            .then((documentos) => resolve(documentos))
            .catch((error) => reject(error));
        });
      };

      obtenerDocumentos()
        .then((documentos) => {
          con.end();
          resolve(documentos);
        })
        .catch((error) => {
          con.end();
          reject(error);
        });
    });
  });
};

const getEstrategiasDesarrollo = () => {
  return new Promise((resolve, reject) => {
    const con = conexion();
    const query =
      "SELECT estrategiasdesarrollo.estrategia, estrategiasdesarrollo.formulario_id FROM formulariodesarrollo INNER JOIN estrategiasdesarrollo ON estrategiasdesarrollo.formulario_id = formulariodesarrollo.id";
    con.query(query, async (error, result) => {
      if (error) {
        console.error("Error al obtener documentos:", error);
        con.end();
        reject(error);
        return;
      }
      const documentosAgrupados = {};

      const obtenerDocumentos = () => {
        return new Promise((resolve, reject) => {
          const documentosAgrupados = {};

          const documentosPromesas = result.map(async (documentoRow) => {
            try {
              const documento = new ResponseEstrategias(documentoRow);

              return documento;
            } catch (error) {
              reject(error);
            }
          });

          Promise.all(documentosPromesas)
            .then((documentos) => resolve(documentos))
            .catch((error) => reject(error));
        });
      };

      obtenerDocumentos()
        .then((documentos) => {
          con.end();
          resolve(documentos);
        })
        .catch((error) => {
          con.end();
          reject(error);
        });
    });
  });
};

const getAlistamientosDesarrollo = () => {
  return new Promise((resolve, reject) => {
    const con = conexion();
    const query =
      "SELECT alistamientodesarrollo.formulario_id, alistamientodesarrollo.alistamiento  FROM formulariodesarrollo INNER JOIN alistamientodesarrollo ON alistamientodesarrollo.formulario_id = formulariodesarrollo.id";
    con.query(query, async (error, result) => {
      if (error) {
        console.error("Error al obtener documentos:", error);
        con.end();
        reject(error);
        return;
      }
      const documentosAgrupados = {};

      const obtenerDocumentos = () => {
        return new Promise((resolve, reject) => {
      
          const documentosAgrupados = {};

          const documentosPromesas = result.map(async (documentoRow) => {
            try {
              const documento = new ResponseAlistamiento(documentoRow);

              return documento;
            } catch (error) {
              reject(error);
            }
          });

          Promise.all(documentosPromesas)
            .then((documentos) => resolve(documentos))
            .catch((error) => reject(error));
        });
      };

      obtenerDocumentos()
        .then((documentos) => {
          con.end();
          resolve(documentos);
        })
        .catch((error) => {
          con.end();
          reject(error);
        });
    });
  });
};

const getEstrategiasInicio = () => {
  return new Promise((resolve, reject) => {
    const con = conexion();
    const query =
      "SELECT estrategiasinicio.estrategia, estrategiasinicio.formulario_id FROM formularioinicio INNER JOIN estrategiasinicio ON estrategiasinicio.formulario_id = formularioinicio.id";
    con.query(query, async (error, result) => {
      if (error) {
        console.error("Error al obtener documentos:", error);
        con.end();
        reject(error);
        return;
      }
      const documentosAgrupados = {};

      const obtenerDocumentos = () => {
        return new Promise((resolve, reject) => {
          const documentosAgrupados = {};

          const documentosPromesas = result.map(async (documentoRow) => {
            try {
              const documento = new ResponseEstrategias(documentoRow);

              return documento;
            } catch (error) {
              reject(error);
            }
          });

          Promise.all(documentosPromesas)
            .then((documentos) => resolve(documentos))
            .catch((error) => reject(error));
        });
      };

      obtenerDocumentos()
        .then((documentos) => {
          con.end();
          resolve(documentos);
        })
        .catch((error) => {
          con.end();
          reject(error);
        });
    });
  });
};

const getAlistamientosInicio = () => {
  return new Promise((resolve, reject) => {
    const con = conexion();
    const query =
      "SELECT alistamientoinicio.formulario_id, alistamientoinicio.alistamiento  FROM formularioinicio INNER JOIN alistamientoinicio ON alistamientoinicio.formulario_id = formularioinicio.id";
    con.query(query, async (error, result) => {
      if (error) {
        console.error("Error al obtener documentos:", error);
        con.end();
        reject(error);
        return;
      }
      const documentosAgrupados = {};

      const obtenerDocumentos = () => {
        return new Promise((resolve, reject) => {
          const documentosAgrupados = {};

          const documentosPromesas = result.map(async (documentoRow) => {
            try {
              const documento = new ResponseAlistamiento(documentoRow);

              return documento;
            } catch (error) {
              reject(error);
            }
          });

          Promise.all(documentosPromesas)
            .then((documentos) => resolve(documentos))
            .catch((error) => reject(error));
        });
      };

      obtenerDocumentos()
        .then((documentos) => {
          con.end();
          resolve(documentos);
        })
        .catch((error) => {
          con.end();
          reject(error);
        });
    });
  });
};

const findByIdDesarrollo = (id) => {
  return new Promise((resolve, reject) => {
    const con = conexion();

    con.query(
      `SELECT fi.*, ei.estrategia, ai.alistamiento, rf.id as id_relacion FROM formulariodesarrollo fi INNER JOIN estrategiasdesarrollo ei ON fi.id = ei.formulario_id INNER JOIN alistamientodesarrollo ai ON fi.id = ai.formulario_id INNER JOIN relacion_formularios rf on rf.id_formulario_desarrollo = fi.id WHERE fi.id = ${id}`,
      async (error, result) => {
        if (error) {
          console.error("Error al obtener documentos:", error);
          con.end();
          reject(error);
          return;
        }
        const documentosAgrupados = {};

        const obtenerDocumentos = () => {
          return new Promise((resolve, reject) => {
            const documentosAgrupados = {};

            const documentosPromesas = result.map(async (documentoRow) => {
              try {
                const documento = new ResponseFormularioInicio(documentoRow);
                const id = documento.id; 
                if (id in documentosAgrupados) {
                  documentosAgrupados[id].estrategias.push(
                    documento.estrategias
                  );
                  documentosAgrupados[id].alistamiento.push(
                    documento.alistamiento
                  );
                } else {
                  documentosAgrupados[id] = {
                    id_relacion: documento.id_relacion,
                    id: documento.id,
                    dia: documento.dia,
                    hora: documento.hora,
                    estrategias: [documento.estrategias],
                    alistamiento: [documento.alistamiento],
                  };
                }
                return documento;
              } catch (error) {
                reject(error);
              }
            });
      
            Promise.all(documentosPromesas)
              .then(() => resolve(Object.values(documentosAgrupados)))
              .catch((error) => reject(error));
          });
        };

        obtenerDocumentos()
          .then((documentos) => {
            const respuestaFormateada = documentos.map((documento) => {
              return {
                id_relacion: documento.id_relacion,
                id: documento.id,
                dia: documento.dia, 
                hora: documento.hora, 
              };
            });

            con.end();
            resolve(respuestaFormateada);
          })
          .catch((error) => {
            con.end();
            reject(error);
          });
      }
    );
  });
};

const findByIdFinalizacion = (id) => {
  return new Promise((resolve, reject) => {
    const con = conexion();

    con.query(
      `SELECT fi.*, ei.estrategia, ai.alistamiento, rf.id AS id_relacion FROM formulariofinalizacion fi INNER JOIN estrategiasfinalizacion ei ON fi.id = ei.formulario_id INNER JOIN alistamientofinalizacion ai ON fi.id = ai.formulario_id INNER JOIN relacion_formularios rf on rf.id_formulario_finalizacion = fi.id WHERE fi.id = ${id}`,
      async (error, result) => {
        if (error) {
          console.error("Error al obtener documentos:", error);
          con.end();
          reject(error);
          return;
        }
        const documentosAgrupados = {};

        const obtenerDocumentos = () => {
          return new Promise((resolve, reject) => {
          
            const documentosAgrupados = {};

            const documentosPromesas = result.map(async (documentoRow) => {
              try {
                const documento = new ResponseFormularioInicio(documentoRow);
                const id = documento.id; 

                if (id in documentosAgrupados) {
                  documentosAgrupados[id].estrategias.push(
                    documento.estrategias
                  );
                  documentosAgrupados[id].alistamiento.push(
                    documento.alistamiento
                  );
                } else {
                  documentosAgrupados[id] = {
                    id: documento.id,
                    dia: documento.dia,
                    hora: documento.hora,
                    estrategias: [documento.estrategias],
                    alistamiento: [documento.alistamiento],
                  };
                }
                return documento; 
              } catch (error) {
                reject(error);
              }
            });
          
            Promise.all(documentosPromesas)
              .then(() => resolve(Object.values(documentosAgrupados)))
              .catch((error) => reject(error));
          });
        };

        obtenerDocumentos()
          .then((documentos) => {

            const respuestaFormateada = documentos.map((documento) => {
              return {
                id: documento.id,
                dia: documento.dia, 
                hora: documento.hora,
                estrategias: documento.estrategias,
                alistamiento: documento.alistamiento,
              };
            });

            con.end();
            resolve(respuestaFormateada);
          })
          .catch((error) => {
            con.end();
            reject(error);
          });
      }
    );
  });
};

const findByIdInicio = (id) => {
  return new Promise((resolve, reject) => {
    const con = conexion();

    con.query(
      `SELECT fi.*, ei.estrategia, ai.alistamiento,  rf.id AS id_relacion FROM formularioinicio fi INNER JOIN estrategiasinicio ei ON fi.id = ei.formulario_id INNER JOIN alistamientoinicio ai ON fi.id = ai.formulario_id INNER JOIN relacion_formularios rf on rf.id_formulario_inicio = fi.id WHERE fi.id = ${id}`,
      async (error, result) => {
        if (error) {
          console.error("Error al obtener documentos:", error);
          con.end();
          reject(error);
          return;
        }
        const documentosAgrupados = {};

        const obtenerDocumentos = () => {
          return new Promise((resolve, reject) => {
           
            const documentosAgrupados = {};

            const documentosPromesas = result.map(async (documentoRow) => {
              try {
                const documento = new ResponseFormularioInicio(documentoRow);
                const id = documento.id;

                if (id in documentosAgrupados) {
                  documentosAgrupados[id].estrategias.push(
                    documento.estrategias
                  );
                  documentosAgrupados[id].alistamiento.push(
                    documento.alistamiento
                  );
                } else {
                  documentosAgrupados[id] = {
                    id: documento.id,
                    dia: documento.dia,
                    hora: documento.hora,
                    estrategias: [documento.estrategias],
                    alistamiento: [documento.alistamiento],
                  };
                }
                return documento;
              } catch (error) {
                reject(error);
              }
            });

            Promise.all(documentosPromesas)
              .then(() => resolve(Object.values(documentosAgrupados)))
              .catch((error) => reject(error));
          });
        };

        obtenerDocumentos()
          .then((documentos) => {
            const respuestaFormateada = documentos.map((documento) => {
              return {
                id_relacion: documento.id_relacion,
                id: documento.id,
                dia: documento.dia, 
                hora: documento.hora,
              };
            });

            con.end();
            resolve(respuestaFormateada);
          })
          .catch((error) => {
            con.end();
            reject(error);
          });
      }
    );
  });
};

const EliminarFormulario = async (id) => {
  const con = conexion();

  try {
    await con.beginTransaction();

    console.log("Intentando eliminar relaciones...");
    const deleteRelacionQuery =
      "DELETE FROM `relacion_formularios` WHERE `id_formulario_inicio` = ? OR `id_formulario_desarrollo` = ? OR `id_formulario_finalizacion` = ?";
    await con.query(deleteRelacionQuery, [id, id, id]);

    console.log("Intentando eliminar estrategias...");
    const deleteEstrategiasQuery =
      "DELETE FROM `estrategiasinicio` WHERE `formulario_id` = ?";
    await con.query(deleteEstrategiasQuery, [id]);

    await con.query("DELETE FROM `estrategiasdesarrollo` WHERE `formulario_id` = ?", [id]);

    await con.query("DELETE FROM `estrategiasfinalizacion` WHERE `formulario_id` = ?", [id]);

    console.log("Intentando eliminar alistamientos...");
    const deleteAlistamientosQuery =
      "DELETE FROM `alistamientoinicio` WHERE `formulario_id` = ?";
    await con.query(deleteAlistamientosQuery, [id]);

    await con.query("DELETE FROM `alistamientodesarrollo` WHERE `formulario_id` = ?", [id]);

    await con.query("DELETE FROM `alistamientofinalizacion` WHERE `formulario_id` = ?", [id]);

    console.log("Intentando eliminar formularios...");
    const deleteFormularioQuery =
      "DELETE FROM `formularioinicio` WHERE `id` = ?";
    await con.query(deleteFormularioQuery, [id]);

    await con.query("DELETE FROM `formulariodesarrollo` WHERE `id` = ?", [id]);

    await con.query("DELETE FROM `formulariofinalizacion` WHERE `id` = ?", [id]);

    console.log("Restableciendo contadores AUTO_INCREMENT...")
    
    await con.query("ALTER TABLE `formularioinicio` AUTO_INCREMENT = 1");

    await con.query("ALTER TABLE `formulariodesarrollo` AUTO_INCREMENT = 1");

    await con.query("ALTER TABLE `formulariofinalizacion` AUTO_INCREMENT = 1");
    
    await con.query("ALTER TABLE `relacion_formularios` AUTO_INCREMENT = 1");

    await con.commit();

    console.log("Eliminación exitosa.");
    return true;
  } catch (err) {
    await con.rollback();
    console.error("Error al eliminar documento:", err);
    throw err;
  } finally {
    con.end();
  }
};

export default {
  CrearFormularioInicio,
  CrearFormularioDesarrollo,
  CrearFormularioFinalizacion,
  TraerFormularioInicio,
  findByIdInicio,
  findByIdDesarrollo,
  TraerFormularioFinalizacion,
  TraerFormularioDesarrollo,
  findByIdFinalizacion,
  getEstrategiasInicio,
  getAlistamientosInicio,
  getAlistamientosDesarrollo,
  getEstrategiasDesarrollo,
  getAlistamientosFinalizacion,
  getEstrategiasFinalizacion,
  crearRelacionFormulario,
  EliminarFormulario,
};
