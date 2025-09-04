// Initialize variables
let loadingProgress = 0;
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');
const loadingMessage = document.getElementById('loading-message');
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');

// Update loading messages
function updateLoadingMessage() {
    const messages = [
        "Loading game assets...",
        "Optimizing performance...",
        "Connecting to servers...",
        "Preparing arena...",
        "Almost ready..."
    ];
    
    const messageIndex = Math.floor(loadingProgress / 20);
    if (messageIndex < messages.length) {
        loadingMessage.textContent = messages[messageIndex];
    }
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
            
            // Hide loading screen and show main content
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    
                    // Animate nav
                    gsap.from('nav', {
                        duration: 0.8,
                        y: -50,
                        opacity: 0,
                        ease: 'power3.out'
                    });

                    // Animate hero section
                    gsap.from('.hero-section', {
                        duration: 1,
                        y: 50,
                        opacity: 0,
                        delay: 0.3,
                        ease: 'power3.out'
                    });

                    // Animate game cards with fromTo to force full visibility
                    document.querySelectorAll('.game-card').forEach((card, index) => {
                        gsap.fromTo(card, 
                            { y: 30, opacity: 0 }, 
                            { y: 0, opacity: 1, delay: 0.6 + index * 0.1, duration: 0.8, ease: 'power2.out' }
                        );

                        // Force child elements to visible immediately
                        card.querySelectorAll('*').forEach(child => {
                            child.style.opacity = '1';
                        });
                    });
                }
            });
        }
    }, 30);
}

// Handle page animations
document.addEventListener('DOMContentLoaded', function() {
    simulateLoading();
    
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .stat-item');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            if (elementPosition < screenPosition) {
                element.classList.add('animate-fade-in');
            }
        });
    };
    
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    document.querySelectorAll('.play-btn').forEach(button => {
        button.addEventListener('click', function() {
            alert('This would launch the game in a real implementation!');
        });
    });
    
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY && window.scrollY > 100) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
    });
});

// Add CSS for nav hide animation
const style = document.createElement('style');
style.textContent = `
    nav {
        transition: transform 0.3s ease;
    }
    
    .nav-hidden {
        transform: translateY(-100%);
    }
`;
document.head.appendChild(style);
