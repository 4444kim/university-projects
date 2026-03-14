# Подключение PostgreSQL к проекту lab4

## 1. Установка PostgreSQL

### macOS (Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
```

### Windows
Скачай установщик с [postgresql.org](https://www.postgresql.org/download/windows/) и установи. Запомни пароль пользователя `postgres`.

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## 2. Создание базы данных

Подключись к PostgreSQL (пароль — тот, что задал при установке):

```bash
psql -U postgres
```

В консоли `psql` выполни:

```sql
CREATE DATABASE student_db;
\q
```

Проверка:
```bash
psql -U postgres -d student_db -c "\dt"
```
После первого запуска приложения появятся таблицы: `students`, `student_profiles`, `courses`, `lessons`, `students_courses`.

---

## 3. Настройка приложения

Файл **`src/main/resources/application.properties`**:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/student_db
spring.datasource.username=postgres
spring.datasource.password=ТВОЙ_ПАРОЛЬ
```

Замени `ТВОЙ_ПАРОЛЬ` на пароль пользователя `postgres`.

Если пользователь или порт другие — измени `username` и порт в URL (например `localhost:5433`).

---

## 4. Запуск приложения

```bash
./mvnw spring-boot:run
```

Приложение поднимется на `http://localhost:8080`.  
При первом запуске Hibernate создаст таблицы (`spring.jpa.hibernate.ddl-auto=update`).

---

## 5. Проверка в Postman

| Метод | URL | Описание |
|-------|-----|----------|
| POST | `http://localhost:8080/students` | Создать студента (тело JSON с `firstName`, `lastName`, `email`, опционально `profile`: `address`, `phone`, `birthDate`) |
| GET | `http://localhost:8080/students` | Список студентов |
| GET | `http://localhost:8080/students/{id}` | Студент по id |
| PUT | `http://localhost:8080/students/{id}` | Обновить студента |
| DELETE | `http://localhost:8080/students/{id}` | Удалить студента |
| POST | `http://localhost:8080/students/{studentId}/courses/{courseId}` | Записать студента на курс |
| POST | `http://localhost:8080/courses` | Создать курс (`title`, `credits`) |
| GET | `http://localhost:8080/courses/{id}` | Курс по id |
| POST | `http://localhost:8080/courses/{courseId}/lessons` | Добавить урок к курсу (`topic`, `duration`) |

Пример тела для **POST /students**:
```json
{
  "firstName": "Иван",
  "lastName": "Петров",
  "email": "ivan@mail.ru",
  "profile": {
    "address": "ул. Ленина, 1",
    "phone": "+7 999 123-45-67",
    "birthDate": "2000-05-15"
  }
}
```

Пример для **POST /courses**:
```json
{
  "title": "Математика",
  "credits": 4
}
```

Пример для **POST /courses/1/lessons**:
```json
{
  "topic": "Линейная алгебра",
  "duration": 90
}
```

---

## 6. Проверка данных в PostgreSQL

```bash
psql -U postgres -d student_db
```

Полезные команды:
- `\dt` — список таблиц
- `SELECT * FROM students;`
- `SELECT * FROM student_profiles;`
- `SELECT * FROM students_courses;` — таблица связи M-M
- `\q` — выход

После этого проект готов к использованию и проверке в Postman и в БД.
