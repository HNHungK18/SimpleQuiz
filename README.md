# SimpleQuiz Assignment 4 – React + Redux + Bootstrap 5

React frontend connects directly to your **existing Assignment 3 AuthUser backend**. It does not include or change the graded backend. Demo Mode has been removed.

## Local development

1. Start MongoDB and your existing `AuthUser` backend (`npm start`) on port `3000`.
2. In the backend `.env`, set `FRONTEND_URL=http://localhost:5173` and ensure Express has `cors` enabled before the routes.
3. In `frontend/.env`, set `VITE_API_URL=http://localhost:3000`.
4. From the `frontend` folder run `npm install` and `npm run dev`.
5. Open `http://localhost:5173`.

Frontend uses Redux Toolkit, React Router, Axios, Bootstrap 5 and Vite 6; `@vitejs/plugin-react@^4.3.4` supports Vite 6.

For endpoint mapping, security caveats and production deployment see `INTEGRATION_GUIDE.md`.
