import express from 'express';
import * as validation from "../middleware/validation/validationMiddleware.mjs";
<<<<<<< HEAD
import walletsService from '../services/walletService.mjs';
=======
import walletService from '../services/walletService.mjs';
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c


const router = express.Router();


/**
 * Returns user balance
*/
router.get(`/user/:id`,
    validation.idParam,
    validation.checkValidationResult,
    async (req, res) => {
        try {
<<<<<<< HEAD
            const userWallet = await walletsService.getWalletByUserId(req.params.id);
=======
            const userWallet = await walletService.findWalletByUserId(req.params.id);
>>>>>>> 6e40cedfd96eecfd3c13ac6b3622bb49f5b62f1c

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
