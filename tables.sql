DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(35) NOT NULL CHECK (first <> ''),
    last VARCHAR(35) NOT NULL CHECK (first <> ''),
    email VARCHAR(60) NOT NULL UNIQUE CHECK (email <> ''),
    password VARCHAR(100) NOT NULL CHECK (password <> ''),
    imageurl VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS events;

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    name VARCHAR(35) NOT NULL CHECK (name <> ''),
    eventdate DATE NOT NULL,
    eventtime TIME NOT NULL,
    location VARCHAR(100) NOT NULL CHECK (location <> ''),
    imageurl VARCHAR(300),
    description TEXT,
    host_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS chatmessages;
--
-- CREATE TABLE chatmessages(
--     id SERIAL PRIMARY KEY,
--     sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     message VARCHAR(1000),
--     receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
