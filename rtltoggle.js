
// Theme and RTL Toggle Logic

document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const body = document.body;
    const html = document.documentElement;

    // --- Theme Toggle ---
    const savedTheme = localStorage.getItem('theme');

    // Apply saved theme
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeIcon('light');
    } else {
        updateThemeIcon('dark');
    }

    // Function to toggle theme provided globally
    window.toggleTheme = function () {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateThemeIcon(isLight ? 'light' : 'dark');
    };

    function updateThemeIcon(mode) {
        // Update both desktop and mobile icons
        const icons = ['theme-icon', 'theme-toggle-icon'];

        icons.forEach(id => {
            const icon = document.getElementById(id);
            if (icon) {
                if (mode === 'light') {
                    icon.setAttribute('data-lucide', 'moon');
                } else {
                    icon.setAttribute('data-lucide', 'sun');
                }
            }
        });

        if (window.lucide) lucide.createIcons();
        window.dispatchEvent(new Event('themeChanged'));
    }

    // --- RTL Toggle ---
    const savedDir = localStorage.getItem('direction');

    // Apply saved direction
    if (savedDir === 'rtl') {
        html.setAttribute('dir', 'rtl');
        body.classList.add('rtl');
    }

    // Function to toggle RTL provided globally
    window.toggleRTL = function () {
        const currentDir = html.getAttribute('dir');
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

        html.setAttribute('dir', newDir);
        if (newDir === 'rtl') {
            body.classList.add('rtl');
        } else {
            body.classList.remove('rtl');
        }

        localStorage.setItem('direction', newDir);
    };
});
