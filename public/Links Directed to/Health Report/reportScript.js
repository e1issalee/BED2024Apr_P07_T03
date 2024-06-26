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
