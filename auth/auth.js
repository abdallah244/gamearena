// Handle form submission
function handleLoginFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('remember-me');
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Save to local storage
    saveUserData(email, password, rememberMe);
    
    // Simulate API call
    simulateLogin(email);
}

// Save user data to local storage
function saveUserData(email, password, rememberMe) {
    const userData = {
        email: email,
        // In a real app, you should never store passwords in plain text
        // This is just for demonstration purposes
        password: password,
        loginTime: new Date().toISOString()
    };
    
    if (rememberMe) {
        localStorage.setItem('gameArenaUser', JSON.stringify(userData));
    } else {
        sessionStorage.setItem('gameArenaUser', JSON.stringify(userData));
    }
}

// Check if user is already logged in
function checkExistingLogin() {
    const userData = localStorage.getItem('gameArenaUser') || sessionStorage.getItem('gameArenaUser');
    
    if (userData) {
        const user = JSON.parse(userData);
        document.getElementById('email').value = user.email;
        document.getElementById('password').value = user.password;
        document.getElementById('remember-me').checked = true;
        
        showNotification(`Welcome back, ${user.email}!`, 'success');
    }
}

// Simulate login process
function simulateLogin(email) {
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = 'Signing in...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        showNotification(`Welcome to Game Arena, ${email}!`, 'success');
        
        // Redirect to game after a delay
        // setTimeout(() => {
        //     window.location.href = '/home/home.html'; 
        // }, 1500);
        
        // Restore button text after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }, 1500);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.auth-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type === 'error' ? 'error' : 'success'}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Handle demo account buttons
function setupDemoAccounts() {
    const demoButtons = document.querySelectorAll('.demo-account-btn');
    
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            const password = this.getAttribute('data-password');
            
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            
            showNotification(`Demo account "${email}" loaded`, 'success');
        });
    });
}

// Handle page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing login
    checkExistingLogin();
    
    // Add event listener to login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
    }
    
    // Setup demo accounts
    setupDemoAccounts();
    
    // Add animation to form elements
    gsap.from('form', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        delay: 0.3,
        ease: 'power2.out'
    });
});