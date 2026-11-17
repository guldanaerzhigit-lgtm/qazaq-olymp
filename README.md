# Qazaq Olymp

Қазақстан мектептерінің 3–9 сынып оқушыларына арналған онлайн олимпиадалар платформасы.

## Технологиялар
- React + TypeScript + Vite
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Cloudflare Pages (hosting)

## Жергілікті іске қосу
1. `npm install`
2. `.env.example` файлын `.env.local` деп көшіріп, Firebase Web App конфигурациясын толтырыңыз.
3. `npm run dev`

## Build
`npm run build`

## Қазіргі кезең
Бастапқы интерфейс және Firebase конфигурациясының үлгісі дайын. Келесі кезеңде Authentication, рөлдер, Firestore Security Rules және олимпиада конструкторы қосылады.

**Қауіпсіздік:** суперадмин рөлі клиент жағынан берілмейді. Оны сенімді серверлік ортада Firebase Admin SDK арқылы тағайындау керек.
