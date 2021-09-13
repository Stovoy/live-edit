let http = require('http').createServer(handler);
let fs = require('fs');
let io = require('socket.io')(http);
let parser = require('url');

let port = 8000;
http.listen(port);

function handler(req, res) {
    let url = parser.parse(req.url, true);

    if (url.path === '/') {
        fs.readFile(__dirname + '/public/index.html', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    } else if (url.path === '/display') {
        fs.readFile(__dirname + '/public/display.html', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
}

let subscribed = [];

io.sockets.on('connection', (socket) => {
    socket.on('update', (data) => {
        for (let s of subscribed) {
            if (s === socket) {
                continue;
            }
            s.emit('update', data);
        }
    });
    socket.on('subscribe', () => {
        subscribed.push(socket);
    });
});

console.log(`Started on ${port}.`);
