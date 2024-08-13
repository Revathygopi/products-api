import { Router } from 'express';
import { addsalesItem,getsalesitems,getsalesitemsbyid,updatesalesitem,deletesalesitem } from '../controller/sales_items';

const router = Router();

router.post('/sales-items', addsalesItem);
router.get('/sales-items', getsalesitems);
router.get('/sales-items/:id', getsalesitemsbyid);
router.put('/sales-item/:id', updatesalesitem);
router.delete('/sales-item/:id', deletesalesitem);

export default router;