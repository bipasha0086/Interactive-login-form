// Get form elements
const form = document.getElementById('registrationForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const successMessage = document.getElementById('successMessage');
const resetBtn = document.getElementById('resetBtn');

// Get error message elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

// Get password strength elements
const passwordStrength = document.getElementById('passwordStrength');
const passwordRequirements = document.getElementById('passwordRequirements');

// Validation state object
const validationState = {
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
};

// Validation functions
function validateName(name) {
    const trimmedName = name.trim();
    if (trimmedName === '') {
        return { valid: false, message: 'Name is required' };
    }
    if (trimmedName.length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters long' };
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
        return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    return { valid: true, message: '' };
}

function validateEmail(email) {
    const trimmedEmail = email.trim();
    if (trimmedEmail === '') {
        return { valid: false, message: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    return { valid: true, message: '' };
}

function validatePhone(phone) {
    const trimmedPhone = phone.trim();
    if (trimmedPhone === '') {
        return { valid: false, message: 'Phone number is required' };
    }
    // Remove all non-digit characters for validation
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
        return { valid: false, message: 'Phone number must be at least 10 digits' };
    }
    if (digitsOnly.length > 15) {
        return { valid: false, message: 'Phone number is too long' };
    }
    return { valid: true, message: '' };
}

function checkPasswordStrength(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Update UI for each requirement
    document.getElementById('req-length').classList.toggle('met', requirements.length);
    document.getElementById('req-uppercase').classList.toggle('met', requirements.uppercase);
    document.getElementById('req-lowercase').classList.toggle('met', requirements.lowercase);
    document.getElementById('req-number').classList.toggle('met', requirements.number);
    document.getElementById('req-special').classList.toggle('met', requirements.special);

    // Calculate strength
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    let strength = 'weak';
    if (metRequirements === 5) {
        strength = 'strong';
    } else if (metRequirements >= 3) {
        strength = 'medium';
    }

    return { requirements, strength, metRequirements };
}

function validatePassword(password) {
    if (password === '') {
        return { valid: false, message: 'Password is required' };
    }
    
    const { requirements, metRequirements } = checkPasswordStrength(password);
    
    if (!requirements.length) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!requirements.uppercase) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!requirements.lowercase) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!requirements.number) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    if (!requirements.special) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    return { valid: true, message: '' };
}

function validateConfirmPassword(password, confirmPassword) {
    if (confirmPassword === '') {
        return { valid: false, message: 'Please confirm your password' };
    }
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true, message: '' };
}

// UI update functions
function updateFieldUI(input, errorElement, isValid, message) {
    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorElement.textContent = '';
        errorElement.classList.remove('active');
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
}

function updatePasswordStrengthUI(password) {
    const strengthBar = passwordStrength.querySelector('.strength-bar');
    
    if (password === '') {
        passwordStrength.classList.remove('active');
        passwordRequirements.classList.remove('active');
        strengthBar.className = 'strength-bar';
        return;
    }

    passwordStrength.classList.add('active');
    passwordRequirements.classList.add('active');
    
    const { strength } = checkPasswordStrength(password);
    strengthBar.className = 'strength-bar ' + strength;
}

// Event handlers for name field
nameInput.addEventListener('input', function() {
    const result = validateName(this.value);
    validationState.name = result.valid;
    updateFieldUI(this, nameError, result.valid, result.message);
});

nameInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
        const result = validateName(this.value);
        validationState.name = result.valid;
        updateFieldUI(this, nameError, result.valid, result.message);
    }
});

nameInput.addEventListener('focus', function() {
    if (this.classList.contains('invalid')) {
        const result = validateName(this.value);
        updateFieldUI(this, nameError, result.valid, result.message);
    }
});

// Event handlers for email field
emailInput.addEventListener('input', function() {
    const result = validateEmail(this.value);
    validationState.email = result.valid;
    updateFieldUI(this, emailError, result.valid, result.message);
});

emailInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
        const result = validateEmail(this.value);
        validationState.email = result.valid;
        updateFieldUI(this, emailError, result.valid, result.message);
    }
});

emailInput.addEventListener('focus', function() {
    if (this.classList.contains('invalid')) {
        const result = validateEmail(this.value);
        updateFieldUI(this, emailError, result.valid, result.message);
    }
});

// Event handlers for phone field
phoneInput.addEventListener('input', function() {
    const result = validatePhone(this.value);
    validationState.phone = result.valid;
    updateFieldUI(this, phoneError, result.valid, result.message);
});

phoneInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
        const result = validatePhone(this.value);
        validationState.phone = result.valid;
        updateFieldUI(this, phoneError, result.valid, result.message);
    }
});

phoneInput.addEventListener('focus', function() {
    if (this.classList.contains('invalid')) {
        const result = validatePhone(this.value);
        updateFieldUI(this, phoneError, result.valid, result.message);
    }
});

// Event handlers for password field
passwordInput.addEventListener('input', function() {
    const result = validatePassword(this.value);
    validationState.password = result.valid;
    updateFieldUI(this, passwordError, result.valid, result.message);
    updatePasswordStrengthUI(this.value);
    
    // Re-validate confirm password if it has a value
    if (confirmPasswordInput.value !== '') {
        const confirmResult = validateConfirmPassword(this.value, confirmPasswordInput.value);
        validationState.confirmPassword = confirmResult.valid;
        updateFieldUI(confirmPasswordInput, confirmPasswordError, confirmResult.valid, confirmResult.message);
    }
});

passwordInput.addEventListener('blur', function() {
    if (this.value !== '') {
        const result = validatePassword(this.value);
        validationState.password = result.valid;
        updateFieldUI(this, passwordError, result.valid, result.message);
    }
});

passwordInput.addEventListener('focus', function() {
    updatePasswordStrengthUI(this.value);
    if (this.classList.contains('invalid')) {
        const result = validatePassword(this.value);
        updateFieldUI(this, passwordError, result.valid, result.message);
    }
});

// Event handlers for confirm password field
confirmPasswordInput.addEventListener('input', function() {
    const result = validateConfirmPassword(passwordInput.value, this.value);
    validationState.confirmPassword = result.valid;
    updateFieldUI(this, confirmPasswordError, result.valid, result.message);
});

confirmPasswordInput.addEventListener('blur', function() {
    if (this.value !== '') {
        const result = validateConfirmPassword(passwordInput.value, this.value);
        validationState.confirmPassword = result.valid;
        updateFieldUI(this, confirmPasswordError, result.valid, result.message);
    }
});

confirmPasswordInput.addEventListener('focus', function() {
    if (this.classList.contains('invalid')) {
        const result = validateConfirmPassword(passwordInput.value, this.value);
        updateFieldUI(this, confirmPasswordError, result.valid, result.message);
    }
});

// Form submission handler
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validate all fields
    const nameResult = validateName(nameInput.value);
    const emailResult = validateEmail(emailInput.value);
    const phoneResult = validatePhone(phoneInput.value);
    const passwordResult = validatePassword(passwordInput.value);
    const confirmPasswordResult = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
    
    // Update validation state
    validationState.name = nameResult.valid;
    validationState.email = emailResult.valid;
    validationState.phone = phoneResult.valid;
    validationState.password = passwordResult.valid;
    validationState.confirmPassword = confirmPasswordResult.valid;
    
    // Update UI for all fields
    updateFieldUI(nameInput, nameError, nameResult.valid, nameResult.message);
    updateFieldUI(emailInput, emailError, emailResult.valid, emailResult.message);
    updateFieldUI(phoneInput, phoneError, phoneResult.valid, phoneResult.message);
    updateFieldUI(passwordInput, passwordError, passwordResult.valid, passwordResult.message);
    updateFieldUI(confirmPasswordInput, confirmPasswordError, confirmPasswordResult.valid, confirmPasswordResult.message);
    
    // Check if all validations passed
    const allValid = Object.values(validationState).every(state => state === true);
    
    if (allValid) {
        // Show success message
        successMessage.classList.add('active');
        
        // Create confetti effect
        createConfetti();
        
        // Log form data (in a real application, you would send this to a server)
        console.log('Form submitted successfully with data:', {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            password: '***hidden***'
        });
    } else {
        // Focus on the first invalid field
        const firstInvalidField = [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput]
            .find(input => input.classList.contains('invalid'));
        
        if (firstInvalidField) {
            scrollToError(firstInvalidField);
            firstInvalidField.focus();
        }
    }
});

// Reset button handler
resetBtn.addEventListener('click', function() {
    // Hide success message
    successMessage.classList.remove('active');
    
    // Reset form
    form.reset();
    
    // Clear validation state
    Object.keys(validationState).forEach(key => {
        validationState[key] = false;
    });
    
    // Remove all validation classes
    [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    
    // Clear all error messages
    [nameError, emailError, phoneError, passwordError, confirmPasswordError].forEach(error => {
        error.textContent = '';
        error.classList.remove('active');
    });
    
    // Hide password strength indicator
    passwordStrength.classList.remove('active');
    passwordRequirements.classList.remove('active');
    
    // Reset password requirements UI
    ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'].forEach(id => {
        document.getElementById(id).classList.remove('met');
    });
    
    // Focus on first field
    nameInput.focus();
});

// Add floating label effect
function addFloatingLabelEffect() {
    const inputs = [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput];
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

// Add input animation effects
function addInputAnimations() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach((input, index) => {
        input.style.animationDelay = `${index * 0.1}s`;
    });
}

// Confetti effect on successful submission
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#27ae60', '#f39c12', '#e74c3c'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        successMessage.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Add typing effect for placeholder
function typingPlaceholder(input, text) {
    let index = 0;
    const originalPlaceholder = input.placeholder;
    input.placeholder = '';
    
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            input.placeholder += text.charAt(index);
            index++;
        } else {
            clearInterval(typeInterval);
        }
    }, 50);
}

// Add smooth scroll to first error
function scrollToError(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize: Focus on first field when page loads
window.addEventListener('load', function() {
    nameInput.focus();
    addFloatingLabelEffect();
    addInputAnimations();
    
    // Add typing effect to placeholders (optional)
    setTimeout(() => {
        const inputs = [
            { el: nameInput, text: 'Enter your full name' },
            { el: emailInput, text: 'example@email.com' },
            { el: phoneInput, text: '(123) 456-7890' },
            { el: passwordInput, text: 'Enter a strong password' },
            { el: confirmPasswordInput, text: 'Re-enter your password' }
        ];
    }, 500);
});
