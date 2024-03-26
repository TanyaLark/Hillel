CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL,
  password VARCHAR(30) NOT NULL,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, password)
  VALUES ('Jerry', 'test@password'), ('George', 'test@password');

  CREATE TABLE urls (
    ID SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    original_url VARCHAR(255) NOT NULL,
    visits INT DEFAULT 0,
    short_link VARCHAR(255) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  DROP TABLE IF EXISTS urls CASCADE;
