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

// CONTACT FORM//
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        console.log({ name, email, message });
        contactForm.reset();
        alert('Message sent successfully!');
    });
});

// CONTACT & CV FORM HANDELLAR//

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
            // Hide message after 2.5 seconds and redirect after 3 seconds
            setTimeout(() => {
                window.location.href = `https://lifaet.pages.dev/cv?token=${grm()}`;
            }, 3000);
            setTimeout(() => {
                msgDiv.style.display = 'none';
            }, 2500);
        } else {
            // Hide message after 2.5 seconds for contact form
            setTimeout(() => {
                msgDiv.style.display = 'none';
            }, 2500);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        updateUI(msgDiv, submitBtn, 'Network Error! Try Again.', '#e74c3c', false);
        // Hide error message after 3 seconds
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 3000);
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
        padding: 5px;
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



// MODERN DESIGN//
// MODERN DESIGN//
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    // Observe all animated elements
    document.querySelectorAll('.skill-item, .project-card, .education-card, .cert-card').forEach((el) => {
        observer.observe(el);
    });

    // Particle background effect
    const particlesConfig = {
        particles: {
            number: { value: 80 },
            color: { value: '#ffffff' },
            opacity: { value: 0.1 },
            size: { value: 1 },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1
            }
        }
    };

    particlesJS('particles-js', particlesConfig);
});



// SITE DATA LOADER//
const SITE_DATA_URL = 'https://lifaet.pages.dev/api';

function buildSocialLinks(socialLinks) {
  return (socialLinks || [])
    .map(link => `
      <a href="${link.url}" target="_blank" rel="noreferrer noopener" class="social-btn" title="${link.name}">
        <i class="${link.icon}"></i>
      </a>
    `)
    .join('');
}

function renderMenu(menuItems) {
  const desktopButtons = document.querySelectorAll('.sidebar .menu-btn');
  const mobileButtons = document.querySelectorAll('.mobile-bottom-nav .nav-btn');

  (menuItems || []).forEach((item, index) => {
    const desktopButton = desktopButtons[index];
    const mobileButton = mobileButtons[index];

    if (desktopButton) {
      const icon = desktopButton.querySelector('i');
      const label = desktopButton.querySelector('span');
      if (icon) icon.className = item.icon;
      if (label) label.textContent = item.desktopLabel;
    }

    if (mobileButton) {
      const icon = mobileButton.querySelector('i');
      const label = mobileButton.querySelector('span');
      if (icon) icon.className = item.icon;
      if (label) label.textContent = item.mobileLabel;
    }
  });
}

function renderProfile(data) {
  const desktopImg = document.querySelector('.sidebar .profile-image img');
  const mobileImg = document.querySelector('.mobile-profile img');
  const desktopName = document.querySelector('.sidebar .profile-name');
  const mobileName = document.querySelector('.mobile-profile span');

  if (desktopImg) {
    desktopImg.src = data.avatar;
    desktopImg.alt = data.name;
  }
  if (mobileImg) {
    mobileImg.src = data.avatar;
    mobileImg.alt = data.name;
  }
  if (desktopName) desktopName.textContent = data.name;
  if (mobileName) mobileName.textContent = data.name;
}

function renderMetadata(data) {
  if (!data) return;
  if (data.title) document.title = data.title;

  const updateMeta = (name, value) => {
    const meta = document.querySelector(`meta[name="${name}"]`);
    if (meta) meta.content = value;
  };

  if (data.description) updateMeta('description', data.description);
  if (data.keywords) updateMeta('keywords', data.keywords);
  if (data.author) updateMeta('author', data.author);
}

function renderHome(data, socialLinks) {
  const introText = document.querySelector('#home .intro-text');
  const socialContainer = document.querySelector('#home .social-links');

  if (introText) {
    introText.innerHTML = `
      <h1>${data.headline} <span class="highlight">${data.highlight}</span></h1>
      <h2 class="typed-text">${data.subtitle}</h2>
      <p class="career-objective">${data.careerObjective}</p>
    `;
  }

  if (socialContainer) {
    socialContainer.innerHTML = buildSocialLinks(socialLinks);
  }
}

function renderExperience(experiences) {
  const timelineGrid = document.querySelector('.timeline-grid');
  if (!timelineGrid) return;

  timelineGrid.innerHTML = (experiences || [])
    .map(exp => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-date">${exp.date}</div>
        <div class="timeline-content">
          <h3>${exp.title}</h3>
          <div class="company-badge"><i class="fas fa-building"></i><span>${exp.company}</span></div>
          <ul class="achievement-list">
            ${(exp.achievements || []).map(item => `<li><i class="fas fa-check-circle"></i>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `)
    .join('');
}

function getEducationIcon(title) {
  if (/BSc|Engineering/i.test(title)) return 'fas fa-graduation-cap';
  if (/Higher Secondary/i.test(title)) return 'fas fa-school';
  if (/Secondary/i.test(title)) return 'fas fa-book';
  return 'fas fa-graduation-cap';
}

function renderEducation(education, certifications) {
  const educationGrid = document.querySelector('.education-grid');
  const certGrid = document.querySelector('.cert-grid');

  if (educationGrid) {
    educationGrid.innerHTML = (education || [])
      .map(item => `
        <div class="education-card">
          <div class="education-header">
            <div class="education-icon"><i class="${getEducationIcon(item.title)}"></i></div>
            <div class="education-title">
              <h3>${item.title}</h3>
              <div class="institute">${item.institute}</div>
              <div class="duration">${item.duration}</div>
            </div>
          </div>
          <div class="education-details">
            <ul class="achievements">
              ${(item.achievements || []).map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
          </div>
        </div>
      `)
      .join('');
  }

  if (certGrid) {
    certGrid.innerHTML = (certifications || [])
      .map(cert => `
        <div class="cert-card">
          <div class="cert-issuer">
            <i class="fas fa-certificate"></i>
            <span>${cert.issuer}</span>
          </div>
          <h3 class="cert-title">${cert.title}</h3>
          ${cert.credentials ? `<div class="cert-credentials"><i class="fas fa-id-badge"></i><span>${cert.credentials}</span></div>` : ''}
          ${cert.link ? `<a href="${cert.link}" class="cert-link" target="_blank" rel="noreferrer noopener">View Certificate <i class="fas fa-external-link-alt"></i></a>` : ''}
        </div>
      `)
      .join('');
  }
}

function renderSkills(skills, languages) {
  const skillsGrid = document.querySelector('.skills-grid');
  if (!skillsGrid) return;

  skillsGrid.innerHTML = (skills || [])
    .map(category => `
      <div class="skill-category">
        <div class="category-header">
          <div class="category-icon"><i class="${category.icon}"></i></div>
          <h3 class="category-title">${category.category}</h3>
        </div>
        <div class="skill-list">
          ${(category.items || []).map(item => `
              <div class="skill-item">
                <div class="skill-info">
                  <span class="skill-name">${item.name}</span>
                  <span class="skill-level">${item.level}</span>
                </div>
                <div class="progress-bar"><div class="progress" style="width:${item.level}"></div></div>
              </div>
            `).join('')}
        </div>
      </div>
    `)
    .join('');

  if (languages && languages.length) {
    skillsGrid.insertAdjacentHTML('beforeend', `
      <div class="skill-category language-proficiency">
        <div class="category-header">
          <div class="category-icon"><i class="fas fa-language"></i></div>
          <h3 class="category-title">Language Proficiency</h3>
        </div>
        <div class="language-list">
          ${languages
            .map(lang => `
              <div class="language-item">
                <span class="language-name">${lang.name}</span>
                <div class="star-rating">
                  ${createRatingStars(lang.rating)}
                </div>
              </div>
            `)
            .join('')}
        </div>
      </div>
    `);
  }
}

function createRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return (
    '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars)
  )
    .replace(/★/g, '<i class="fas fa-star"></i>')
    .replace(/½/, '<i class="fas fa-star-half-alt"></i>')
    .replace(/☆/g, '<i class="fa-regular fa-star"></i>');
}

function humanizeCategory(category) {
  return String(category)
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .map(word => word ? word[0].toUpperCase() + word.slice(1) : '')
    .join(' ');
}

function getProjectCategories(projects) {
  return Array.from(
    new Set(
      (projects || []).flatMap(project => {
        const cats = Array.isArray(project.category) ? project.category : [project.category];
        return cats.filter(Boolean);
      })
    )
  );
}

function renderProjects(projects) {
  const projectFilters = document.querySelector('.project-filters');
  const projectGrid = document.querySelector('.projects-grid');
  if (!projectFilters || !projectGrid) return;

  const categories = getProjectCategories(projects);
  const filters = [
    { id: 'all', label: 'All' },
    ...categories.map(id => ({ id, label: humanizeCategory(id) }))
  ];

  projectFilters.innerHTML = filters
    .map(filter => `
      <button type="button" class="filter-btn${filter.id === 'all' ? ' active' : ''}" data-filter="${filter.id}">${filter.label}</button>
    `)
    .join('');

  projectGrid.innerHTML = (projects || [])
    .map(project => `
      <div class="project-card" data-categories="${(Array.isArray(project.category) ? project.category : [project.category]).join(',')}">
        <div class="project-image">
          <img src="${project.image}" alt="${project.name}">
          <div class="project-overlay">
            <div class="project-links">
              <a href="${project.link}" target="_blank" rel="noreferrer noopener" title="${project.name}">
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="project-info">
          <h3>${project.name}</h3>
          <p>${project.details}</p>
          <div class="project-tags">
            ${(project.tags || []).map(tag => `<span>${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `)
    .join('');

  projectFilters.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      projectFilters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn === button));
      filterProjects(filter);
    });
  });
}

function filterProjects(filter) {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const categories = card.dataset.categories.split(',');
    card.style.display = filter === 'all' || categories.includes(filter) ? 'block' : 'none';
  });
}

function renderContact(email, location, mapUrl, socialLinks) {
  const contactInfo = document.querySelector('.contact-info');
  const contactSocial = document.querySelector('#contact .social-links');
  const contactMap = document.querySelector('#contact iframe');

  if (contactInfo) {
    contactInfo.innerHTML = `
      <div class="info-card">
        <div class="info-icon"><i class="fas fa-envelope"></i></div>
        <div class="info-content"><h3>Email</h3><p>${email}</p></div>
      </div>
      <div class="info-card">
        <div class="info-icon"><i class="fas fa-map-marker-alt"></i></div>
        <div class="info-content"><h3>Location</h3><p>${location}</p></div>
      </div>
    `;
  }

  if (contactMap) contactMap.src = mapUrl;
  if (contactSocial) contactSocial.innerHTML = buildSocialLinks(socialLinks);
}

function renderCopyright(text) {
  const copyrightEl = document.querySelector('.sidebar .copyright p:first-child');
  if (copyrightEl) copyrightEl.textContent = text;
}

function loadJSONData() {
  return fetch(SITE_DATA_URL)
    .then(response => {
      if (!response.ok) throw new Error('Cannot load site data');
      return response.json();
    });
}

window.addEventListener('DOMContentLoaded', () => {
  loadJSONData()
    .then(data => {
      renderMetadata(data);
      renderMenu(data.menu);
      renderProfile(data);
      renderHome(data, data.socialLinks);
      renderExperience(data.experience);
      renderEducation(data.education, data.certifications);
      renderSkills(data.skills, data.languages);
      renderProjects(data.projects);
      renderContact(data.email, data.location, data.mapUrl, data.socialLinks);
      renderCopyright(data.copyright);
    })
    .catch(err => {
      console.error('Site data loader error:', err);
    });
});
