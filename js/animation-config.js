(function () {
    const presets = {
        cinematic: {
            colorDynamics: {
                cycleSpeed: 0.28,
                gradientIntensity: 0.85
            },
            mouseInteraction: {
                influenceRadius: 0.16,
                attractionForce: 0.7,
                repulsionForce: 0.85,
                damping: 0.008,
                sensitivity: 0.00055
            }
        },
        responsive: {
            colorDynamics: {
                cycleSpeed: 1.15,
                gradientIntensity: 1.35
            },
            mouseInteraction: {
                influenceRadius: 0.95,
                attractionForce: 2.6,
                repulsionForce: 0.7,
                damping: 0.07,
                sensitivity: 0.0018
            }
        }
    };

    // === DÉTECTION DE LA LANGUE (identique à votre newsletter) ===
    const getLanguage = () => {
        const path = window.location.pathname;
        if (path.includes('/fr/')) return 'fr';
        if (path.includes('/en/')) return 'en';
        if (path.includes('/es/')) return 'es';
        if (path.includes('/it/')) return 'it';
        return 'fr';
    };

    // === TRADUCTIONS DU TOGGLE ===
    const toggleLabels = {
        fr: {
            cinematic: 'Mode Cinématique',
            responsive: 'Mode Responsive'
        },
        en: {
            cinematic: 'Cinematic Mode',
            responsive: 'Responsive Mode'
        },
        es: {
            cinematic: 'Modo Cinematográfico',
            responsive: 'Modo Responsivo'
        },
        it: {
            cinematic: 'Modalità Cinematografica',
            responsive: 'Modalità Responsiva'
        }
    };

    // Retourne le texte traduit selon le mode actif
    const getToggleText = (mode) => {
        const lang = getLanguage();
        return toggleLabels[lang]?.[mode] || toggleLabels.fr[mode];
    };

    // --- Icône pour chaque mode (comme le theme-toggle) ---
    const getToggleIcon = (mode) => {
        return mode === 'cinematic' ? '🎬' : '📱';
    };

    const clonePreset = (preset) => ({
        colorDynamics: { ...preset.colorDynamics },
        mouseInteraction: { ...preset.mouseInteraction }
    });

    const config = clonePreset(presets.cinematic);
    config.mode = "cinematic";

    const applyMode = (mode) => {
        const preset = presets[mode];
        if (!preset) return;
        Object.assign(config.colorDynamics, preset.colorDynamics);
        Object.assign(config.mouseInteraction, preset.mouseInteraction);
        config.mode = mode;
        window.dispatchEvent(new CustomEvent("animation-mode-change", { detail: { mode } }));
    };

    const nextMode = () => (config.mode === "cinematic" ? "responsive" : "cinematic");

    // Met à jour l'interface (curseur + label traduit)
    const updateToggleUI = (toggleContainer, isCinematic) => {
        const slider = toggleContainer.querySelector('.mode-toggle-slider');
        const label = toggleContainer.querySelector('.mode-toggle-label');
        if (slider) {
            slider.style.transform = isCinematic ? 'translateX(0)' : 'translateX(26px)';
        }
        if (label) {
            label.textContent = getToggleText(isCinematic ? 'cinematic' : 'responsive');
        }
    };

    // Style arc-en-ciel pour le logo, le texte du toggle et les variantes
    const ensureBrandStyles = () => {
        if (document.getElementById("coulouban-rainbow-style")) return;
        const style = document.createElement("style");
        style.id = "coulouban-rainbow-style";
        style.textContent = `

    /* Classe de base arc-en-ciel */
.coulouban-rainbow {
    font-weight: 700 !important;
    background: linear-gradient(135deg, #ff0055 0%, #00e5ff 10%, #39ff14 20%, #d600ff 30%, #ffd700 40%, #ff0055 50%, #00e5ff 60%, #39ff14 70%, #d600ff 80%, #ffd700 90%, #ff0055 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 6s linear infinite;
}
.toggle-label-rainbow {
    background: linear-gradient(135deg, var(--color-histoire), var(--color-contact), var(--color-experience), var(--color-galerie), var(--color-poesie));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 6s linear infinite;
    font-weight: 600;
    text-shadow: none;
}
@keyframes couloubanGradientCycle {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
}

    /* Variante rapide */
.coulouban-rainbow-fast {
    font-weight: 700 !important;
    background: linear-gradient(135deg, #ff0055 0%, #00e5ff 10%, #39ff14 20%, #d600ff 30%, #ffd700 40%, #ff0055 50%, #00e5ff 60%, #39ff14 70%, #d600ff 80%, #ffd700 90%, #ff0055 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 2s linear infinite;
}

    /* Variante lente */
.coulouban-rainbow-slow {
    font-weight: 700 !important;
    background: linear-gradient(135deg, #ff0055 0%, #00e5ff 10%, #39ff14 20%, #d600ff 30%, #ffd700 40%, #ff0055 50%, #00e5ff 60%, #39ff14 70%, #d600ff 80%, #ffd700 90%, #ff0055 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 12s linear infinite;
}

    /* Variante pastel */
.coulouban-rainbow-pastel {
    font-weight: 300 !important;
    background: linear-gradient(135deg, #ffb3ba 0%, #b5e3ff 10%, #baffc9 20%, #e0bbff 30%, #ffdfb3 40%, #ffb3ba 50%, #b5e3ff 60%, #baffc9 70%, #e0bbff 80%, #ffdfb3 90%, #ffb3ba 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 6s linear infinite;
}

    /* Variante néon */
.coulouban-rainbow-neon {
    font-weight: 700 !important;
    background: linear-gradient(135deg, #ff00cc 0%, #00ffff 10%, #39ff14 20%, #ff00aa 30%, #ffff00 40%, #ff00cc 50%, #00ffff 60%, #39ff14 70%, #ff00aa 80%, #ffff00 90%, #ff00cc 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 5s linear infinite;
    text-shadow: 0 0 8px rgba(0,255,255,0.3);
}

    /* Variante inversée */
.coulouban-rainbow-reverse {
    font-weight: 700 !important;
    background: linear-gradient(135deg, #ffd700 0%, #d600ff 10%, #39ff14 20%, #00e5ff 30%, #ff0055 40%, #ffd700 50%, #d600ff 60%, #39ff14 70%, #00e5ff 80%, #ff0055 90%, #ffd700 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 6s linear infinite;
}

    /* Variante mix rainbow basée sur les couleurs du thème */
.coulouban-rainbow-mix {
    font-weight: 700 !important;
    background: linear-gradient(135deg, var(--color-histoire), var(--color-contact), var(--color-experience), var(--color-galerie), var(--color-poesie));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 6s linear infinite;
}

    /* Variante bleu rainbow basée sur la couleur du histoire */
    .coulouban-rainbow-blue {
    font-weight: 700 !important;
    background: linear-gradient(
      135deg, #dbeafe 0%, #93c5fd 10%, var(--color-histoire) 20%, #1e40af 30%, #172554 40%, #dbeafe 50%, #93c5fd 60%, var(--color-histoire) 70%, #1e40af 80%, #172554 90%, #dbeafe 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 2.1s linear infinite;
}

    /* Variante orange/rose rainbow basée sur la couleur de poesie */
    .coulouban-rainbow-orange {
    font-weight: 700 !important;
    background: linear-gradient(
      135deg, #fed7aa 0%, #fb923c 10%, var(--color-poesie) 20%, #f472b6 30%, #db2777 40%, #fed7aa 50%, #fb923c 60%, var(--color-poesie) 70%, #f472b6 80%, #db2777 90%, #fed7aa 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientHorizontal 3.2s linear infinite;
}

    /* Variante rose/rouge rainbow basée sur la couleur de galerie */
    .coulouban-rainbow-red {
    font-weight: 500 !important;
    background: linear-gradient(
      135deg, #fbcfe8 0%, #f9a8d4 10%, var(--color-galerie) 20%, #f472b6 30%, #dc2626 40%, #fbcfe8 50%, #f9a8d4 60%, var(--color-galerie) 70%, #f472b6 80%, #dc2626 90%, #fbcfe8 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 6.3s linear infinite;
}

    /* Variante verte rainbow basée sur la couleur de experience */
    .coulouban-rainbow-green {
    font-weight: 500 !important;
    background: linear-gradient(
      135deg, #a7f3d0 0%, #34d399 10%, var(--color-experience) 20%, #059669 30%, #064e3b 40%, #a7f3d0 50%, #34d399 60%, var(--color-experience) 70%, #059669 80%, #064e3b 90%, #a7f3d0 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientHorizontal 12.4s linear infinite, twinkle 2s ease-in-out infinite;
}

    /* Variante scintillante */
.coulouban-rainbow-twinkle {
    font-weight: 700 !important;
    background: linear-gradient(135deg, #ff0055 0%, #00e5ff 10%, #39ff14 20%, #d600ff 30%, #ffd700 40%, #ff0055 50%, #00e5ff 60%, #39ff14 70%, #d600ff 80%, #ffd700 90%, #ff0055 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 6s linear infinite, twinkle 2s ease-in-out infinite;
}
@keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

    /* Variante horizontale */
.coulouban-rainbow-horizontal {
    font-weight: 700 !important;
    background: linear-gradient(90deg, #ff0055 0%, #00e5ff 10%, #39ff14 20%, #d600ff 30%, #ffd700 40%, #ff0055 50%, #00e5ff 60%, #39ff14 70%, #d600ff 80%, #ffd700 90%, #ff0055 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 100%;
    animation: couloubanGradientHorizontal 6s linear infinite;
}
@keyframes couloubanGradientHorizontal {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
}

    /* Variante */
.coulouban-rainbow-dusk {
    font-weight: 700 !important;
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 10%, #ff4757 20%, #a29bfe 30%, #6c5ce7 40%, #ff6b6b 50%, #ff8e53 60%, #ff4757 70%, #a29bfe 80%, #6c5ce7 90%, #ff6b6b 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 6s linear infinite;
}

    /* Variante */
.coulouban-rainbow-forest {
    font-weight: 700 !important;
    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 10%, #1abc9c 20%, #f1c40f 30%, #e67e22 40%, #2ecc71 50%, #27ae60 60%, #1abc9c 70%, #f1c40f 80%, #e67e22 90%, #2ecc71 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 300%;
    animation: couloubanGradientCycle 6s linear infinite;
}

/* === Style supplémentaire pour le toggle icône (comme le theme-toggle) === */
.animation-toggle-container {
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
    user-select: none;
}
.animation-toggle-wrapper {
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
.animation-toggle-icon {
    font-size: 14px;
    transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}
.animation-toggle-label {
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
    white-space: nowrap;
}
.animation-toggle-container:hover .animation-toggle-wrapper {
    border-color: rgba(255,255,255,0.4);
    box-shadow: 0 0 8px rgba(255,255,255,0.1);
}
@media (max-width: 768px) {
    .animation-toggle-container {
        gap: 6px;
    }
    .animation-toggle-wrapper {
        width: 44px;
        height: 22px;
    }
    .animation-toggle-icon {
        font-size: 12px;
    }
    .animation-toggle-label {
        font-size: 8px;
        padding: 3px 6px;
        letter-spacing: 0.08em;
    }
}
`;
        document.head.appendChild(style);
    };

    const applyRainbowToLogo = () => {
        const brandLink = document.querySelector('a[href="home.html"]');
        if (brandLink && !brandLink.classList.contains("coulouban-rainbow-mix")) {
            ensureBrandStyles();
            brandLink.classList.add("coulouban-rainbow-mix");
        }
    };

    // Création du toggle avec icône (même apparence que le theme-toggle)
    const createInlineToggle = () => {
        const oldToggle = document.getElementById("animation-mode-switch");
        if (oldToggle) oldToggle.remove();

        let navActions = document.getElementById("nav-actions");
        if (!navActions) {
            const brandLink = document.querySelector('a[href="home.html"]');
            if (!brandLink) return null;
            let parentContainer = brandLink.parentElement;
            let wrapper = parentContainer.querySelector('.brand-toggle-wrapper');
            if (!wrapper) {
                wrapper = document.createElement("div");
                wrapper.className = "brand-toggle-wrapper";
                wrapper.style.display = "flex";
                wrapper.style.flexDirection = "column";
                wrapper.style.alignItems = "center";
                wrapper.style.gap = "6px";
                parentContainer.insertBefore(wrapper, brandLink);
                wrapper.appendChild(brandLink);
            }
            navActions = wrapper;
        }

        const container = document.createElement('div');
        container.id = "animation-mode-switch";
        container.className = 'animation-toggle-container';
        container.style.display = 'flex';
        container.style.gap = '12px';
        container.style.alignItems = 'center';
        container.style.cursor = 'pointer';
        container.style.userSelect = 'none';

        const toggle = document.createElement('div');
        toggle.className = 'animation-toggle-wrapper';
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

        const icon = document.createElement('span');
        icon.className = 'animation-toggle-icon';
        icon.style.fontSize = '14px';
        icon.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        icon.textContent = getToggleIcon(config.mode);
        toggle.appendChild(icon);

        const label = document.createElement('span');
        label.className = 'animation-toggle-label';
        label.textContent = getToggleText(config.mode);

        container.appendChild(toggle);
        container.appendChild(label);
        navActions.appendChild(container);

        // Effets hover (comme le theme-toggle)
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

        const updateToggle = () => {
            icon.textContent = getToggleIcon(config.mode);
            label.textContent = getToggleText(config.mode);
        };

        container.addEventListener("click", (e) => {
            e.stopPropagation();
            const newMode = nextMode();
            applyMode(newMode);
            updateToggle();
        });

        window.addEventListener("animation-mode-change", updateToggle);
        updateToggle();

        // Adaptation responsive (dimensions)
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            container.style.gap = isMobile ? '6px' : '12px';
            toggle.style.width = isMobile ? '44px' : '52px';
            toggle.style.height = isMobile ? '22px' : '26px';
            icon.style.fontSize = isMobile ? '12px' : '14px';
            label.style.fontSize = isMobile ? '8px' : '10px';
            label.style.padding = isMobile ? '3px 6px' : '4px 8px';
            label.style.letterSpacing = isMobile ? '0.08em' : '0.1em';
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return container;
    };

    // Initialisation
    const init = () => {
        ensureBrandStyles();
        applyRainbowToLogo();
        createInlineToggle();
    };

    // API publique
    window.AnimationConfig = config;
    window.AnimationConfigPresets = presets;
    window.setAnimationMode = applyMode;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();