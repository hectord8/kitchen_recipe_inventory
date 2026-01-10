CREATE TABLE IF NOT EXISTS customers
(
    id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    email     VARCHAR(255) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes
(
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    spoonacular_id INT          NOT NULL UNIQUE,
    title          VARCHAR(255) NOT NULL,
    image          VARCHAR(512) NOT NULL,
    summary        TEXT,
    instructions   TEXT,
    prep_minutes   INT,
    cook_minutes   INT,
    ready_minutes  INT,
    calories       INT,
    diet           VARCHAR(255), -- e.g. "vegan,gluten free"
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creator        VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS customer_saved_recipes
(
    customer_id INT NOT NULL,
    recipe_id   INT NOT NULL,
    saved_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(1000),

    PRIMARY KEY (customer_id, recipe_id),

    FOREIGN KEY (customer_id)
        REFERENCES customers (id)
        ON DELETE CASCADE,

    FOREIGN KEY (recipe_id)
        REFERENCES recipes (id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory
(
    item_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customerid INTEGER NOT NULL,
    item        TEXT    NOT NULL,
    description TEXT,
    image       TEXT,
    quantity    INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS items
(
    id   BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    UNIQUE (name)
);




