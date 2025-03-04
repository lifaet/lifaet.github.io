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
const projectsData =[
    {
        "name": "Keylogger Surveillance System",
        "details": "This type of surveillance technology monitors and records each keystroke and DNS query a system makes on a specific computer. It can upload real-time data to an FTP server and provides a secure local and online web console as an interface for viewing and analyzing log files. ",
        "image": "./assets/images/portfolio/1.jpg",
        "link": "https://github.com/lifaet/Keylogger-Surveillance-System",
        "catagory": ["software"],
        "tags": ["Python", "JavaScript", "HTML", "Ubuntu Server"]
    },
    {
        "name": "Object Following Robot",
        "details": "It is a simple object-following robot. It can detect an object in front of it and can follow the object.",
        "image": "./assets/images/portfolio/2.jpg",
        "link": "https://github.com/lifaet/WALL-E-Junior",
        "catagory": ["software", "hardware"],
        "tags": ["C", "Arduino"]
    },
    {
        "name": "MoviesBay",
        "details": "This project was a movie download website. Developed based on HTML, BOOTSTRAP, CSS, JAVASCRIPT, and database integration.",
        "image": "./assets/images/portfolio/3.jpg",
        "link": "https://moviesbay.pages.dev",
        "catagory": ["web"],
        "tags": ["HTML", "css", "JavaScript", "Bootstrap", "AppScript"]
    },
    {
        "name": "Optical Communication  ",
        "details": "This demonstrates an advanced technology that transfers data using optical signals.",
        "image": "./assets/images/portfolio/4.jpg",
        "link": "https://github.com/lifaet/Optical-Communication",
        "catagory": ["software", "hardware"],
        "tags": ["C", "Arduino"]
    },
    {
        "name": "RC Surveillance Car ",
        "details": "he aim of this project is to design and build a remote-controlled surveillance camera car using an ESP32 module, car kit, and Motor driver module.",
        "image": "./assets/images/portfolio/5.jpg",
        "link": "https://github.com/lifaet/RC-Surveillance-Car",
        "catagory": ["software", "hardware"],
        "tags": ["C", "Arduino"]
    },
    {
        "name": "Rotten Food Detection System",
        "details": "An innovative system based on Arduino and gas sensors, designed to detect and alert users about food spoilage, ensuring food safety and reducing waste. ",
        "image": "./assets/images/portfolio/6.jpg",
        "link": "https://github.com/lifaet/Rotten-Food-Detection-System",
        "catagory": ["software", "hardware"],
        "tags": ["C", "Arduino"]
    },
    {
        "name": "Automated Toll Collection System",
        "details": "An automated, cashless system using RFID technology to identify vehicles and deduct toll charges.",
        "image": "./assets/images/portfolio/7.jpg",
        "link": "https://github.com/lifaet/Auto-Toll-Collection-System",
        "catagory": ["software", "hardware"],
        "tags": ["Python", "C", "arduino"]
    },
    {
        "name": "Harinakundu Mobile House",
        "details": "Website for a mobile and accessories shop.",
        "image": "./assets/images/portfolio/8.jpg",
        "link": "https://hmhc.pages.dev",
        "catagory": ["web"],
        "tags": ["HTML", "CSS", "Bootstrap", "JavaScript", "AppScript"]
    },
    {
        "name": "Solar Tracker",
        "details": "It’s a smart system that uses LDRs and Arduino for sun tracking. It adjusts the orientation of solar panels to maximize energy absorption, thereby boosting solar power efficiency. ",
        "image": "./assets/images/portfolio/9.jpg",
        "link": "https://github.com/lifaet/Solar-Tracker",
        "catagory": ["software", "hardware"],
        "tags": ["C", "Arduino"]
    },
    {
        "name": "Flowers Shop",
        "details": "A website For a local flowers shop",
        "image": "./assets/images/portfolio/10.jpg",
        "link": "https://lifaet.github.io/wd4-flowers-shop",
        "catagory":["web"],
        "tags": ["HTML", "CSS", "Bootstrap", "JavaScript"]
    },
    {
        "name": "Grufolio",
        "details": "Basic portfolio website for individual.",
        "image": "./assets/images/portfolio/11.jpg",
        "link": "https://lifaet.github.io/wd2-grufolio",
        "catagory": ["web"],
        "tags": ["HTML", "CSS", "Bootstrap", "JavaScript"]
    },
    {
        "name": "Brothers Association",
        "details": "A website For local Organization Based on bootstrap.",
        "image": "./assets/images/portfolio/12.jpg",
        "link": "https://lifaet.github.io/wd1-brothers-association",
        "catagory": ["web"],
        "tags": ["HTML", "CSS", "Bootstrap", "JavaScript"]
    },
    {
        "name": "PIR Security Alarm",
        "details": "Security Alarm for restricted area.",
        "image": "./assets/images/portfolio/13.jpg",
        "link": "https://github.com/lifaet/PIR-Security-Alarm",
        "catagory": ["software", "hardware"],
        "tags": ["C", "Arduino"]
    },
    {
        "name": "Object Detection",
        "details": "Object detection and identification for live camera feed or videos.",
        "image": "./assets/images/portfolio/14.jpg",
        "link": "https://github.com/lifaet/Object-Detection",
        "catagory": ["software"],
        "tags": ["C", "Arduino"]
    },
    {
        "name": "Work-Rest-Timer",
        "details": "A Balanced Approach to Digital Wellness",
        "image": "./assets/images/portfolio/15.jpg",
        "link": "https://github.com/lifaet/Work-Rest-Timer",
        "catagory": ["software"],
        "tags": ["Python"]
    },
    {
        "name": "Local-FileIndex-Server",
        "details": "Basic application to index and share selected directories of a Windows computer to the local network.",
        "image": "./assets/images/portfolio/16.jpg",
        "link": "https://github.com/lifaet/Local-FileIndex-Server",
        "catagory": ["software"],
        "tags": ["Python", "HTML", "CSS", "JavaScript"]
    }
];

function createProjectCard(project) {
    return `
        <div class="project-card" data-categories="${project.catagory.join(',')}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.name}">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.catagory.includes('web') ? // Changed from 'website' to 'web'
                            `<a href="${project.link}" target="_blank" title="Live Site">
                                <i class="fas fa-external-link-alt"></i>
                            </a>` :
                            `<a href="${project.link}" target="_blank" title="Source Code">
                                <i class="fab fa-github"></i>
                            </a>`
                        }
                    </div>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.name}</h3>
                <p>${project.details}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    const projectsHTML = projectsData.map(project => createProjectCard(project)).join('');
    projectsGrid.innerHTML = projectsHTML;

    // Initialize project filters if they exist
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });
    });

    // Set initial active state for 'all' filter
    const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterBtn) {
        allFilterBtn.classList.add('active');
    }
}

function filterProjects(filter) {
    // Update filter button active states
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter projects
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        const categories = project.getAttribute('data-categories').split(',');
        if (filter === 'all' || categories.includes(filter)) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

// Load projects when DOM is ready
document.addEventListener('DOMContentLoaded', loadProjects);



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