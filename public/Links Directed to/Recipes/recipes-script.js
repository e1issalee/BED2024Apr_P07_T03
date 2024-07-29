// ======================= Navigation Bar  =======================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    navbar.style.transition = 'top 0.6s';

    window.addEventListener('scroll', function() {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            navbar.style.top = '-200px'; // Hide the navbar by moving it up
        } else {
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
        navbar.style.top = '-200px'; // Hide the navbar by moving it up
    } else {
        navbar.style.top = '0'; // Show the navbar
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
}));

// ======================= Recipe Homepage  ========================
const searchBtn = document.getElementById('search-btn');
const recipeList = document.getElementById('recipe');
// const recipeDetailsContent = document.querySelector('.recipe-details-content');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event listeners
if (searchBtn) {
    searchBtn.addEventListener('click', getRecipeList);
}
if (recipeCloseBtn) {
    recipeCloseBtn.addEventListener('click', () => {
        mealDetailsContent.parentElement.classList.remove('showRecipe');
    });
}

// Get recipe list that matches name
function getRecipeList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = '';
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="recipe-item" data-id="${meal.idMeal}">
                            <div class="recipe-img">
                                <img src="${meal.strMealThumb}" alt="Image of recipe" />
                            </div>
                            <div class="recipe-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Click to view</a>
                            </div>
                        </div>
                    `;
                });
                recipeList.classList.remove('notFound');
            } else {
                html = "No recipes found.";
                recipeList.classList.add('notFound');
            }
            recipeList.innerHTML = html;
            addRecipeEventListeners();
        });
}

function addRecipeEventListeners() {
    const recipeItems = document.querySelectorAll('.recipe-item');
    recipeItems.forEach(item => {
        item.querySelector('.recipe-btn').addEventListener('click', function(event) {
            event.preventDefault();
            getMealRecipe(item.dataset.id);
        });
    });
}

// Get recipe of the meal
function getMealRecipe(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals[0]));
}

// Create a modal
// Modify the mealRecipeModal function to use handleSaveRecipe
function mealRecipeModal(meal) {
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
        <div class="save-btn-container">
            <button id="save-recipe" onclick="handleSaveRecipe(${meal.idMeal})">Save Recipe</button>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Check if the user is logged in
function isUserLoggedIn() {
    return !!sessionStorage.getItem('userId');
}

// Function to handle the save recipe button click
function handleSaveRecipe(recipeId) {
    if (isUserLoggedIn()) {
        saveRecipe(recipeId);
    } else {
        alert('You need to be logged in to save recipes.');
        // Redirect to login page
        window.location.href = '../../login.html'; // Change this to your actual login page route
    }
}

function saveRecipe(recipeId) {
    const userId = getUserIdFromSession();

    fetch('http://localhost:3000/save-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, recipeId })
    })
    .then(response => {
        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Recipe saved successfully!');
        } else {
            alert('Failed to save recipe.');
        }
    })
    .catch(error => {
        console.error('Error saving recipe:', error);
    });
}

function getUserIdFromSession() {
    return sessionStorage.getItem('userId');
}

const seeAllRecipesBtn = document.getElementById('see-all-recipes');

if (seeAllRecipesBtn) {
    seeAllRecipesBtn.addEventListener('click', () => {
        if (isUserLoggedIn()) {
            window.location.href = 'saved-recipes.html'; // Change this to your actual saved recipes page route
        } else {
            alert('You need to be logged in to see saved recipes.');
            window.location.href = '../../login.html'; // Change this to your actual login page route
        }
    });
}
