/**
 * Ponto de entrada principal
 * Garante que o DOM esteja carregado antes de executar os scripts
 */
document.addEventListener("DOMContentLoaded", () => {
  
  // [CORREÇÃO] O bloco de inicialização do Lucide foi REMOVIDO daqui.
  // Ele estava quebrando a execução de todo este arquivo.

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

  // 4. Script de Toggle de Tema (Agora vai funcionar)
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


  // 8. Lógica do Terminal Interativo
  (function setupTerminal() {
    const modal = document.getElementById('terminal_modal');
    const form = document.getElementById('terminal-form');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    if (!modal || !form || !input || !output) {
      console.warn("Componentes do terminal não encontrados.");
      return;
    }
    
    // [CORREÇÃO] Removida a linha 'shown.bs.modal' (Bootstrap)

    const modalObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'open' && modal.open) {
                input.focus();
                const dateEl = output.querySelector('[data-date="true"]');
                if (dateEl) {
                  dateEl.textContent = `Último login: ${new Date().toLocaleString('pt-BR')}`;
                }
            }
        });
    });
    modalObserver.observe(modal, { attributes: true });
    
    const dateEl = output.querySelector('.opacity-70:nth-child(2)');
    if (dateEl) {
        dateEl.textContent = `Último login: ${new Date().toLocaleString('pt-BR')}`;
        dateEl.setAttribute('data-date', 'true');
    }


    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const command = input.value.trim().toLowerCase();
      if (command) {
        printToTerminal(`~/kaua $ ${command}`);
        processCommand(command);
      }
      input.value = '';
    });
    
    const processCommand = (cmd) => {
        switch (cmd) {
            case 'help':
                printToTerminal("Comandos disponíveis:");
                printToTerminal(`
                  <ul class="list-inside list-disc pl-4">
                    <li><span class="text-primary">'help'</span>: Mostra esta lista</li>
                    <li><span class="text-primary">'solucoes'</span>: Lista o que posso fazer por você</li>
                    <li><span class="text-primary">'projetos'</span>: Lista meus projetos em destaque</li>
                    <li><span class="text-primary">'stack'</span>: Mostra minhas principais tecnologias</li>
                    <li><span class="text-primary">'contato'</span>: Exibe minhas informações de contato</li>
                    <li><span class="text-primary">'chat'</span>: Abre meu projeto de ChatBot (link)</li>
                    <li><span class="text-primary">'clear'</span>: Limpa o terminal</li>
                  </ul>
                `);
                break;
            case 'solucoes':
                printToTerminal("Posso ajudar seu negócio com:");
                printToTerminal(`
                  <ul class="list-inside list-disc pl-4">
                    <li>APIs e Integrações</li>
                    <li>Sistemas Web Sob Medida</li>
                    <li>Automação e Bots</li>
                    <li>Manutenção e Evolução de Sistemas</li>
                  </ul>
                  (Veja mais na seção <a href='#solucoes' class='link' onclick='terminal_modal.close()'>#solucoes</a>)
                `);
                break;
            case 'projetos':
                printToTerminal("Meus principais projetos:");
                printToTerminal(`
                  <ul class="list-inside list-disc pl-4">
                    <li>Apiário CRM (Back-end)</li>
                    <li>ChatBot Inteligente (Spring AI)</li>
                    <li>Este Portfólio (Front-end)</li>
                  </ul>
                  (Veja mais na seção <a href='#projetos' class='link' onclick='terminal_modal.close()'>#projetos</a>)
                `);
                break;
            case 'stack':
                 printToTerminal("Minha Tech Stack principal:");
                 printToTerminal(`
                    <b>Back-end:</b> Java, Spring Boot, Spring Data JPA, APIs REST
                    <b>Front-end:</b> HTML, CSS, TailwindCSS, JavaScript
                    <b>Banco:</b> MySQL, PostgreSQL
                    <b>DevOps/Qualidade:</b> Docker, Git, JUnit
                 `);
                break;
            case 'contato':
                printToTerminal("Vamos conversar:");
                printToTerminal(`
                  <ul class="list-inside list-disc pl-4">
                    <li><b>Email:</b> kauavilarim@gmail.com</li>
                    <li><b>LinkedIn:</b> /in/kaua-vilarim/</li>
                    <li><b>GitHub:</b> /Miraliv</li>
                  </ul>
                `);
                break;
            case 'chat':
                printToTerminal("Abrindo projeto ChatBot em nova aba...");
                window.open('https://github.com/Miraliv/SpringAI', '_blank');
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            default:
                printToTerminal(`Comando não encontrado: ${cmd}. Digite 'help'.`);
                break;
        }
    };
    
    const printToTerminal = (htmlContent) => {
        const line = document.createElement('div');
        line.innerHTML = htmlContent;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    };

  })();

});