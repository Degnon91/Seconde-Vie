# Decathlon Seconde Vie — Prototype Web
**Bloc A4 — Développement Web · EEMI × Decathlon**

## Structure du projet

```
seconde-vie/
├── index.html      → Page principale (structure HTML + overlays)
├── styles.css      → Design system (tokens Figma Decathlon cobalt #3643BA)
├── scoring.js      → Moteur de diagnostic et de calcul de prix
└── app.js          → Application (pages, navigation, UI)
```

## Lancer le projet

Ouvrir `index.html` dans un navigateur. Aucune dépendance serveur.

Ou avec VS Code Live Server : clic droit sur `index.html` → *Open with Live Server*

## Architecture

### scoring.js — Moteur métier
- **`calcScore(scores)`** — Calcule le score /100 à partir des réponses du diagnostic
- **`calcPrice(score, meta)`** — Calcule le prix de reprise selon l'âge, l'état et le prix neuf
- **`CDIAG_BY_CAT`** — Critères de diagnostic par catégorie (16 catégories)
- **`BRANDS_BY_CAT`** — Marques par catégorie

### app.js — Application
- Toutes les pages UI : `pLogin()`, `pH()`, `pT()`, `pD()`, `pRes()`, `pConf()`, `pSDiag()`...
- Navigation : `go(page)`, `render()`
- Flux client et vendeur complets

## Commits Git suggérés

```bash
git init
git add .
git commit -m "init: structure projet Seconde Vie (HTML/CSS/JS)"
git commit -m "feat: scoring engine — calcScore() + calcPrice() 2026"
git commit -m "feat: diagnostic par catégorie (16 catégories)"
git commit -m "feat: flux vendeur — mode guidé vs expert"
git commit -m "fix: logique réparations par critère spécifique"
```

## Livrable
Prototype fonctionnel — RNCP 34541 Bloc A4 — EEMI × Decathlon 2026
