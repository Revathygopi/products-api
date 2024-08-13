import { Router } from 'express';
import { addPurchaseLedger,getAllPurchaseLedgers,getpurchaseledgerbyid,updatepurchaseledger,deletepurchaseledger } from '../controller/purchase';
import { getStockCount,addStock } from '../controller/stock';
const router = Router();

router.post('/purchase', addPurchaseLedger);
router.get('/purchases',getAllPurchaseLedgers);
router.get('/purchases/:id',getpurchaseledgerbyid);
router.put('/purchase/:id',updatepurchaseledger);
router.delete('/purchases/:id',deletepurchaseledger)
router.get('/stocks',getStockCount)
router.post('/stock/:id', addStock)

export default router;

