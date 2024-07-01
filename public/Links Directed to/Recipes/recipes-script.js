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


// ======================= Recipe Homepage  ========================
const searchBtn = document.getElementById('search-btn');
const recipeList = document.getElementById('recipe');
const recipeDetailsContent = document.querySelector('recipe-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

//event listeners
searchBtn.addEventListener('click', getRecipeList);

//get recipe list that matches name
function getRecipeList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    ('search-input').value.trim();
    fetch(`www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata`)
    .then(Response => Response.json())
    .then(data => {
        console.log(data);
    })
}

document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        // Change the SIGN UP/LOGIN text to the user's name
        const dropbtn = document.querySelector('.dropbtn');
        dropbtn.textContent = user.name;

        // Hide Login button
        const loginLink = document.getElementById('login-link')
        // Show logout button
        const logoutButton = document.getElementById('logout-button');
        if (loginLink && logoutButton) {
            loginLink.style.display = 'none'
            logoutButton.style.display = 'block';
        }
    } else {
        // Hide logout button if user is not logged in and show login link when logged out
        const loginLink = document.getElementById('login-link')
        const logoutButton = document.getElementById('logout-button');
        if (loginLink && logoutButton) {
            loginLink.style.display = 'block'
            logoutButton.style.display = 'none';
        }
    }
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton){
        logoutButton.addEventListener('click', function() {
            // Clear user data from localStorage
            localStorage.removeItem('user');

            // Redirect to the login page
            window.location.href = '../../login.html';
        });
    }
});