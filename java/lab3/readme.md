GET / — приветствие
Users (/api/users)
POST /api/users — создать
GET /api/users — все
GET /api/users/{id} — по id
PUT /api/users/{id} — обновить
DELETE /api/users/{id} — удалить
Books (/api/books)
POST /api/books — создать
GET /api/books — все
GET /api/books/{id} — по id
GET /api/books/by-author?author=... — по автору
PUT /api/books/{id} — обновить
DELETE /api/books/{id} — удалить
Students (/api/students)
POST /api/students — создать
GET /api/students — все
GET /api/students/{id} — по id
GET /api/students/by-course?course=... — по курсу
PUT /api/students/{id} — обновить
DELETE /api/students/{id} — удалить
Products (/api/products)
POST /api/products — создать
GET /api/products — все (опционально: ?name=, ?minPrice=, ?maxPrice=)
GET /api/products/{id} — по id
GET /api/products/price-greater-than?price=... — цена больше
PUT /api/products/{id} — обновить
DELETE /api/products/{id} — удалить
Todos (/api/todos)
POST /api/todos — создать
GET /api/todos — все (?completed=true — только выполненные)
GET /api/todos/{id} — по id
GET /api/todos/completed — только выполненные
PUT /api/todos/{id} — обновить
DELETE /api/todos/{id} — удалить
Orders (/api/orders)
POST /api/orders — создать
GET /api/orders — все (?status=... — по статусу)
GET /api/orders/{id} — по id
GET /api/orders/by-status?status=... — по статусу
PUT /api/orders/{id} — полное обновление
PATCH /api/orders/{id}/status — обновить только status (body: {"status": "..."})
DELETE /api/orders/{id} — удалить
Courses (/api/courses)
POST /api/courses — создать
GET /api/courses — все
GET /api/courses/{id} — по id
PUT /api/courses/{id} — обновить
DELETE /api/courses/{id} — удалить (400, если duration > 40)
Comments (/api/comments)
POST /api/comments — создать
GET /api/comments — все
GET /api/comments/{id} — по id
PATCH /api/comments/{id} — обновить только text (body: {"text": "..."})
DELETE /api/comments/{id} — удалить
News (/api/news)
POST /api/news — создать
GET /api/news — все (?published=true — только опубликованные)
GET /api/news/{id} — по id
GET /api/news/published — только опубликованные
PUT /api/news/{id} — обновить
DELETE /api/news/{id} — удалить