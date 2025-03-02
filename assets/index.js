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