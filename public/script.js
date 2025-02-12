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
                const data = await response.json();
                alert('Login successful!');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('isClaimed', false);
                localStorage.setItem('userID', data.user.id); // for linking to health report
                document.getElementById('login-dropdown').innerText = data.user.name;

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


document.addEventListener('DOMContentLoaded', async () => {
    const healthReportLink = document.querySelector('a[href="Links Directed to/Health Report/healthReport.html"]');
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    console.log('DOM fully loaded and parsed');
    console.log('Health Report Link:', healthReportLink);
    console.log('User:', user);
    console.log('Token:', token);

    if (user && token && healthReportLink) {
        console.log('Adding event listener to health report link');
        healthReportLink.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent the default link behavior
            console.log('Health report link clicked');

            try {
                const response = await fetch(`http://localhost:3000/healthReport/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('Fetch response status:', response.status);

                if (response.ok) {
                    const healthReports = await response.json();
                    console.log('Health reports:', healthReports);

                    if (healthReports.length > 0) {
                        // Redirect to the report.html if reports are found
                        console.log('Redirecting to report.html');
                        // window.location.href = `Links Directed to/Health Report/report.html?userID=${user.id}`;
                        window.location.href = `http://localhost:3000/Links%20Directed%20to/Health%20Report/report.html?userID=${user.id}`;
                    } else {
                        // No reports found, redirect to healthReport.html
                        console.log('No reports found, redirecting to healthReport.html');
                        window.location.href = healthReportLink.href;
                    }
                } else if (response.status === 404) {
                    // No reports found, redirect to healthReport.html
                    console.log('No reports found (404), redirecting to healthReport.html');
                    window.location.href = healthReportLink.href;
                } else {
                    throw new Error('Server Error');
                }
            } catch (error) {
                console.error('Error checking report:', error);
                // Redirect to healthReport.html in case of an error
                console.log('Redirecting to healthReport.html due to error');
                window.location.href = healthReportLink.href;
            }
        });
    } else {
        console.log('User, token, or health report link missing');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.querySelector('.feedback-form');
  
    // Handle form submission
    feedbackForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
  
      const issueInput = document.getElementById('issue');
      const comments = issueInput.value.trim();
  
      // Validate input
      if (!comments) {
        alert('Please enter a description of the issue.');
        return;
      }
  
      // Retrieve the user and token from local storage
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
  
      if (!user || !token) {
        alert('You need to be logged in to submit feedback.');
        return;
      }
  
      const userID = user.id; // Extract userID from the user object
  
      const feedbackDetails = {
        userID,
        comments
      };
  
      try {
        // Send a POST request to the server to create feedback
        const response = await fetch('/userFeedback/createFeedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the request headers
          },
          body: JSON.stringify(feedbackDetails)
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Feedback submitted successfully:', result);
  
          // Clear the input field
          issueInput.value = '';
  
          // Optionally, display a success message to the user
          alert('Thank you for your feedback!');
        } else {
          // Handle errors
          const error = await response.json();
          console.error('Error submitting feedback:', error);
          alert('Error submitting feedback. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    });
  });
  
