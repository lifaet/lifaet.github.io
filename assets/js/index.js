// Variables
let isScrolling = false;
let lastScrollTime = Date.now();
const scrollCooldown = 1000;

const pages = Array.from(document.querySelectorAll('.page'));
const menuButtons = Array.from(document.querySelectorAll('.menu-btn'));
const mobileButtons = Array.from(document.querySelectorAll('.nav-btn'));
let currentPageIndex = 0;

// Function to update URL hash
function updateURL(pageId) {
    if (history.pushState) {
        history.pushState(null, null, `#${pageId}`);
    } else {
        window.location.hash = pageId;
    }
}

// Function to change active page
function changePage(direction) {
    const now = Date.now();
    if (isScrolling || now - lastScrollTime < scrollCooldown) return;

    const nextIndex = currentPageIndex + direction;
    if (nextIndex >= 0 && nextIndex < pages.length) {
        isScrolling = true;
        lastScrollTime = now;
        currentPageIndex = nextIndex;

        // Update desktop menu
        menuButtons.forEach(btn => btn.classList.remove('active'));
        menuButtons[currentPageIndex].classList.add('active');

        // Update mobile menu
        mobileButtons.forEach(btn => btn.classList.remove('active'));
        mobileButtons[currentPageIndex].classList.add('active');

        // Update pages
        pages.forEach(page => page.classList.remove('active'));
        pages[currentPageIndex].classList.add('active');

        // Update URL
        updateURL(pages[currentPageIndex].id);

        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    }
}

// Handle desktop scroll navigation
function handleDesktopScroll(e) {
    if (window.innerWidth > 768) {
        const activePage = document.querySelector('.page.active');
        const atBottom = Math.abs(activePage.scrollHeight - activePage.scrollTop - activePage.clientHeight) < 1;
        const atTop = activePage.scrollTop === 0;

        if (atBottom && e.deltaY > 0) {
            e.preventDefault();
            changePage(1);
        } else if (atTop && e.deltaY < 0) {
            e.preventDefault();
            changePage(-1);
        }
    }
}

// Event Listeners
pages.forEach(page => {
    page.addEventListener('wheel', handleDesktopScroll, { passive: false });
});

// Handle mobile navigation
mobileButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        currentPageIndex = index;
        
        mobileButtons.forEach(btn => btn.classList.remove('active'));
        menuButtons.forEach(btn => btn.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        button.classList.add('active');
        menuButtons[index].classList.add('active');
        pages[index].classList.add('active');
        
        updateURL(button.getAttribute('data-page'));
    });
});

// Handle desktop navigation
menuButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        currentPageIndex = index;
        
        menuButtons.forEach(btn => btn.classList.remove('active'));
        mobileButtons.forEach(btn => btn.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        button.classList.add('active');
        mobileButtons[index].classList.add('active');
        pages[index].classList.add('active');
        
        updateURL(button.getAttribute('data-page'));
    });
});

// Handle URL changes
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('load', handleHashChange);

function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    const targetPage = document.getElementById(hash);
    const targetMenuBtn = document.querySelector(`.menu-btn[data-page="${hash}"]`);
    const targetNavBtn = document.querySelector(`.nav-btn[data-page="${hash}"]`);

    if (targetPage && targetMenuBtn && targetNavBtn) {
        // Update pages
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        targetPage.classList.add('active');

        // Update desktop menu buttons
        document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
        targetMenuBtn.classList.add('active');

        // Update mobile nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        targetNavBtn.classList.add('active');

        // Update current page index
        currentPageIndex = Array.from(document.querySelectorAll('.page')).indexOf(targetPage);
    }
}

// Call handleHashChange on load and hash change
window.addEventListener('load', handleHashChange);
window.addEventListener('hashchange', handleHashChange);



// PROJECTS//
// PROJECTS//
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Get array of categories from data-categories attribute
                const categories = card.getAttribute('data-categories').split(',');
                
                if (filter === 'all' || categories.includes(filter)) {
                    // Show card with animation
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    // Hide card with animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});



// CONTACT FORM//
// CONTACT FORM//
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



// CONTACT & CV FORM HANDELLAR//

/* filepath: /G:/Web Development/lifaet.github.io-development/assets/js/form-handler.js */
const gScript = 'https://script.google.com/macros/s/';
const idx = 'AKfycbwTnO3lXBe1RyfMECfWA4i-Z';
const sId = idx + '3dSgHApZGgJYHGkXkQNrEwJM1feXgOGz7HTuSTLm6Xggg';

// Form config object
const formConfig = {
    contact: {
        messageId: 'show_contact_msg',
        buttonId: 'submit-button',
        loadingText: 'Submitting...',
        successText: 'Message sent successfully!'
    },
    cv: {
        messageId: 'show_cv_msg',
        buttonSelector: '.cv-btn',
        loadingText: 'Saving Info...',
        successText: 'Information Recorded. Loading CV...'
    }
};

// Initialize form handlers
['contact', 'cv'].forEach(type => {
    document.getElementById(`${type}Form`).addEventListener('submit', e => {
        e.preventDefault();
        handleFormSubmit(e.target, type);
    });
});

async function handleFormSubmit(form, type) {
    const config = formConfig[type];
    const msgDiv = document.getElementById(config.messageId) || createMessageDiv(form);
    const submitBtn = type === 'contact' 
        ? document.getElementById(config.buttonId)
        : form.querySelector(config.buttonSelector);

    try {
        // Show loading state
        updateUI(msgDiv, submitBtn, config.loadingText, '#3498db', true);

        // Send form data
        const formData = new FormData(form);
        formData.append('form-type', type);
        
        await sendFormData(formData);

        // Handle success
        updateUI(msgDiv, submitBtn, config.successText, '#2ecc71', false);
        resetForm(form);

        // Post-success actions
        if (type === 'cv') {
            setTimeout(() => window.location.href = `https://cv.lifaet.workers.dev/?cv=${grm()}`, 2600);
        } else {
            setTimeout(() => msgDiv.style.display = 'none', 2600);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        updateUI(msgDiv, submitBtn, 'Network Error! Try Again.', '#e74c3c', false);
        setTimeout(() => msgDiv.style.display = 'none', 5000);
    }
}

function updateUI(msgDiv, submitBtn, text, color, isLoading) {
    msgDiv.textContent = text;
    msgDiv.style.display = 'block';
    msgDiv.style.backgroundColor = color;
    msgDiv.style.color = 'white';
    submitBtn.disabled = isLoading;
}

function createMessageDiv(form) {
    const div = document.createElement('div');
    div.id = 'show_cv_msg';
    div.style.cssText = `
        display: none;
        text-align: center;
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 8px;
        font-size: 0.9em;
        transition: all 0.3s ease;
    `;
    form.parentNode.insertBefore(div, form);
    return div;
}

async function sendFormData(formData) {
    const formDataString = Array.from(formData.entries())
        .map(pair => `${pair[0]}=${encodeURIComponent(pair[1])}`)
        .join('&');

    const response = await fetch(`${gScript}${sId}/exec`, {
        method: 'POST',
        body: formDataString,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow'
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return response.text();
}

function resetForm(form) {
    form.reset();
    form.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.value = '';
        input.parentElement.classList.remove('active');
    });
}

function grm() {
    const c2v = sId.substring(7, 11);
    const c5w = sId.substring(20, 23);
    const cc = c2v + "4299" + c5w;
    return Array.from({ length: 20 }, () => cc.charAt(Math.floor(Math.random() * cc.length))).join('');
}