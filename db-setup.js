const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./konter_pulsa.db');

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS customers`);
  db.run(`DROP TABLE IF EXISTS employees`);
  db.run(`DROP TABLE IF EXISTS branches`);
  db.run(`DROP TABLE IF EXISTS products`);
  db.run(`DROP TABLE IF EXISTS sales`);

  db.run(`CREATE TABLE customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      created_at TEXT
  );`);

  db.run(`CREATE TABLE employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      branch_id INTEGER,
      position TEXT,
      hired_at TEXT
  );`);

  db.run(`CREATE TABLE branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      branch_name TEXT,
      city TEXT
  );`);

  db.run(`CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT,
      type TEXT,      -- Pulsa / Data
      value INTEGER,
      price INTEGER
  );`);

  db.run(`CREATE TABLE sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      employee_id INTEGER,
      branch_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      total_amount INTEGER,
      sale_date TEXT
  );`);

  db.run(`INSERT INTO branches (branch_name, city) VALUES
      ('Cabang A', 'Jakarta'),
      ('Cabang B', 'Bandung'),
      ('Cabang C', 'Surabaya');`);

  db.run(`INSERT INTO employees (name, branch_id, position, hired_at) VALUES
      ('Rudi', 1, 'Kasir', '2024-02-01'),
      ('Ani', 1, 'Staff', '2024-05-11'),
      ('Bima', 2, 'Kasir', '2023-09-21'),
      ('Dita', 3, 'Kasir', '2024-01-15');`);

  db.run(`INSERT INTO customers (name, phone, created_at) VALUES
      ('Andi', '08123456789', '2025-01-01'),
      ('Sinta', '08234567890', '2025-01-05'),
      ('Bagus', '08345678901', '2025-02-12');`);

  db.run(`INSERT INTO products (provider, type, value, price) VALUES
      ('Telkomsel', 'Pulsa', 5000, 6000),
      ('Telkomsel', 'Pulsa', 10000, 11500),
      ('Indosat', 'Data', 5, 25000),
      ('XL', 'Pulsa', 20000, 22000);`);

  db.run(`INSERT INTO sales (customer_id, employee_id, branch_id, product_id, quantity, total_amount, sale_date) VALUES
      (1, 1, 1, 1, 2, 12000, '2025-09-01'),
      (2, 2, 1, 2, 1, 11500, '2025-09-02'),
      (1, 3, 2, 3, 1, 25000, '2025-09-05'),
      (3, 4, 3, 4, 3, 66000, '2025-09-07');`);

  console.log("✅ OLTP database created and dummy data inserted.");
});

db.close();
