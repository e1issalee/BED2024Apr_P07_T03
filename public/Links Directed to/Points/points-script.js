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

    // Calorie counter logic
    resetCaloriesAtMidnight();
    updateProgressBar();
    checkClaimStatus();
});

const dailyCalorieGoal = 2500;
let totalCaloriesConsumed = localStorage.getItem('totalCaloriesConsumed') ? parseInt(localStorage.getItem('totalCaloriesConsumed')) : 0;
let isClaimed = localStorage.getItem('isClaimed') ? JSON.parse(localStorage.getItem('isClaimed')) : false;

function addCalories() {
    const calorieInput = document.getElementById('calorie-input');
    const caloriesToAdd = parseInt(calorieInput.value);
    if (!isNaN(caloriesToAdd) && caloriesToAdd > 0) {
        totalCaloriesConsumed += caloriesToAdd;
        localStorage.setItem('totalCaloriesConsumed', totalCaloriesConsumed);
        updateProgressBar();
        calorieInput.value = '';
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

function resetCaloriesAtMidnight() {
    const current = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const timeToMidnight = midnight.getTime() - current.getTime();

    setTimeout(() => {
        totalCaloriesConsumed = 0;
        isClaimed = false;
        localStorage.setItem('totalCaloriesConsumed', totalCaloriesConsumed);
        localStorage.setItem('isClaimed', JSON.stringify(isClaimed));
        updateProgressBar();
        resetCaloriesAtMidnight();  // set the next reset
    }, timeToMidnight);
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

function redeemVoucher() {
    alert("Voucher redeemed!");
}

function checkClaimStatus() {
    const claimButton = document.getElementById('claim-button');
    if (isClaimed) {
        claimButton.disabled = true;
    }
}