# Moro Delivre - Multi-Store Shipping App

تطبيق إرساليات يستقبل من عدة متاجر مع جاهزية للنشر أونلاين.

## الميزات الأساسية

✅ **إدارة المتاجر المتعددة** - كل متجر له حساب خاص يدير منتجاته وطلباته بشكل مستقل
✅ **نظام مصادقة JWT** - تسجيل دخول آمن لأصحاب المتاجر والمندوبين والعملاء
✅ **إدارة الطلبات والشحن** - استلام الطلبات وتعيين مندوب توصيل وتتبع حالة الشحنة
✅ **لوحة تحكم الأدمن** - إدارة المتاجر والمستخدمين والطلبات والإحصائيات
✅ **توثيق API** - Swagger/OpenAPI مدمج

## البنية التكنولوجية

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL
- **Authentication**: JWT with Passport
- **ORM**: TypeORM
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## البدء المحلي

### المتطلبات

- Node.js 20+
- PostgreSQL 14+
- Docker (اختياري)

### التثبيت

```bash
# تثبيت المكتبات
npm install

# إنشاء ملف .env
cp .env.example .env

# تشغيل قاعدة البيانات (Docker)
docker-compose up -d

# تشغيل السيرفر
npm run start:dev
```

### الإعدادات

قم بتحرير ملف `.env` مع بيانات الاتصال بقاعدة البيانات:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=moro_delivre
JWT_SECRET=your_jwt_secret_here
```

## API Endpoints

### الصحة والمعلومات

- `GET /` - معلومات الـ API
- `GET /health` - فحص صحة الخادم

### المصادقة

- `POST /auth/register` - تسجيل مستخدم جديد
- `POST /auth/login` - تسجيل دخول

### المتاجر

- `GET /stores` - قائمة المتاجر
- `GET /stores/:id` - تفاصيل متجر
- `POST /stores` - إنشاء متجر جديد (مصرح به فقط)
- `PATCH /stores/:id` - تحديث متجر
- `PATCH /stores/:id/approve` - الموافقة على متجر (أدمن فقط)

### المنتجات

- `GET /products` - قائمة المنتجات
- `GET /products/:id` - تفاصيل منتج
- `POST /products` - إنشاء منتج (مصرح به فقط)
- `PATCH /products/:id` - تحديث منتج
- `DELETE /products/:id` - حذف منتج

### الطلبات

- `GET /orders` - قائمة الطلبات
- `GET /orders/:id` - تفاصيل طلب
- `POST /orders` - إنشاء طلب جديد (مصرح به فقط)
- `PATCH /orders/:id/status` - تحديث حالة الطلب
- `POST /orders/:id/items` - إضافة عناصر للطلب

### الشحنات

- `GET /delivery` - قائمة الشحنات
- `GET /delivery/:id` - تفاصيل شحنة
- `POST /delivery` - إنشاء شحنة (أدمن فقط)
- `PATCH /delivery/:id/status` - تحديث حالة الشحنة
- `PATCH /delivery/:id/driver` - تعيين مندوب (أدمن فقط)
- `PATCH /delivery/:id/location` - تحديث موقع الشحنة

### الإدارة

- `GET /admin/users` - قائمة المستخدمين (أدمن فقط)
- `GET /admin/stores/pending` - المتاجر قيد الانتظار (أدمن فقط)
- `GET /admin/stats` - إحصائيات المنصة (أدمن فقط)

## البيانات والنماذج

### الأدوار (Roles)

- `admin` - مدير النظام
- `store_owner` - صاحب المتجر
- `driver` - مندوب التوصيل
- `customer` - العميل

### حالات الطلب

- `pending` - قيد الانتظار
- `confirmed` - مؤكد
- `packed` - معبأ
- `ready_for_delivery` - جاهز للتوصيل
- `in_delivery` - قيد التوصيل
- `delivered` - تم التسليم
- `cancelled` - ملغى

### حالات الشحنة

- `assigned` - تعيين المندوب
- `picked_up` - تم استلام الطلب
- `in_transit` - قيد النقل
- `delivered` - تم التسليم
- `failed` - فشل التسليم

## اختبار

```bash
# تشغيل الاختبارات
npm test

# الاختبارات مع تغطية الكود
npm run test:cov

# اختبارات E2E
npm run test:e2e
```

## النشر على Render

### الخطوات

1. اضغط على `Deploy` في حسابك على Render
2. ربط مستودع GitHub
3. اختر فرع `main`
4. ستجد ملف `render.yaml` في المشروع يحتوي على إعدادات النشر
5. Render سيقوم بـ:
   - تثبيت المكتبات
   - بناء المشروع
   - إنشاء قاعدة بيانات PostgreSQL
   - تشغيل الخادم

### متغيرات البيئة

تأكد من تعيين هذه المتغيرات في Render:

- `NODE_ENV=production`
- `JWT_SECRET` - مفتاح سري قوي
- `ADMIN_EMAIL` - بريد الأدمن
- `ADMIN_PASSWORD` - كلمة سر الأدمن

## الملفات الرئيسية

```
src/
├── main.ts                  # نقطة الدخول
├── app.module.ts            # الـ root module
├── config/                  # ملفات التكوين
│   ├── database.config.ts
│   └── jwt.config.ts
├── modules/                 # الـ modules الرئيسية
│   ├── auth/
│   ├── users/
│   ├── stores/
│   ├── products/
│   ├── orders/
│   ├── delivery/
│   └── admin/
└── health.controller.ts     # فحص الصحة
```

## الترخيص

UNLICENSED

## الدعم

للأسئلة أو المشاكل، يرجى فتح issue أو التواصل مع الدعم.
