# Тестовое задание для NodeJs разработчика
Для того, чтобы запустить проект, необходимо:
1) Установить DATABASE_URL=postgres://user:password@host/databasename в .env
2) Установить PORT=3000 в .env
3) npm install
4) psql -U postgres -d outside_db -f ./sql-helpers/dropall.sql (пока без миграций)
5) npm start или npm run dev

Пока без докера, докумнтации и тестов D:\
Для тестирования можно использовать коллекцию из постмана\
