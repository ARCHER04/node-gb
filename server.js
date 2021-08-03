const listBox = document.querySelector(".fm__catalog");
const fileBox = document.querySelector(".fm__file");
const catalog = document.querySelector(".fm__header");
const file = document.querySelector(".fm__file__header");
window.addEventListener("load", () => loadData("/"));
const http = require("http");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

const PORT = 3000;

function createListElements(currentCatalog, list) {
    listBox.innerText = "";
    fileBox.innerText = "";
    catalog.innerText = currentCatalog;
    file.style.display = "none";
    list.forEach(element => {
        const listItem = document.createElement("div");
        listItem.classList.add("fm__item");
        if (!element.isFile) listItem.classList.add("fm__item-catalog");
        listItem.innerText = element.file;
        listItem.addEventListener("click", (event) => {
            const path = catalog.innerHTML +
                (catalog.innerHTML.slice(-1) == "/" ? "" : "/") + event.target.innerHTML;
            file.innerText = path;
            loadData(path);
        })
        listBox.append(listItem);
    });

}

function viewTextFile(text) {
    file.style.display = "inline";
    fileBox.innerText = text;
}

function loadData(currentFile) {
    getData(currentFile)
        .then(data => {
            if (data.hasOwnProperty("list")) {
                createListElements(data.currentCatalog, data.list);
            } else {
                viewTextFile(data);
            }
        })
}

function getData(path) {
    return fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
    }).then(response => {
        if (response.headers.get("Content-Type") == "json") return response.json();
        return response.text();
    }).catch(error => console.log(error))
}

http.createServer((request, response) => {
    if (request.method === "GET") {
        if (request.url == "/") {
            const file = path.join(__dirname, "index.html");
            const rs = fs.createReadStream(file);
            response.writeHead(200, { "Content-Type": "text/html" });
            rs.pipe(response);
        } else if (request.url.includes("css") || request.url.includes("js")) {
            const file = path.join(__dirname, request.url);
            const rs = fs.createReadStream(file);
            response.writeHead(200, { "Content-Type": request.url.includes("css") ? "text/css" : "text/js" });
            rs.pipe(response);
        }
    } else if (request.method === "POST") {
        const item = __dirname + request.url;
        if (!isFile(item)) {
            const listDir = readDirectory(item);
            // console.log(item);
            const answer = { currentCatalog: request.url, list: listDir }
            response.writeHead(200, { "Content-Type": "json" })
            response.end(JSON.stringify(answer));
        } else {
            const rs = fs.createReadStream(item);
            response.writeHead(200, { "Content-Type": "text/html" });
            rs.pipe(response);
        }
    } else {
        response.statusCode = 405;
        response.end();
    }
}).listen(3000, "localhost", () => {
    console.log("Сервер запущен");
});

function isFile(fileName) {
    return fs.lstatSync(fileName).isFile();
}
function readDirectory(dir) {
    const list = fs.readdirSync(dir);
    const listObj = list.map(item => {
        return { file: item, isFile: isFile(path.join(dir, item)) }
    });
    if (dir !== __dirname + "/") listObj.unshift({ file: "..", isFile: false });
    return listObj;
}