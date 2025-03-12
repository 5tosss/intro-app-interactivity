const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Definir un tamaño fijo para el canvas
canvas.width = 800;
canvas.height = 500;

let objects = [];
let removedCount = 0;
let level = 1;
const objectsPerLevel = 10;
let speed = 1;

class MovingObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.color = "red";
        this.opacity = 1;
        this.speedY = speed;
    }
    
    update() {
        this.y -= this.speedY;
        if (this.y + this.size < 0) {
            this.resetPosition();
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
    
    changeColor() {
        this.color = "blue";
    }
    
    disappear() {
        let fadeOut = setInterval(() => {
            this.opacity -= 0.05;
            if (this.opacity <= 0) {
                clearInterval(fadeOut);
                objects = objects.filter(obj => obj !== this);
                removedCount++;
                updateStats();
                if (removedCount % objectsPerLevel === 0) {
                    level++;
                    speed += 0.5;
                    spawnObjects(objectsPerLevel);
                }
            }
        }, 50);
    }
    
    resetPosition() {
        this.y = canvas.height;
        this.x = Math.random() * (canvas.width - this.size);
    }
}

function spawnObjects(amount) {
    for (let i = 0; i < amount; i++) {
        objects.push(new MovingObject(Math.random() * canvas.width, canvas.height + Math.random() * 100));
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => {
        obj.update();
        obj.draw();
    });
    requestAnimationFrame(update);
}

function updateStats() {
    document.getElementById("count").innerText = removedCount;
    document.getElementById("percentage").innerText = ((removedCount / objectsPerLevel) * 100).toFixed(1);
    document.getElementById("level").innerText = level;
}

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    objects.forEach(obj => {
        if (mouseX >= obj.x && mouseX <= obj.x + obj.size && mouseY >= obj.y && mouseY <= obj.y + obj.size) {
            obj.changeColor();
        }
    });
});

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    objects.forEach(obj => {
        if (mouseX >= obj.x && mouseX <= obj.x + obj.size && mouseY >= obj.y && mouseY <= obj.y + obj.size) {
            obj.disappear();
        }
    });
});

spawnObjects(objectsPerLevel);
update();
