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
});

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('create-post-form');
  
    // Handle form submission
    postForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
  
      const postContentInput = document.getElementById('post-content');
      const postContent = postContentInput.value.trim();
  
      // Validate input
      if (!postContent) {
        alert('Please enter some content for your post.');
        return;
      }
  
      // Retrieve the user and token from local storage
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
  
      if (!user || !token) {
        alert('You need to be logged in to create a post.');
        return;
      }
  
      const userID = user.id; // Extract userID from the user object
      const postID = Date.now(); // Generate a unique post ID based on the current time
      const userName = user.name;
      const timestamp = new Date().toISOString(); // Get the current timestamp
  
      const postDetails = {
        userID,
        postID,
        userName,
        timestamp,
        postContent
      };
  
      try {
        // Send a POST request to the server to create the post
        const response = await fetch('/forum/createPost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the request headers
          },
          body: JSON.stringify(postDetails)
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Post created successfully:', result);
  
          // Clear the input field
          postContentInput.value = '';
  
          // Optionally, display a success message to the user
          alert('Your post has been created successfully!');
        } else {
          // Handle errors
          const error = await response.json();
          console.error('Error creating post:', error);
          alert('Error creating post. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    });
  });
  

  