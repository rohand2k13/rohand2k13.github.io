// ─────────────────────────────────────────────────────────────
//  YOUR SITE SETTINGS — edit this file to change what the site shows.
//  (You can edit it directly on GitHub: open the file → pencil icon → Commit.)
// ─────────────────────────────────────────────────────────────
window.SITE = {
  name: "Rohan Dutta",
  handle: "rohand2k13",
  role: "Engineer · Traveller · Writer",
  company: "",

  // Shown under the name at the top: home city and work city
  places: [
    { code: "CCU", city: "Kolkata", kind: "home" },
    { code: "MAS", city: "Chennai", kind: "work" }
  ],

  // Mentoring (Topmate): shown as a button in the intro card and a row in "Follow me"
  mentor: {
    url: "https://topmate.io/rohand2k13",
    button: "Book a free 1:1",
    label: "Topmate",
    note: "Free 1:1 for students"
  },

  // Your GitHub username: powers the "People who follow me" panel
  githubUser: "rohand2k13",

  // Profile picture for your notes feed. Upload a square photo to the images folder
  // and put its path here, e.g. "images/me.jpg". Leave empty to show your initials.
  avatar: "",

  headline: "A wireless communication engineer, by vocation and avocation.",
  intro: "I build the protocol software behind Wi‑Fi. Off the clock: wildlife, photography, slow travel and the essays that come out of it.",

  // About card — two short lines
  about: [
    "I build Wi‑Fi protocol software at Qualcomm.",
    "M.Tech in EC, IIT Kharagpur."
  ],

  // "Beyond work" chips
  beyond: ["Wildlife & photography", "Travel writing", "Toastmasters", "Table tennis", "Pool", "Music", "Reading", "Cricket", "Snooker", "Premier League"],

  // Social shortcuts — shown in this order. Check each link opens YOUR profile.
  socials: [
    { name: "LinkedIn",  url: "https://www.linkedin.com/in/rohan2k13/", featured: true },
    { name: "Instagram", url: "https://www.instagram.com/rohand2k13/" },
    { name: "Facebook",  url: "https://www.facebook.com/rohand2k13" },
    { name: "X",         url: "https://x.com/rohand2k13", follow: "https://x.com/intent/follow?screen_name=rohand2k13" },
    { name: "GitHub",    url: "https://github.com/rohand2k13", tile: false }  // header icon only; has its own Follow button
  ],

  // Email. Hidden for now. To show an "Email me" box, set showPublicly: true.
  // showGmailShortcut: true adds an "Open inbox" tile and header icon (only works for you when signed in).
  showGmailShortcut: false,
  emails: [
    { label: "Personal Gmail", address: "rohand2k13@gmail.com", showPublicly: false }
  ]
};
