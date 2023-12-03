import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const boxes = Array.from({ length: 20000 }, () => ({
  id: Math.floor(Math.random() * 100000),
  color: "rgb(0, 0, 0)",
}));

const expressServer = express();
const httpServer = createServer(expressServer);
const websocketServer = new WebSocketServer({ server: httpServer });

expressServer.use(express.static(path.join(__dirname, "public")));

expressServer.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "app.html"));
});

websocketServer.on("connection", (connection) => {
  connection.send(JSON.stringify({ boxes }));
  connection.on("message", (data) => {
    const deserialisedData = JSON.parse(data);
    if (deserialisedData.updatedBox) {
      boxes.find((box) => box.id === deserialisedData.updatedBox.id).color =
        deserialisedData.updatedBox.color;
    }
    for (const client of websocketServer.clients) {
      const serialisedData = JSON.stringify(deserialisedData);
      client.send(serialisedData);
    }
  });
});

httpServer.listen(process.env.PORT || 3000);
