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
