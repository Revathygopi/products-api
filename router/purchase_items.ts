import { Router } from 'express';
import { addPurchaseItem,getpurchaseitems, getpurchaseitemsbyid,updatepurchaseitem,deletepurchaseitem } from '../controller/purchase_items';

const router = Router();

router.post('/purchase-items', addPurchaseItem);
router.get('/purchaseditems',getpurchaseitems);
router.get('/purchase-items/:id', getpurchaseitemsbyid);
router.put('/purchase-item/:id', updatepurchaseitem);
router.delete('/purchase-item/:id', deletepurchaseitem);

export default router;
