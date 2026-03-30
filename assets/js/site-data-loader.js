const SITE_DATA_URL = './assets/data/site-data-new.json';

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
