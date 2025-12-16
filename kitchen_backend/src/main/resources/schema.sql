CREATE TABLE IF NOT EXISTS customers (
        id INT auto_increment PRIMARY KEY ,
        firstname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS recipes (
                                       id INT  auto_increment PRIMARY KEY,
                                       title VARCHAR(255) NOT NULL,
                                       category VARCHAR(255) NOT NULL,
                                       diet VARCHAR(255) NOT NULL,
                                       image VARCHAR(255) NOT NULL,
                                       spoonacular_id VARCHAR(255) NOT NULL

);

CREATE TABLE IF NOT EXISTS customer_saved_recipes (
        customer_id INT NOT NULL,
        recipe_id INT NOT NULL,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description VARCHAR(1000),

        PRIMARY KEY (customer_id, recipe_id),

        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
