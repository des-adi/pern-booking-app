/*// Load environment variables from .env file (ES module style)
import dotenv from 'dotenv';
dotenv.config();

// Import the Pool class from pg module
import { Pool } from 'pg';

// Create a new pool instance
const pool = new Pool();

// Export the query function
export const query = (text, params) => pool.query(text, params);

*/

import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool();

export const query = (text, params) => pool.query(text, params);

/*require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool();

module.exports = {
    query: (text,params) => pool.query(text,params),
};*/