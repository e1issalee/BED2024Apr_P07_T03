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
    // Find the "Login" button by its id
    const loginButton = document.getElementById('login-submit');
    
    loginButton.addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const email = document.getElementById('login-user-email').value;
        const password = document.getElementById('login-user-pwd').value;

        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const user = await response.json();
                alert('Login successful!');
                localStorage.setItem('user', JSON.stringify(user));
                document.getElementById('login-dropdown').innerText = user.name;

                // Redirect to a different page if needed
                window.location.href = 'index.html';

            } else {
                const errorData = await response.json();
                alert('Error logging in: ' + (errorData.message || 'Invalid credentials'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error logging in');
        }
    });
});

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
            window.location.href = 'login.html';
        });
    }
});



