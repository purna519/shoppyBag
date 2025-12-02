# ShoppyBag Frontend

This frontend is built with Vite + React and uses Bootstrap for styling. It connects to the backend API under `/api` by default.

Install and run
```powershell
cd C:\Users\kuram\Desktop\shoppyBag\shoppybag-frontend
npm install
npm run dev
```

To point to a different backend host set `VITE_API_HOST` before running:
```powershell
$env:VITE_API_HOST = 'http://localhost:8080'; npm run dev
```
