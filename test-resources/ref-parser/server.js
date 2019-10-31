const fs = require('fs');
const http = require('http');
const path = require('path');

module.exports = function () {
    return new Promise ((resolve, reject) => {
        try {
            const server = http.createServer((req, res) => {
                const filePath = path.resolve(__dirname, req.url.substring(1));
                fs.readFile(filePath, 'utf8', (err, content) => {
                    if (err) {
                        res.statusCode = 404;
                        res.end();
                    } else {
                        res.statusCode = 200;
                        res.setHeader('content-type', req.url.endsWith('.json') ? 'application/json' : 'text/x-yaml');
                        res.write(content);
                        res.end();
                    }
                });
            });
            server.on('clientError', (err, socket) => {
                socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
            });
            server.listen(18088);
            let intervalId = setInterval(() => {
                if (server.listening) {
                    clearTimeout(intervalId);
                    resolve(server.close.bind(server));
                }
            }, 10);
        } catch (err) {
            reject(err);
        }
    });
};


