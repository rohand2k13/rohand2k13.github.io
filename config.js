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

  // Topmate: shown as a row in "Follow me"
  mentor: {
    url: "https://topmate.io/rohand2k13",
    label: "Topmate",
    note: "@rohand2k13"
  },

  // Your GitHub username: powers the "People who follow me" panel
  githubUser: "rohand2k13",

  // Profile picture for your notes feed. Upload a square photo to the images folder
  // and put its path here, e.g. "images/me.jpg". Leave empty to show your initials.
  avatar: "images/rohan-v2.jpg",

  headline: "A wireless communication engineer, by vocation and avocation.",
  intro: "I build the protocol software behind Wi‑Fi. Off the clock: wildlife, photography, slow travel and the essays that come out of it.",

  // About card — two short lines
  about: [
    "I build Wi‑Fi protocol software at Qualcomm.",
    "M.Tech in EC, IIT Kharagpur."
  ],

  // Full "About me" page (#/about). One string per paragraph.
  aboutLong: [
    "I am Rohan Dutta, an engineer and technology enthusiast currently working as an Engineering Manager and Wi-Fi protocol stack developer at Qualcomm. My work involves developing and architecting next-generation Wi-Fi technologies, with a focus on wireless networking, WLAN protocols and security. I enjoy exploring emerging technologies and contributing to the evolution of wireless communication systems.",
    "Academically, I hold a Master's degree in Electronics and Electrical Communication Engineering from the Indian Institute of Technology (IIT), Kharagpur, with a specialisation in Telecommunications Systems. I also hold a Bachelor's degree in Electronics and Communication Engineering.",
    "Beyond technology and engineering, I have a keen interest in science, history, geography and current affairs. I enjoy travelling, particularly exploring places rich in natural beauty, wildlife and cultural heritage. Reading, music and photography are among my other interests. I am also an enthusiastic Toastmaster and enjoy public speaking and exchanging ideas.",
    "This website is a little space to bring together some of my interests, experiences, thoughts and explorations."
  ],

  // "Beyond work" chips
  beyond: ["Wildlife & photography", "Travel writing", "Toastmasters", "Table tennis", "Pool", "Music", "Reading", "Cricket", "Snooker", "Premier League"],

  // Social shortcuts — shown in this order. Check each link opens YOUR profile.
  socials: [
    { name: "LinkedIn",  url: "https://www.linkedin.com/in/rohand2k13/", featured: true },
    { name: "Instagram", url: "https://www.instagram.com/rohand2k13/" },
    { name: "Facebook",  url: "https://www.facebook.com/rohand2k13" },
    { name: "X",         url: "https://x.com/rohand2k13", follow: "https://x.com/intent/follow?screen_name=rohand2k13" },
    { name: "GitHub",    url: "https://github.com/rohand2k13", tile: false }  // header icon only; has its own Follow button
  ],

  // Public contact email: shown as an "Email" row in "Follow me".
  // (Other addresses on your domain, like admin@, are set up in the forwarding
  // service only and never listed here.)
  showGmailShortcut: false,
  emails: [
    { label: "Email", address: "mail@rohand2k13.com", showPublicly: true }
  ]
};
