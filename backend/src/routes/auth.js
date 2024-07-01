import express from "express";
import {query} from "../db/database.js";
import { check, validationResult } from 'express-validator';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from '../middleware/auth.js';

const router = express.Router();
router.post("/login",[
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({min: 6})],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({status: errors.array()});
        }

        const {email, password} = req.body;

        try {
            const userResult = await query("SELECT * FROM users WHERE email = $1",[email]);

            if(userResult.rows.length==0){
                return res.status(400).json({status: "Invalid credentials"});
            }

            const user = userResult.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.status(400).json({status: "Invalid credentials"});
            }
            
            const token = jwt.sign(
                {userId: user.id},
                 process.env.JWT_SECRET_KEY,
                {expiresIn: "1d"});

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000
            });

            res.status(200).json({userId: user.id});
        } catch (error) {
            console.log(error);
            res.status(500).json({status: "Something is wrong"});
        }
    }
 );

//validate token
router.get("/validate-token", verifyToken, (req,res) => {
    res.status(200).send({userId: req.userId});
});

router.post("/logout", (req,res) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),       //token expires at the time of creation during logging out
    });
    res.send();
});

export default router;
//module.exports = router;