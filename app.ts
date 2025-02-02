import express from 'express';
import cors from 'cors';
import productRoutes from './router/product';
import supplierRoutes from './router/supplier';
import purchaseLedgerRoutes from './router/purchase_ledger';
import purchaseItemRoutes from './router/purchase_items';
import salesItemsRoutes from './router/sales_items';
import salesRoutes from'./router/sales';
import path from 'path';

const PORT =  5000;
const app = express();

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', productRoutes);
app.use('/api', supplierRoutes);
app.use('/api', purchaseLedgerRoutes);
app.use('/api', purchaseItemRoutes);
app.use('/api', salesItemsRoutes);
app.use('/api', salesRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
