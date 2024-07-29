document.addEventListener('DOMContentLoaded', function() {
    if (isUserLoggedIn()) {
        fetchSavedRecipes();
    } else {
        alert('You need to be logged in to see saved recipes.');
        window.location.href = '../../login.html'; // Change this to your actual login page route
    }
});

function isUserLoggedIn() {
    return !!sessionStorage.getItem('userId');
}

function getUserIdFromSession() {
    return sessionStorage.getItem('userId');
}

function fetchSavedRecipes() {
    const userId = getUserIdFromSession();
    fetch(`http://localhost:3000/get-saved-recipes?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            let html = '';
            if (data.recipes && data.recipes.length > 0) {
                data.recipes.forEach(recipe => {
                    html += `
                        <div class="recipe-item" data-id="${recipe.idMeal}">
                            <div class="recipe-img">
                                <img src="${recipe.strMealThumb}" alt="Image of recipe" />
                            </div>
                            <div class="recipe-name">
                                <h3>${recipe.strMeal}</h3>
                                <a href="#" class="recipe-btn" onclick="getMealRecipe(${recipe.idMeal})">View Recipe</a>
                            </div>
                        </div>
                    `;
                });
            } else {
                html = "No recipes found.";
            }
            document.getElementById('saved-recipes-list').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching saved recipes:', error);
        });
}

function getMealRecipe(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals[0]));
}

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
    `;
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = html;
    document.body.appendChild(modal);
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Function to handle the delete recipe button click
function handleDeleteRecipe(recipeId) {
    if (isUserLoggedIn()) {
        deleteRecipe(recipeId);
    } else {
        alert('You need to be logged in to delete recipes.');
        // Redirect to login page
        window.location.href = '../../login.html'; // Change this to your actual login page route
    }
}

function deleteRecipe(recipeId) {
    const userId = getUserIdFromSession();

    fetch('http://localhost:3000/delete-recipe', {
        method: 'DELETE',
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
            alert('Recipe deleted successfully!');
            // Optionally close the modal or update the UI
            mealDetailsContent.parentElement.classList.remove('showRecipe');
        } else {
            alert('Failed to delete recipe.');
        }
    })
    .catch(error => {
        console.error('Error deleting recipe:', error);
    });
}
