document.addEventListener('DOMContentLoaded', () => {
    // Navigation handling
    const navButtons = document.querySelectorAll('[data-page]');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPage = button.getAttribute('data-page');
            
            // Remove active class from all buttons and pages
            navButtons.forEach(btn => btn.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked button and target page
            button.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
            
            // Reset scroll position of the new page
            document.querySelector('.content').scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
});