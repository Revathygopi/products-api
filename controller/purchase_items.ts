import { Request, Response } from 'express';
import pool from '../db';
import { PurchaseItem } from '../models/purchase_items';

export const addPurchaseItem = async (req: Request, res: Response) => {
  const { purchaseLedgerId, productId, qty, GST, total, discount, subtotal } = req.body;

  if (!purchaseLedgerId || !productId || qty === undefined || GST === undefined || total === undefined || discount === undefined || subtotal === undefined) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
  
    const result = await pool.query(
      'INSERT INTO Purchaseds_items (purchase_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [purchaseLedgerId, productId, qty, GST, total, discount, subtotal]
    );
    const purchaseItem: PurchaseItem = result.rows[0];
    res.status(201).json(purchaseItem);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getItemsByPurchaseLedgerId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM Purchaseds_items WHERE purchase_ledger_id = $1',
      [id]
    );
    const items: PurchaseItem[] = result.rows;
    res.status(200).json(items);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
