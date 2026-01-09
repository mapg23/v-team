import express from 'express';
import * as validation from "../middleware/validation/validationMiddleware.mjs";
import walletService from '../services/walletService.mjs';


const router = express.Router();


/**
 * Returns user balance
*/
router.get(`/user/:id`,
    validation.idParam,
    validation.checkValidationResult,
    async (req, res) => {
        try {
            const userWallet = await walletService.findWalletByUserId(req.params.id);

            return res.status(200).json(userWallet);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not fetch wallet for user ${req.params.id}`,
                message: err.message
            });
        }
    });

export default router;
