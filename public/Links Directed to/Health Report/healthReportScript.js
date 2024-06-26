//healthReportScript.js

// nav bar functions
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

// healthReport functions

function isValidWeight(weight) {
return /^\d+(\.\d)?$/.test(weight);
}

document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generateButton');
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

    const formData = {
        userAge: userAge,
        userHeight: userHeight,
        userWeight: userWeight,
        userGender: userGender.value,
        userActivityLevel: userActivityLevel
    };

    try {
      const response = await fetch('http://localhost:3000/saveUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Server Error');
      }

      const responseData = await response.json();
      console.log('Success:', responseData);

      if (responseData.success) {
        // Redirect to report.html on success
        window.location.href = 'http://localhost:3000/Links%20Directed%20to/Health%20Report/report.html';
      } else {
        console.error('Error in response:', responseData);
        // Handle error in response if necessary
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      // Handle fetch request error (e.g., network error)
    }
  
  });

  function displayErrors(errors) {
      console.log('Displaying Errors:', errors); // Debugging line

      document.getElementById('userAgeError').textContent = errors.userAge || '';
      document.getElementById('userHeightError').textContent = errors.userHeight || '';
      document.getElementById('userWeightError').textContent = errors.userWeight || '';
      document.getElementById('userGenderError').textContent = errors.userGender || '';
      document.getElementById('userActivityLevelError').textContent = errors.userActivityLevel || '';
  }
});


