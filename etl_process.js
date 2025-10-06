const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./konter_pulsa.db');

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS dim_customer`);
  db.run(`DROP TABLE IF EXISTS dim_employee`);
  db.run(`DROP TABLE IF EXISTS dim_branch`);
  db.run(`DROP TABLE IF EXISTS dim_product`);
  db.run(`DROP TABLE IF EXISTS fact_sales`);

  db.run(`CREATE TABLE dim_customer (
      customer_key INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      name TEXT,
      phone TEXT
  );`);

  db.run(`CREATE TABLE dim_employee (
      employee_key INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      name TEXT,
      branch_id INTEGER
  );`);

  db.run(`CREATE TABLE dim_branch (
      branch_key INTEGER PRIMARY KEY AUTOINCREMENT,
      branch_id INTEGER,
      branch_name TEXT,
      city TEXT
  );`);

  db.run(`CREATE TABLE dim_product (
      product_key INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      provider TEXT,
      type TEXT,
      value INTEGER,
      category TEXT
  );`);

  db.run(`CREATE TABLE fact_sales (
      sale_key INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_key INTEGER,
      employee_key INTEGER,
      branch_key INTEGER,
      product_key INTEGER,
      quantity INTEGER,
      total_amount INTEGER,
      sale_month TEXT
  );`);

  db.run(`INSERT INTO dim_customer (customer_id, name, phone)
          SELECT id, name, phone FROM customers;`);

  db.run(`INSERT INTO dim_employee (employee_id, name, branch_id)
          SELECT id, name, branch_id FROM employees;`);

  db.run(`INSERT INTO dim_branch (branch_id, branch_name, city)
          SELECT id, branch_name, city FROM branches;`);

  db.run(`INSERT INTO dim_product (product_id, provider, type, value, category)
          SELECT id, provider, type, value,
                 CASE 
                    WHEN type = 'Pulsa' THEN 'Pulsa'
                    ELSE 'Data'
                 END as category
          FROM products;`);

  db.run(`INSERT INTO fact_sales (customer_key, employee_key, branch_key, product_key, quantity, total_amount, sale_month)
          SELECT s.customer_id, 
                 s.employee_id, 
                 s.branch_id, 
                 s.product_id, 
                 s.quantity,
                 (s.quantity * p.price) as total_amount,
                 substr(s.sale_date,1,7) as sale_month
          FROM sales s
          JOIN products p ON s.product_id = p.id;`);

  console.log("✅ ETL process complete with TRANSFORM!\n");

  db.all(`SELECT * FROM fact_sales`, (err, rows) => {
    if (err) throw err;
    console.log("📊 Fact Sales Data:");
    console.table(rows);

    db.all(`SELECT * FROM dim_product`, (err2, rows2) => {
      console.log("\n📦 Dim Product with Category:");
      console.table(rows2);
      db.close();
    });
  });
});
