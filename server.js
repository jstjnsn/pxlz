import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 8080 });

const boxes = Array.from({ length: 10000 }, () =>
  Math.floor(Math.random() * 100000)
);

let messageCount = 0;

server.on("connection", (connection) => {
  console.log("New connection");
  connection.send(JSON.stringify({ boxes }));
  connection.on("message", (data) => {
    const deserialisedData = JSON.parse(data);
    console.log(messageCount, deserialisedData);
    messageCount++;
    for (const client of server.clients) {
      const serialisedData = JSON.stringify(deserialisedData);
      client.send(serialisedData);
    }
  });
});
