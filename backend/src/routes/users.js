import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { query } from '../db/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();
import { check, validationResult } from 'express-validator';


// /api/users/register
router.post("/register",[
    check("firstName", "First Name is required.").isString(),
    check("lastName", "Last Name is required.").isString(),
    check("email", "Email is required.").isEmail(),
    check("password", "Password of 6 or more characters is required.").isLength({min: 6})], async(req,res) => {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({status: errors.array()});
        }
        const {email, password, firstName, lastName} = req.body;
        const userResult = await query("SELECT * FROM users WHERE email = $1",[email]);
        if(userResult.rows.length>0){
            return res.status(400).json({
                status: "User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await query("INSERT INTO users(email, password, firstName, lastName) VALUES($1,$2,$3,$4)",[email, hashedPassword, firstName, lastName]);

        const token = jwt.sign({userId: user.id},
             process.env.JWT_SECRET_KEY,
            {expiresIn: "1d"});
        
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000,
        });

        return res.status(200).json({status: "OK"});
    } catch (err) {
        console.log(err);
        res.status(500).send({status: "Something went wrong"});
    }
});

export default router;
//module.exports = router;