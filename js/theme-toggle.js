// Theme Toggle Button Component (Light/Dark Mode)
(function() {
    const getThemeInfo = () => {
        const path = window.location.pathname;
        
        // Extract language and theme from path
        let language, currentTheme, isItalian = false;
        
        if (path.includes('/fr/')) {
            language = 'fr';
            currentTheme = path.includes('/obscur/') ? 'obscur' : 'clair';
        } else if (path.includes('/en/')) {
            language = 'en';
            currentTheme = path.includes('/dark/') ? 'dark' : 'light';
        } else if (path.includes('/es/')) {
            language = 'es';
            currentTheme = path.includes('/oscuro/') ? 'oscuro' : 'claro';
        } else if (path.includes('/it/')) {
            language = 'it';
            currentTheme = path.includes('/oscuro/') ? 'oscuro' : 'chiaro';
            isItalian = true;
        }

        return { language, currentTheme, isItalian };
    };

    const buildThemeLink = () => {
        const path = window.location.pathname;
        const { language, currentTheme, isItalian } = getThemeInfo();
        
        let targetTheme;
        if (language === 'fr') {
            targetTheme = currentTheme === 'obscur' ? 'clair' : 'obscur';
        } else if (language === 'en') {
            targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
        } else if (language === 'es') {
            targetTheme = currentTheme === 'oscuro' ? 'claro' : 'oscuro';
        } else if (language === 'it') {
            targetTheme = currentTheme === 'oscuro' ? 'chiaro' : 'oscuro';
        }

        if (!language || !currentTheme || !targetTheme) return null;

        // Extract page name and query string
        const pathParts = path.split('/');
        const pageName = pathParts[pathParts.length - 1];

        // Build new path
        let newPath;
        if (language === 'it' && isItalian && currentTheme === 'oscuro') {
            // From IT oscuro to IT chiaro
            newPath = path.replace(/\/it\/oscuro\//, '/it/chiaro/');
        } else if (language === 'it' && !isItalian && currentTheme === 'chiaro') {
            // From IT chiaro to IT oscuro
            newPath = path.replace(/\/it\/chiaro\//, '/it/oscuro/');
        } else {
            // Standard replacement
            newPath = path.replace(`/${language}/${currentTheme}/`, `/${language}/${targetTheme}/`);
        }

        return newPath + window.location.search;
    };

    const getLabels = (currentTheme) => {
        const { language } = getThemeInfo();
        
        const translations = {
            fr: {
                light: 'Mode Clair',
                dark: 'Mode Sombre'
            },
            en: {
                light: 'Light Mode',
                dark: 'Dark Mode'
            },
            es: {
                light: 'Modo Claro',
                dark: 'Modo Oscuro'
            },
            it: {
                light: 'Modalità Chiara',
                dark: 'Modalità Scura'
            }
        };

        const t = translations[language] || translations.fr;
        
        if (currentTheme === 'obscur' || currentTheme === 'dark' || currentTheme === 'oscuro' || currentTheme === 'scuro') {
            return { label: t.light, alt: '☀️' };
        } else {
            return { label: t.dark, alt: '🌙' };
        }
    };

    window.createThemeToggle = () => {
        const { currentTheme } = getThemeInfo();
        const targetLink = buildThemeLink();

        if (!targetLink || !currentTheme) return null;

        const labels = getLabels(currentTheme);

        // Ensure brand styles exist
        const ensureThemeToggleStyles = () => {
            if (document.getElementById("coulouban-theme-toggle-style")) return;
            const style = document.createElement("style");
            style.id = "coulouban-theme-toggle-style";
            style.textContent = `
                .theme-toggle-container {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    cursor: pointer;
                    user-select: none;
                }
                
                .theme-toggle-wrapper {
                    width: 52px;
                    height: 26px;
                    background-color: rgba(0,0,0,0.6);
                    border-radius: 26px;
                    border: 1px solid rgba(255,255,255,0.25);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .theme-toggle-icon {
                    font-size: 14px;
                    transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
                }

                .theme-toggle-label {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    background: linear-gradient(135deg, var(--color-histoire), var(--color-contact), var(--color-experience), var(--color-galerie), var(--color-poesie));
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent !important;
                    background-size: 300% 300%;
                    animation: couloubanGradientCycle 6s linear infinite;
                    padding: 4px 8px;
                    border-radius: 20px;
                    background-color: rgba(0,0,0,0.4);
                    backdrop-filter: blur(4px);
                    font-family: 'Montserrat', sans-serif;
                }

                .theme-toggle-container:hover .theme-toggle-wrapper {
                    border-color: rgba(255,255,255,0.4);
                    box-shadow: 0 0 8px rgba(255,255,255,0.1);
                }
            `;
            document.head.appendChild(style);
        };

        ensureThemeToggleStyles();

        // Container
        const container = document.createElement('a');
        container.href = targetLink;
        container.className = 'theme-toggle-container';
        container.style.textDecoration = 'none';
        container.style.display = 'flex';
        container.style.gap = '12px';
        container.style.alignItems = 'center';
        container.style.cursor = 'pointer';
        container.style.userSelect = 'none';

        // Toggle switch
        const toggle = document.createElement('div');
        toggle.className = 'theme-toggle-wrapper';
        toggle.style.width = '52px';
        toggle.style.height = '26px';
        toggle.style.backgroundColor = 'rgba(0,0,0,0.6)';
        toggle.style.borderRadius = '26px';
        toggle.style.border = '1px solid rgba(255,255,255,0.25)';
        toggle.style.position = 'relative';
        toggle.style.display = 'flex';
        toggle.style.alignItems = 'center';
        toggle.style.justifyContent = 'center';
        toggle.style.transition = 'all 0.2s ease';

        // Icon
        const icon = document.createElement('span');
        icon.className = 'theme-toggle-icon';
        icon.style.fontSize = '14px';
        icon.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        icon.textContent = labels.alt;

        toggle.appendChild(icon);

        // Label
        const label = document.createElement('span');
        label.className = 'coulouban-rainbow-mix';
        label.style.fontSize = '10px';
        label.style.letterSpacing = '0.1em';
        label.style.textTransform = 'uppercase';
        label.style.padding = '4px 8px';
        label.style.borderRadius = '20px';
        label.style.backgroundColor = 'rgba(0,0,0,0.4)';
        label.style.backdropFilter = 'blur(4px)';
        label.style.fontFamily = "'Montserrat', sans-serif";
        label.textContent = labels.label;

        // Add hover effect
        container.addEventListener('mouseenter', () => {
            toggle.style.borderColor = 'rgba(255,255,255,0.4)';
            toggle.style.boxShadow = '0 0 8px rgba(255,255,255,0.1)';
            icon.style.transform = 'scale(1.2)';
        });

        container.addEventListener('mouseleave', () => {
            toggle.style.borderColor = 'rgba(255,255,255,0.25)';
            toggle.style.boxShadow = 'none';
            icon.style.transform = 'scale(1)';
        });

        container.appendChild(toggle);
        container.appendChild(label);

        return container;
    };

    const injectThemeToggle = () => {
        const themeToggle = window.createThemeToggle();
        if (!themeToggle) return;
    
        // Chercher le conteneur dédié #nav-actions par ID
        let navActions = document.getElementById("nav-actions");
    
        // Si le conteneur n'existe pas, le créer à l'intérieur de la navbar (fallback)
        if (!navActions) {
            const nav = document.querySelector('nav');
            if (nav) {
                // On cherche le dernier div de la barre (souvent celui qui contient les liens)
                const lastNavDiv = nav.querySelector('div:last-child');
                if (lastNavDiv) {
                    navActions = document.createElement('div');
                    navActions.id = "nav-actions";
                    navActions.className = 'flex items-center gap-3';
                    // Insérer après le dernier div (ou à la fin de la navbar)
                    lastNavDiv.parentNode.insertBefore(navActions, lastNavDiv.nextSibling);
                }
            }
        }
    
        // Injecter le bouton dans le conteneur
        if (navActions) {
            navActions.appendChild(themeToggle);
        } else {
            // Fallback : comportement original (au cas où)
            const nav = document.querySelector('nav');
            if (nav) {
                const lastNavElement = nav.querySelector('div:last-child');
                if (lastNavElement) lastNavElement.appendChild(themeToggle);
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectThemeToggle);
    } else {
        injectThemeToggle();
    }
})();
