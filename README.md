# NovaReach Digital Agency Website

Static site (HTML/CSS/JS) + one Vercel serverless function.

## Deploy
1. Push this folder to a GitHub repo.
2. Vercel > Add New Project > import the repo (Framework: Other, no build command).
3. Settings > Environment Variables: add `N8N_WEBHOOK_URL` = your n8n Webhook node (Production URL), then redeploy.

## n8n
Webhook node: method POST. Payload fields: type ("contact" or "meeting"), name, email, phone, service, message, date, time, topic, source, submittedAt.
Use an IF node on `type` to send contact leads and meeting bookings to different paths (Sheets, email, Slack, calendar).

## Local test
`npx vercel dev` (the /api route does not work if you just double-click index.html).
