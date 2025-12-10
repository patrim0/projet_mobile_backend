import { app } from './app';
import fs from 'fs';
import https from 'https';
import http from 'http';

const httpPort = process.env.HTTP_PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 3443;

console.log(`Environnement: ${process.env.NODE_ENV || "development"}`);

if (process.env.HTTPS_ENABLED === 'true') {
    const certificateOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH as string),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH as string)
    };

    https.createServer(certificateOptions, app).listen(httpsPort, () => {
        console.log(`Serveur HTTPS démarré sur le port ${httpsPort}`)
    })

    http.createServer((req, res) => {
        res.writeHead(301, { "Location": `https://localhost:${httpsPort}${req.url}` });
        res.end();
    }).listen(httpPort, () => {
        console.log(`Serveur HTTP en écoute sur http://localhost:${httpPort}`);
    });
} 
else {
    app.listen(httpPort, () => {
        console.log(`Serveur en écoute sur http://localhost:${httpPort}`);
    });
}