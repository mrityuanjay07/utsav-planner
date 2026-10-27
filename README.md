# Utsav Planner

An event planning assistant for weddings, birthdays and community events. Enter your date, guests, budget (in rupees), programme and your main worry. The app returns a budget split, a week-by-week timeline, vendor questions, a checklist, ideas and advice.

## Features

- Event types: wedding, birthday, community event
- Plan updates as you type, with plain messages when something is missing
- Tap-to-add common worries (tight budget, guest list, family opinions, time, weather)
- Solutions tab: advice for your situation
- Budget split with a spent-or-quoted tracker
- Timeline that counts back from your event date
- Vendor list with book-by dates, status and questions to ask
- Checklist with progress and your own tasks
- Ideas matched to your programme and budget
- Ask Claude tab for a tailored plan
- Copy, download or print the whole plan
- Light and dark theme. Your data stays in your browser (localStorage).

## Project structure

```
utsav-planner/
├── index.html        Page structure
├── css/style.css     Styles, light/dark theme, print styles
├── js/
│   ├── data.js       Budget splits, timelines, checklists, ideas
│   ├── logic.js      State, budget calculation, advice rules
│   ├── views.js      Tab screens, AI prompt, call to /api/ask
│   └── app.js        Buttons, live updates, plan export
├── api/ask.js        Serverless function that calls the Claude API
├── .env.example      Names of the settings you need
└── README.md
```

## Run locally

Open `index.html` in a browser. Everything works except live AI answers. To test those too, use Vercel's dev server:

```
npm i -g vercel
vercel dev
```

## Publish with live AI answers (Vercel, free tier)

1. Push this folder to a GitHub repository.
2. Go to vercel.com, choose **Add New → Project**, and import the repository. Keep the default settings.
3. Under **Settings → Environment Variables**, add `ANTHROPIC_API_KEY` with your key from console.anthropic.com. Redeploy.
4. Your site is live, and the Ask Claude tab now answers.

The key stays on the server in `api/ask.js`. Never put it in any file under `js/`.

`api/ask.js` limits each visitor to 15 requests per 10 minutes and caps the prompt length. Set a spending limit on your Anthropic account as well.

## Publish without AI (GitHub Pages, free)

1. Push the folder to GitHub.
2. Open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
3. The site goes live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

On GitHub Pages the Ask Claude tab shows a short message and a **Copy my brief** button, so people can paste their details into a Claude chat. Every other feature works.
