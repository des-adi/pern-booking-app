import express from 'express';
import { query } from "../db/database.js";
import {param, validationResult} from 'express-validator';
import Stripe from 'stripe';
import verifyToken from '../middleware/auth.js';

const stripe = new Stripe(process.env.STRIPE_API_KEY);

const router = express.Router();

router.get('/search', async (req, res) => {
    try {
      const queryClause = constructSearchQuery(req.query);
  
      let sortOptions = '';
      switch (req.query.sortOption) {
        case 'starRating':
          sortOptions = 'ORDER BY starrating DESC';
          break;
        case 'pricePerNightAsc':
          sortOptions = 'ORDER BY pricepernight ASC';
          break;
        case 'pricePerNightDesc':
          sortOptions = 'ORDER BY pricepernight DESC';
          break;
      }
  
      const pageSize = 5;
      const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1');
      const offset = (pageNumber - 1) * pageSize;
  
      const hotelsQuery = `
        SELECT * FROM hotels
        WHERE ${queryClause}
        ${sortOptions}
        LIMIT $1 OFFSET $2;
      `;
  
      const countQuery = `
        SELECT COUNT(*) FROM hotels
        WHERE ${queryClause};
      `;
  
      const hotelsResult = await query(hotelsQuery, [pageSize, offset]);
      const countResult = await query(countQuery);
  
      const total = parseInt(countResult.rows[0].count);
  
      const response = {
        data: hotelsResult.rows,
        pagination: {
          total,
          page: pageNumber,
          pages: Math.ceil(total / pageSize),
        },
      };
  
      res.json(response);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });

router.get("/:id", [
    param("id").notEmpty().isInt().withMessage("Hotel Id is required"),
  ], async (req,res) => {
  
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }
  
    const id = parseInt(req.params.id);
    try {
      const hotelData = await query("SELECT * FROM hotels WHERE id = $1", [id]);
      const hotel = hotelData.rows[0];
      res.json(hotel);
    } catch (err) {
      console.log(err);
      res.status(500).json({message: "Error fetching hotels"});
    }
  });
  
router.post("/:hotelId/bookings/payment-intent", verifyToken, async (req,res) => {
  //totalcost, hotelId, userId

  const {numberOfNights} = req.body;
  const hotelId = req.params.hotelId;

  const hotelData = await query("SELECT * FROM hotels WHERE id = $1",[hotelId]);

  const hotel = hotelData.rows[0];

  if(!hotel){
    res.status(400).json({message: "Hotel not found"});
  }

  const totalcost = hotel.pricepernight * numberOfNights;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalcost * 100,
    currency: "aud",
    metadata: {
      hotelId,
      userId: req.userId,
    },
  });

  if(!paymentIntent.client_secret){
    return res.status(500).json({message: "Error creating payment intent"});
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalcost,
  };

  res.send(response);
});

router.post("/:hotelId/bookings", verifyToken, async (req,res) => {
  try {
    const {paymentIntentId, ...bookingData} = req.body;
    const hotelId = req.params.hotelId;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log(paymentIntent.metadata);
    if(!paymentIntent){
      res.status(400).json({message: "Payment intent not found"});
    }

    if(paymentIntent.metadata.hotelId !== hotelId || paymentIntent.metadata.userId !== req.userId.toString()){
      res.status(400).json({message: "Payment intent mismatch"});
    }

    if(paymentIntent.status !== 'succeeded'){
      return res.status(400).json({message: `Payment intent not succeeded. Status ${paymentIntent.status}`});
    }

    const newBooking = {
      firstname: bookingData.firstname,
      lastname: bookingData.lastname,
      email: bookingData.email,
      adultcount: bookingData.adultcount,
      childcount: bookingData.childcount,
      checkin: new Date(bookingData.checkin),
      checkout: new Date(bookingData.checkout),
      userid: req.userId,
      totalcost: bookingData.totalcost,
      hotelid: hotelId,
    };
    console.log(newBooking);
    const hotel = await query(
      `INSERT INTO bookings (firstname, lastname, email, adultcount, childcount, checkin, checkout, userid, totalcost, hotelid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        newBooking.firstname,
        newBooking.lastname,
        newBooking.email,
        newBooking.adultcount,
        newBooking.childcount,
        newBooking.checkin,
        newBooking.checkout,
        newBooking.userid,
        newBooking.totalcost,
        newBooking.hotelid
      ]
    );
    res.status(200).send(hotel.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Something went wrong"});
  }
});
const constructSearchQuery = (queryParams) => {
    let queryParts = [];
  
    if (queryParams.destination) {
      queryParts.push(
        `(city ILIKE '%${queryParams.destination}%' OR country ILIKE '%${queryParams.destination}%')`
      );
    }
  
    if (queryParams.adultCount) {
      queryParts.push(`adultcount >= ${parseInt(queryParams.adultCount)}`);
    }
  
    if (queryParams.childCount) {
      queryParts.push(`childcount >= ${parseInt(queryParams.childCount)}`);
    }
  
    if (queryParams.facilities) {
      const facilitiesArray = Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities];
      const facilitiesCondition = facilitiesArray
        .map((facility) => `'${facility}'`)
        .join(',');
      queryParts.push(`facilities @> ARRAY[${facilitiesCondition}]::text[]`);
    }
  
    if (queryParams.types) {
      const typesArray = Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types];
      const typesCondition = typesArray.map((type) => `'${type}'`).join(',');
      queryParts.push(`type IN (${typesCondition})`);
    }
  
    if (queryParams.stars) {
      const starRatings = Array.isArray(queryParams.stars)
        ? queryParams.stars.map((star) => parseInt(star))
        : [parseInt(queryParams.stars)];
      const starsCondition = starRatings.join(',');
      queryParts.push(`starrating IN (${starsCondition})`);
    }
  
    if (queryParams.maxPrice) {
      queryParts.push(`pricepernight <= ${parseInt(queryParams.maxPrice)}`);
    }
  
    return queryParts.length ? queryParts.join(' AND ') : 'TRUE';
  };

export default router;



