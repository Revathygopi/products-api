import { Router } from 'express';
import { addSalesLedger,getAllSalesLedgers,getSalesLedgerById,updateSalesLedger,deleteSalesLedger } from '../controller/sales';

const router = Router();

router.post('/sales-ledger', addSalesLedger);
router.get('/sales-ledgers',getAllSalesLedgers);
router.get('/sales-ledger/:id', getSalesLedgerById);
router.put('/sales-ledger/:id', updateSalesLedger);
router.delete('/sales-ledger/:id', deleteSalesLedger);

export default router;