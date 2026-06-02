# Booking form → Google Sheet + email (setup)

Your website's booking form is ready to send every lead to a **Google Sheet**
(like your old Google Form) **and** email you at getauthenticcare@gmail.com.
Photos uploaded by the customer get saved to a Google Drive folder.

This uses **Google Apps Script** — free, no third-party signup, no monthly limit.
Do this once. ~15 minutes.

---

## Step 1 — Make the Google Sheet
1. Go to https://sheets.google.com and create a **blank** spreadsheet.
2. Name it something like **"Authentic Car Care — Leads"**.
   (You don't need to add any columns — the script adds them automatically.)

## Step 2 — Open the script editor
1. In that sheet, click the **Extensions** menu → **Apps Script**.
2. A code editor opens in a new tab. Delete whatever sample code is there.
3. Open the file `backend/google-apps-script.gs` from this project, copy **all**
   of it, and paste it into the editor.
4. Click the **save** icon (💾).

## Step 3 — Deploy it as a Web App
1. Top-right, click **Deploy** → **New deployment**.
2. Click the gear ⚙️ next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** anything, e.g. "booking catcher"
   - **Execute as:** **Me** (your email)
   - **Who has access:** **Anyone**   ← important
4. Click **Deploy**.
5. Google will ask you to **authorize**. Click through:
   - Choose your account → "Advanced" → "Go to (project name) (unsafe)" → Allow.
   - (This warning is normal — it's *your own* script asking to use *your* Sheet,
     email, and Drive. You're granting it to yourself.)
6. It shows a **Web app URL** ending in `/exec`. **Copy that URL.**

## Step 4 — Paste the URL into the website
1. Open `index.html`.
2. Near the top of the app code, find this line:

   ```
   const BOOKING_ENDPOINT = '';
   ```

3. Paste your URL inside the quotes:

   ```
   const BOOKING_ENDPOINT = 'https://script.google.com/macros/s/AKfy..../exec';
   ```

4. Save, commit, and it goes live. (Or just tell Claude the URL and it'll do this.)

---

## Test it
Open your live site, fill out the booking form, and submit. Within a few seconds:
- a new row appears in your Google Sheet,
- you get an email,
- any photos show up in a Drive folder called
  "Authentic Car Care — booking photos".

## If you change the script later
Apps Script → **Deploy** → **Manage deployments** → edit (pencil) →
**Version: New version** → Deploy. The URL stays the same.

## Notes
- The customer always sees the "Booking sent" message instantly, even if the
  send is still finishing in the background.
- Free Gmail sending limit is ~100 emails/day — far more than enough for leads.
- Want a copy of each lead emailed to a second address too? Tell Claude.
