function toggleActive(link) {
    // Remove active class from previously active link
    var currentActive = document.querySelector('.navbar a.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }

    // Add active class to clicked link
    link.classList.add('active');
}

// -------------------- Scroll to Top -------------------- // 
function scrollToTop() {
    // Scroll smoothly to the top of the page
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// JavaScript to create a parallax scrolling effect
window.addEventListener('scroll', function() {
    const parallaxImg = document.querySelector('.parallax-img');
    const scrollPosition = window.scrollY;
    parallaxImg.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
});

window.addEventListener('scroll', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var revealTop = reveals[i].getBoundingClientRect().top;
        var revealPoint = 100;

        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active');
        }
    }
}

function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {

        // Fetch the latest user data from the server
        await refreshUserData(user.id);

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

    // Calorie counter logic
    resetCaloriesAtMidnight(user.id);
    updateProgressBar();
    checkClaimStatus();
});

const dailyCalorieGoal = 2500;
let totalCaloriesConsumed = localStorage.getItem('totalCaloriesConsumed') ? parseInt(localStorage.getItem('totalCaloriesConsumed')) : 0;
let isClaimed = localStorage.getItem('isClaimed') ? JSON.parse(localStorage.getItem('isClaimed')) : false;

async function refreshUserData(userId) {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user));
            totalCaloriesConsumed = user.dailyCalories;
            localStorage.setItem('totalCaloriesConsumed', totalCaloriesConsumed);
            // Update the total calories consumed today element
            resetCaloriesAtMidnight(user.id);
        } else {
            console.error('Error fetching user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

async function addCalories() {
    const calorieInput = document.getElementById('calorie-input');
    const caloriesToAdd = parseInt(calorieInput.value);
    if (!isNaN(caloriesToAdd) && caloriesToAdd > 0) {
        const success = await updateUserCaloriesInDB(caloriesToAdd);
        if (success) {
            totalCaloriesConsumed += caloriesToAdd;
            localStorage.setItem('totalCaloriesConsumed', totalCaloriesConsumed);
            updateProgressBar();
            calorieInput.value = '';
        }
    }
}

async function updateUserCaloriesInDB(caloriesToAdd) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
        alert("User not logged in. Please log in to update calories.");
        return false;
    }

    try {
        const response = await fetch(`http://localhost:3000/users/updateDailyCalories/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dailyCalories: user.dailyCalories + caloriesToAdd })
        });

        if (response.ok) {
            const updatedUser = await response.json();
            user.dailyCalories = updatedUser.dailyCalories;
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        } else {
            alert("Error updating calories");
            return false;
        }
    } catch (error) {
        console.error("Error updating calories", error);
        alert("Error updating calories");
        return false;
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const caloriesToday = document.getElementById('calories-today');
    const claimButton = document.getElementById('claim-button');
    const percentage = (totalCaloriesConsumed / dailyCalorieGoal) * 100;
    progressBar.style.width = percentage + '%';
    caloriesToday.textContent = totalCaloriesConsumed;

    if (totalCaloriesConsumed >= dailyCalorieGoal && !isClaimed) {
        claimButton.disabled = false;
    } else {
        claimButton.disabled = true;
    }
}

function resetCaloriesAtMidnight(userId) {
    const current = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const timeToMidnight = midnight.getTime() - current.getTime();

    setTimeout(async () => {
        try {
            // Reset local variables and storage
            totalCaloriesConsumed = 0;
            isClaimed = false;
            localStorage.setItem('totalCaloriesConsumed', totalCaloriesConsumed);
            localStorage.setItem('isClaimed', JSON.stringify(isClaimed));
            updateProgressBar();

            // Reset dailyCalories in MSSQL via PUT request
            await resetDailyCalories(userId);

            // Set the next reset
            resetCaloriesAtMidnight(userId);

        } catch (error) {
            console.error('Error resetting at midnight:', error);
        }
    }, timeToMidnight);
}

async function resetDailyCalories(userId) {
    try {
        const response = await fetch(`http://localhost:3000/users/resetDailyCalories/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
            // Optionally, pass additional data if needed in the body
        });

        if (!response.ok) {
            throw new Error('Failed to reset daily calories');
        }
    } catch (error) {
        console.error('Error resetting daily calories:', error);
        throw error;
    }
}

async function claimCalories() {
    const user = JSON.parse(localStorage.getItem('user'));

  // Check if user is stored locally
  if (!user || !user.id) {
    alert("User not logged in. Please log in to claim calories.");
    return; // Exit the function if no user is found
  }

  if (totalCaloriesConsumed >= dailyCalorieGoal && !isClaimed) {
    try {
      const response = await fetch(`http://localhost:3000/users/updatePointsAndVouchers/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ points: user.points + 10, numberOfVouchers: user.numberOfVouchers })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        alert("Calories claimed: " + totalCaloriesConsumed + "\nPoints claimed: 10 points");
        document.getElementById('claim-button').disabled = true;
        isClaimed = true;
        localStorage.setItem('isClaimed', JSON.stringify(isClaimed));
        user.points = updatedUser.points;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        alert("Error claiming calories");
      }
    } catch (error) {
      console.error("Error claiming calories", error);
      alert("Error claiming calories");
    }
  } else {
    alert("You cannot claim calories until you reach your daily goal.");
  }
}

async function redeemVoucher() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.id) {
        alert("User not logged in. Please log in to redeem a voucher.");
        return;
    }

    if (user.points < 50) {
        alert("Not enough points to redeem a voucher.");
        return;
    }

    try {
        // Update points and vouchers in the database
        const response = await fetch(`http://localhost:3000/users/updatePointsAndVouchers/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ points: user.points - 50, numberOfVouchers: user.numberOfVouchers + 1 })
        });

        if (response.ok) {
            const updatedUser = await response.json();

            // Update local storage
            user.points = updatedUser.points;
            user.numberOfVouchers = updatedUser.numberOfVouchers;
            localStorage.setItem('user', JSON.stringify(user));

            alert("Voucher redeemed successfully!");
        } else {
            alert("Error redeeming voucher.");
        }
    } catch (error) {
        console.error("Error redeeming voucher", error);
        alert("Error redeeming voucher.");
    }
}

function checkClaimStatus() {
    const claimButton = document.getElementById('claim-button');
    if (isClaimed) {
        claimButton.disabled = true;
    }
}