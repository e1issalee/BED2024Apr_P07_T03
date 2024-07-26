document.addEventListener('DOMContentLoaded', function() {
    // Navbar functions
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

    // Handle user authentication
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Change the SIGN UP/LOGIN text to the user's name
        const dropbtn = document.querySelector('.dropbtn');
        dropbtn.textContent = user.name;

        // Hide Login button and show Logout button
        const loginLink = document.getElementById('login-link');
        const logoutButton = document.getElementById('logout-button');
        if (loginLink && logoutButton) {
            loginLink.style.display = 'none';
            logoutButton.style.display = 'block';
        }
    } else {
        // Hide Logout button and show Login button
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

    // Handle form submission
    const postForm = document.getElementById('create-post-form');
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
        const userName = user.name;
        const timestamp = new Date().toISOString(); // Get the current timestamp

        const postDetails = {
            userID,
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

                // Fetch and display posts again
                fetchAndDisplayPosts();

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

    // Function to fetch and display posts
    const fetchAndDisplayPosts = async () => {
        try {
            const response = await fetch('/forum/getAllPosts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const posts = await response.json();
                const postsContainer = document.getElementById('posts-container');
                postsContainer.innerHTML = ''; // Clear the container

                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('post');

                    // Populate the post element with the post data
                    postElement.innerHTML = `
                        <div class="post-header">
                            <div class="post-info">
                                <p class="username">${post.userName}</p>
                                <p class="time">${new Date(post.timestamp).toLocaleString()}</p>
                            </div>
                            <div class="post-options">
                                <button class="options-button">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="12" cy="7" r="1"></circle>
                                        <circle cx="12" cy="17" r="1"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="post-content">
                            <p>${post.postContent}</p>
                        </div>
                        <div class="post-actions">
                            <div class="actions-left">
                                <button class="like-button">
                                    <i class="fa-regular fa-heart"></i>
                                    <span>${post.likes || 0}</span>
                                </button>
                                <button class="comment-button">
                                    <i class="fa-regular fa-comment"></i>
                                    <span>${post.comments || 0}</span>
                                </button>
                            </div>
                            <div class="actions-right">
                                <button class="share-button">
                                    <i class="fa-solid fa-share"></i>
                                </button>
                                <button class="delete-button">
                                    <i class="fa-solid fa-trash-can" style="font-size:24px;"></i>
                                </button>
                                <button class="edit-button">
                                    <i class="fa-solid fa-edit" style="font-size:24px;"></i>
                                </button>
                            </div>
                        </div>
                    `;

                    // Append the post to the container
                    postsContainer.appendChild(postElement);
                });
            } else {
                // Handle errors
                const error = await response.json();
                console.error('Error fetching posts:', error);
                alert('Error fetching posts. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while fetching posts. Please try again.');
        }
    };

    // Fetch and display posts when the page loads
    fetchAndDisplayPosts();
});
