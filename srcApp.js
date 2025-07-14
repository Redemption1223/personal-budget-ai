#!/bin/bash

echo "🏠 Setting up Personal Budget AI App..."

# Create React app
echo "📦 Creating React app..."
npx create-react-app personal-budget-ai
cd personal-budget-ai

# Copy the fixed App.js (you'll need to paste this manually)
echo "📝 Replace src/App.js with the fixed code from the artifact above"

# Install additional dependencies
echo "⬇️  Installing dependencies..."
npm install firebase

# Create PWA manifest
echo "📱 Setting up PWA..."
cat > public/manifest.json << 'EOF'
{
  "name": "Personal Budget AI",
  "short_name": "Budget AI",
  "description": "Smart budget management with AI-powered deals and meal planning",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "scope": "/",
  "icons": [
    {
      "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxwYXRoIGQ9Ik05NiA0OEM3OC4zMjcgNDggNjQgNjIuMzI3IDY0IDgwVjExMkM2NCAxMjkuNjczIDc4LjMyNyAxNDQgOTYgMTQ0UzEyOCAxMjkuNjczIDEyOCAxMTJWODBDMTI4IDYyLjMyNyAxMTMuNjczIDQ4IDk2IDQ4WiIgZmlsbD0id2hpdGUiLz4KPHA+dGggZD0iTTk2IDY0QzEwNC44MzcgNjQgMTEyIDcxLjE2MyAxMTIgODBWMTEyQzExMiAxMjAuODM3IDEwNC44MzcgMTI4IDk2IDEyOEM4Ny4xNjMgMTI4IDgwIDEyMC44MzcgODAgMTEyVjgwQzgwIDcxLjE2MyA4Ny4xNjMgNjQgOTYgNjRaIiBmaWxsPSIjNjY3ZWVhIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxOTIiIHkyPSIxOTIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzY2N2VlYSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K",
      "sizes": "192x192",
      "type": "image/svg+xml"
    },
    {
      "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxwYXRoIGQ9Ik0yNTYgMTI4QzIwOC4yMTggMTI4IDE3MCAxNjYuMjE4IDE3MCAyMTRWMjk4QzE3MCAzNDUuNzgyIDIwOC4yMTggMzg0IDI1NiAzODRTMzQyIDM0NS43ODIgMzQyIDI5OFYyMTRDMzQyIDE2Ni4yMTggMzAzLjc4MiAxMjggMjU2IDEyOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNTYgMTcwQzI3OS4xOTYgMTcwIDI5OCAxODguODA0IDI5OCAyMTJWMzAwQzI5OCAzMjMuMTk2IDI3OS4xOTYgMzQyIDI1NiAzNDJTMjE0IDMyMy4xOTYgMjE0IDMwMFYyMTJDMjE0IDE4OC44MDQgMjMyLjgwNCAxNzAgMjU2IDE3MFoiIGZpbGw9IiM2NjdlZWEiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwX2xpbmVhcl8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjUxMiIgeTI9IjUxMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNjY3ZWVhIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzc2NGJhMiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ]
}
EOF

# Add manifest link to index.html
echo "🔗 Adding PWA links to index.html..."
sed -i '/<title>/a\    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />\n    <meta name="theme-color" content="#667eea" />\n    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />' public/index.html

# Create service worker
cat > public/sw.js << 'EOF'
const CACHE_NAME = 'budget-ai-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
EOF

# Update package.json with deploy script
echo "⚙️ Adding deploy script..."
npm pkg set scripts.deploy="npm run build && npx vercel --prod"

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Replace src/App.js with the fixed code from above"
echo "2. Run: npm start (to test locally)"
echo "3. Run: npm run build (to build for production)"
echo "4. Run: npx vercel (to deploy to cloud)"
echo ""
echo "🌐 Your app will be available at: yourapp.vercel.app"
echo "📱 Users can add it to their phone home screen!"
echo ""
echo "🔥 To add real Firebase backend:"
echo "1. Create project at console.firebase.google.com"
echo "2. Replace mock auth with real Firebase config"
echo "3. Enable Authentication and Firestore"
