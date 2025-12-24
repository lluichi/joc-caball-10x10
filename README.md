# 🐴 El Passeig del Cavall (Knight's Tour)

Un joc interactiu de taulell 10x10 on has de moure un cavall d'escacs visitant el màxim nombre de caselles sense repetir cap.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Com jugar

1. Clica qualsevol casella per col·locar el cavall (torn 1)
2. Mou el cavall en forma de **L** (com als escacs)
3. Les caselles **verdes** mostren els moviments vàlids
4. Les caselles **vermelles** indiquen moviments no permesos
5. El joc acaba quan no tens cap moviment disponible
6. Si aconsegueixes una puntuació TOP 10, podràs guardar el teu nom!

## 🚀 Execució en local

### Requisits previs

- [Node.js](https://nodejs.org/) (versió 18 o superior)
- npm (inclòs amb Node.js)

### Instal·lació

```bash
# Clona el repositori
git clone <url-del-repositori>
cd joc-cavall-10x10

# Instal·la les dependències
npm install
```

### Execució en mode desenvolupament

```bash
npm run dev
```

Obre el navegador a `http://localhost:5173`

### Compilació per producció

```bash
npm run build
```

Els fitxers compilats es generaran a la carpeta `dist/`.

### Previsualitzar la versió de producció

```bash
npm run preview
```

## 🌐 Publicació a la web

### Opció 1: GitHub Pages (Gratuït)

1. **Configura la base URL** a `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/nom-del-repositori/',  // Afegeix aquesta línia
})
```

2. **Instal·la gh-pages**:

```bash
npm install -D gh-pages
```

3. **Afegeix scripts** a `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. **Publica**:

```bash
npm run deploy
```

El joc estarà disponible a: `https://<usuari>.github.io/<nom-repositori>/`

---

### Opció 2: Netlify (Gratuït)

#### Via interfície web:
1. Ves a [netlify.com](https://netlify.com) i crea un compte
2. Clica "Add new site" → "Import an existing project"
3. Connecta amb el teu repositori de GitHub
4. Configura:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Clica "Deploy site"

#### Via CLI:
```bash
# Instal·la Netlify CLI
npm install -g netlify-cli

# Compila el projecte
npm run build

# Publica
netlify deploy --prod --dir=dist
```

---

### Opció 3: Vercel (Gratuït)

#### Via interfície web:
1. Ves a [vercel.com](https://vercel.com) i crea un compte
2. Clica "Add New" → "Project"
3. Importa el repositori de GitHub
4. Vercel detectarà automàticament que és un projecte Vite
5. Clica "Deploy"

#### Via CLI:
```bash
# Instal·la Vercel CLI
npm install -g vercel

# Publica (segueix les instruccions)
vercel
```

---

### Opció 4: Servidor propi

1. **Compila el projecte**:
```bash
npm run build
```

2. **Puja la carpeta `dist/`** al teu servidor web (Apache, Nginx, etc.)

3. **Configura el servidor** per servir una SPA (Single Page Application):

**Nginx** (`nginx.conf`):
```nginx
location / {
    root /path/to/dist;
    try_files $uri $uri/ /index.html;
}
```

**Apache** (`.htaccess` dins de `dist/`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 📁 Estructura del projecte

```
joc-caball-10x10/
├── public/              # Fitxers estàtics
├── src/
│   ├── components/      # Components React
│   │   ├── Board.jsx    # Taulell del joc
│   │   ├── Cell.jsx     # Caselles individuals
│   │   ├── Controls.jsx # Botons de control
│   │   ├── Ranking.jsx  # Modal del rànquing
│   │   └── GameOverModal.jsx  # Modal de fi de joc
│   ├── App.jsx          # Component principal
│   ├── App.css          # Estils principals
│   ├── index.css        # Estils globals
│   └── main.jsx         # Punt d'entrada
├── index.html           # HTML principal
├── package.json         # Dependències
└── vite.config.js       # Configuració de Vite
```

## ⚙️ Funcionalitats

- ✅ Taulell 10x10 interactiu
- ✅ Moviment del cavall en L (escacs)
- ✅ Indicadors visuals de moviments vàlids/invàlids
- ✅ Comptador de torns
- ✅ Botó per desfer l'últim moviment
- ✅ Botó per reiniciar la partida
- ✅ Rànquing TOP 10 (guardat amb localStorage)
- ✅ Disseny responsiu per a mòbils
- ✅ Interfície en català

## 🛠️ Tecnologies

- [React 19](https://react.dev/)
- [Vite 7](https://vite.dev/)
- CSS3 amb animacions

## 📝 Llicència

MIT License - Lliure per a ús personal i comercial.
