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

document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('deleteReportButton');
    deleteButton.addEventListener('click', deleteReport);
  });
  
  async function deleteReport() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
  
    if (!user || !token) {
      console.error('User information or token not found');
      return;
    }
  
    const userId = user.id; // Assuming user object has an 'id' property
    try {
      const response = await fetch(`http://localhost:3000/deleteReport/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete report');
      }
  
      const data = await response.json();
      console.log('Report deleted:', data);
      // Redirect to healthReport.html after successful deletion
      window.location.href = 'healthReport.html';
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  }
  
  
// async function deleteReport() {
//     const user = JSON.parse(localStorage.getItem('user'));
//     const token = localStorage.getItem('token');

//     if (!user) {
//         console.error('User is not logged in');
//         return;
//     }


//     const userID = user.id; // Ensure this is a valid ID

//     try {
//         const response = await fetch(`http://localhost:3000/deleteReport/${userID}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}` // Add token if required
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Failed to delete report');
//         }

//         // Handle successful deletion
//         alert('Report deleted successfully');
//         window.location.href = 'healthReport.html'; // Redirect to healthReport.html or another page

//     } catch (error) {
//         console.error('Error deleting report:', error);
//         alert('Error deleting report');
//     }
// }




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
