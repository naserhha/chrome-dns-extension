# تغییرات فارسی‌سازی افزونه DNS

## ✅ تغییرات انجام شده

### 1. فایل `manifest.json`
- **نام افزونه:** `DNS Configuration Manager` → `مدیر تنظیمات DNS`
- **توضیحات:** به فارسی تغییر یافت
- **عنوان پیش‌فرض:** `DNS Configuration` → `تنظیمات DNS`

### 2. فایل `popup.html`
- **زبان:** `lang="en"` → `lang="fa" dir="rtl"`
- **عنوان صفحه:** `DNS Configuration` → `تنظیمات DNS`
- **عنوان اصلی:** `DNS Configuration` → `تنظیمات DNS`
- **وضعیت پیش‌فرض:** `Default DNS` → `DNS پیش‌فرض`

#### DNS های آماده:
- `Google DNS` → `گوگل DNS`
- `Cloudflare` → `کلودفلر`
- `OpenDNS` → `اوپن DNS`
- `Quad9` → `کواد ۹`
- `Shecan` → `شکن`
- `Begzar` → `بگذر`

#### بخش تنظیمات سفارشی:
- `Quick DNS Presets` → `DNS های آماده`
- `Custom DNS Configuration` → `تنظیمات DNS سفارشی`
- `Primary DNS Server:` → `سرور DNS اصلی:`
- `Secondary DNS Server:` → `سرور DNS فرعی:`
- `Configuration Name:` → `نام تنظیمات:`
- `Save Custom DNS` → `ذخیره DNS سفارشی`
- `Saved Configurations` → `تنظیمات ذخیره شده`
- `Apply DNS` → `اعمال DNS`
- `Reset to Default` → `بازگشت به پیش‌فرض`

#### Placeholder ها:
- `e.g., 8.8.8.8` → `مثال: 8.8.8.8`
- `e.g., 8.8.4.4` → `مثال: 8.8.4.4`
- `My Custom DNS` → `DNS سفارشی من`

#### پیام توجه:
- `This extension uses Chrome's proxy API...` → `این افزونه از API پروکسی کروم برای تنظیم DNS استفاده می‌کند...`

### 3. فایل `popup.js`
#### پیام‌های خطا:
- `Please enter both primary DNS and configuration name` → `لطفاً سرور DNS اصلی و نام تنظیمات را وارد کنید`
- `Please enter valid IP addresses` → `لطفاً آدرس‌های IP معتبر وارد کنید`
- `Please select a DNS configuration first` → `لطفاً ابتدا یک تنظیمات DNS انتخاب کنید`

#### پیام‌های موفقیت:
- `Custom DNS configuration saved successfully!` → `تنظیمات DNS سفارشی با موفقیت ذخیره شد!`
- `Applied ${config.name} configuration` → `تنظیمات ${config.name} اعمال شد`
- `Configuration deleted successfully` → `تنظیمات با موفقیت حذف شد`
- `Applied ${this.currentConfig.name} DNS configuration` → `تنظیمات DNS ${this.currentConfig.name} اعمال شد`
- `Reset to default DNS configuration` → `بازگشت به تنظیمات DNS پیش‌فرض`

#### پیام‌های خطا:
- `Error applying DNS configuration` → `خطا در اعمال تنظیمات DNS`
- `Error resetting DNS configuration` → `خطا در بازگشت به تنظیمات پیش‌فرض`

#### متن‌های رابط:
- `No saved configurations` → `هیچ تنظیماتی ذخیره نشده`
- `Apply` → `اعمال`
- `Delete` → `حذف`
- `Default DNS` → `DNS پیش‌فرض`

### 4. فایل `popup.css`
- **فونت:** اضافه شدن `'Tahoma', 'Arial'` برای پشتیبانی بهتر از فارسی
- **جهت:** اضافه شدن `direction: rtl` و `text-align: right`
- **تراز متن:** `text-align: left` → `text-align: right` برای دکمه‌ها
- **حاشیه:** `margin-right` → `margin-left` برای دکمه‌ها

### 5. فایل `README.md`
- **عنوان اصلی:** `DNS Configuration Manager - Chrome Extension` → `مدیر تنظیمات DNS - افزونه کروم`
- **توضیحات:** تمام بخش‌ها به فارسی ترجمه شد
- **ویژگی‌ها:** تمام ویژگی‌ها به فارسی ترجمه شد
- **نصب:** دستورالعمل‌های نصب به فارسی
- **استفاده:** راهنمای استفاده به فارسی
- **سرورهای DNS:** نام‌های فارسی برای تمام سرورها

## 🎯 ویژگی‌های خاص برای کاربران ایرانی

### 1. پشتیبانی از DNS های ایرانی
- **شکن:** DNS ایرانی برای دسترسی بهتر
- **بگذر:** DNS ایرانی جایگزین

### 2. رابط کاربری فارسی
- **RTL:** پشتیبانی کامل از راست به چپ
- **فونت:** استفاده از فونت‌های مناسب فارسی
- **ترجمه:** تمام متن‌ها به فارسی

### 3. پیام‌های بومی‌سازی شده
- **خطاها:** پیام‌های خطا به فارسی
- **موفقیت:** پیام‌های موفقیت به فارسی
- **راهنما:** راهنمای استفاده به فارسی

## ✅ تست نهایی

### بررسی ساختار:
- ✅ تمام فایل‌ها موجود هستند
- ✅ JavaScript syntax صحیح است
- ✅ Manifest.json معتبر است
- ✅ HTML structure کامل است
- ✅ CSS برای RTL بهینه شده است

### بررسی عملکرد:
- ✅ تمام دکمه‌ها کار می‌کنند
- ✅ پیام‌ها به فارسی نمایش داده می‌شوند
- ✅ رابط کاربری RTL است
- ✅ DNS های ایرانی موجود هستند

## 🎉 نتیجه

**افزونه DNS کاملاً فارسی شده و آماده استفاده برای کاربران ایرانی است!**

### ویژگی‌های کلیدی:
- 🌐 رابط کاربری کاملاً فارسی
- 🇮🇷 پشتیبانی از DNS های ایرانی
- 📱 طراحی واکنش‌گرا
- 🔒 امنیت و حریم خصوصی
- 💾 ذخیره محلی تنظیمات

### نحوه استفاده:
1. افزونه را در کروم بارگذاری کنید
2. روی آیکون افزونه کلیک کنید
3. DNS مورد نظر را انتخاب کنید
4. روی "اعمال DNS" کلیک کنید

**افزونه آماده استفاده است! 🚀** 