# Relationship Wrapped ❤️

Transform your chat history into a beautiful, interactive "Spotify Wrapped" style experience. 

This project takes your exported WhatsApp (or other) chat data and visualizes your relationship's journey—the late-night talks, the memes, the "I love you"s, and everything in between.

## ✨ Features

- **The Stats**: See who texts more, your busiest months, and your "vibe" analysis.
- **Time Machine**: Search through your entire history to find that one specific memory.
- **On This Day**: Relive what happened exactly 1, 2, or 5 years ago today.
- **The Gallery**: A curated collection of your shared photos.
- **Interactive Map**: Pinpoint the meaningful places in your story.

## 🚀 How to Make It Yours

This is a template. To see *your* relationship wrapped, you'll need to feed it your data.

### 1. Export Your Chat
Export your chat history (e.g., from WhatsApp) as a `.txt` or `.json` file.

### 2. Format Your Data
The app expects a `data.json` file in the `public` folder with the following structure:

```json
{
  "meta": {
    "total_messages": 15000,
    "start_date": "2023-01-01",
    "end_date": "2024-01-01"
  },
  "wrapped": {
    "sweetest": [ ... ],
    "funniest": [ ... ],
    "timeline": [ ... ]
  },
  "search_index": [
    {
      "timestamp": "2023-05-20 10:00:00",
      "message": "I love you",
      "sender": "Me"
    }
  ]
}
```

(Check `public/data.json` for the exact dummy example!)

### 3. Run It Locally

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and watch your story unfold.

## 🔒 Privacy Note

Your data stays on your machine. This is a local-first application. If you deploy it, ensure you password-protect it or keep the URL private, as it contains your personal conversation history.

---

Made with 💖 for love.
