document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Page 2 Display Logic
    if (window.location.pathname.includes('page2.html')) {
        const params = new URLSearchParams(window.location.search);
        const displayContainer = document.getElementById('registration-data');
        
        if (displayContainer && params.has('fullName')) {
            const data = {
                'Full Name': params.get('fullName'),
                'Email ID': params.get('email'),
                'Major': params.get('major'),
                'Student ID': params.get('studentId'),
                'Why the Interest?': params.get('interest'),
                'Registration ID': 'REG-' + Math.floor(100000 + Math.random() * 900000)
            };

            for (const [key, value] of Object.entries(data)) {
                const row = document.createElement('div');
                row.className = 'data-row';
                row.innerHTML = `<strong>${key}:</strong> <span>${value}</span>`;
                displayContainer.appendChild(row);
            }
        }
    }
});