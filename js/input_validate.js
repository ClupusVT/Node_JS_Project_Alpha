// validation.js

function sanitizeInput(input) {
    // Replace HTML special characters with their entities
    return input.replace(/[&<>"'/]/g, function (match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;'
        }[match];
    });
}

function validateForm() {
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');

    // Sanitize username and password
    usernameInput.value = sanitizeInput(usernameInput.value);
    passwordInput.value = sanitizeInput(passwordInput.value);

    // You can add additional validation logic here if needed

    return true; // Return true to allow form submission
}
