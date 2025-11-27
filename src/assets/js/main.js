/**
 * Ponto de entrada principal
 * Garante que o DOM esteja carregado antes de executar os scripts
 */

// Variável global para guardar o efeito Vanta
let vantaEffect = null;

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Define o ano atual no rodapé
    try {
        const yearEl = document.getElementById("year");
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    } catch (e) {
        console.error("Erro ao definir o ano:", e);
    }

    // 3. Script do Modal de Imagem
    (function setupImageModal() {
        const modalToggle = document.getElementById("imageModal");
        const modalImage = document.getElementById("modalImage");
        const imageLinks = document.querySelectorAll("[data-modal-src]");

        if (!modalToggle || !modalImage || imageLinks.length === 0) {
            return;
        }

        const openModal = (imageSrc) => {
            modalImage.src = imageSrc;
            modalToggle.checked = true;
        };

        imageLinks.forEach((link) => {
            link.addEventListener("click", () => {
                openModal(link.dataset.modalSrc);
            });
        });
    })();

    // 4. [MODIFICADO] Script de Toggle de Tema (Destrói e Recria o Vanta)
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

            // --- INÍCIO DA CORREÇÃO ---
            // 1. Destrói o efeito Vanta anterior, se existir
            if (vantaEffect) {
                vantaEffect.destroy();
                vantaEffect = null;
            }

            // 2. Pega as cores corretas para o tema atual
            const newColors = getVantaColors(t);

            // 3. Cria um NOVO efeito Vanta com as cores certas e SEM MOUSE
            if (window.VANTA) {
                vantaEffect = window.VANTA.NET({
                    el: "#vanta-bg",
                    
                    // AQUI ESTÁ A MUDANÇA QUE VOCÊ PEDIU:
                    mouseControls: false, // Desativa interação do mouse
                    touchControls: false, // Desativa interação do toque
                    gyroControls: false,  // Desativa giroscópio
                    
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: newColors.color,            // Cor dinâmica
                    backgroundColor: newColors.backgroundColor, // Fundo dinâmico
                    points: 10.00,
                    maxDistance: 20.00,
                    spacing: 15.00,
                    showDots: false 
                });
            } else {
                console.warn("Vanta.js não foi carregado a tempo.");
            }
            // --- FIM DA CORREÇÃO ---
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

    // 5. Script de Filtro de Projetos
    (function setupProjectFilter() {
        const tabs = document.querySelectorAll('[data-filter]');
        const cards = document.querySelectorAll('[data-cats]');

        if (tabs.length === 0 || cards.length === 0) return;

        tabs.forEach(tab => tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('tab-active'));
            tab.classList.add('tab-active');
            const f = tab.dataset.filter;
            cards.forEach(c => {
                const cats = c.dataset.cats.split(',');
                c.classList.toggle('hidden', !(f === 'all' || cats.includes(f)));
            });
        }));
    })();

    // 6. Script de Botões de Cópia
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

    // 7. Script de Navegação Ativa
    (function setupActiveNavScroll() {
        const allAnchors = Array.from(document.querySelectorAll('a[href^="#"]'));
        const sections = Array.from(new Set(allAnchors.map(a => a.getAttribute('href'))))
            .map(href => document.querySelector(href))
            .filter(Boolean);

        if (!sections.length) return;

        const setActive = (href) => {
            allAnchors.forEach(a => {
                const isActive = a.getAttribute('href') === href;
                a.classList.toggle('active', isActive);
                if (isActive) {
                    a.setAttribute('aria-current', 'page');
                } else {
                    a.removeAttribute('aria-current');
                }
            });
        };

        const observer = new IntersectionObserver((entries) => {
            const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            if (visible.length > 0) {
                setActive('#' + visible[0].target.id);
            }
        }, { root: null, rootMargin: '-40% 0% -40% 0%', threshold: [0, 0.25, 0.5] });

        sections.forEach(s => observer.observe(s));
    })();


    // 8. [REMOVIDO] Lógica do Terminal Interativo


    // 9. [REMOVIDO] Script de inicialização do Vanta.js
    // (A lógica agora está no item 4, dentro da função 'sync')

}); // Fim do DOMContentLoaded

/**
 * [Sem alteração] Cores corrigidas para o modo Light
 */
function getVantaColors(theme) {
    // Cores HEx baseadas nos temas 'light' e 'night' do DaisyUI
    if (theme === "light") {
        // Modo Claro: Fundo branco, linhas roxas (primary)
        return {
            color: 0x661AE6, // Cor 'primary' do DaisyUI 'light'
            backgroundColor: 0xffffff // Cor 'base-100' do DaisyUI 'light'
        };
    } 
    
    // Modo Escuro (night)
    return {
        color: 0x793ef9, // Cor 'primary' do DaisyUI 'night'
        backgroundColor: 0x1d232a // Cor 'base-100' do DaisyUI 'night'
    };
}