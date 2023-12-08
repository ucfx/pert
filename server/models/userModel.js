const db = require("./db");

const sql = `CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)`;

class User {
    static async createTable() {
        try {
            const [rows] = await db.query(sql);
            if (rows.warningStatus === 0) console.log("Users Table created");
        } catch (error) {
            throw new Error("Failed to create table: " + error.message);
        }
    }

    static async getAll() {
        try {
            const [rows] = await db.query("SELECT * FROM users");
            return rows;
        } catch (error) {
            throw new Error("Failed to get users: " + error.message);
        }
    }

    static async getOne(id) {
        try {
            const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
                id,
            ]);
            return rows[0];
        } catch (error) {
            throw new Error("Failed to get user: " + error.message);
        }
    }

    static async create(name, email, password) {
        try {
            const [rows] = await db.query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [name, email, password]
            );
            return rows;
        } catch (error) {
            throw new Error("Failed to create user: " + error.message);
        }
    }

    static async update(id, name, email, password) {
        try {
            const [rows] = await db.query(
                "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
                [name, email, password, id]
            );
            return rows;
        } catch (error) {
            throw new Error("Failed to update user: " + error.message);
        }
    }

    static async delete(id) {
        try {
            const [rows] = await db.query("DELETE FROM users WHERE id = ?", [
                id,
            ]);
            return rows;
        } catch (error) {
            throw new Error("Failed to delete user: " + error.message);
        }
    }
}

User.createTable();

module.exports = User;
