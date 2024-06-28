//reportScript.js

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
    const urlParams = new URLSearchParams(window.location.search);
    const reportID = urlParams.get('reportID'); // Assuming the reportID is passed as a query parameter
  
    try {
      const response = await fetch(`http://localhost:3000/healthReport/${reportID}`); // Replace with your API endpoint to fetch health report data
      if (!response.ok) {
        throw new Error('Failed to fetch health report data');
      }
  
      const reportData = await response.json();
      console.log('Fetched report data:', reportData); 
      displayReportDetails(reportData); // Function to populate HTML with report data
    } catch (error) {
      console.error('Error fetching health report data:', error);
      // Handle error (e.g., show error message on the page)
    }
  });
  
function displayReportDetails(reportData) {
    console.log('Displaying report details:', reportData); 
    document.getElementById('userAge').textContent = reportData.userAge
    document.getElementById('userHeight').textContent = reportData.userHeight;
    document.getElementById('userWeight').textContent = reportData.userWeight;
    document.getElementById('userGender').textContent = reportData.userGender;
    document.getElementById('userActivityLevel').textContent = reportData.userActivityLevel;
    document.getElementById('userBMI').textContent = reportData.userBMI;
    document.getElementById('userDailyCaloricIntake').textContent = reportData.userDailyCaloricIntake;
    document.getElementById('userBodyFatPercentage').textContent = reportData.userBodyFatPercentage;
    document.getElementById('userBMIRange').textContent = reportData.userBMIRange;
    document.getElementById('userBFPRange').textContent = reportData.userBFPRange;
}
  