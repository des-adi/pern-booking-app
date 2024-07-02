import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import multer from 'multer';
import {query} from '../db/database.js';
import cloudinary from '../db/cloudinaryconfig.js';
import verifyToken from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/", verifyToken, [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight").notEmpty().withMessage("Price per night is required and must be a number"),
    body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
], upload.array("imageFiles", 6), async (req, res) => {
    try {
        const imageFiles = req.files;
        console.log('Image Files:', imageFiles);
        const newHotel = req.body;
        console.log('New Hotel Data:', newHotel);

        const uploadPromises = imageFiles.map(async (image) => {
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = `data:${image.mimetype};base64,${b64}`;
            try {
                const res = await cloudinary.uploader.upload(dataURI);
                console.log('Cloudinary Upload Result:', res);
                return res.url;
            } catch (uploadErr) {
                console.error('Upload Error:', uploadErr);
                throw uploadErr;
            }
        });

        const imageURLs = await Promise.all(uploadPromises);
        newHotel.imageURLs = imageURLs;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;

        const hotel = await query(
            "INSERT INTO hotels(userId, name, city, country, description, type, adultCount, childCount, facilities, pricePerNight, starRating, imageURLs, lastUpdated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
            [
                newHotel.userId, newHotel.name, newHotel.city, newHotel.country, newHotel.description, newHotel.type,
                newHotel.adultCount, newHotel.childCount, newHotel.facilities, newHotel.pricePerNight,
                newHotel.starRating, newHotel.imageURLs, newHotel.lastUpdated
            ]
        );

        res.status(201).send(hotel);
    } catch (err) {
        console.error('Error creating hotel:', err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.get("/", verifyToken, async(req,res) => {
    try {
        const hotels = await query("SELECT * FROM hotels WHERE userId = $1",[req.userId]);
        res.json(hotels);
    } catch (err) {
        res.status(500).send({message: "Error fetching hotels"});
    }
});

export default router;
