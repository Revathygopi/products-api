import express from 'express';
import productRoutes from './router/product';
import supplierRoutes from './router/supplier';
import purchaseLedgerRoutes from './router/purchase_ledger';
import purchaseItemRoutes from './router/purchase_items';
import path from 'path';

const PORT =  5000;
const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', productRoutes);
app.use('/api', supplierRoutes);
app.use('/api', purchaseLedgerRoutes);
app.use('/api', purchaseItemRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
