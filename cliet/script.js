const app = new PIXI.Application({
    width: 1080,
    height: 1920,
    backgroundColor: 0x000000,
    view: document.getElementById("game")
});

const REELS_COUNT = 5;
const ROWS_COUNT = 3;
const SYMBOL_SIZE = 200;
const SYMBOLS = ["icon1", "icon2", "icon3", "icon4", "icon5", "icon6", "icon7", "icon8"];

let reels = [];
let spinning = false;

// Загрузка текстур
PIXI.Assets.load(SYMBOLS.map(sym => `assets/${sym}.png`)).then(setup);

function setup() {
    // Создание барабанов
    for (let i = 0; i < REELS_COUNT; i++) {
        const reel = new PIXI.Container();
        reel.x = i * SYMBOL_SIZE;
        reel.y = (app.screen.height - ROWS_COUNT * SYMBOL_SIZE) / 2;
        app.stage.addChild(reel);

        // Заполнение символами
        for (let j = 0; j < ROWS_COUNT + 1; j++) { // +1 для скрытого символа
            const symbol = new PIXI.Sprite(PIXI.Texture.from(`assets/${SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]}.png`));
            symbol.y = j * SYMBOL_SIZE;
            reel.addChild(symbol);
        }
        reels.push(reel);
    }

    // Кнопка старта
    document.getElementById("start-btn").addEventListener("click", startSpin);
}

function startSpin() {
    if (spinning) return;
    spinning = true;

    // Запрос к серверу
    fetch("server/delay.php")
        .then(response => response.text())
        .then(delay => {
            document.getElementById("delay-result").textContent = `Delay: ${delay}s`;
            stopSpin(parseInt(delay));
        });

    // Анимация вращения
    for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        const extra = Math.floor(Math.random() * 3);
        const target = reel.y + (ROWS_COUNT + extra) * SYMBOL_SIZE;
        const duration = 1000 + i * 200 + Math.random() * 500;

        gsap.to(reel, {
            y: target,
            duration: duration / 1000,
            ease: "back.out(0.2)",
            onComplete: () => {
                if (i === reels.length - 1) spinning = false;
            }
        });
    }
}

function stopSpin(delay) {
    setTimeout(() => {
        // Эффект отскока
        reels.forEach(reel => {
            gsap.to(reel, {
                y: reel.y + 50,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        });
    }, delay * 1000);
}
