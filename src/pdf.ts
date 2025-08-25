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
        const text = await response.text();

        const scale = 3;
        const canvas = createCanvas(595 * scale, 842 * scale);
        const ctx = canvas.getContext("2d");

        const svgImage = await loadImage(`data:image/svg+xml;base64,${Buffer.from(text).toString("base64")}`);
        ctx.drawImage(svgImage, 0, 0, canvas.width, canvas.height);

        const pngBuffer = canvas.toBuffer("image/png");
        const imageData = `data:image/png;base64,${pngBuffer.toString("base64")}`;
        doc.addImage(imageData, "PNG", 0, 0, 210, 297);
        
        if (i < urls.length - 1) doc.addPage();
    }
    
    const arrayBuffer = doc.output('arraybuffer');
    return Buffer.from(arrayBuffer);
}