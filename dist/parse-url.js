export async function toBuffer(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);
    return dataBuffer;
}
//# sourceMappingURL=parse-url.js.map