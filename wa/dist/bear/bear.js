const isNum = x => typeof x === 'number';
const px = n => `${n}px`;

const getPagePos = (e, param) =>
  e.targetTouches ? e.touches[0][`page${param}`] : e[`page${param}`];

const randomN = n => Math.round(-n - 0.5 + Math.random() * (2 * n + 1));

const wrapper = document.querySelector('.wrapper');

const addEvents = (target, event, action, array) => {
  array.forEach(a => target[`${event}EventListener`](a, action));
};

const mouse = {
  up: (t, e, a) => addEvents(t, e, a, ['mouseup', 'touchend']),
  move: (t, e, a) => addEvents(t, e, a, ['mousemove', 'touchmove']),
  down: (t, e, a) => addEvents(t, e, a, ['mousedown', 'touchstart']),
  enter: (t, e, a) => addEvents(t, e, a, ['mouseenter', 'touchstart']),
  leave: (t, e, a) => addEvents(t, e, a, ['mouseleave', 'touchmove']),
};

class Vector {
  constructor(props) {
    Object.assign(this, { x: 0, y: 0, ...props });
  }
  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  setLength(length) {
    const angle = Math.atan2(this.y, this.x);
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  }
  setXy(xy) {
    this.x = xy.x;
    this.y = xy.y;
  }
  addXy(xy) {
    this.x += xy.x;
    this.y += xy.y;
  }
  subtractXy(xy) {
    this.x -= xy.x;
    this.y -= xy.y;
  }
  multiplyXy(n) {
    this.x *= n;
    this.y *= n;
  }
}

class WorldObject {
  constructor(props) {
    Object.assign(this, {
      zOffset: 90,
      moveWithTransform: true,
      x: 0, y: 0,
      offset: { x: null, y: null },
      pos: new Vector({ x: props.x, y: props.y }),
      size: { w: 0, h: 0 },
      maxSize: { w: 0, h: 0 },
      ...props,
    });
    this.addToWorld();
  }
  get rect() {
    const { left, top } = this.el.getBoundingClientRect();
    return { left, top };
  }
  get distPos() {
    const { w, h } = this.size;
    return {
      x: this.rect.left + (w / 2),
      y: this.rect.top + (h / 2),
    };
  }
  setOffset() {
    const { x, y } = this.offset;
    if (isNum(x) && isNum(y)) {
      this.el.style.setProperty('--offset-x', px(x));
      this.el.style.setProperty('--offset-y', px(y));
    }
  }
  setSize(target = this) {
    const { w, h } = target.size;
    const { w: mW, h: mH } = target.maxSize;
    this.el.style.setProperty('--w', px(w));
    this.el.style.setProperty('--h', px(h));
    this.el.style.setProperty('--max-w', px(mW));
    this.el.style.setProperty('--max-h', px(mH));
  }
  setStyles() {
    const { x, y } = this.pos;
    this.el.style.left = px(x || 0);
    this.el.style.top = px(y || 0);
    this.el.style.zIndex = this.z || 0;
    this.el.style.transformOrigin = isNum(this.offset.x) && isNum(this.offset.y)
      ? `${this.offset.x}px ${this.offset.y}px`
      : `center`;
  }
  distanceBetween(target) {
    return Math.round(
      Math.sqrt(Math.pow(target.distPos.x - this.distPos.x, 2) + Math.pow(target.distPos.y - this.distPos.y, 2))
    );
  }
  addToWorld() {
    this.setSize();
    this.setOffset();
    if (!this.noPos) this.setStyles();
    this.container.appendChild(this.el);
  }
}

class Food extends WorldObject {
  constructor(props) {
    super({
      el: Object.assign(document.createElement('div'), { className: `food ${props.type} object` }),
      x: 0, y: 0,
      grabPos: { a: { x: 0, y: 0 }, b: { x: 0, y: 0 } },
      container: wrapper,
      eatCount: 0,
      eatInterval: null,
      points: 1,
      ...props,
    });
    this.el._foodObject = this;
    this.addDragEvent();
    this.setPos();
  }
  touchPos(e) {
    return {
      x: getPagePos(e, 'X'),
      y: getPagePos(e, 'Y'),
    };
  }
  addDragEvent() {
    mouse.down(this.el, 'add', this.onGrab);
  }
  drag = (e, x, y) => {
    if (e.type[0] === 'm') e.preventDefault();
    this.grabPos.a.x = this.grabPos.b.x - x;
    this.grabPos.a.y = this.grabPos.b.y - y;
    this.pos.subtractXy(this.grabPos.a);
    this.setStyles();
  }
  onGrab = e => {
    this.grabPos.b = this.touchPos(e);
    mouse.up(document, 'add', this.onLetGo);
    mouse.move(document, 'add', this.onDrag);
  }
  onDrag = e => {
    const { x, y } = this.touchPos(e);
    if (this.canMove) this.drag(e, x, y);
    this.grabPos.b.x = x;
    this.grabPos.b.y = y;
  }
  onLetGo = () => {
    mouse.up(document, 'remove', this.onLetGo);
    mouse.move(document, 'remove', this.onDrag);
  }
  eat() {
    if (!this.eatInterval) {
      this.eatInterval = setInterval(() => {
        this.eatCount++;
        this.el.className = `food ${this.type} ${this.type}-eaten-${this.eatCount} object`;
        if (this.eatCount >= 5) {
          this.el.remove();
          clearInterval(this.eatInterval);
          this.eatInterval = null;
          if (this.hoop) {
            this.hoop.food = null;
            const hoopIndex = hoops.indexOf(this.hoop);
            const maxScores = [999, 999, 9999];
            
            this.hoop.score = Math.min(this.hoop.score + this.points, maxScores[hoopIndex]);
            this.hoop.scoreBox.innerText = this.hoop.score.toString().padStart(hoopIndex === 2 ? 4 : 3, '0');
            updatePhoneNumber();
          }
        }
      }, 100);
    }
  }
  setPos() {
    const { width, height } = wrapper.getBoundingClientRect();
    this.pos.setXy({
      x: width / 2 - 36,
      y: height - 400,
    });
    this.setStyles();
  }
}

class Hoop extends WorldObject {
  constructor(props) {
    super({
      ...props,
      canMove: true,
      type: 'hoop',
      el: Object.assign(document.createElement('div'), {
        className: 'hoop object',
        innerHTML: `
          <div class="backboard"></div>
          <div class="rim"></div>
          <div class="net"></div>
        `,
      }),
    });

    this.rim = new WorldObject({
      el: this.el.querySelector('.rim'),
      container: this.el,
      body: this,
      size: { w: 60, h: 10 },
      maxSize: { w: 60, h: 10 },
      noPos: true,
    });

    mouse.move(document, 'add', () => {
      for (const foodEl of wrapper.querySelectorAll('.food')) {
        const foodObj = foodEl._foodObject;
        if (!foodObj) continue;
        if (this.rim.distanceBetween(foodObj) < 50) {
          if (!foodObj.hoop) {
            foodObj.hoop = this;
          }
          foodObj.eat();
          return;
        }
      }
    });

    window.addEventListener('resize', () => {
      if (this.food) this.food.setPos();
    });
  }
}

const hoops = [];
const { width } = wrapper.getBoundingClientRect();
const spacing = width / 4;

for (let i = 0; i < 3; i++) {
  const hoop = new Hoop({
    container: wrapper,
    size: { w: 70, h: 90 },
    maxSize: { w: 90, h: 100 },
    offset: { x: null, y: null },
  });
  hoop.pos.x = spacing * i + spacing / 1 - 35;
  hoop.pos.y = window.innerHeight - 600;
  hoop.setStyles();
  hoops.push(hoop);

  const box = document.createElement('div');
  box.className = 'score-box';
  box.innerText = i === 2 ? '0000' : '000';
  wrapper.appendChild(box);

  hoop.scoreBox = box;
  hoop.score = 0;

  box.style.position = 'absolute';
  box.style.left = `${hoop.pos.x}px`;
  box.style.top = `${hoop.pos.y - 60}px`;
  box.style.color = 'white';
  box.style.fontSize = '24px';
  box.style.fontWeight = 'bold';
  box.style.textAlign = 'center';
  box.style.width = '100px';
  box.style.marginLeft = '-50px';
}

function spawnBall(type) {
  let points = 1;
  if (type === 'big') points = 100;
  else if (type === 'medium') points = 50;
  else if (type === 'ten') points = 10;
  else if (type === 'mystery') points = Math.floor(Math.random() * 1000);

  new Food({
    type: 'basketball',
    size: { w: 64, h: 64 },
    canMove: true,
    points: points,
    hoop: null,
  });
}

function updatePhoneNumber() {
  const part1 = hoops[0]?.score.toString().padStart(3, '0') || '000';
  const part2 = hoops[1]?.score.toString().padStart(3, '0') || '000';
  const part3 = hoops[2]?.score.toString().padStart(4, '0') || '0000';
  document.getElementById('phone-number').innerText = `(${part1}) ${part2}-${part3}`;
}
const submitBtn = document.getElementById('submit-btn');
const resultScreen = document.getElementById('result-screen');
const finalNumber = document.getElementById('final-number');

submitBtn.addEventListener('click', () => {
  const phoneText = document.getElementById('phone-number').innerText;
  finalNumber.textContent = phoneText;
  resultScreen.classList.remove('hidden');
});
