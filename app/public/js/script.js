const BOX_SIZE = 10;

const app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);

const webSocketUrl = window.location.href.includes("localhost")
  ? "ws://localhost:3000"
  : "wss://pxlz.fly.dev";

const server = new WebSocket(webSocketUrl);

server.onmessage = (event) => {
  const { boxes, updatedBox } = JSON.parse(event.data);
  if (boxes) {
    for (const boxData of boxes) {
      const boxElement = document.createElement("div");
      boxElement.classList.add("box");
      boxElement.style.width = `${BOX_SIZE}px`;
      boxElement.style.height = `${BOX_SIZE}px`;
      boxElement.style.backgroundColor = boxData.color;
      boxElement.id = boxData.id;
      boxElement.addEventListener("click", () => {
        server.send(
          JSON.stringify({
            updatedBox: {
              id: boxData.id,
              color: getRandomRGBColor(),
            },
          })
        );
      });
      app.appendChild(boxElement);
    }
  } else if (updatedBox) {
    updateBox(updatedBox.id, updatedBox.color);
  }
};

function updateBox(id, color) {
  const box = document.getElementById(id);
  const boxSelected = box.classList.contains("selected");
  if (boxSelected) {
    box.classList.remove("selected");
  } else {
    box.classList.add("selected");
  }
  box.style.backgroundColor = color;
}

function getRandomRGBColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r}, ${g}, ${b})`;
}
