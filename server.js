import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (connection) => {
  console.log("New connection");
  connection.on("message", (data) => {
    const deserialisedData = JSON.parse(data);
    console.log(deserialisedData);
    for (const client of server.clients) {
      const serialisedData = JSON.stringify(deserialisedData);
      client.send(serialisedData);
    }
  });
});
