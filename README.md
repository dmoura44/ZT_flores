# ZT Flores

Site institucional e catalogo digital da **ZT Flores**, distribuidora de flores sediada em Holambra, SP.
Fundada em 2019 por Marcio e Zecca, a empresa representa mais de 50 produtores e opera em uma estrutura de 600m².

---

## Sobre o Projeto

Front-end estatico construido com HTML, CSS e JavaScript puro, utilizando Tailwind CSS via CDN para estilizacao e Google Fonts para tipografia. O site e composto por quatro paginas principais e um sistema de componentes compartilhados injetados via JavaScript.

### Paginas

| Arquivo | Descricao |
|---|---|
| `home.html` | Landing page com hero, colecao de produtos, FAQ, feed do Instagram e CTA |
| `lista_de_produtos_marketplace.html` | Catalogo completo com filtros por categoria e ocasiao |
| `galeria.html` | Galeria visual com arranjos em destaque |
| `nossa_historia.html` | Pagina institucional com historia, vantagens, missao, visao e valores |

### Arquivos de Suporte

| Arquivo | Funcao |
|---|---|
| `shared.js` | Injeta header, footer, splash screen, carrinho, botao WhatsApp e overlay de idioma |
| `i18n.js` | Dicionario de traducoes para PT-BR, EN-US e ES-ES |
| `styles.css` | Design system completo com variaveis CSS, componentes e media queries responsivas |

---

## Funcionalidades

- **Internacionalizacao (i18n)** — Troca de idioma com overlay animado (PT-BR, EN-US, ES-ES). Preferencia salva em localStorage.
- **Carrinho de Cotacao** — Sem precos exibidos. O cliente seleciona produtos e solicita orcamento via WhatsApp com lista formatada.
- **Responsivo** — Layout adaptado para desktop, tablet e celular. Filtros do catalogo colapsaveis em telas menores.
- **Instagram Embed** — Posts reais do perfil @ztflores_holambra carregados via lazy loading.
- **Cloudinary** — Imagens otimizadas com entrega automatica em WebP/AVIF via Cloudinary (cloud: `dqcs4rqjx`).
- **Splash Screen** — Animacao de logo em video na entrada do site, com velocidade acelerada em revisitas.

---

## Stack

- HTML5 semantico
- CSS3 com variaveis customizadas
- JavaScript ES6+ (vanilla)
- Tailwind CSS (CDN)
- Google Fonts (Manrope + Playfair Display)
- Material Symbols (Google)
- Cloudinary (CDN de imagens)
- Instagram Embed API

---

## Deploy

O projeto e estatico e pode ser publicado diretamente no **Vercel**:

1. Conecte este repositorio ao Vercel
2. Framework Preset: `Other`
3. Build Command: deixar vazio
4. Output Directory: `.` (raiz)
5. O Vercel servira os arquivos HTML diretamente

---

## Estrutura

```
ZTFlores/
  home.html
  lista_de_produtos_marketplace.html
  galeria.html
  nossa_historia.html
  shared.js
  i18n.js
  styles.css
  ZTlogo.png
  logo_animada.mp4
  README.md
```

---

## Contato

WhatsApp: +55 19 99663-8193
Instagram: [@ztflores_holambra](https://www.instagram.com/ztflores_holambra/)

---

Desenvolvido para ZT Flores -- Holambra, SP.
