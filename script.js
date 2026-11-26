(() => {
  const GITHUB_USERNAME = 'gabriza007';
  const EXCLUDED_REPOS = new Set(['gabriza007', 'portifolio', 'ponte-segura', 'ia']);
  const MAX_REPOS = 6;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Menu mobile acessível */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  function setMenuState(open) {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    navMenu.classList.toggle('is-open', open);
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!isOpen);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenuState(false);
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) {
        setMenuState(false);
      }
    });
  }

  /* 2. Copiar e-mail no rodapé */
  const copyBtn = document.getElementById('copy-email-btn');
  const copyFeedback = document.getElementById('copy-feedback');

  if (copyBtn && copyFeedback) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || '';
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
        copyFeedback.textContent = `E-mail copiado: ${email}`;
      } catch {
        copyFeedback.textContent = `E-mail para contato: ${email}`;
      }

      window.setTimeout(() => {
        copyFeedback.textContent = '';
      }, 3500);
    });
  }

  /* 3. Animações de Scroll com Lenis + GSAP + ScrollTrigger (gratuitas via CDN) */
  function initScrollAnimations() {
    if (prefersReducedMotion || typeof window.gsap === 'undefined') {
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Smooth scroll com Lenis sincronizado ao ticker do GSAP
    let lenis = null;
    if (typeof window.Lenis !== 'undefined') {
      lenis = new window.Lenis({
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 0.95,
      });

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Âncoras internas suaves via Lenis
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
          const targetId = anchor.getAttribute('href');
          if (!targetId || targetId === '#') return;
          const target = document.querySelector(targetId);
          if (!target) return;
          event.preventDefault();
          lenis.scrollTo(target, { offset: -72 });
        });
      });
    }

    // Barra de progresso fixa no topo
    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) {
      gsap.to(progressEl, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }

    // Entrada coreografada do Hero + deslocamento horizontal sutil no scroll
    const heroLines = document.querySelectorAll('[data-hero-line]');
    const heroFades = document.querySelectorAll('[data-hero-fade]');

    if (heroLines.length) {
      gsap.from(heroLines, {
        yPercent: 105,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform',
      });

      const leftLine = document.querySelector('[data-hero-line="left"]');
      const rightLine = document.querySelector('[data-hero-line="right"]');

      if (leftLine) {
        gsap.to(leftLine, {
          xPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: '#inicio',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (rightLine) {
        gsap.to(rightLine, {
          xPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: '#inicio',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }

    if (heroFades.length) {
      gsap.from(heroFades, {
        opacity: 0,
        y: 18,
        duration: 0.75,
        stagger: 0.1,
        delay: 0.15,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }

    // Marquee contínuo que acelera sutilmente conforme o scroll
    const marqueeTrack = document.getElementById('marquee-track');
    if (marqueeTrack) {
      const marqueeTween = gsap.to(marqueeTrack, {
        xPercent: -33.333,
        duration: 24,
        ease: 'none',
        repeat: -1,
      });

      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate(self) {
          const velocity = Math.min(Math.abs(self.getVelocity()) / 900, 2.2);
          marqueeTween.timeScale(1 + velocity);
        },
      });
    }

    // Galeria horizontal pinned da Liga Caramelo em desktop
    const ligaStage = document.getElementById('liga-stage');
    const ligaTrack = document.getElementById('liga-track');
    const ligaCounter = document.getElementById('liga-counter');
    const totalSlides = ligaTrack ? ligaTrack.querySelectorAll('.liga-slide').length : 0;

    if (ligaStage && ligaTrack) {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 901px)', () => {
        const getScrollDistance = () => {
          const viewport = ligaStage.querySelector('.liga-viewport');
          const visibleWidth = viewport ? viewport.clientWidth : window.innerWidth;
          return Math.max(0, ligaTrack.scrollWidth - visibleWidth + 48);
        };

        const horizontalTween = gsap.to(ligaTrack, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: ligaStage,
            start: 'top top+=68',
            end: () => `+=${Math.max(getScrollDistance(), 600)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate(self) {
              if (!ligaCounter || !totalSlides) return;
              const current = Math.min(
                totalSlides,
                Math.max(1, Math.round(self.progress * (totalSlides - 1)) + 1)
              );
              ligaCounter.textContent = `${String(current).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
            },
          },
        });

        // Leve movimento de profundidade nas legendas durante o trilho horizontal (sem cortar os prints)
        ligaTrack.querySelectorAll('.liga-caption').forEach((caption) => {
          gsap.fromTo(
            caption,
            { x: 18 },
            {
              x: -12,
              ease: 'none',
              scrollTrigger: {
                trigger: caption,
                containerAnimation: horizontalTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        });
      });

      // Atualiza contador no scroll nativo em telas menores
      const viewport = ligaStage.querySelector('.liga-viewport');
      if (viewport && ligaCounter && totalSlides) {
        viewport.addEventListener(
          'scroll',
          () => {
            if (window.innerWidth > 900) return;
            const maxScroll = viewport.scrollWidth - viewport.clientWidth;
            if (maxScroll <= 0) return;
            const ratio = viewport.scrollLeft / maxScroll;
            const current = Math.min(totalSlides, Math.max(1, Math.round(ratio * (totalSlides - 1)) + 1));
            ligaCounter.textContent = `${String(current).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
          },
          { passive: true }
        );
      }
    }

    // Revelação suave das linhas editoriais e blocos de conteúdo (nunca trava invisível se já estiver visível/acima)
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.95) {
        return;
      }

      gsap.from(el, {
        y: 24,
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          once: true,
        },
      });
    });

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  /* 4. Loader seguro dos demais repositórios públicos do GitHub */
  const reposContainer = document.getElementById('github-projects');

  function renderRepoRow(repo) {
    const li = document.createElement('li');
    li.className = 'index-row';

    const link = document.createElement('a');
    link.className = 'index-link';
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Abrir repositório ${repo.name} no GitHub`);

    const main = document.createElement('div');
    main.className = 'index-main';

    const title = document.createElement('h3');
    title.textContent = repo.name;

    const desc = document.createElement('p');
    desc.textContent = repo.description || 'Repositório público de código e estudos.';

    main.append(title, desc);

    const meta = document.createElement('div');
    meta.className = 'index-meta';

    const stack = document.createElement('span');
    stack.className = 'index-stack';
    const langText = repo.language || 'Projeto';
    const starsCount = repo.stargazers_count ?? 0;
    stack.textContent = starsCount > 0 ? `${langText} · ★ ${starsCount}` : langText;

    const arrow = document.createElement('span');
    arrow.className = 'index-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';

    meta.append(stack, arrow);
    link.append(main, meta);
    li.appendChild(link);
    return li;
  }

  function renderRepoState(message, showRetry) {
    if (!reposContainer) return;
    reposContainer.innerHTML = '';

    const li = document.createElement('li');
    li.className = 'repos-state';

    const text = document.createElement('p');
    text.textContent = message;
    li.appendChild(text);

    if (showRetry) {
      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'btn-outline-ink';
      retryBtn.textContent = 'Tentar novamente';
      retryBtn.addEventListener('click', loadRepositories);
      li.appendChild(retryBtn);
    }

    reposContainer.appendChild(li);
  }

  async function loadRepositories() {
    if (!reposContainer) return;
    reposContainer.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=15`
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const repos = data
        .filter((repo) => !repo.fork && !EXCLUDED_REPOS.has(repo.name.toLowerCase()))
        .slice(0, MAX_REPOS);

      reposContainer.innerHTML = '';

      if (repos.length === 0) {
        renderRepoState('Nenhum repositório adicional encontrado.', false);
        return;
      }

      const fragment = document.createDocumentFragment();
      repos.forEach((repo) => fragment.appendChild(renderRepoRow(repo)));
      reposContainer.appendChild(fragment);
    } catch {
      renderRepoState('Não foi possível carregar os repositórios do GitHub agora.', true);
    } finally {
      reposContainer.setAttribute('aria-busy', 'false');
      if (typeof window.ScrollTrigger !== 'undefined') {
        window.ScrollTrigger.refresh();
      }
    }
  }

  initScrollAnimations();
  loadRepositories();
})();
