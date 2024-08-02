import { Router } from 'express';
import { addPurchaseLedger } from '../controller/purchase';

const router = Router();

router.post('/purchase-ledgers', addPurchaseLedger);

export default router;

