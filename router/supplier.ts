import { Router } from 'express';
import { addSupplier, getSupplier } from '../controller/supplier';

const router = Router();

router.post('/addsuppliers', addSupplier);
router.get('/getSupplier', getSupplier);

export default router;
