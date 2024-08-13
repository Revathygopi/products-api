import { Router } from 'express';
import { addProduct,getproduct,getproductbyid,updateproduct,deleteproduct } from '../controller/product';

const router = Router();

router.post('/product', addProduct);
router.get('/products',getproduct);
router.get('/products/:id',getproductbyid);
router.put('/product/:id',updateproduct)
router.delete('/product/:id',deleteproduct);

export default router;
