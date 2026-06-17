// Newsletter Signup Component
(function() {
    document.head.insertAdjacentHTML('beforeend', '<style>.newsletter-input::placeholder{color:#ffffff;opacity:1;}</style>');
    const translations = {
        fr: {
            label: "S'inscrire à la newsletter",
            placeholder: "Votre email",
            button: "S'inscrire",
            success: "Merci !",
            error: "Email invalide"
        },
        en: {
            label: "Subscribe to Newsletter",
            placeholder: "Your email",
            button: "Subscribe",
            success: "Thank you!",
            error: "Invalid email"
        },
        es: {
            label: "Suscribirse al boletín",
            placeholder: "Tu correo",
            button: "Suscribirse",
            success: "¡Gracias!",
            error: "Correo no válido"
        },
        it: {
            label: "Iscriviti alla newsletter",
            placeholder: "La tua email",
            button: "Iscriviti",
            success: "Grazie!",
            error: "Email non valida"
        }
    };

    const getLanguage = () => {
        const path = window.location.pathname;
        if (path.includes('/fr/')) return 'fr';
        if (path.includes('/en/')) return 'en';
        if (path.includes('/es/')) return 'es';
        if (path.includes('/it/')) return 'it';
        return 'fr'; // default
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    window.createNewsletterForm = () => {
        const lang = getLanguage();
        const t = translations[lang];

        // Container
        const container = document.createElement('div');
        container.className = 'newsletter-container';
        container.style.marginTop = '24px';
        container.style.paddingTop = '24px';
        container.style.borderTop = '1px solid rgba(255,255,255,0.1)';
        container.style.width = '100%';
        container.style.maxWidth = '320px';
        container.style.textAlign = 'center';

        // Label
        const label = document.createElement('p');
        label.className = 'newsletter-label';
        label.style.fontSize = '11px';
        label.style.letterSpacing = '0.15em';
        label.style.textTransform = 'uppercase';
        label.style.fontWeight = '600';
        label.style.marginBottom = '12px';
        // On retire la couleur fixe et on ajoute la classe arc-en-ciel
        label.classList.add('coulouban-rainbow-forest');
        label.textContent = t.label;

        // Form
        const form = document.createElement('form');
        form.className = 'newsletter-form';
        form.style.display = 'flex';
        form.style.gap = '8px';
        form.style.alignItems = 'stretch';
        form.onsubmit = (e) => {
            e.preventDefault();
            handleSubmit();
        };

        // Input
        const input = document.createElement('input');
        input.type = 'email';
        input.placeholder = t.placeholder;
        input.className = 'newsletter-input';
        input.style.flex = '1';
        input.style.padding = '10px 12px';
        input.style.fontSize = '12px';
        input.style.backgroundColor = 'rgba(0,0,0,0.3)';
        input.style.border = '1px solid rgba(255,255,255,0.15)';
        input.style.borderRadius = '4px';
        input.style.color = '#ffffff';
        input.style.fontFamily = "'Montserrat', sans-serif";
        input.style.transition = 'all 0.2s ease';
        input.style.backdropFilter = 'blur(4px)';

        input.addEventListener('focus', () => {
            input.style.borderColor = 'rgba(255,255,255,0.3)';
            input.style.backgroundColor = 'rgba(0,0,0,0.5)';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(255,255,255,0.15)';
            input.style.backgroundColor = 'rgba(0,0,0,0.3)';
        });

        // Button
        const button = document.createElement('button');
        button.type = 'submit';
        button.className = 'newsletter-button';

        // On retire la couleur du bouton pour ne pas cacher le dégradé du texte
        // et on insère un <span> qui portera l'effet arc-en-ciel
        button.style.padding = '10px 16px';
        button.style.fontSize = '11px';
        button.style.fontWeight = '600';
        button.style.letterSpacing = '0.1em';
        button.style.textTransform = 'uppercase';
        button.style.backgroundColor = '#f5f5f5';
        button.style.border = '1px solid #cccccc';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.2s ease';
        button.style.fontFamily = "'Montserrat', sans-serif";
        button.style.whiteSpace = 'nowrap';
        button.style.backdropFilter = 'blur(4px)';
        // Plus de color ici, elle sera gérée par le span

        // Création du span qui contiendra le texte et l'effet rainbow
        const buttonText = document.createElement('span');
        buttonText.textContent = t.button;
        buttonText.classList.add('coulouban-rainbow-forest');  // La classe arc-en-ciel
        button.appendChild(buttonText);

        // Les événements hover restent inchangés
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'rgba(255,255,255,0.1)';
            button.style.borderColor = 'rgba(255,255,255,0.4)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'rgba(0,0,0,0.4)';
            button.style.borderColor = 'rgba(255,255,255,0.2)';
        });

        // Message
        const message = document.createElement('div');
        message.className = 'newsletter-message';
        message.style.fontSize = '11px';
        message.style.marginTop = '8px';
        message.style.minHeight = '16px';
        message.style.display = 'none';
        message.style.letterSpacing = '0.05em';

        const handleSubmit = () => {
            const email = input.value.trim();
            
            if (!validateEmail(email)) {
                message.textContent = t.error;
                message.style.color = '#fca5a5';
                message.style.display = 'block';
                input.style.borderColor = 'rgba(252, 165, 165, 0.5)';
                return;
            }

            // Success
            message.textContent = t.success;
            message.style.color = '#86efac';
            message.style.display = 'block';
            input.style.borderColor = 'rgba(134, 239, 172, 0.5)';
            input.style.backgroundColor = 'rgba(0,0,0,0.3)';
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'default';

            // Redirect to soon.html after 1.5 seconds
            setTimeout(() => {
                const path = window.location.pathname;
                let soonPath = '../accueil/soon.html';
                
                // Adjust the path based on current location depth
                if (path.includes('/lang/')) {
                    soonPath = '../../../accueil/soon.html';
                }
                
                window.location.href = soonPath;
            }, 300);
        };

        form.appendChild(input);
        form.appendChild(button);
        container.appendChild(label);
        container.appendChild(form);
        container.appendChild(message);

        return container;
    };

    const injectNewsletter = () => {
        const wrapper = document.querySelector('.social-newsletter-wrapper');
        if (wrapper) {
            const newsletter = window.createNewsletterForm();
            wrapper.appendChild(newsletter);
        } else {
            // Fallback si le conteneur n'existe pas (ancienne structure)
            const footer = document.querySelector('footer');
            if (footer) {
                const socialIcons = footer.querySelector('.flex.space-x-6');
                if (socialIcons && socialIcons.parentElement) {
                    const footerDiv = socialIcons.parentElement;
                    const newsletter = window.createNewsletterForm();
                    footerDiv.appendChild(newsletter);
                }
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNewsletter);
    } else {
        injectNewsletter();
    }
})();
