// ======================= Navigation Bar  =======================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    // Add a transition effect for smooth appearance/disappearance
    navbar.style.transition = 'top 0.6s';

    window.addEventListener('scroll', function() {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Downscroll
            navbar.style.top = '-200px'; // Hide the navbar by moving it up
        } else {
            // Upscroll
            navbar.style.top = '0'; // Show the navbar
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
    });
} else {
    console.error('Navbar element not found.');
}

// Add debounce to improve performance
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

window.addEventListener('scroll', debounce(function() {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Downscroll
        navbar.style.top = '-200px'; // Hide the navbar by moving it up
    } else {
        // Upscroll
        navbar.style.top = '0'; // Show the navbar
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
}));

