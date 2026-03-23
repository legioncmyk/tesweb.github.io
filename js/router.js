// Simple SPA-like navigation
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('[data-link]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
});
