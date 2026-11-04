---
title: How to publish a post on this site
date: 2026-11-01
type: long
tags: [guide]
summary: A template essay — copy this file, change the top lines, write below them, and commit. Delete it once you've posted your first real piece.
---
Every post is one text file in the **posts** folder. The block at the top between the `---` lines tells the site about the post:

- **title** — the headline
- **date** — written as `YYYY-MM-DD`, or `YYYY-MM-DD HH:MM` (India time) so notes show "2h ago"; newest first
- **type** — `long` for an essay with its own page, `short` for a quick note shown in full on the blog
- **tags** — optional, like `[travel, wildlife]`
- **summary** — optional one-line teaser for the essay card
- **cover** — optional picture, e.g. `images/bandipur.jpg`
- **draft** — set to `true` to keep a post hidden

## Writing the body

Below the second `---`, just write. A blank line starts a new paragraph. Use `##` for a subheading, `**bold**`, `*italics*`, and `> ` at the start of a line for a pull quote.

> Pull quotes look like this.

To add a photo, upload it into the **images** folder, then write `![a short description](images/your-photo.jpg)` on its own line.

## Publishing

Commit the file on GitHub. In about a minute the site rebuilds and the post is live.
