"use strict";

import 'dotenv';
import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    port: process.env.MARIADB_PORT,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    connectionLimit: 5
});

const db = {
    connect: async function connect() {
        const conn = await pool.getConnection();
        return conn;
    },

    query: async function query(sql, params = []) {
        let conn;
        try {
            conn = await this.connect();
            const result = await conn.query(sql, params);
            return result;
        } catch (err) {
            console.error(`SQL ERROR: ${err.message}`);
            throw err;
        } finally {
            if (conn) await conn.end();
        }
    },
    // Helper function for select.
    select: async function select(table, columns = '*', where = '', params = []) {
        const sql =
        `SELECT ${Array.isArray(columns) ? columns.join(', ') : columns} FROM ${table}` +
        (where ? ` WHERE ${where}` : '');

        return this.query(sql, params);
    },

    // Helper function for insert.
    insert: async function insert(table, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');

        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

        return this.query(sql, values);
    },

    // Helper function for update.
    update: async function update(table, data, where, params = []) {
        const setClause = Object.keys(data)
            .map((k) => `${k} = ?`)
            .join(', ');

        const sql = `UPDATE ${table} SET ${setClause}` + (where ? ` WHERE ${where}` : '');

        return this.query(sql, [...Object.values(data), ...params]);
    },

    // Helper function for remove.
    remove: async function remove(table, where, params = []) {
        const sql = `DELETE FROM ${table}` + (where ? ` WHERE ${where}` : '');

        return this.query(sql, params);
    }
};

export default db;