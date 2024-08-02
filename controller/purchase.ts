import { Request, Response } from 'express';
import pool from '../db';
import { PurchaseLedger } from '../models/purchase_ledger';

export const addPurchaseLedger = async (req: Request, res: Response) => {
  const { supplierId, invoiceDate, GSTN, items } = req.body;

  if (!supplierId || !invoiceDate || !GSTN || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Missing or invalid required fields.' });
  }

  try {

    const ledgerResult = await pool.query(
      'INSERT INTO Purchase_ledger (supplier_id, invoice_date, GSTN) VALUES ($1, $2, $3) RETURNING id',
      [supplierId, invoiceDate, GSTN]
    );
    const purchaseLedgerId = ledgerResult.rows[0].id;

    const itemPromises = items.map((item: any) =>
      pool.query(
        'INSERT INTO Purchaseds_items (purchase_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [purchaseLedgerId, item.productId, item.qty, item.GST, item.total, item.discount, item.subtotal]
      )
    );
    await Promise.all(itemPromises);

    res.status(201).json({ message: 'Purchase ledger and items created successfully.' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
