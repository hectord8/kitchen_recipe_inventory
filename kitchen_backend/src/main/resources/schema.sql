CREATE TABLE IF NOT EXISTS customers (
                                         id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                         firstname VARCHAR(255) NOT NULL,
                                         email VARCHAR(255) NOT NULL UNIQUE,
                                         password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
                                       id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                       title VARCHAR(255) NOT NULL,
                                       category VARCHAR(100) NOT NULL,
                                       diet VARCHAR(100) NOT NULL,
                                       image VARCHAR(255),
                                       prep_time INT NOT NULL,
                                       cook_time INT NOT NULL,
                                       description TEXT,
                                       creator VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_saved_recipes (
                                                      customer_id INT NOT NULL,
                                                      recipe_id INT NOT NULL,
                                                      saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                      description VARCHAR(1000),

                                                      PRIMARY KEY (customer_id, recipe_id),

                                                      FOREIGN KEY (customer_id)
                                                          REFERENCES customers(id)
                                                          ON DELETE CASCADE,

                                                      FOREIGN KEY (recipe_id)
                                                          REFERENCES recipes(id)
                                                          ON DELETE CASCADE
);


INSERT INTO RECIPES
(TITLE, CATEGORY, DIET, IMAGE, PREP_TIME, COOK_TIME, DESCRIPTION, CREATOR)
VALUES
    ('Spaghetti Bolognese', 'Dinner', 'Omnivore', NULL, 15, 45, 'Classic beef and tomato pasta sauce', 'system'),
    ('Chicken Stir Fry', 'Dinner', 'Omnivore', NULL, 10, 20, 'Quick stir fried chicken with vegetables', 'system'),
    ('Vegetable Curry', 'Dinner', 'Vegetarian', NULL, 15, 35, 'Spiced mixed vegetable curry', 'system'),
    ('Beef Tacos', 'Dinner', 'Omnivore', NULL, 20, 25, 'Seasoned beef tacos with toppings', 'system'),
    ('Salmon Teriyaki', 'Dinner', 'Pescatarian', NULL, 10, 20, 'Pan seared salmon with teriyaki glaze', 'system'),

    ('Avocado Toast', 'Breakfast', 'Vegetarian', NULL, 5, 5, 'Smashed avocado on toasted bread', 'system'),
    ('Pancakes', 'Breakfast', 'Vegetarian', NULL, 10, 15, 'Fluffy breakfast pancakes', 'system'),
    ('Omelette', 'Breakfast', 'Omnivore', NULL, 5, 10, 'Egg omelette with fillings', 'system'),
    ('Smoothie Bowl', 'Breakfast', 'Vegan', NULL, 10, 0, 'Blended fruit smoothie bowl', 'system'),

    ('Caesar Salad', 'Lunch', 'Omnivore', NULL, 10, 10, 'Classic caesar salad with chicken', 'system'),
    ('Grilled Cheese Sandwich', 'Lunch', 'Vegetarian', NULL, 5, 10, 'Toasted cheese sandwich', 'system'),
    ('Chicken Wrap', 'Lunch', 'Omnivore', NULL, 10, 10, 'Chicken wrap with salad', 'system'),
    ('Lentil Soup', 'Lunch', 'Vegan', NULL, 15, 40, 'Hearty lentil soup', 'system'),

    ('Chocolate Brownies', 'Dessert', 'Vegetarian', NULL, 15, 30, 'Rich chocolate brownies', 'system'),
    ('Apple Crumble', 'Dessert', 'Vegetarian', NULL, 20, 40, 'Baked apple crumble', 'system'),
    ('Banana Bread', 'Dessert', 'Vegetarian', NULL, 15, 50, 'Moist banana bread', 'system'),
    ('Fruit Salad', 'Dessert', 'Vegan', NULL, 10, 0, 'Fresh mixed fruit salad', 'system'),

    ('Hummus', 'Snack', 'Vegan', NULL, 10, 0, 'Chickpea hummus dip', 'system'),
    ('Protein Balls', 'Snack', 'Vegan', NULL, 15, 0, 'No-bake protein balls', 'system'),
    ('Garlic Bread', 'Snack', 'Vegetarian', NULL, 5, 10, 'Toasted garlic bread', 'system');
