# YERL — Young Engineering Robotics Lab

A bilingual (EN/RU), responsive robotics education website. Built with plain HTML, CSS, JavaScript and a tiny Node.js static generator. **No npm dependencies or database.**

## What works in v1

- English and Russian website, with language switching and distinct URLs.
- Home, Articles, Learn, Olympiad Prep, Resources, Quizzes and About.
- Article catalogue with instant search and topic filters.
- Individual article pages, structured for search engines.
- Downloadable PDF resources (sample English and Russian guides included).
- Interactive, self-scoring quizzes. Quiz answers stay in the visitor's browser.
- A mobile navigation menu and responsive design.
- **Pages CMS visual editor**, configured in `.pages.yml`. Edit articles, resources, and quizzes without editing website code.
- Optional SEO sitemap, canonical URLs and hreflang when `SITE_URL` is set.

## Step 1 — Open YERL on your own computer

1. Install Node.js 20+ from <https://nodejs.org/> and install VS Code if needed.
2. Unzip this folder and open it in VS Code (`File > Open Folder`).
3. Open the terminal in VS Code (`Terminal > New Terminal`).
4. Run:

   ```bash
   npm run dev
   ```

5. Open <http://localhost:4173/en/> in your browser. Russian version: <http://localhost:4173/ru/>.
6. Stop the local server with `Ctrl+C`.

If you change code/content locally, stop and restart `npm run dev` to rebuild your pages.

You can also generate the final static files using `npm run build`; they appear in the `dist/` folder.

## Step 2 — Upload to GitHub

Create a new GitHub repository, for example `yerl-website`. Avoid adding another README in GitHub because this folder already contains one. Then in VS Code terminal:

```bash
git init
git add .
git commit -m "Create YERL website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/yerl-website.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Sign in when GitHub asks. Alternatively, upload the **source project** through the GitHub website (including the hidden file `.pages.yml`). `dist/` is generated and excluded by `.gitignore`.

## Step 3 — Publish free on Cloudflare Pages

1. Open <https://dash.cloudflare.com/> and sign in.
2. Go to **Workers & Pages > Create application > Pages > Import an existing Git repository** (menu labels may change).
3. Authorize GitHub and choose `yerl-website`.
4. Configure:
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: repository root
5. Deploy. Cloudflare will assign a public `YOUR_PROJECT.pages.dev` address; you do **not** need to buy a domain yet.
6. Opening that address will redirect to the English YERL homepage, and `/ru/` will show the Russian version.

Cloudflare automatically rebuilds the website after commits to the connected branch, including changes made through Pages CMS.

## Step 4 — Publish articles through a visual editor

1. Open <https://app.pagescms.org/>.
2. Log in with GitHub and install/authorize the Pages CMS GitHub App for **your specific repository**.
3. Open `yerl-website`. Pages CMS will read the existing `.pages.yml` settings.
4. Open **Articles (English)** or **Статьи (Русский)** and create an entry.
5. Enter:
   - **Slug**: URL-safe English characters, e.g. `motor-speed-control` (required).
   - Title, description, category, difficulty, date, reading time.
   - **Article contents**: write and format using the rich-text editor. You can insert images.
   - Turn on **Publicly visible** when the article is ready.
6. Save the entry. Pages CMS writes a JSON file to the GitHub repository. Cloudflare rebuilds the site. The article appears at `/en/articles/motor-speed-control/` or `/ru/articles/motor-speed-control/`.
7. To create a matching article in the second language, give it the **same slug**. That makes the language-switcher open the corresponding translation.

**Important:** A saved article may need a minute or two to appear because the hosting service builds a new static version after each change. You may edit the sample articles or delete them.

### Uploading a PDF or ZIP

In Pages CMS, open **Downloads (English)** or **Файлы (Русский)**. Create a resource with a title, description, category and slug, then upload a file in the **file** field. Toggle `published` on and save. Files are stored under `public/files` and become downloadable from `/files/...`. Static assets on Cloudflare Pages have a file size limit (check their current documentation if you plan to host large archives).

### Creating a quiz without code

In **Quizzes (English)** / **Тесты (Русский)**, create a quiz and add questions. For each question, enter the possible choices and a **1-based correct option number** (1 = first option, 2 = second, etc.), then an explanation. Visitors will see a score and explanations after completing the quiz. No user accounts or server storage are involved.

## Step 5 — Make Google discover YERL

Once your Cloudflare site is live:

1. Open your Cloudflare Pages project settings.
2. Add an environment variable for production builds:

   ```text
   SITE_URL=https://YOUR_PROJECT.pages.dev
   ```

   Enter your **real published URL**, without a trailing slash. Never use the literal example address.
3. Redeploy the project. The generator will create `https://YOUR_PROJECT.pages.dev/sitemap.xml`, and page URLs will have correct canonical and language-alternate tags.
4. Open <https://search.google.com/search-console/about>, add your website, follow Google's site-ownership verification instructions, and submit `sitemap.xml`.
5. Publish genuinely useful articles. Search visibility takes time, and Google does not guarantee indexing or rankings.

When you later buy a custom domain, connect it in Cloudflare Pages, update `SITE_URL`, and redeploy. Submit the new sitemap in Search Console. Search results may take time to reflect the move.

## Project structure

```text
YERL_website/
├── .pages.yml                  # Visual-editor configuration
├── package.json               # Build and local preview scripts
├── scripts/
│   ├── build.mjs              # Generates static pages, search and sitemap
│   └── serve.mjs              # Local development preview
├── assets/
│   ├── style.css              # All visual styling
│   ├── site.js                # Search, mobile menu, quizzes
│   └── hero.svg               # Illustration in home hero
├── content/
│   ├── articles/{en,ru}/      # Editable article JSON files
│   ├── resources/{en,ru}/     # Editable download listings
│   └── quizzes/{en,ru}/       # Editable quiz questions
├── public/
│   ├── files/                 # Downloadable PDF and other files
│   ├── images/                # Uploaded images
│   └── favicon.svg
└── dist/                      # Generated site (not committed to Git)
```

## Practical notes

- Each article belongs to a single category. You can extend `CATEGORIES` in `scripts/build.mjs` and the selectors in `.pages.yml` together.
- Only people you authorize in your GitHub / Pages CMS should be able to edit and publish content. **Visitors cannot publish or upload files.**
- Avoid publishing your personal address, school schedule, phone number or other private contact details on a public website.
- The v1 catalogue searches article titles, descriptions and categories, not the complete article text. It is a client-side filter, not a hosted search engine.
- Preview and editor authentication were not connected to a live GitHub/Cloudflare account during development, so test the editor publishing flow after you deploy.
- This project has no visitor accounts, newsletter collection, advertising trackers or analytics in v1.

## Quick change guide

- Change colours, typography, layout: `assets/style.css`.
- Change text in the home page, navigation or static sections: `scripts/build.mjs` (see the `I` language dictionaries).
- Add an article: use Pages CMS, or create `content/articles/en/example.json` with `slug`, `title`, `description`, `category`, `published`, and `body` (HTML).
- Add a PDF: through Pages CMS or put the file in `public/files` and create a resource entry.
- Add or edit quiz questions: Pages CMS, Quizzes section.

YERL is an independent educational site, not an official competition platform.
#   y e r l - w e b s i t e  
 