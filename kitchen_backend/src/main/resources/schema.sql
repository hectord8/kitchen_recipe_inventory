CREATE TABLE IF NOT EXISTS  customers (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           firstname VARCHAR(255) NOT NULL,
                           email VARCHAR(255) NOT NULL UNIQUE,
                           password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       title VARCHAR(255) NOT NULL,
                                       category VARCHAR(100) NOT NULL,
                                       diet VARCHAR(100) NOT NULL,
                                       image VARCHAR(255),
                                       prep_time INT NOT NULL,
                                       cook_time INT NOT NULL,
                                       description TEXT
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
