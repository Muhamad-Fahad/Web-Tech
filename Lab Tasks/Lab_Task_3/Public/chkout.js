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
            // Prevent non-numeric input for phone, card number, and CVV
            $('#phone, #cardNumber, #cvv').on('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });

            // Prevent non-alphabetic input for full name
            $('#fullName').on('input', function() {
                this.value = this.value.replace(/[^A-Za-z\s]/g, '');
            });

            $('#checkoutForm').on('submit', function(e) {
                e.preventDefault();
                let isValid = true;
                
                // Reset errors and remove error class
                $('.error').text('');
                $('input, textarea').removeClass('error-input');
                
                // Full Name validation
                const fullName = $('#fullName')[0];
                if (!fullName.checkValidity()) {
                    $('#fullNameError').text('Please enter a valid name (only alphabets and spaces allowed)');
                    $('#fullName').addClass('error-input');
                    isValid = false;
                }

                // Email validation
                const email = $('#email')[0];
                if (!email.checkValidity()) {
                    $('#emailError').text('Please enter a valid email address');
                    $('#email').addClass('error-input');
                    isValid = false;
                }

                // Phone validation
                const phone = $('#phone')[0];
                if (!phone.checkValidity()) {
                    $('#phoneError').text('Please enter a valid phone number (10-15 digits)');
                    $('#phone').addClass('error-input');
                    isValid = false;
                }

                // Address validation
                const address = $('#address')[0];
                if (!address.checkValidity()) {
                    $('#addressError').text('Address is required');
                    $('#address').addClass('error-input');
                    isValid = false;
                }

                // Card Number validation
                const cardNumber = $('#cardNumber')[0];
                if (!cardNumber.checkValidity()) {
                    $('#cardNumberError').text('Please enter a valid 16-digit card number');
                    $('#cardNumber').addClass('error-input');
                    isValid = false;
                }

                // Expiry Date validation
                const expiryDate = $('#expiryDate')[0];
                if (!expiryDate.checkValidity()) {
                    $('#expiryDateError').text('Expiry date is required');
                    $('#expiryDate').addClass('error-input');
                    isValid = false;
                } else {
                    const [year, month] = expiryDate.value.split('-');
                    const expiry = new Date(year, month - 1);
                    const today = new Date();
                    if (expiry < today) {
                        $('#expiryDateError').text('Card has expired');
                        $('#expiryDate').addClass('error-input');
                        isValid = false;
                    }
                }

                // CVV validation
                const cvv = $('#cvv')[0];
                if (!cvv.checkValidity()) {
                    $('#cvvError').text('Please enter a valid 3-digit CVV');
                    $('#cvv').addClass('error-input');
                    isValid = false;
                }
                
                if (isValid) {
                    alert('Order submitted successfully!');
                    $('#checkoutForm')[0].reset();
                }
                
                return false;
            });
        });