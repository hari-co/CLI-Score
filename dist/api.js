import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { createHash } from "crypto";
async function getSuffix(url) {
    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
        }
    });
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const links = Array.from(document.head.querySelectorAll("link"));
    const matches = links
        .map(link => link.getAttribute("href"))
        .filter(href => href && href.startsWith("https://musescore.com/static/public/build/musescore_es6/"));
    for (const url of matches) {
        const scriptResponse = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
            }
        });
        const text = await scriptResponse.text();
        const regex = /([a-z]{3})"\)\.substr\(0,4\)/;
        const match = text.match(regex);
        if (match) {
            return match[1];
        }
    }
    return;
}
function generateToken(id, type, index, suffix) {
    const input = id + type + index + suffix;
    const hash = createHash("md5");
    hash.update(input);
    return hash.digest("hex").slice(0, 4);
}
function getApiEndpoint(id, index, type) {
    return `/api/jmuse?id=${id}&index=${index}&type=${type}`;
}
export async function fetchApiImages(url) {
    try {
        const regex = /scores\/([0-9]{8})/;
        const match = url.match(regex);
        if (!match) {
            throw new Error("No Regex match: id");
        }
        const id = match[1];
        if (!id) {
            throw new Error("No capture group: id");
        }
        const type = "img";
        const suffix = await getSuffix(url);
        if (suffix === undefined) {
            throw new Error("Error getting suffix");
        }
        const MAX_PAGES = 6;
        const pageUrls = [];
        for (let index = 0; index < MAX_PAGES; index++) {
            try {
                const authToken = generateToken(id, type, index.toString(), suffix);
                const apiUrl = getApiEndpoint(id, index.toString(), type);
                const request = await fetch("https://musescore.com/" + apiUrl, {
                    headers: {
                        "Authorization": authToken,
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
                    }
                });
                const data = await request.json();
                const imageUrl = data.info.url;
                if (!imageUrl) {
                    throw new Error("Image URL not found.");
                }
                if (imageUrl.startsWith("https://s3.ultimate-guitar.com")) {
                    break;
                }
                pageUrls.push(imageUrl);
            }
            catch (error) {
                console.error(error);
                break;
            }
        }
        console.log(pageUrls);
        return pageUrls;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
fetchApiImages("https://musescore.com/user/32413850/scores/26062204");
//# sourceMappingURL=api.js.map