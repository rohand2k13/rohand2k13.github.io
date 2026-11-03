# Rohan's personal website

A light, fast personal site with:

- **Social shortcuts**: LinkedIn (featured), Instagram, Facebook
- **Gmail links**: "Open inbox" for you, plus "Email me" and "Compose in Gmail" for visitors
- **Today's briefing**: India, World, Politics, Markets, Travel and Geography headlines, refreshed every hour
- **Blog**: long essays (each on its own page) and short notes (shown in full)

It's hosted free on **GitHub Pages**, and it stays online permanently. You don't need to run a server or keep your computer on.

---

## Part 1: Put it online (about 15 minutes, one time)

### 1. Create a GitHub account
Go to **github.com** → **Sign up**. Pick your username carefully because it becomes part of your address. For example, the username `rohand2k13` gives `https://rohand2k13.github.io`.

### 2. Create the repository
1. Click **+** (top right) → **New repository**.
2. **Repository name**: type `YOURUSERNAME.github.io` (for example `rohand2k13.github.io`). With this exact name, the site lives at the root address with nothing after the slash.
3. Choose **Public**. Free GitHub Pages needs a public repository. Only the site's files are public, never your accounts.
4. Click **Create repository**.

### 3. Upload the files
1. Unzip `rohan-site.zip` on your computer.
2. In the new repository, click **uploading an existing file**.
3. Open the unzipped folder, select **everything inside it**, and drag it into the browser. Drag the contents, not the folder itself.
4. Click **Commit changes**.

> ⚠️ **The hidden `.github` folder.** Mac and Windows hide folders whose names start with a dot, so this folder often doesn't get uploaded. Check that it made it:
> In the repository, look for a `.github` folder. If you can't see it, do this:
> **Add file → Create new file** → in the name box type `.github/workflows/deploy.yml` (the slashes create the folders) → paste in everything from the `deploy.yml` file inside the zip → **Commit changes**.

### 4. Turn on GitHub Pages
1. In the repository: **Settings → Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

### 5. Publish
1. Open the **Actions** tab. If GitHub asks, click **I understand… enable workflows**.
2. Click **Build and publish site** → **Run workflow** → **Run workflow**.
3. Wait about a minute for the green tick. Your site is live at **https://YOURUSERNAME.github.io**.

From now on the site rebuilds itself **every hour** to pull in fresh news. It also rebuilds whenever you change a file.

---

## Part 2: Use your own domain, like `rohan.in` (optional, about ₹500–1,000 a year)

1. Buy a domain from any registrar, such as Cloudflare, Namecheap, GoDaddy or Hostinger.
2. In the registrar's **DNS settings**, add these records:

   | Type  | Name / Host | Value                    |
   |-------|-------------|--------------------------|
   | A     | @           | 185.199.108.153          |
   | A     | @           | 185.199.109.153          |
   | A     | @           | 185.199.110.153          |
   | A     | @           | 185.199.111.153          |
   | CNAME | www         | YOURUSERNAME.github.io   |

3. On GitHub: **Settings → Pages → Custom domain** → type your domain → **Save**.
4. Wait for the DNS check to pass. This usually takes minutes but can take a few hours. Then tick **Enforce HTTPS**.

---

## Part 3: Everyday use, all from the GitHub website (works on your phone too)

### Write a blog post
1. Open the `posts` folder → **Add file → Create new file**.
2. Name it like `2026-11-05-my-post.md`.
3. Paste in this template and write:

   ```
   ---
   title: My post title
   date: 2026-11-05
   type: long
   tags: [travel, wildlife]
   ---
   Your writing goes here. Leave a blank line between paragraphs.
   ```

   Use `type: short` for a quick note.
4. Click **Commit changes**. The post is live in about a minute.

The sample post `how-to-post` explains formatting, photos and drafts. Delete both sample posts once you've written your own.

### Add photos to a post
Open the `images` folder → **Add file → Upload files**. Then put this line in your post: `![description](images/photo-name.jpg)`.

### Change your links, emails or intro text
Edit **`config.js`**: click it → pencil icon → change → **Commit changes**.
- Check that each social link opens **your** profile. LinkedIn profile addresses in particular can differ from your handle.
- To add a second Gmail account, copy the email line. Set `showPublicly: false` on any address you don't want visitors to see. That address will still appear in your **Open inbox** shortcut.

### Change the news topics
Edit **`scripts/feeds.json`**. Each tab uses a Google News search, so you can change the `query` text to anything you'd type into Google News.

---

## How the news works
- **Live, per tab:** when a visitor opens a tab, the site fetches that topic's latest Google News headlines right then. A green **Live** dot shows the headlines are fresh. The ↻ button fetches again.
- **Hourly saved copy as backup:** browsers can't read Google News feeds directly, so live fetching goes through free public relays (allorigins.win, then rss2json.com). If both are slow or down, the tab shows the copy saved at the last hourly rebuild, labelled "Saved copy · 40m ago".

## Good to know
- **News pauses if the repository is idle for 60 days.** GitHub stops hourly jobs on repositories with no changes for 60 days and emails you when it does. Posting anything, or clicking **Enable workflow** in the Actions tab, restarts it.
- **Cost:** GitHub hosting is free. The only optional cost is a custom domain.
- **Preview on your computer (optional):** install Node.js, then run `npm install` and `npm run preview` in this folder.
