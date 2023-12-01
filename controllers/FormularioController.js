import { Router } from "express";
import respuestasHttp from "../utils/respuestasHttp.js";
import FormularioService from "../services/FormularioService.js";
import { generarPDF, template } from "../utils/templatePdf.js";
import fs from "fs";

const router = Router();

router.get("/find/:id", async (req, res) => {
  const id = req.params.id;
  FormularioService.getFormularioByid(id)
    .then((array) => {
      const templateHTML = template(array);
      generarPDF(templateHTML, (err, response) => {
        if (err) {
          return res.status(500).send(err);
        }

        const { filename } = response;
        const fileStream = fs.createReadStream(filename);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=output.pdf");

        fileStream.pipe(res);
        fileStream.on("end", () => {
          fs.unlinkSync(filename);
        });
      });
    })
    .catch((err) => {
      respuestasHttp.error(
        req,
        res,
        "No es posible leer los documentos",
        err,
        400
      );
    });
});

router.get("/get/all", (req, res) => {
  FormularioService.getFormularioInicio()
    .then((array) => {
      respuestasHttp.exito(req, res, array, 200);
    })
    .catch((err) => {
      respuestasHttp.error(
        req,
        res,
        "No es posible leer los documentos",
        err,
        400
      );
    });
});

router.post("/create", (req, res) => {
  FormularioService.crearFormulario(req.body)
    .then((document) => {
      respuestasHttp.exito(req, res, true, 201);
    })
    .catch((err) => {
      respuestasHttp.error(
        req,
        res,
        "No es posible crear el documento",
        err,
        400
      );
    });
});

router.delete('/eliminar/:id', async (req, res) => {
  const idFormulario = req.params.id;

  try {
    const resultadoEliminacion = await FormularioService.eliminarFormulario(idFormulario);
    res.status(200).json({ mensaje: 'Formulario eliminado con éxito', resultado: resultadoEliminacion });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el formulario', mensaje: error.message });
  }
});

router.get("/pdf", (req, res) => {});

export default router;
