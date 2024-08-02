import { Router } from 'express';
import { addPurchaseItem, getItemsByPurchaseLedgerId } from '../controller/purchase_items';

const router = Router();

router.post('/purchase-items', addPurchaseItem);
router.get('/purchase-items/:id', getItemsByPurchaseLedgerId);

export default router;
