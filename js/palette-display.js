(function() {
    const getPaletteNames = (lang) => {
        const palettes = {
            fr: [
                "Prisme de Bismuth",
                "Opale Angélique",
                "Quartz Cybernétique",
                "Réfraction Fluorite",
                "Héliodore Spectral",
                "Titanium Irisé",
                "Euphorie Minérale"
            ],
            en: [
                "Bismuth Prism",
                "Angelic Opal",
                "Cybernetic Quartz",
                "Fluorite Refraction",
                "Heliodore Spectral",
                "Iridescent Titanium",
                "Mineral Euphoria"
            ],
            es: [
                "Prisma de Bismuto",
                "Ópalo Angélico",
                "Cuarzo Cibernético",
                "Refracción de Fluorita",
                "Heliodoro Espectral",
                "Titanio Iridiscente",
                "Euforia Mineral"
            ],
            it: [
                "Prisma di Bismuto",
                "Opale Angelico",
                "Quarzo Cibernetico",
                "Rifrazione Fluorite",
                "Eliodoro Spettrale",
                "Titanio Iridescente",
                "Euforia Minerale"
            ]
        };
        return palettes[lang] || palettes.fr;
    };

    const getLanguage = () => {
        const path = window.location.pathname;
        if (path.includes('/fr/')) return 'fr';
        if (path.includes('/en/')) return 'en';
        if (path.includes('/es/')) return 'es';
        if (path.includes('/it/')) return 'it';
        return 'fr';
    };

    const displayPalette = () => {
        const paletteNum = sessionStorage.getItem('coulouban-theme') || '0';
        const lang = getLanguage();
        const names = getPaletteNames(lang);
        const name = names[parseInt(paletteNum)];

        // Trouver le lien "Coulouban"
        const couloubanLink = Array.from(document.querySelectorAll('a')).find(
            a => a.textContent.trim() === 'Coulouban'
        );

        if (couloubanLink) {
            // Créer un wrapper avec position relative pour positionner la palette en absolu
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                position: relative;
            `;
            
            // Cloner le lien dans le wrapper
            const clonedLink = couloubanLink.cloneNode(true);
            wrapper.appendChild(clonedLink);
            
            // Ajouter le span de palette en ABSOLUTE au-dessus
            const paletteDisplay = document.createElement('span');
            paletteDisplay.className = 'palette-display';
            paletteDisplay.style.cssText = `
                position: absolute;
                bottom: 100%;
                left: 0;
                font-size: 0.45rem;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                font-weight: 400;
                color: var(--color-gold);
                opacity: 0.7;
                line-height: 1.2;
                white-space: nowrap;
            `;
            paletteDisplay.textContent = `#${paletteNum} - ${name}`;
            wrapper.appendChild(paletteDisplay);
            
            // Remplacer le lien par le wrapper
            couloubanLink.parentNode.replaceChild(wrapper, couloubanLink);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', displayPalette);
    } else {
        displayPalette();
    }
})();
