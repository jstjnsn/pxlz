const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const BOX_COUNT = 50;
const BOX_SIZE = 10;

const app = document.createElement("div");
app.id = "app2";
document.body.appendChild(app);

const server = new WebSocket("ws://localhost:8080");

server.onmessage = (event) => {
  const { boxes, updatedBoxId } = JSON.parse(event.data);
  if (boxes) {
    for (const boxId of boxes) {
      const box = document.createElement("div");
      box.classList.add("box");
      box.style.width = `${BOX_SIZE}px`;
      box.style.height = `${BOX_SIZE}px`;
      box.id = boxId;
      box.addEventListener("click", () => {
        server.send(JSON.stringify({ updatedBoxId: boxId }));
      });
      app.appendChild(box);
    }
  } else if (updatedBoxId) {
    updateBox(updatedBoxId);
  }
};

function updateBox(boxId) {
  const box = document.getElementById(boxId);
  const boxSelected = box.classList.contains("selected");
  if (boxSelected) {
    box.classList.remove("selected");
  } else {
    box.classList.add("selected");
  }
  box.style.backgroundColor = getRandomRGBColor();
}

function getRandomRGBColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r}, ${g}, ${b})`;
}
