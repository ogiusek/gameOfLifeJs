const newMap = (size) => Array(size).fill(0).map(() => Array(size).fill(0).map(() => false));

const map_size = 64;
let map = newMap(map_size);
let running = 0;
const app = document.getElementById("app");

function draw() {
  console.time("drawTime");
  let newInnerHTML = "";
  map.map((c, cI) => {
    newInnerHTML += `<div class="c">${c.map((e, eI) =>
      `<button onClick="tileClick(${cI}, ${eI});" style="--alive: ${1 - Number(e)};"></button>`).reduce((sum, e) => sum + e, '')}
      </div>`;
  });

  app.innerHTML = newInnerHTML;
  console.timeEnd("drawTime");
}

function getNeighbours(cI, eI) {
  let neighbours = 0;
  const eMinus = eI > 0, cMinus = cI > 0,
    ePlus = eI < map[cI].length - 1, cPlus = cI < map.length - 1;

  if (eMinus) neighbours += Number(map[cI][eI - 1]);
  if (cMinus) neighbours += Number(map[cI - 1][eI]);
  if (ePlus) neighbours += Number(map[cI][eI + 1]);
  if (cPlus) neighbours += Number(map[cI + 1][eI]);

  if (cMinus && ePlus) neighbours += Number(map[cI - 1][eI + 1]);
  if (cPlus && ePlus) neighbours += Number(map[cI + 1][eI + 1]);
  if (cMinus && eMinus) neighbours += Number(map[cI - 1][eI - 1]);
  if (cPlus && eMinus) neighbours += Number(map[cI + 1][eI - 1]);

  return neighbours;
}

function perFrame() {
  if (running) {
    console.time('animatedFrame');
    const newMap = map.map((c, cI) => c.map((e, eI) => {
      const neighbours = getNeighbours(cI, eI);
      return neighbours === 3 || (e && neighbours === 2);
    }));
    if (JSON.stringify(newMap) === JSON.stringify(map)) running = 0;
    map = JSON.parse(JSON.stringify(newMap));
    console.timeEnd('animatedFrame');
    draw();
  }
}



// actions on user
function startStop() {
  running = !running;
}

function tileClick(c, i) {
  if (!running) {
    map[c][i] = !map[c][i];
    draw();
  }
}

function restart() {
  running = 0;
  map = newMap(map_size);
  draw();
}

draw();
setInterval(perFrame, 500);