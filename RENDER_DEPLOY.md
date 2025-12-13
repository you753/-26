# دليل النشر على Render - المحاسب الأعظم

## 1. إنشاء Web Service على Render

1. ادخل على [render.com](https://render.com)
2. اختر **New** → **Web Service**
3. اربط GitHub أو ارفع الملفات

## 2. إعدادات الخدمة

| الإعداد | القيمة |
|---------|--------|
| **Name** | المحاسب-الأعظم |
| **Environment** | Node |
| **Build Command** | `npm install && cp vite.config.render.ts vite.config.ts && npm run build && node scripts/post-build.js && npm run db:push` |
| **Start Command** | `npm start` |
| **Node Version** | 20 |

## 3. متغيرات البيئة (Environment Variables)

اضغط على **Environment** وأضف:

```
DATABASE_URL = postgresql://bmg_user:PASSWORD@dpg-xxx.render.com/bmg?sslmode=require
NODE_ENV = production
```

## 4. قاعدة البيانات

إذا لم تكن لديك قاعدة بيانات:
1. اختر **New** → **PostgreSQL**
2. اختر المنطقة (Singapore قريبة للخليج)
3. انسخ **External Database URL**

## 5. بيانات الدخول الافتراضية

عند تشغيل التطبيق لأول مرة على قاعدة بيانات فارغة:
- **اسم المستخدم:** BMG1
- **كلمة المرور:** B1M2G3

## 6. التحقق من الاتصال

عند تشغيل التطبيق ستظهر رسالة:
```
✅ Connected to Render PostgreSQL
```

## ملاحظات مهمة

- التطبيق يستخدم `process.env.PORT` تلقائياً (Render يحدد البورت)
- SSL مُفعّل تلقائياً لقواعد البيانات الخارجية
- الجداول تُنشأ تلقائياً عند أول تشغيل
