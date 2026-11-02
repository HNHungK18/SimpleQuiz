# SimpleQuiz Assignment 4: Frontend + your actual Assignment 3

## What was verified against the AuthUser.rar source

- Backend runs with `npm start` from the **existing Assignment 3 AuthUser folder**.
- `POST /users/register` accepts `{ username, password, isAdmin }`. React signup always sends `isAdmin:false`; Admin accounts created locally via Postman only.
- `POST /users/login` returns `{ token, user: { _id, username, isAdmin } }`.
- All Question API endpoints are `/question` (singular), not `/questions`.
- `GET /quizzes` and `GET /quizzes/:quizId` already populate `questions`.
- `GET /quizzes/:quizId/populate` filters for questions whose text matches `capital`, so the frontend does NOT use it.
- Question edit/delete require the logged-in author, including for an Admin account.
- Quiz create/edit/delete require Admin token.
- Add existing questions is implemented from the frontend via `GET /quizzes/:id` followed by admin-only `PUT /quizzes/:id`, because the A3 specialized endpoint has a missing import.

## Local run (no modification to the graded backend needed)

1. Start MongoDB.
2. In your existing Assignment 3 folder `AuthUser`, run `npm install` if needed, then `npm start` (port 3000).
3. In **this package** `frontend`, run `npm install` then `npm run dev`.
4. Open http://localhost:5173.

`frontend/.env` contains:

```env
VITE_API_URL=http://localhost:3000
```

Axios calls the backend directly at `http://localhost:3000`. Set `FRONTEND_URL=http://localhost:5173` in the backend `.env` and enable CORS before your Express routes.

**No Admin checkbox on React signup:** it creates ordinary users only. To create an Admin for your class demo use Postman `POST http://localhost:3000/users/register` with `isAdmin:true`. Do not expose that public registration behavior on a public deployment.

## Production deployment

- Deploy MongoDB to Atlas and Express to a Node hosting service, React/Vite to Vercel.
- Set frontend `VITE_API_URL=https://your-api-domain` **on Vercel**, then rebuild.
- Enable restricted Express CORS for your Vercel frontend domain. See `BACKEND_A3_OPTIONAL_FIXES.md`.
- Set MongoDB URI and JWT_SECRET only on the backend. Do not commit `.env` credentials or upload `node_modules`.

## Limitations inherited from A3

- A3 returns `correctAnswerIndex` in GET endpoints. For a class project the frontend can score answers locally; do not use that for a security-sensitive exam.
- A3 stores Quiz title, description and question IDs. It has no category field, score history, or dedicated grading endpoint. Frontend does not claim these are persisted.
- The Quiz PUT-based attach operation can overwrite concurrent quiz edits; suitable for single-admin class demo. Adding the missing `mongoose` import lets you restore the more robust POST endpoint later.
- Real runtime integration against your database has not been performed in this environment. Use Postman and browser DevTools to verify requests.
