import { Router } from 'express';
import { addProduct } from '../controller/product';

const router = Router();

router.post('/products', addProduct);

export default router;
