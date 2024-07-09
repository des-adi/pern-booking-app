import express from 'express';
import { query } from "../db/database.js";
import {param, validationResult} from 'express-validator';
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
      const hotel = await query("SELECT * FROM hotels WHERE id = $1", [id]);
      res.json(hotel.rows[0]);
    } catch (err) {
      console.log(err);
      res.status(500).json({message: "Error fetching hotels"});
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



