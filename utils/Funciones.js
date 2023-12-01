import { PDFDocument, rgb } from "pdf-lib";

export const generarPDF = async (datos) => {
  const doc = await PDFDocument.create();
  let page = doc.addPage();
  page.setSize(800, 800);

  const fontSize = 8;
  const lineHeight = 40; 
  const additionalWidth = 800; 

  const textOptions = {
    fontSize,
    color: rgb(0, 0, 0),
  };

  const keys = Object.keys(datos);
  const informacionTabla = keys.map((key) => ({
    etiqueta: key.charAt(0).toUpperCase() + key.slice(1),
    valor: datos[key].toString(),
  }));

  let x = 20;
  let y = page.getHeight() - 50;


  informacionTabla.forEach((fila) => {
    const etiquetaText = `${fila.etiqueta}:`;
    const valorText = fila.valor;

   
    const etiquetaHeight = fontSize;
    const valorHeight = fontSize;

   
    if (y - valorHeight < 50) {
      page = doc.addPage([
        (page.getSize().width = additionalWidth),
        page.getSize().height,
      ]);
      y = page.getHeight() - 50;
    }

    page.drawText(etiquetaText, { x, y, ...textOptions });
    page.drawText(valorText, { x, y: y - lineHeight, ...textOptions });
    const lineY = y - lineHeight - 5;
    page.drawLine({
      start: { x: 10, y: lineY },
      end: { x: page.getWidth() - 50, y: lineY },
      color: rgb(0, 0, 0),
    });
    y -= lineHeight + 40;
  });

  const pdfBytes = await doc.save();
  return pdfBytes;
};
