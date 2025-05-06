import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  port: 3306, // Default MySQL port; change if needed
  user: "root",
  password: "mysql",
  database: "Agoda",
};

const testConnection = async () => {
  try {
    const connection = await mysql.createConnection(config);
    console.log("Connected to the MySQL database!");
    await connection.end(); // Close the connection after testing
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

let pool: mysql.Pool | null = null;

export const getDbConnection = async () => {
  if (!pool) {
    pool = mysql.createPool(config); // create a connection pool
  }
  return pool;
};
