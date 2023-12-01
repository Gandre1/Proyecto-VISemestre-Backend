import pdf from "html-pdf";
import fs from "fs";

export const template = (documento) => {
  
 console.log(documento);

  console.log(documento.formularioInicio.estrategia == []);

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }
  
      table {
        width: 100%;
        border-collapse: collapse;
      }
  
      th, td {
        border: 1px solid #ccc;
        padding: 15px;
        text-align: left;
      }
  
      th {
        background-color: #f2f2f2;
      }
  
      h2 {
        color: #333;
        margin-top: 0;
      }
    </style>
    <title>Tabla con 3 Columnas</title>
  </head>
  <body>
  
  <table>
    <tr>
      <th>HORARIO</th>
      <th>ESTRATEGIAS</th>
      <th>ALISTAMIENTO </th>
    </tr>
    <tr>
      <td>
        <p>${documento.formularioInicio.formulario.hora}</p>
      </td>
      <td>
        <b>Iniciacion</b>
      <ul>
      ${documento.formularioInicio.estrategia.length == [] ? documento.formularioInicio.estrategia.map((estrategia, index) => {
      `
        <li>${estrategia}</li>
      `;
      }): documento.formularioInicio.estrategia }
    </ul>
      </td>
      <td>
      <ul>
        ${documento.formularioInicio.alistamiento == [] ? documento.formularioInicio.alistamiento.map((alistamiento, index) => {
          return `
          <li>${alistamiento}</li>
        `
        }): `<li>${documento.formularioInicio.alistamiento}</li>` }
      </ul>
      </td>
    </tr>
    <tr>
      <td>
        <p>${documento.formulariosDesarrollo.formulario.hora}</p>
      </td>
      <td>
        <b>Desarrollo</b>
      <ul>
        ${documento.formulariosDesarrollo.estrategia == [] ? documento.formulariosDesarrollo.estrategia.map((estrategia, index) => {
          return `
          <li>${estrategia}</li>
        `
        }): documento.formulariosDesarrollo.estrategia }
      </ul>
      </td>
      <td>
      <ul>
        ${documento.formulariosDesarrollo.alistamiento == [] ? documento.formulariosDesarrollo.alistamiento.map((alistamiento, index) => {
          return `
          <li>${alistamiento}</li>
        `
        }): documento.formulariosDesarrollo.alistamiento }
      </ul>
      </td>
    </tr>
    <tr>
      <td>
        <p>${documento.formularioFinal.formulario.hora}</p>
      </td>
      <td>
        <b>Finalizacion</b>
        <ul>
        ${documento.formularioFinal.estrategia == [] ? documento.formularioFinal.estrategia.map(estrategia => `<li>${estrategia}</li>`): documento.formularioFinal.estrategia }
        </ul>
      </td>
      <td>
      <ul>
      ${documento.formularioFinal.alistamiento == [] ? documento.formularioFinal.alistamiento.map((alistamiento, index) => {
        return `
        <li>${alistamiento}</li>
      `
      }): documento.formularioFinal.alistamiento }
    </ul>
      </td>
    </tr>
  </table>
  
  </body>
  </html>
  
`;
};

export const generarPDF = (htmlContent, callback) => {
  const options = { format: "Letter" };
  pdf.create(htmlContent, options).toFile(callback);
};
