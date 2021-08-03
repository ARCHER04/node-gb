const io = require("socket.io");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { listenerCount } = require("process");

const app = http.createServer((request, response) => {
    if (request.method === 'GET') {

        const filePath = path.join(__dirname, 'index.html');

        readStream = fs.createReadStream(filePath);

        readStream.pipe(response);
    } else if (request.method === 'POST') {
        let data = '';

        request.on('data', chunk => {
            data += chunk;
        });

        request.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);

            response.writeHead(200, { 'Content-Type': 'json' });
            response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});
let count = 0;
const socketio = io(app);
socketio.on("connection", socket => {
    console.log("New Connection");
    let name = "";
    socket.on("CLIENT_REG", data => {
        name = data.msg;
        console.log(`Подключился: ${name}`);
        count++;
        socketio.sockets.emit('NEW_CONN_EVENT', { msg: `Подключился: ${name}`, count: count });
    })
    socket.on("CLIENT_MSG", data => {
        socketio.sockets.emit("SERVER_MSG", { user: data.user, msg: data.msg });
    });
    socket.on("disconnect", (socket) => {
        console.log("Отключился: " + name);
        count--;
        socketio.sockets.emit('NEW_CONN_EVENT', { msg: `Отключился: ${name}`, count: count });
    });


});
app.listen(3000, "localhost");
