# ScoreFetchRPC

[![Node](https://img.shields.io/badge/node-18+-brightgreen)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/) [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

ScoreFetch is a Node.js RPC API for fetching from MuseScore and converting into PDF, MP3, or MIDI files. Auth Tokens are generated with a technique documented by [Librescore](https://github.com/LibreScore). ( Which sadly isn't working at the time of writing :( )

---

## **Installation**

```bash
git clone https://github.com/hari-co/Score-Fetch.git
cd Score-Fetch
npm install
```

## **Build**

To run locally, first compile to JS, then start server.
```bash
npx tsc
npm start
```

## **Usage**

All endpoints accept a MuseScore URL as a query parameter:

### **API Endpoints**

| Endpoint      | Method | Query Params | Response     |
|---------------|--------|--------------|-------------|
| `/pdf`        | GET    | `url`        | PDF file    |
| `/mp3`        | GET    | `url`        | MP3 file    |
| `/midi`       | GET    | `url`        | MIDI file   |

---

### **Example Requests**

#### Download a PDF

```bash
curl -O "http://localhost:3000/pdf?url=https://musescore.com/user/12345/scores/67890"
```

## **License**
MIT License

## **Disclaimer**
- This tool is purely for educational purposes.
- All scores, MP3s, and MIDI files belong to their respective authors on MuseScore.
- The author of this project is not responsible for any misuse, redistribution, or copyright violations.
