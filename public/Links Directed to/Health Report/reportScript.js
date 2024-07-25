// //reportScript.js

// // nav bar functions
// function toggleActive(element) {
//     var navbar = document.querySelector('.navbar');
//     var links = navbar.getElementsByTagName('a');
//     for (var i = 0; i < links.length; i++) {
//         links[i].classList.remove('active');
//     }
//     element.classList.add('active');
// }
  
// function scrollToTop() {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
// }
  
// function scrollToSection(sectionId) {
//     document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
// }
  
// function toggleDropdown() {
//     var dropdownContent = document.getElementById('dropdownContent');
//     dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
// }

// document.addEventListener('DOMContentLoaded', async function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const reportID = urlParams.get('reportID'); // Assuming the reportID is passed as a query parameter
  
//     try {
//       const response = await fetch(`http://localhost:3000/healthReport/${reportID}`); // Replace with your API endpoint to fetch health report data
//       if (!response.ok) {
//         throw new Error('Failed to fetch health report data');
//       }
  
//       const reportData = await response.json();
//       console.log('Fetched report data:', reportData); 
//       displayReportDetails(reportData); // Function to populate HTML with report data
//     } catch (error) {
//       console.error('Error fetching health report data:', error);
//       // Handle error (e.g., show error message on the page)
//     }
//   });
  
// function displayReportDetails(reportData) {
//     console.log('Displaying report details:', reportData); 
//     document.getElementById('userAge').textContent = reportData.userAge
//     document.getElementById('userHeight').textContent = reportData.userHeight;
//     document.getElementById('userWeight').textContent = reportData.userWeight;
//     document.getElementById('userGender').textContent = reportData.userGender;
//     document.getElementById('userActivityLevel').textContent = reportData.userActivityLevel;
//     document.getElementById('userBMI').textContent = reportData.userBMI;
//     document.getElementById('userDailyCaloricIntake').textContent = reportData.userDailyCaloricIntake;
//     document.getElementById('userBodyFatPercentage').textContent = reportData.userBodyFatPercentage;
//     document.getElementById('userBMIRange').textContent = reportData.userBMIRange;
//     document.getElementById('userBFPRange').textContent = reportData.userBFPRange;
// }

// document.addEventListener('DOMContentLoaded', function() {
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (user) {
//       // Change the SIGN UP/LOGIN text to the user's name
//       const dropbtn = document.querySelector('.dropbtn');
//       dropbtn.textContent = user.name;

//       // Hide Login button
//       const loginLink = document.getElementById('login-link')
//       // Show logout button
//       const logoutButton = document.getElementById('logout-button');
//       if (loginLink && logoutButton) {
//           loginLink.style.display = 'none'
//           logoutButton.style.display = 'block';
//       }
//   } else {
//       // Hide logout button if user is not logged in and show login link when logged out
//       const loginLink = document.getElementById('login-link')
//       const logoutButton = document.getElementById('logout-button');
//       if (loginLink && logoutButton) {
//           loginLink.style.display = 'block'
//           logoutButton.style.display = 'none';
//       }
//   }
//   const logoutButton = document.getElementById('logout-button');
//   if (logoutButton){
//       logoutButton.addEventListener('click', function() {
//           // Clear user data from localStorage
//           localStorage.removeItem('user');

//           // Redirect to the login page
//           window.location.href = '../../login.html';
//       });
//   }
// });

// reportScript.js

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



document.addEventListener('DOMContentLoaded', async function() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        console.error('User is not logged in');
        window.location.href = '../../login.html';
        return;
    }

    const userID = user.id; // Ensure this is a valid ID

    try {
      const response = await fetch(`http://localhost:3000/healthReport/${userID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch health report data');
      }
  
      const reportData = await response.json();
      console.log('Fetched report data:', reportData);
      displayReportDetails(reportData);
    } catch (error) {
      console.error('Error fetching health report data:', error);
    }
});

function displayReportDetails(reportData) {
    if (Array.isArray(reportData) && reportData.length > 0) {
        const report = reportData[0]; // Access the first object in the array
        console.log('Displaying report details:', report);
        
        // Update HTML elements with the details from the report object
        document.getElementById('userAge').textContent = report.userAge || 'N/A';
        document.getElementById('userHeight').textContent = report.userHeight || 'N/A';
        document.getElementById('userWeight').textContent = report.userWeight || 'N/A';
        document.getElementById('userGender').textContent = report.userGender || 'N/A';
        document.getElementById('userActivityLevel').textContent = report.userActivityLevel || 'N/A';
        document.getElementById('userBMI').textContent = report.userBMI || 'N/A';
        document.getElementById('userDailyCaloricIntake').textContent = report.userDailyCaloricIntake || 'N/A';
        document.getElementById('userBodyFatPercentage').textContent = report.userBodyFatPercentage || 'N/A';
        document.getElementById('userBMIRange').textContent = report.userBMIRange || 'N/A';
        document.getElementById('userBFPRange').textContent = report.userBFPRange || 'N/A';
    } else {
        console.error('Invalid report data format');
    }
}


document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
      // Change the SIGN UP/LOGIN text to the user's name
      const dropbtn = document.querySelector('.dropbtn');
      dropbtn.textContent = user.name;

      // Hide Login button
      const loginLink = document.getElementById('login-link');
      // Show logout button
      const logoutButton = document.getElementById('logout-button');
      if (loginLink && logoutButton) {
          loginLink.style.display = 'none';
          logoutButton.style.display = 'block';
      }
  } else {
      // Hide logout button if user is not logged in and show login link when logged out
      const loginLink = document.getElementById('login-link');
      const logoutButton = document.getElementById('logout-button');
      if (loginLink && logoutButton) {
          loginLink.style.display = 'block';
          logoutButton.style.display = 'none';
      }
  }
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
      logoutButton.addEventListener('click', function() {
          // Clear user data from localStorage
          localStorage.removeItem('user');

          // Redirect to the login page
          window.location.href = '../../login.html';
      });
  }
});
