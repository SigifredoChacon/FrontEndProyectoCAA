import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import FormularioDeBienes from '/src/assets/FormularioDeBienes.pdf';

// Función principal para generar un PDF completo con datos específicos de usuario, formulario y activo
// Entradas:
// - userData: Objeto con información del usuario (nombre, cédula, correo, teléfono)
// - formData: Objeto con datos específicos del formulario (observaciones, uso del bien, accesorios)
// - assetData: Objeto con información del activo (número de placa, nombre, número de serie, marca, modelo, estado, descripción)
// - startDate y endDate: Fechas de inicio y fin de uso del activo en formato Date
// Salida:
// - pdfBytes: ArrayBuffer que contiene los bytes del PDF generado y completado
export const generateFilledPDF = async (userData, formData, assetData, startDate, endDate) => {
    // Carga el archivo PDF del formulario base en formato ArrayBuffer
    const existingPdfBytes = await fetch(FormularioDeBienes).then((res) =>
        res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes); // Carga el PDF en el documento

    const pages = pdfDoc.getPages(); // Obtiene todas las páginas del documento
    const firstPage = pages[0]; // Selecciona la primera página para editar
    const secondPage = pages[1]; // Selecciona la segunda página para editar

    const fontSize = 10; // Define el tamaño de la fuente
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica); // Carga la fuente Helvetica para el PDF

    // Función interna para dividir texto en líneas con un límite de caracteres
    // Entrada:
    // - text: String con el texto a dividir
    // - maxCharsPerLine: Número máximo de caracteres por línea
    // Salida:
    // - lines: Array de strings, cada uno representando una línea de texto
    const wrapText = (text, maxCharsPerLine) => {
        const words = text.split(' '); // Divide el texto en palabras
        const lines = [];
        let line = '';

        // Construye líneas con el límite de caracteres
        words.forEach((word) => {
            const testLine = line + (line ? ' ' : '') + word;
            if (testLine.length <= maxCharsPerLine) {
                line = testLine;
            } else {
                lines.push(line); // Guarda la línea completa
                line = word;
            }
        });

        if (line.length > 0) {
            lines.push(line); // Agrega la última línea si existe
        }

        return lines; // Retorna el array de líneas
    };

    // Procesa las observaciones del formulario y ajusta el texto en líneas
    const observationLines = wrapText(formData.observaciones || 'Sin observaciones', 117);
    let yPosition = 390; // Posición Y inicial para empezar a dibujar texto en la primera página

    // Dibuja cada línea de observaciones en la primera página
    observationLines.forEach((line) => {
        firstPage.drawText(line, { x: 40, y: yPosition, size: fontSize, font });
        yPosition -= 12; // Ajusta la posición para la siguiente línea
    });

    // Dibuja los detalles de uso del bien en el formulario (primera página)
    firstPage.drawText('X', { x: 47, y: 588, size: fontSize, font });
    if (formData.usoBien === "1") firstPage.drawText('X', { x: 47, y: 520, size: fontSize, font });
    else if (formData.usoBien === "2") firstPage.drawText('X', { x: 47, y: 485, size: fontSize, font });
    else if (formData.usoBien === "3") firstPage.drawText('X', { x: 47, y: 451, size: fontSize, font });
    else if (formData.usoBien === "4") firstPage.drawText('X', { x: 316.5, y: 519.5, size: fontSize, font });

    // Dibuja la información principal del activo en la primera página
    firstPage.drawText(assetData.NumeroPlaca.toString(), { x: 68, y: 187, size: fontSize, font });
    firstPage.drawText(assetData.Nombre, { x: 133, y: 187, size: fontSize, font });
    firstPage.drawText(assetData.NumeroSerie, { x: 300, y: 187, size: fontSize, font });
    firstPage.drawText(assetData.Marca, { x: 410, y: 187, size: fontSize, font });
    firstPage.drawText(assetData.Modelo, { x: 490, y: 187, size: fontSize, font });

    // Marca el estado del activo en la segunda página (óptimo o dañado)
    if (assetData.NombreEstado === 'Optimo') secondPage.drawText('X', { x: 265.9, y: 691, size: fontSize, font });
    else secondPage.drawText('X', { x: 330.6, y: 691.6, size: fontSize, font });

    // Dibuja los accesorios del activo en la segunda página
    secondPage.drawText(formData.accesorios, { x: 230, y: 490, size: fontSize, font });

    // Ajusta el texto de descripción del activo con límite de caracteres en la segunda página
    const observationLinesDescription = wrapText(assetData.Descripcion || 'Sin observaciones', 45);
    let yPositionDescription = 700; // Posición Y inicial para la descripción en segunda página

    // Dibuja cada línea de descripción en la segunda página
    observationLinesDescription.forEach((line) => {
        secondPage.drawText(line, { x: 370, y: yPositionDescription, size: fontSize, font });
        yPositionDescription -= 12; // Ajusta la posición para cada línea
    });

    // Dibuja las fechas de inicio y fin del uso del activo en la segunda página
    secondPage.drawText(startDate.toLocaleDateString(), { x: 150, y: 340, size: fontSize, font });
    secondPage.drawText(endDate.toLocaleDateString(), { x: 440, y: 340, size: fontSize, font });

    // Dibuja la información del usuario en la segunda página
    secondPage.drawText(userData.Nombre, { x: 185, y: 275, size: fontSize, font });
    secondPage.drawText(userData.CedulaCarnet.toString(), { x: 185, y: 248, size: fontSize, font });
    secondPage.drawText(userData.CorreoEmail, { x: 175, y: 220, size: fontSize, font });
    secondPage.drawText(userData.Telefono, { x: 450, y: 248, size: fontSize, font });

    const pdfBytes = await pdfDoc.save(); // Guarda el documento como array de bytes
    return pdfBytes; // Retorna el array de bytes del PDF generado
};
