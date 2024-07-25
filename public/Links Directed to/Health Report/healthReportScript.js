// healthReportScript.js

// Nav bar functions
function toggleActive(element) {
  var navbar = document.querySelector('.navbar');
  var links = navbar.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    links[i].classList.remove('active');
  }
  element.classList.add('active');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function toggleDropdown() {
  var dropdownContent = document.getElementById('dropdownContent');
  dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

// Health report functions
function isValidWeight(weight) {
  return /^\d+(\.\d)?$/.test(weight);
}

document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generateButton');
  const logoutButton = document.getElementById('logout-button');
  const loginLink = document.getElementById('login-link');

  generateButton.addEventListener('click', async () => {
    const userAge = document.getElementById('userAge').value;
    const userHeight = document.getElementById('userHeight').value;
    const userWeight = document.getElementById('userWeight').value;
    const userGender = document.querySelector('input[name="userGender"]:checked');
    const userActivityLevel = document.getElementById('userActivityLevel').value;
  
    let hasErrors = false;
    const errors = {};
  
    // Validate user age
    if (!userAge || isNaN(userAge) || userAge <= 0) {
      errors.userAge = '* Please enter a valid age, it should be a positive integer.';
      hasErrors = true;
    }
  
    // Validate user height
    if (!userHeight || isNaN(userHeight) || userHeight < 1.00 || userHeight > 2.00) {
      errors.userHeight = '* Height must be between 1.00 and 2.00 meters.';
      hasErrors = true;
    }
  
    // Validate user weight
    if (!userWeight || !isValidWeight(userWeight)) {
      errors.userWeight = '* Weight must be a positive number with up to one decimal place.';
      hasErrors = true;
    }
  
    // Validate user gender
    if (!userGender) {
      errors.userGender = '* Please select your gender.';
      hasErrors = true;
    }
  
    // Validate user activity level
    if (!userActivityLevel) {
      errors.userActivityLevel = '* Please select your activity level.';
      hasErrors = true;
    }
  
    // Display errors if any
    displayErrors(errors);
  
    if (hasErrors) {
      return;
    }
  
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
  
    if (!user || !token) {
      console.error('User is not logged in or token is missing');
      return;
    }
  
    const formData = {
      userAge,
      userHeight,
      userWeight,
      userGender: userGender.value,
      userActivityLevel,
      userID: user.id // Add user-specific information here
    };
  
    try {
      const response = await fetch('http://localhost:3000/saveUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the request header
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error('Server Error');
      }
  
      const responseData = await response.json();
      console.log('Success:', responseData);
  
      if (responseData.success) {
        // Redirect to report.html with userID instead of reportID
        window.location.href = `http://localhost:3000/Links%20Directed%20to/Health%20Report/report.html?userID=${user.id}`;
      } else {
        console.error('Error in response:', responseData);
        // Handle error in response if necessary
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      // Handle fetch request error (e.g., network error)
    }
  });
  
  // Handle user login/logout UI updates
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    // Change the SIGN UP/LOGIN text to the user's name
    const dropbtn = document.querySelector('.dropbtn');
    dropbtn.textContent = user.name;

    // Hide Login button
    if (loginLink) {
      loginLink.style.display = 'none';
    }
    // Show logout button
    if (logoutButton) {
      logoutButton.style.display = 'block';
    }
  } else {
    // Hide logout button if user is not logged in and show login link when logged out
    if (loginLink) {
      loginLink.style.display = 'block';
    }
    if (logoutButton) {
      logoutButton.style.display = 'none';
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Also clear the token

      // Redirect to the login page
      window.location.href = '../../login.html';
    });
  }

  // Function to display errors in the UI
  function displayErrors(errors) {
    console.log('Displaying Errors:', errors); // Debugging line

    document.getElementById('userAgeError').textContent = errors.userAge || '';
    document.getElementById('userHeightError').textContent = errors.userHeight || '';
    document.getElementById('userWeightError').textContent = errors.userWeight || '';
    document.getElementById('userGenderError').textContent = errors.userGender || '';
    document.getElementById('userActivityLevelError').textContent = errors.userActivityLevel || '';
  }
});
