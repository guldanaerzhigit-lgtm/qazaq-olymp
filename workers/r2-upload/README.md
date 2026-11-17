# Qazaq Olymp R2 upload Worker

This Worker keeps the R2 bucket private and accepts uploads only from authenticated Firebase users whose Firestore profile has `role: "teacher"` or `role: "superadmin"`.

## Dashboard setup
1. In Worker Settings > Bindings, add the R2 bucket binding: variable `BUCKET`, bucket `qazaq-olymp-files`.
2. In Worker Settings > Variables and Secrets, add secret `FIREBASE_API_KEY` using the Firebase Web API key from the project's web app config.
3. Add variable `FIREBASE_PROJECT_ID` = `qazaq-olymp`.
4. Add variable `ALLOWED_ORIGIN` = the exact deployed Pages origin, for example `https://qazaq-olymp.pages.dev`. Add multiple exact origins separated by commas if needed.
5. Deploy the Worker.

## Endpoints
- `GET /health` — health check.
- `POST /upload` — authenticated teacher/superadmin upload. Send Firebase ID token in `Authorization: Bearer <token>`, file bytes as request body, and MIME type in `Content-Type`. Allowed: JPG, PNG, WEBP, PDF; max 10 MB.
- `GET /file/<encoded-key>` — authenticated file retrieval.

The Worker verifies Firebase ID tokens using Firebase Identity Toolkit and checks the user's own Firestore document at `users/{uid}`. That document must contain a string field `role` with value `teacher` or `superadmin`. Firestore rules must allow an authenticated user to read their own profile document. Never expose R2 credentials in the browser.

This Worker is intentionally separate from the Vite/Pages frontend. It does not use Firebase Storage.
