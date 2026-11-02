# Fix: No matching export DEMO

The old project had `import { DEMO } from '../services/api'` in four files. Removing the export alone caused the Vite dependency scanning error. This version **removes the DEMO imports, conditional branches and demo.js**.

Files updated:
- `frontend/src/services/api.js`
- `frontend/src/features/authSlice.js`
- `frontend/src/features/quizSlice.js`
- `frontend/src/components/Layout.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/services/demo.js` (deleted)
- `frontend/vite.config.js` (React plugin, no proxy)
- `frontend/package.json` (Vite 6 compatible React plugin)
- `frontend/.env` (only VITE_API_URL)

Running locally requires your original backend to be running and CORS to accept `http://localhost:5173`.

After replacing the frontend, run `npm install` and `npm run dev`. The original `AuthUser` backend is not included or modified.
