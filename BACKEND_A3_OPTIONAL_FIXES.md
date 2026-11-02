# Optional backend fixes in the separate original Assignment 3 folder

You do **not** need to apply these fixes to run Assignment 4 locally with Vite proxy.

### 1. Make POST /quizzes/:id/existing-questions work

At the top of `controllers/quizController.js`, add:

```js
const mongoose = require('mongoose');
```

Your `addExistingQuestions` function calls `mongoose.isValidObjectId()` and otherwise throws `ReferenceError: mongoose is not defined`. The frontend package deliberately uses the existing Quiz PUT endpoint instead, so this patch is optional.

### 2. Fix batch creation of questions (optional)

`addManyQuestionsToQuiz` calls `Question.insertMany(req.body)` without assigning `author`. Your Question schema requires `author`. Map each input question to `{ ...q, author: req.user._id }` after validating the request and excluding unsafe fields.

### 3. CORS when frontend and backend are deployed on different domains

Install `cors` in the A3 backend: `npm install cors`.

In `app.js`, before `app.use('/quizzes', ...)`:

```js
const cors = require('cors');
app.use(cors({ origin: process.env.FRONTEND_URL }));
```

Set the backend environment variable `FRONTEND_URL` to the full Vercel origin, e.g. `https://your-quiz.vercel.app`. Allow only your actual frontend origin rather than `*`.

### 4. Security caution for public deployment

A3 currently allows anyone to register an Admin with `isAdmin: true` in `POST /users/register`. This is appropriate only for a controlled classroom exercise. Before putting the API on the public Internet, disable admin self-registration, require an authorization check, or pre-create an Admin securely.

### 5. Quiz game scoring

The A3 Quiz GET response includes `correctAnswerIndex`; the React app calculates scores client-side. For production assessments, grade on the server and do not return answer keys before submission.
