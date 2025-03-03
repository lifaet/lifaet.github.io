/* filepath: /G:/Web Development/lifaet.github.io-development/assets/js/contact.js */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Here you can add your form submission logic
        // For example, sending to an email service or backend API
        console.log({ name, email, subject, message });
        
        // Reset form
        contactForm.reset();
        
        // Show success message (you can customize this)
        alert('Message sent successfully!');
    });
});