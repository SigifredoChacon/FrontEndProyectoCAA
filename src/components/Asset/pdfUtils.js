import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';  // Asegúrate de que StandardFonts está correctamente importado
import FormularioDeBienes from '/src/assets/FormularioDeBienes.pdf';

export const generateFilledPDF = async (userData, formData, assetData, startDate, endDate) => {
    const existingPdfBytes = await fetch(FormularioDeBienes).then((res) =>
        res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Obtener todas las páginas
    const pages = pdfDoc.getPages();

    // Asegúrate de que tienes la página correcta para cada dato
    const firstPage = pages[0];
    const secondPage = pages[1];

    // Configuración general
    const fontSize = 10;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica); // Importa correctamente la fuente


    if(formData.usoBien === "1") firstPage.drawText('X', { x: 47, y: 520, size: fontSize, font });
    firstPage.drawText(formData.observaciones || 'Sin observaciones', { x: 50, y: 660, size: fontSize, font });


    firstPage.drawText(assetData.placa, { x: 300, y: 700, size: fontSize, font });
    firstPage.drawText(assetData.descripcion, { x: 300, y: 680, size: fontSize, font });
    firstPage.drawText(assetData.serie, { x: 300, y: 660, size: fontSize, font });
    firstPage.drawText(assetData.marca, { x: 300, y: 640, size: fontSize, font });
    firstPage.drawText(assetData.modelo, { x: 300, y: 620, size: fontSize, font });

    secondPage.drawText(assetData.estado, { x: 300, y: 600, size: fontSize, font });
    secondPage.drawText(assetData.accesorios || 'N/A', { x: 300, y: 580, size: fontSize, font });


    secondPage.drawText(`Fecha de Inicio: ${startDate.toLocaleDateString()}`, { x: 50, y: 700, size: fontSize, font });
    secondPage.drawText(`Fecha de Fin: ${endDate.toLocaleDateString()}`, { x: 50, y: 680, size: fontSize, font });

    secondPage.drawText(userData.name, { x: 50, y: 700, size: fontSize, font });
    secondPage.drawText(userData.cedula, { x: 50, y: 680, size: fontSize, font });
    secondPage.drawText(userData.email, { x: 50, y: 660, size: fontSize, font });
    secondPage.drawText(userData.dependencia, { x: 50, y: 640, size: fontSize, font });
    secondPage.drawText(userData.celular, { x: 50, y: 620, size: fontSize, font });
    secondPage.drawText(userData.oficina, { x: 50, y: 600, size: fontSize, font });


    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
