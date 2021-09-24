# Тестовое задание для NodeJs разработчика
Для того, чтобы запустить проект, необходимо:
1) Установить DATABASE_URL=postgres://user:password@host/databasename в .env
2) npm install
3) psql -u User -f ./sql-helpers/dropall.sql (пока без миграций)
4) npm start или npm run dev

К сожалению докер пока не успел настроить D:
