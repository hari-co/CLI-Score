import { jsPDF } from 'jspdf';
import { createCanvas, loadImage } from "canvas";

export async function convertToPDF(urls: string[]) {
    const doc = new jsPDF();

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        if (!url) {
            console.warn(`Invalid URL at index ${i}`);
            continue;
        }
        const response = await fetch(url);

        const scale = 3;
        const canvas = createCanvas(595 * scale, 842 * scale);
        const ctx = canvas.getContext("2d");

        const imageData = await response.arrayBuffer();
        const pngImage = await loadImage(Buffer.from(imageData));
        ctx.drawImage(pngImage, 0, 0, canvas.width, canvas.height);
      
        const pngDataUrl = canvas.toDataURL("image/png");
        doc.addImage(pngDataUrl, "PNG", 0, 0, 210, 297);
        
        if (i < urls.length - 1) doc.addPage();
    }
    
    const arrayBuffer = doc.output('arraybuffer');
    return Buffer.from(arrayBuffer);
}
