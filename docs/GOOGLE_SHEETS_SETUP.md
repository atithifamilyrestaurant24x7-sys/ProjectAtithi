# Google Sheets সেটআপ গাইড (পেমেন্ট ট্র্যাকিং)

## ধাপ ১: Google Sheet তৈরি করুন

1. [Google Sheets](https://sheets.google.com) খুলুন
2. নতুন স্প্রেডশীট তৈরি করুন
3. নাম দিন: `Atithi Orders`
4. প্রথম রো-তে এই হেডার লিখুন:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Phone | Order Type | Date | Time | Address | Payment Method | UTR | Total | Items |

---

## ধাপ ২: Google Apps Script সেটআপ

1. স্প্রেডশীটে **Extensions** → **Apps Script** ক্লিক করুন
2. সব কোড ডিলিট করে নিচের কোড পেস্ট করুন:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name,
      data.phone,
      data.orderType,
      data.date,
      data.time,
      data.address || '-',
      data.paymentMethod,
      data.utr || '-',
      data.total,
      data.items
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Atithi Order API is running!' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Ctrl+S** দিয়ে সেভ করুন
4. প্রজেক্টের নাম দিন: `Atithi Order Logger`

---

## ধাপ ৩: Web App হিসেবে Deploy করুন

1. **Deploy** বাটন → **New deployment** ক্লিক করুন
2. **Select type** এ ⚙️ (gear icon) → **Web app** সিলেক্ট করুন
3. সেটিংস:
   - **Description**: Order Logger
   - **Execute as**: Me
   - **Who has access**: **Anyone** (গুরুত্বপূর্ণ!)
4. **Deploy** ক্লিক করুন
5. **Authorize access** ক্লিক করুন → আপনার Google অ্যাকাউন্ট সিলেক্ট করুন
6. "Google hasn't verified this app" দেখালে → **Advanced** → **Go to Atithi Order Logger (unsafe)** → **Allow**
7. **Web app URL** কপি করুন (দেখতে এরকম হবে: `https://script.google.com/macros/s/xxxxx/exec`)

---

## ধাপ ৪: প্রজেক্টে URL যোগ করুন

প্রজেক্ট ফোল্ডারে `.env.local` ফাইল তৈরি করুন (বা এডিট করুন):

```env
NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**YOUR_SCRIPT_ID** এর জায়গায় আপনার কপি করা URL দিন।

---

## ✅ সেটআপ শেষ!

এখন প্রতিটা অর্ডার অটো Google Sheets-এ সেভ হবে!
