# Gabriel Ribeiro | Portfólio

Portfólio pessoal em estética editorial com galeria de prints reais da **Liga Caramelo**, lista de projetos, formação e animações de scroll com **GSAP + ScrollTrigger + Lenis** via CDN gratuito.

**[Acessar o portfólio](https://gabriza007.github.io/portifolio/)** · [Perfil no GitHub](https://github.com/gabriza007)

## Recursos

- Identidade editorial em papel claro (`#f4f1ea`) contrastada com galeria escura (`#111110`) para exibição dos prints reais da Liga Caramelo.
- Animações de scroll gratuitas com **GSAP 3 + ScrollTrigger** e rolagem suave com **Lenis**, respeitando `prefers-reduced-motion`.
- Índice editorial para projetos complementares (**Ponte Segura**, **Assistente de IA**) e carregamento dinâmico dos demais repositórios pela API pública do GitHub.
- Menu mobile acessível, navegação por teclado (`:focus-visible`, skip link) e cópia rápida de e-mail.

## Tecnologias

HTML5 · CSS3 · JavaScript · GSAP + ScrollTrigger (CDN) · Lenis (CDN) · GitHub REST API · Google Fonts

## Executar localmente

```bash
git clone https://github.com/gabriza007/portifolio.git
cd portifolio
python -m http.server 8000
```

Acesse `http://localhost:8000`. Não há instalação de dependências nem etapa de build.

## Estrutura

```text
index.html              Estrutura semântica, galeria e seções editoriais
styles.css              Tokens visuais, tipografia, molduras e responsividade
script.js               Animações Lenis/GSAP, menu mobile e API do GitHub
assets/liga-caramelo/   Capturas reais da área pública e painel admin
```

## Autor

[Gabriel Ribeiro](https://github.com/gabriza007) · [LinkedIn](https://www.linkedin.com/in/gabriel-ribeiro-917441368)
