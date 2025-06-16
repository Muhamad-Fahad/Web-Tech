// Navbar scroll behavior
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            navbar.classList.add('hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
        }
    } else {
        navbar.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
});

$(document).ready(function() {
            // Initialize tooltips
            $('[data-bs-toggle="tooltip"]').tooltip();
            
            // Open checkout page when product image is clicked
            $('.grid-item img').on('click', function(e) {
                e.preventDefault();
                window.location.href = 'checkout.html';
            });

            // Open checkout page when Shop Now is clicked
            $('.shop-now').on('click', function(e) {
                e.preventDefault();
                window.location.href = 'checkout.html';
            });

            // Open checkout page when View Lookbook is clicked
            $('.view-lookbook').on('click', function(e) {
                e.preventDefault();
                window.location.href = 'checkout.html';
            });

            // Open checkout page when Shop Collection is clicked
            $('.shop-collection').on('click', function(e) {
                e.preventDefault();
                window.location.href = 'checkout.html';
            });

            // Open checkout page when Read Journal is clicked
            $('.read-journal').on('click', function(e) {
                e.preventDefault();
                window.location.href = 'checkout.html';
            });

            // Open checkout page when About Link is clicked
            $('.about-link').on('click', function(e) {
                e.preventDefault();
                window.location.href = 'checkout.html';
            });
        });