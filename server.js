import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EXPRESS SERVER

const expressServer = express();

expressServer.use(express.static("public"));

expressServer.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "app.html"));
});

expressServer.listen(3000);

// WEBSOCKET SERVER

const websocketServer = new WebSocketServer({ port: 8080 });

const boxes = Array.from(
  new Set(
    Array.from({ length: 15000 }, () => Math.floor(Math.random() * 100000))
  ).entries()
);

let messageCount = 0;

websocketServer.on("connection", (connection) => {
  connection.send(JSON.stringify({ boxes }));
  connection.on("message", (data) => {
    const deserialisedData = JSON.parse(data);
    messageCount++;
    for (const client of websocketServer.clients) {
      const serialisedData = JSON.stringify(deserialisedData);
      client.send(serialisedData);
    }
  });
});
