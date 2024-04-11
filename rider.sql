CREATE TABLE riders (
    rider_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    vehicle_type VARCHAR(50),
    vehicle_registration VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    hire_date DATE,
    last_login DATETIME,
    address VARCHAR(255),
    district VARCHAR(100)
);

CREATE TABLE delivery_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    rider_id INT,
    delivery_date DATE,
    total_deliveries INT,
    total_distance DECIMAL(10, 2),
    total_earnings DECIMAL(10, 2),
    FOREIGN KEY (rider_id) REFERENCES riders(rider_id)
);

CREATE TABLE delivery_ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT,
    rating DECIMAL(3, 2),
    feedback TEXT,
    FOREIGN KEY (record_id) REFERENCES delivery_records(record_id)
);

CREATE TABLE order_status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50)
);

CREATE TABLE customer_communication (
    communication_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    message TEXT,
    communication_type VARCHAR(50),
    timestamp DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    delivery_address VARCHAR(255),
    status ENUM('pending', 'in_progress', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    rider_id INT,
    delivery_time DATETIME,
    delivery_cost DECIMAL(10, 2),
    pickup_location VARCHAR(255),
    delivery_location VARCHAR(255),
    delivery_status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_rider FOREIGN KEY (rider_id) REFERENCES riders(rider_id)
);

INSERT INTO customers (first_name, last_name, email, phone_number, address, city, state, postal_code, country)
VALUES
('John', 'Doe', 'john.doe@example.com', '1234567890', '123 Main St', 'Anytown', 'Anystate', '12345', 'USA'),
('Alice', 'Smith', 'alice.smith@example.com', '9876543210', '456 Elm St', 'Othertown', 'Otherstate', '54321', 'USA');

-- Sample data for order status
INSERT INTO order_status (status_name) VALUES
('Pending'),
('In Progress'),
('Delivered'),
('Cancelled');

-- Inserting values into the riders table
INSERT INTO riders (first_name, last_name, email, phone_number, vehicle_type, vehicle_registration, status, hire_date, last_login, address, district)
VALUES
('John', 'Doe', 'john.doe@example.com', '1234567890', 'Motorcycle', 'ABC123', 'active', '2023-01-15', '2024-04-10 08:30:00', '123 Main St', 'District 1'),
('Alice', 'Smith', 'alice.smith@example.com', '9876543210', 'Bicycle', 'XYZ456', 'active', '2023-03-20', '2024-04-10 09:15:00', '456 Elm St', 'District 2');

-- Inserting values into the delivery_records table
INSERT INTO delivery_records (rider_id, delivery_date, total_deliveries, total_distance, total_earnings)
VALUES
(1, '2024-04-10', 20, 45.5, 150.75),
(2, '2024-04-10', 15, 32.2, 120.50);

-- Inserting values into the delivery_ratings table
INSERT INTO delivery_ratings (record_id, rating, feedback)
VALUES
(1, 4.5, 'Excellent service! John was very punctual and polite.'),
(2, 4.0, 'Alice delivered everything on time, but one item was damaged during transit.');

INSERT INTO orders (customer_id, order_date, delivery_address, status, total_amount)
VALUES
(1, '2024-04-12', '123 Main St', 'pending', 50.00),
(2, '2024-04-12', '456 Elm St', 'pending', 75.00);
