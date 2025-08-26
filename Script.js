const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const hue = 360;

// Set up event listeners for mouse clicks to launch fireworks
canvas.addEventListener('click', (e) => {
    createFirework(e.clientX, e.clientY);
});

// A single particle for a firework
class Particle {
    constructor(x, y, hue, firework) {
        this.x = x;
        this.y = y;
        this.firework = firework;
        this.size = Math.random() * 3 + 1;
        this.hue = hue;
        this.velocity = {
            x: Math.cos(Math.random() * Math.PI * 2) * (Math.random() * 5 + 1),
            y: Math.sin(Math.random() * Math.PI * 2) * (Math.random() * 5 + 1)
        };
        this.alpha = 1;
        this.decay = 0.02;
    }

    update() {
        if (!this.firework) {
            this.velocity.y += 0.03; // Gravity effect
            this.alpha -= this.decay;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
        ctx.fill();
    }
}

// Create the initial firework rocket
function createFirework(x, y) {
    const firework = new Particle(canvas.width / 2, canvas.height, Math.random() * 360, true);
    const fireworkTarget = { x, y };

    // Animate the firework rocket
    const animateFirework = setInterval(() => {
        firework.update();
        firework.draw();
        
        // Calculate the distance to the target
        const dx = fireworkTarget.x - firework.x;
        const dy = fireworkTarget.y - firework.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move towards the target
        const speed = 5;
        firework.velocity.x = (dx / distance) * speed;
        firework.velocity.y = (dy / distance) * speed;

        if (distance < speed || firework.y < 0) {
            clearInterval(animateFirework);
            // Explode the firework
            createExplosion(firework.x, firework.y, firework.hue);
        }
    }, 1000 / 60);
}

// Create particles for the explosion
function createExplosion(x, y, hue) {
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, hue, false));
    }
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    particles = particles.filter(particle => particle.alpha > 0.05);
}

// Start the animation
animate();

// Automatically launch fireworks at random intervals
setInterval(() => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 2);
    createFirework(x, y);
}, 1000);

// Add event listener for the continue button
document.getElementById('continueBtn').addEventListener('click', () => {
    window.location.href = 'video.html';
});
