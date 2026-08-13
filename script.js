// ==========================================
// EcstacyBlog - JavaScript Functionality
// ==========================================

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('EcstacyBlog initialized');
    initializeAdUnits();
    setupNewsletterForm();
    setupSearchFunctionality();
    setupSmoothScroll();
});

// ==========================================
// Google AdSense Initialization
// ==========================================

function initializeAdUnits() {
    // Push AdSense ads to display
    // This will automatically display ads if you have set up your AdSense ID
    if (typeof adsbygoogle !== 'undefined') {
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.log('AdSense ads are not fully loaded yet');
        }
    }
}

// ==========================================
// Newsletter Signup Handler
// ==========================================

function handleNewsletterSignup(event) {
    event.preventDefault();

    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value;

    // Basic email validation
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission (in production, you'd send this to your backend)
    const button = form.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Subscribing...';
    button.disabled = true;

    setTimeout(() => {
        // Store subscription (localStorage for demo)
        let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        }

        showNotification('Successfully subscribed! Check your email for confirmation.', 'success');
        emailInput.value = '';
        button.textContent = originalText;
        button.disabled = false;

        console.log('Newsletter subscription - Email:', email);
    }, 1000);
}

// ==========================================
// Search Functionality
// ==========================================

function setupSearchFunctionality() {
    const searchBox = document.querySelector('.search-box');
    
    if (searchBox) {
        searchBox.addEventListener('input', debounce(function(e) {
            const query = e.target.value.toLowerCase();
            if (query.length > 0) {
                console.log('Searching for:', query);
                // In production, this would filter posts or search articles
                performSearch(query);
            }
        }, 300));
    }
}

function performSearch(query) {
    // Get all post cards
    const posts = document.querySelectorAll('.post-card');
    let results = 0;

    posts.forEach(post => {
        const title = post.querySelector('h2, h3')?.textContent.toLowerCase() || '';
        const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
        const category = post.querySelector('.post-category')?.textContent.toLowerCase() || '';

        if (title.includes(query) || excerpt.includes(query) || category.includes(query)) {
            post.style.display = 'block';
            results++;
        } else {
            post.style.display = 'none';
        }
    });

    console.log(`Found ${results} matching article(s)`);
}

// ==========================================
// Notification System
// ==========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Auto-remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ==========================================
// Smooth Scroll
// ==========================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// Utility Functions
// ==========================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// Analytics Tracking (Optional)
// ==========================================

function trackPageView() {
    // Send to your analytics service
    console.log('Page view tracked');
}

function trackArticleClick(articleTitle) {
    console.log('Article clicked:', articleTitle);
    // Send to analytics
}

// Track article clicks
document.addEventListener('click', function(e) {
    const button = e.target.closest('.read-more-btn');
    if (button) {
        const title = button.closest('.post-content').querySelector('h2, h3').textContent;
        trackArticleClick(title);
    }
});

// Track when user leaves page (for analytics)
window.addEventListener('beforeunload', function() {
    trackPageView();
});

// ==========================================
// Ad Refresh Functionality (Premium Feature)
// ==========================================

function refreshAdUnits() {
    if (typeof adsbygoogle !== 'undefined') {
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.log('Could not refresh ads');
        }
    }
}

// Optional: Refresh ads every 30 minutes
setInterval(() => {
    refreshAdUnits();
}, 30 * 60 * 1000);

// ==========================================
// Dark Mode Toggle (Optional)
// ==========================================

function initializeDarkMode() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Listen for changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    });
}

// ==========================================
// Performance Monitoring (Optional)
// ==========================================

function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const metrics = {
            pageLoadTime: timing.loadEventEnd - timing.navigationStart,
            domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
            resourcesTime: timing.responseEnd - timing.fetchStart,
        };
        console.log('Performance Metrics:', metrics);
    }
}

// Log metrics when page loads
window.addEventListener('load', logPerformanceMetrics);

// ==========================================
// Add animation styles dynamically
// ==========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Initialize Dark Mode
// ==========================================

initializeDarkMode();

console.log('EcstacyBlog script loaded successfully');
