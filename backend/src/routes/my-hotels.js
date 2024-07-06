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

        const imageURLs = await uploadImages(imageFiles);
        newHotel.imageurls = imageURLs;
        newHotel.lastupdated = new Date();
        newHotel.userId = req.userId;

        const hotel = await query(
            "INSERT INTO hotels(userId, name, city, country, description, type, adultcount, childcount, facilities, pricepernight, starrating, imageurls, lastupdated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
            [
                newHotel.userId, newHotel.name, newHotel.city, newHotel.country, newHotel.description, newHotel.type,
                newHotel.adultcount, newHotel.childcount, newHotel.facilities, newHotel.pricepernight,
                newHotel.starrating, newHotel.imageurls, newHotel.lastupdated
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

router.get("/:id", verifyToken, async(req,res) => {
    const id = req.params.id;
    try {
        const hotel = await query("SELECT * FROM hotels WHERE id = $1 AND userid::integer = $2",[id, req.userId]);
        res.json(hotel.rows);
    } catch (err) {
        res.status(500).json({message: "Error fetching hotel"});
    }
});

router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async(req,res) => {

    console.log("Files are",req.files);
    try {
        const updatedHotel = req.body;
        updatedHotel.lastupdated = new Date();

        const files = req.files;
        const updatedImageURLs = await uploadImages(files);
        console.log("Updated images",updatedImageURLs);
        updatedHotel.imageurls = [...updatedImageURLs, ...(updatedHotel.imageurls || [])];
        console.log(updatedHotel);
        const hotel = await query("UPDATE hotels SET name = $1, city = $2, country = $3, description = $4, type = $5, adultcount = $6, childcount = $7, facilities = $8, pricepernight = $9, starrating = $10, imageurls = $11, lastupdated = $12 WHERE id = $13 AND userid::integer = $14 RETURNING *",
            [
                updatedHotel.name, updatedHotel.city, updatedHotel.country, updatedHotel.description, updatedHotel.type, updatedHotel.adultcount, updatedHotel.childcount, updatedHotel.facilities, updatedHotel.pricepernight, updatedHotel.starrating, updatedHotel.imageurls, updatedHotel.lastupdated, req.params.hotelId, req.userId
            ]);
        if(!hotel){
            res.status(404).json({message: "Hotel not found"})
        }
        res.status(201).json(hotel);
    } catch (err) {
        res.status(500).json({message: "Something went wrong"});
    }
});

async function uploadImages(imageFiles) {
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
    return imageURLs;
};

export default router;
