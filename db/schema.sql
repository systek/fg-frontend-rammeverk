CREATE TABLE authors
(
    id        SERIAL PRIMARY KEY,
    author_id uuid DEFAULT gen_random_uuid(),
    name      VARCHAR(100) NOT NULL,
    bio       TEXT
);

CREATE TABLE books
(
    book_id        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    author_id      INT          NOT NULL,
    published_date DATE,
    isbn           VARCHAR(20),
    FOREIGN KEY (author_id) REFERENCES authors (id)
);
