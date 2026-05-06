CREATE DATABASE secureframe;

\c secureframe;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password TEXT,
    role VARCHAR(20) DEFAULT 'USER'
);

CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    user_id INT REFERENCES users(id)
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    filename TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    album_id INT REFERENCES albums(id)
);