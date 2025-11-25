# Email Writer Assistant (Gmail + AI)

Tired of copying emails into ChatGPT/Gemini, describing what you want, then copy‑pasting the reply back into Gmail?

This project is a **Chrome extension + Spring Boot backend** that puts AI reply and improvement buttons **directly inside Gmail’s compose toolbar**. One click → context‑aware reply or improved draft, no copy‑paste needed.

---

## ✨ Features

### In Gmail (Chrome Extension)
- **AI Reply** button:
  - Reads the email you’re replying to
  - Generates a context‑aware reply
  - Supports tones:
    - `professional`
    - `casual`
    - `friendly`
    - `short` (short & direct)

- **Improve** button:
  - Takes your current draft and improves it
  - Modes:
    - `general`
    - `grammar`
    - `professional`
    - `concise`
    - `friendly`
    - `clarity`

- Buttons appear **inside Gmail’s compose toolbar** (no separate UI)

### Backend (Spring Boot)
- REST API to:
  - Generate replies: `POST /api/email/generate`
  - Improve drafts: `POST /api/email/improve`
- Uses **Google Gemini** (Generative Language API) under the hood
- Deployed on **Render** (Dockerized, Java 21, Spring Boot 4)

---

## 🧱 Tech Stack

- **Frontend (Extension)**
  - Chrome Extension **Manifest V3**
  - Content script injected into `mail.google.com`
  - Pure JS + CSS (no framework)
  - `fetch` calls to the backend

- **Backend**
  - Java 21
  - Spring Boot 4.x (Spring Web MVC)
  - `RestClient` (blocking HTTP client)
  - Jackson for JSON
  - Docker (Eclipse Temurin 21 JDK/JRE)
  - Deployed on **Render**

- **AI**
  - Google Gemini (e.g. `gemini-2.5-flash` via `generateContent`)

---

## 🖼 Demo

> TODO: Add a GIF / screenshot and optional video link.
> 
- Demo video(React+vite): https://1drv.ms/v/c/9ac9dee7a01ebf9b/EXBV94EoiiZApava6AfOzDsB0-cvBqjHhyVFahbiiCxZZw?e=QEq4Bo
- Demo video(extension):  https://1drv.ms/v/c/9ac9dee7a01ebf9b/EafpHp2C3stErbvqlniJaOIBhgbaetGt5i8ivxtx5_kGNg?e=PMGocm

---

## 🔗 Live Backend
The backend is hosted at: https://mailai-extension-3.onrender.com/api/email/setup


Chrome Extension – Installation (Developer Mode)
This is how someone can install the extension locally (e.g. your friends).

1.Download the ZIP

Google Drive link:
[Download extension ZIP] https://drive.google.com/drive/folders/1Mpu7NiJBpCuVPiUKF3pwbxDpITZxJJiJ?usp=drive_link

2.Unzip the folder

After unzipping, you should have something like:
extension/
  manifest.json
  content.js
  content.css

3.Load in Chrome

Open Chrome and go to: chrome://extensions
Turn on Developer mode (top-right toggle)
Click “Load unpacked”
Select the unzipped folder (the one containing manifest.json)

4.Use in Gmail

Open https://mail.google.com in Chrome
Refresh the page
Click Reply or Compose
You should see “AI Reply” and “Improve” buttons in the Gmail compose toolbar
