/**
 * src/assets/js/main.js
 * Ponto de entrada principal
 */

let vantaEffect = null;

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. DATA NO RODAPÉ
    try {
        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    } catch (e) { console.error("Erro ano:", e); }

    // 2. MODAL DE IMAGEM
    (function setupImageModal() {
        const modalToggle = document.getElementById("imageModal");
        const modalImage = document.getElementById("modalImage");
        const imageLinks = document.querySelectorAll("[data-modal-src]");

        if (!modalToggle || !modalImage || imageLinks.length === 0) return;

        imageLinks.forEach((link) => {
            link.addEventListener("click", () => {
                modalImage.src = link.dataset.modalSrc;
                modalToggle.checked = true;
            });
        });
    })();

    // 3. NAVBAR DINÂMICA
    (function setupDynamicNavbar() {
        const header = document.querySelector('header');
        if (!header) return;

        const updateHeader = () => {
            if (window.scrollY > 20) {
                header.classList.remove('border-transparent');
                header.classList.add('bg-base-100/80', 'backdrop-blur-md', 'shadow-lg', 'border-base-content/10');
            } else {
                header.classList.add('border-transparent');
                header.classList.remove('bg-base-100/80', 'backdrop-blur-md', 'shadow-lg', 'border-base-content/10');
            }
        };

        window.addEventListener('scroll', updateHeader);
        updateHeader();
    })();

    // 4. SCROLL REVEAL (Animação de entrada)
    (function setupScrollReveal() {
        const elements = document.querySelectorAll('.reveal');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, 
            rootMargin: "0px 0px -20px 0px" // Ajustado para disparar um pouco antes
        });

        elements.forEach(el => observer.observe(el));
    })();

    // 5. TOGGLE DE TEMA
    (function setupThemeToggle() {
        const root = document.documentElement;
        const btn = document.getElementById("themeToggle");

        if (!btn) return;

        const saved = localStorage.getItem("theme");
        if (saved) root.setAttribute("data-theme", saved);

        const sync = () => {
            const t = root.getAttribute("data-theme") || "night";
            btn.querySelector(".sun").classList.toggle("hidden", t !== "light");
            btn.querySelector(".moon").classList.toggle("hidden", t === "light");

            if (vantaEffect) {
                vantaEffect.destroy();
                vantaEffect = null;
            }

            const newColors = getVantaColors(t);

            if (window.VANTA) {
                try {
                    vantaEffect = window.VANTA.NET({
                        el: "#vanta-bg",
                        mouseControls: false,
                        touchControls: false,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00,
                        color: newColors.color,
                        backgroundColor: newColors.backgroundColor,
                        points: 10.00,
                        maxDistance: 20.00,
                        spacing: 15.00,
                        showDots: false 
                    });
                } catch (err) { console.warn("Erro Vanta:", err); }
            }
        };
        
        sync(); 
        
        btn.addEventListener("click", () => {
            const current = root.getAttribute("data-theme") || "night";
            const next = current === "light" ? "night" : "light";
            root.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            sync(); 
        });
    })();

    // 6. FILTRO DE PROJETOS
    (function setupProjectFilter() {
        const tabs = document.querySelectorAll('[data-filter]');
        const cards = document.querySelectorAll('[data-cats]');

        if (!tabs.length || !cards.length) return;

        tabs.forEach(tab => tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('tab-active'));
            tab.classList.add('tab-active');
            
            const f = tab.dataset.filter;
            
            cards.forEach(c => {
                const cats = c.dataset.cats.split(',');
                if(f === 'all' || cats.includes(f)) {
                    c.classList.remove('hidden');
                    setTimeout(() => {
                        c.classList.add('reveal'); 
                        c.classList.add('active');
                    }, 10);
                } else {
                    c.classList.add('hidden');
                    c.classList.remove('active'); 
                }
            });
        }));
    })();

    // 7. BOTÕES DE CÓPIA
    (function setupCopyButtons() {
        document.querySelectorAll('[data-copy]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const text = btn.getAttribute('data-copy');
                const originalText = btn.textContent;
                try { 
                    await navigator.clipboard.writeText(text); 
                    btn.textContent = 'copiado!'; 
                    setTimeout(()=> btn.textContent = originalText, 1200); 
                } catch(e){ console.error(e); }
            });
        });
    })();

    // 8. NAVEGAÇÃO ATIVA
    (function setupActiveNavScroll() {
        const allAnchors = Array.from(document.querySelectorAll('a[href^="#"]'));
        const sections = Array.from(new Set(allAnchors.map(a => a.getAttribute('href'))))
            .map(href => document.querySelector(href))
            .filter(Boolean);

        if (!sections.length) return;

        const observer = new IntersectionObserver((entries) => {
            const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            if (visible.length > 0) {
                allAnchors.forEach(a => {
                    const isActive = a.getAttribute('href') === '#' + visible[0].target.id;
                    a.classList.toggle('active', isActive);
                    if(isActive) a.setAttribute('aria-current', 'page');
                    else a.removeAttribute('aria-current');
                });
            }
        }, { root: null, rootMargin: '-40% 0% -40% 0%', threshold: [0, 0.25, 0.5] });

        sections.forEach(s => observer.observe(s));
    })();

    // 9. [NOVO] SPOTLIGHT EFFECT (Borda seguindo mouse)
    (function setupSpotlightCards() {
        const cards = document.querySelectorAll('.spotlight-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Define as variáveis CSS para usar no gradiente
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    })();

}); 

function getVantaColors(theme) {
    if (theme === "light") {
        return { color: 0x661AE6, backgroundColor: 0xffffff };
    } 
    return { color: 0x793ef9, backgroundColor: 0x1d232a };
}