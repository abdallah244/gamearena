// Initialize variables
let loadingProgress = 0;
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');
const loadingMessage = document.getElementById('loading-message');
const loadingScreen = document.getElementById('loading-screen');
const introScreen = document.getElementById('intro-screen');
const gameTitle = document.getElementById('game-title');
const logoContainer = document.getElementById('logo-container');
const goToGameBtn = document.getElementById('go-to-game-btn');

// Three.js variables
let scene, camera, renderer, particles;

// Initialize Three.js scene
function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('intro-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Create particles for background
    createParticles();
    
    // Start animation
    animate();
}

// Create particle system
function createParticles() {
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Random positions
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        // Random colors (green theme)
        colors[i * 3] = Math.random() * 0.3 + 0.2;     // R
        colors[i * 3 + 1] = Math.random() * 0.5 + 0.5; // G
        colors[i * 3 + 2] = Math.random() * 0.3 + 0.2; // B
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.7
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }
    
    renderer.render(scene, camera);
}

// Animate title letters
function animateTitle() {
    const title = "GAME ARENA";
    gameTitle.innerHTML = '';
    
    for (let i = 0; i < title.length; i++) {
        const letter = document.createElement('span');
        letter.textContent = title[i];
        letter.className = 'letter text-6xl font-bold text-white glow-text';
        
        if (title[i] === ' ') {
            letter.innerHTML = '&nbsp;';
        }
        
        gameTitle.appendChild(letter);
        
        // Animate each letter with a delay
        gsap.to(letter, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: 0.1 * i
        });
    }
}

// Update loading messages
function updateLoadingMessage() {
    const messages = [
        "Initializing game environment...",
        "Loading assets...",
        "Optimizing performance...",
        "Preparing arena...",
        "Almost ready..."
    ];
    
    const messageIndex = Math.floor(loadingProgress / 20);
    if (messageIndex < messages.length) {
        loadingMessage.textContent = messages[messageIndex];
    }
}

// Show intro screen with animations
function showIntroScreen() {
    // Show intro screen
    introScreen.classList.remove('pointer-events-none');
    gsap.to(introScreen, {
        opacity: 1,
        duration: 1
    });
    
    // Initialize Three.js
    initThreeJS();
    
    // Animate logo appearance
    gsap.to(logoContainer, {
        opacity: 1,
        duration: 2,
        ease: "power3.out",
        delay: 0.5
    });
    
    // Animate title after a short delay
    setTimeout(animateTitle, 1000);
    
    // Show enter button after animation
    setTimeout(() => {
        gsap.to(goToGameBtn, {
            opacity: 1,
            duration: 1
        });
    }, 2500);
}

// Simulate loading process
function simulateLoading() {
    const interval = setInterval(() => {
        loadingProgress += 1;
        loadingBar.style.width = `${loadingProgress}%`;
        loadingText.textContent = `${loadingProgress}%`;
        
        updateLoadingMessage();
        
        if (loadingProgress >= 100) {
            clearInterval(interval);
            
            // Hide loading screen and show intro
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    showIntroScreen();
                }
            });
        }
    }, 20); // Adjust speed as needed
}

// Handle window resize
function handleResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize everything when page loads
window.addEventListener('load', () => {
    // Start loading simulation
    simulateLoading();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Add click event to button
    goToGameBtn.addEventListener('click', () => {
        // Add your game entry logic here
         window.location.href = './login.html'; 
    });
});