import express from "express";
import pricesModel from "../models/prices.mjs";

const router = express.Router();

/**
 * Get prices for a city
 */
router.get("/:cityId", async (req, res) => {
    try {
        const cityId = Number(req.params.cityId);
        const result = await pricesModel.getPricesByCityId(cityId);

        if (!result.length) {
            return res.status(404).json({ error: `Prices not found for city with ID ${cityId}` });
        }

        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Create prices for a city
 */
router.post("/", async (req, res) => {
    try {
        const {
            cityId,
            startFee,
            minuteFee,
            parkingFee,
            discountMultiplier
        } = req.body;

        const result = await pricesModel.createPrices({
            city_id: cityId,
            start_fee: startFee,
            minute_fee: minuteFee,
            parking_fee: parkingFee,
            discount_multiplier: discountMultiplier
        });

        if (!result.affectedRows) {
            return res.status(500).json({ error: "Could not greate prices for city" });
        }

        res.status(201).json({ result: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Update prices for a city
 */
router.put("/:cityId", async (req, res) => {
    try {
        const cityId = Number(req.params.cityId);
        const data = req.body;

        const result = await pricesModel.updatePricesByCityId(cityId, data);

        if (!result.affectedRows) {
            return res.status(404).json({ error: "Prices not found for city" });
        }

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
