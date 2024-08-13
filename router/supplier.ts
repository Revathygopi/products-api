import { Router } from 'express';
import { addSupplier, getSupplier,getsupplierbyid,updatesupplier,deletesupplier } from '../controller/supplier';

const router = Router();

router.post('/addsuppliers', addSupplier);
router.get('/getSupplier', getSupplier);
router.get('/getsupplier/:id',getsupplierbyid)
router.put('/supplier/:id',updatesupplier);
router.delete('/supplier/:id',deletesupplier)

export default router;
