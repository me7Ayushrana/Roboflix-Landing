# Google Form Webhook Integration

This API endpoint (`/api/free-trial-webhook`) processes incoming webhook requests from the Google Form to provision free trial credentials in Supabase.

To make this flow work smoothly, you must set up a Google Apps Script on the Google Sheet connected to your Google Form.

## Setup Instructions

### 1. Link Form to Google Sheet
1. Open your Google Form: [Start Robotics in 2026](https://forms.gle/RgDMJBtXSA5TE3B69).
2. Go to the **Responses** tab.
3. Click the green **Link to Sheets** icon to create or open the connected Google Sheet.

### 2. Add Google Apps Script
1. In the connected Google Sheet, click **Extensions** -> **Apps Script** in the top menu.
2. Delete any boilerplate code inside the editor.
3. Copy and paste the script below into the editor.
4. Replace `https://your-site.vercel.app` in the `WEBHOOK_URL` variable with your actual deployed website domain (or your ngrok public URL if testing localhost).
5. Click the **Save** (disk) icon or press `Cmd+S` / `Ctrl+S`.

### 3. Configure form submit trigger
1. Click the **Triggers** icon (clock shape) on the left sidebar of the Apps Script dashboard.
2. Click **+ Add Trigger** in the bottom right corner.
3. Configure the trigger settings:
   - **Choose which function to run:** `onFormSubmit`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `From spreadsheet`
   - **Select event type:** `On form submit`
   - **Failure notification settings:** `Notify me daily`
4. Click **Save**.
5. Grant permissions: A popup will request authorization. Click your Google account, click **Advanced**, click **Go to Untitled project (unsafe)** or your project name, and click **Allow**.

---

## Google Apps Script Template

```javascript
// Change this to your deployed domain + /api/free-trial-webhook
const WEBHOOK_URL = "https://your-deployed-domain.vercel.app/api/free-trial-webhook";

function onFormSubmit(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowValues = range.getValues()[0];
    
    let email = "";
    let phone = "";
    
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i].toString().toLowerCase().trim();
      const val = rowValues[i] ? rowValues[i].toString().trim() : "";
      
      // Matches standard field names containing 'email', 'mail', 'phone', 'mobile', 'number', 'whatsapp'
      if (header.includes("email") || header.includes("mail")) {
        email = val;
      } else if (
        header.includes("phone") || 
        header.includes("mobile") || 
        header.includes("contact") || 
        header.includes("whatsapp") || 
        header.includes("number")
      ) {
        phone = val;
      }
    }
    
    Logger.log("Extracted Info -> Email: " + email + ", Phone: " + phone);
    
    if (!email || !phone) {
      Logger.log("Aborted: Email or Phone is missing in form submission.");
      return;
    }
    
    const payload = {
      email: email,
      phone: phone
    };
    
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    Logger.log("Sending POST to: " + WEBHOOK_URL);
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("HTTP Response Code: " + response.getResponseCode());
    Logger.log("HTTP Response Body: " + response.getContentText());
  } catch (error) {
    Logger.log("Trigger Exception: " + error.toString());
  }
}
```
