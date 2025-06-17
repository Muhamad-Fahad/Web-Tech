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

const modal = document.getElementById('checkoutModal');
const shopNowButtons = document.querySelectorAll('.shop-now');
const closeModal = document.querySelector('.close-modal');

// Open modal when Shop Now is clicked
shopNowButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'flex';
    });
});

// Close modal when X is clicked
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Form validation
function validateForm(event) {
    event.preventDefault();
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    
    // Email validation
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid Gmail address';
        isValid = false;
    }
    
    // Name validation
    if (!name) {
        document.getElementById('nameError').textContent = 'Name is required';
        isValid = false;
    }
    
    // Address validation
    if (!address) {
        document.getElementById('addressError').textContent = 'Address is required';
        isValid = false;
    }
    
    if (isValid) {
        alert('Order submitted successfully!');
        modal.style.display = 'none';
        document.getElementById('checkoutForm').reset();
    }
    
    return false;
}

// Email validation helper function
function validateEmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}