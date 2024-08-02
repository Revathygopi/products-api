"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "12345678",
    database: "postgres",
});
exports.default = pool;
