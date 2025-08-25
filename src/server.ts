import express from "express";

import { getScoreName, fetchApi } from "./api.js";
import { convertToPDF } from "./pdf.js";
import { toBuffer } from "./parse-url.js";

const app = express()
const port = 3000

app.get("/pdf", async (req, res) => {
    const url = req.query.url;
    const regex = /user\/[0-9]+\/scores\/[0-9]+/

    if (typeof url !== "string") {
        return res.status(400).json({error: "Invalid URL"});
    }

    const match = url.match(regex)

    if (!match) {
        return res.status(400).json({error: "Invalid MuseScore URL format"});
    }

    const scoreName = await getScoreName(url);
    const imageUrls = await fetchApi(url, "img");
    const pdfBuffer = await convertToPDF(imageUrls);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${scoreName}.pdf"`);
    res.send(pdfBuffer);
});

app.get("/mp3", async (req, res) => {
    const url = req.query.url;
    const regex = /user\/[0-9]+\/scores\/[0-9]+/

    if (typeof url !== "string") {
        return res.status(400).json({error: "Invalid URL"});
    }

    const match = url.match(regex)

    if (!match) {
        return res.status(400).json({error: "Invalid MuseScore URL format"});
    }

    const scoreName = await getScoreName(url);
    const mp3Urls = await fetchApi(url, "mp3");

    if (!mp3Urls[0]) {
        return res.status(404).json({error: "MP3 URL not found."})
    }

    const mp3Buffer = await toBuffer(mp3Urls[0]);
    res.setHeader('Content-Type', 'application/mp3');
    res.setHeader('Content-Disposition', `attachment; filename="${scoreName}.mp3"`);
    res.send(mp3Buffer);
});

app.get("/midi", async (req, res) => {
    const url = req.query.url;
    const regex = /user\/[0-9]+\/scores\/[0-9]+/

    if (typeof url !== "string") {
        return res.status(400).json({error: "Invalid URL"});
    }

    const match = url.match(regex)

    if (!match) {
        return res.status(400).json({error: "Invalid MuseScore URL format"});
    }

    const scoreName = await getScoreName(url);
    const midiUrls = await fetchApi(url, "midi");

    if (!midiUrls[0]) {
        return res.status(404).json({error: "MP3 URL not found."})
    }

    const midiBuffer = await toBuffer(midiUrls[0]);
    res.setHeader('Content-Type', 'application/midi');
    res.setHeader('Content-Disposition', `attachment; filename="${scoreName}.mid"`);
    res.send(midiBuffer);
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

export default app;