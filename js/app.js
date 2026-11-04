/** UI: wires the controls to the network and draws the decision boundary. */
(() => {
  const { Network, datasets } = window.NP;
  const $ = (id) => document.getElementById(id);
  const canvas = $('c'), ctx = canvas.getContext('2d');
  const SIZE = 360, CELL = 8, GRID = SIZE / CELL;
  const cfg = { layers: 2, neurons: 6, lr: 0.1 };
  let name = 'Circles', data = datasets[name](), net, running = true;

  const build = () => { net = new Network(Array(cfg.layers).fill(cfg.neurons)); };
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

  function draw() {
    const a = rgb(css('--b')), b = rgb(css('--a')), bg = rgb(css('--card')), strength = 0.55;
    for (let gy = 0; gy < GRID; gy++) for (let gx = 0; gx < GRID; gx++) {
      const p = net.predict((gx + 0.5) / GRID * 2 - 1, 1 - (gy + 0.5) / GRID * 2);
      const mix = (i) => Math.round(bg[i] * (1 - strength) + (a[i] * (1 - p) + b[i] * p) * strength);
      ctx.fillStyle = `rgb(${mix(0)},${mix(1)},${mix(2)})`;
      ctx.fillRect(gx * CELL, gy * CELL, CELL, CELL);
    }
    for (const [x, y, label] of data) {
      ctx.beginPath();
      ctx.arc((x + 1) / 2 * SIZE, (1 - y) / 2 * SIZE, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = label ? css('--a') : css('--b');
      ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = css('--card'); ctx.stroke();
    }
  }

  function showStats() {
    const { loss, accuracy } = net.evaluate(data);
    $('ep').textContent = net.steps;
    $('loss').textContent = loss.toFixed(3);
    $('acc').textContent = Math.round(accuracy * 100) + '%';
  }

  function frame() {
    if (running) for (let k = 0; k < 15; k++) {
      net.trainBatch(Array.from({ length: 16 }, () => data[(Math.random() * data.length) | 0]), cfg.lr);
    }
    draw(); showStats(); requestAnimationFrame(frame);
  }

  Object.keys(datasets).forEach((n) => {
    const btn = document.createElement('button');
    btn.textContent = n; btn.setAttribute('aria-pressed', n === name);
    btn.onclick = () => {
      name = n; data = datasets[n](); build();
      [...$('sets').children].forEach((x) => x.setAttribute('aria-pressed', x === btn));
    };
    $('sets').append(btn);
  });
  const bind = (id, key, out, fixed) => {
    $(id).oninput = () => {
      cfg[key] = Number($(id).value);
      $(out).textContent = fixed ? cfg[key].toFixed(2) : cfg[key];
      if (key !== 'lr') build();
    };
  };
  bind('L', 'layers', 'Lv'); bind('H', 'neurons', 'Hv'); bind('lr', 'lr', 'lrv', true);
  $('play').onclick = () => { running = !running; $('play').textContent = running ? 'Pause' : 'Train'; };
  $('reset').onclick = build;
  $('shuffle').onclick = () => { data = datasets[name](); build(); };

  build(); frame();
})();
