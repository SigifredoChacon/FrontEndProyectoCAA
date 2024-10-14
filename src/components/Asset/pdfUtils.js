import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import FormularioDeBienes from '/src/assets/FormularioDeBienes.pdf';

export const generateFilledPDF = async (userData, formData, assetData, startDate, endDate) => {
    const existingPdfBytes = await fetch(FormularioDeBienes).then((res) =>
        res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];

    const fontSize = 10;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Función para dividir texto en líneas de máximo 117 caracteres
    const wrapText = (text, maxCharsPerLine) => {
        const words = text.split(' ');
        const lines = [];
        let line = '';

        words.forEach((word) => {
            const testLine = line + (line ? ' ' : '') + word; // Asegura espacios entre palabras
            if (testLine.length <= maxCharsPerLine) {
                line = testLine;
            } else {
                lines.push(line); // Guarda la línea actual
                line = word; // Comienza una nueva línea con la palabra que no cabía
            }
        });

        if (line.length > 0) {
            lines.push(line); // Agrega la última línea si tiene contenido
        }

        return lines;
    };

    // Ajustar el texto de observaciones a 117 caracteres por línea
    const observationLines = wrapText(formData.observaciones || 'Sin observaciones', 117);
    let yPosition = 390;

    observationLines.forEach((line) => {
        firstPage.drawText(line, { x: 40, y: yPosition, size: fontSize, font });
        yPosition -= 12;
    });

    //Primera pagina
    firstPage.drawText('X', { x: 47, y: 588, size: fontSize, font });
    if (formData.usoBien === "1") firstPage.drawText('X', { x: 47, y: 520, size: fontSize, font });
    else if (formData.usoBien === "2") firstPage.drawText('X', { x: 47, y: 485, size: fontSize, font });
    else if (formData.usoBien === "3") firstPage.drawText('X', { x: 47, y: 451, size: fontSize, font });
    else if (formData.usoBien === "4") firstPage.drawText('X', { x: 316.5, y: 519.5, size: fontSize, font });

    firstPage.drawText(assetData.NumeroPlaca.toString(), { x: 68, y: 187, size: fontSize, font });
    firstPage.drawText(assetData.Nombre, { x: 133, y: 187, size: fontSize, font });
    firstPage.drawText(assetData.NumeroSerie, { x: 300, y: 187, size: fontSize, font });
    firstPage.drawText(assetData.Marca, { x: 410, y: 187, size: fontSize, font });
    firstPage.drawText(assetData.Modelo, { x: 490, y: 187, size: fontSize, font });

    // Datos en la segunda página
    if(assetData.NombreEstado === 'Optimo') secondPage.drawText('X', { x: 265.9, y: 691, size: fontSize, font });
    else secondPage.drawText('X', { x: 330.6, y: 691.6, size: fontSize, font });


    secondPage.drawText(assetData.Descripcion, { x: 370, y: 700, size: fontSize, font });

    secondPage.drawText(startDate.toLocaleDateString(), { x: 150, y: 340, size: fontSize, font });
    secondPage.drawText(endDate.toLocaleDateString(), { x:440, y: 340, size: fontSize, font });

    secondPage.drawText(userData.Nombre, { x: 185, y: 275, size: fontSize, font });
    secondPage.drawText(userData.CedulaCarnet.toString(), { x: 185, y: 248, size: fontSize, font });
    secondPage.drawText(userData.CorreoEmail, { x: 175, y: 220, size: fontSize, font });
    secondPage.drawText(userData.Telefono, { x: 450, y: 248, size: fontSize, font });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
