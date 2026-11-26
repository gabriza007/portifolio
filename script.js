(() => {
  const GITHUB_USERNAME = 'gabriza007';
  const MAX_REPOS = 6;

  // Enable progressive reveal animations only when JS runs
  document.documentElement.classList.add('js-enabled');

  /* 1. Accessible Mobile Menu */
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
      if (window.innerWidth > 768) {
        setMenuState(false);
      }
    });
  }

  /* 2. Scroll Reveal (respects prefers-reduced-motion) */
  const revealItems = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((el) => observer.observe(el));
  }

  /* 3. Copy Email Action */
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

  /* 4. GitHub Repositories Loader */
  const reposContainer = document.getElementById('github-projects');

  function renderRepoCard(repo) {
    const card = document.createElement('a');
    card.className = 'repo-card';
    card.href = repo.html_url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `Abrir repositório ${repo.name} no GitHub`);

    const top = document.createElement('div');
    top.className = 'repo-top';

    const title = document.createElement('h4');
    title.className = 'repo-title';
    title.textContent = repo.name;

    const ext = document.createElement('span');
    ext.className = 'repo-ext';
    ext.setAttribute('aria-hidden', 'true');
    ext.textContent = '↗';

    top.append(title, ext);

    const desc = document.createElement('p');
    desc.className = 'repo-desc';
    desc.textContent = repo.description || 'Repositório público de código e estudos.';

    const footer = document.createElement('div');
    footer.className = 'repo-footer';

    const lang = document.createElement('span');
    lang.className = 'repo-lang';
    lang.textContent = repo.language || 'Projeto';

    const stars = document.createElement('span');
    stars.textContent = `★ ${repo.stargazers_count ?? 0}`;

    footer.append(lang, stars);
    card.append(top, desc, footer);
    return card;
  }

  function renderState(message, showRetry) {
    if (!reposContainer) return;
    reposContainer.innerHTML = '';

    const box = document.createElement('div');
    box.className = 'repos-state';

    const text = document.createElement('p');
    text.textContent = message;
    box.appendChild(text);

    if (showRetry) {
      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'btn btn-secondary btn-sm';
      retryBtn.textContent = 'Tentar novamente';
      retryBtn.addEventListener('click', loadRepositories);
      box.appendChild(retryBtn);
    }

    reposContainer.appendChild(box);
  }

  async function loadRepositories() {
    if (!reposContainer) return;
    reposContainer.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=12`
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const repos = data
        .filter((repo) => !repo.fork && repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
        .slice(0, MAX_REPOS);

      reposContainer.innerHTML = '';

      if (repos.length === 0) {
        renderState('Nenhum repositório público encontrado no momento.', false);
        return;
      }

      const fragment = document.createDocumentFragment();
      repos.forEach((repo) => fragment.appendChild(renderRepoCard(repo)));
      reposContainer.appendChild(fragment);
    } catch {
      renderState('Não foi possível carregar os repositórios do GitHub agora.', true);
    } finally {
      reposContainer.setAttribute('aria-busy', 'false');
    }
  }

  loadRepositories();
})();
