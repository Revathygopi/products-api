import { Request, Response } from 'express';
import pool from '../db';
import { PurchaseItem } from '../models/purchase_items';

export const addPurchaseItem = async (req: Request, res: Response) => {
  const { purchaseLedgerId, productId, qty, GST, total, discount, subtotal } = req.body;
  try {

    const result = await pool.query(
      'INSERT INTO Purchaseds_items (purchase_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [purchaseLedgerId, productId, qty, GST, total, discount, subtotal]
    );
    const purchaseItem: PurchaseItem = result.rows[0];
    res.status(201).json(purchaseItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getpurchaseitems = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('select * from  Purchaseds_items ');
    const purchaseditems = result.rows
    res.status(200).json(purchaseditems)
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Cannot get purchased items' })
  }
}

export const getpurchaseitemsbyid = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM Purchaseds_items WHERE id = $1',
      [id]
    );
    const items: PurchaseItem = result.rows[0];
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
export const updatepurchaseitem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { purchaseLedgerId, productId, qty, GST, total, discount, subtotal } = req.body;
  try {
    const result = await pool.query('update Purchaseds_items set purchaseLedgerId = $1, productId = $2, qty = $3, GST = $4, total = $5, discount = $6, subtotal = $7 where id = $8  returning *',
      [purchaseLedgerId, productId, qty, GST, total, discount, subtotal, id])
    const products: PurchaseItem = result.rows[0];
    res.status(200).json(products)
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Canot able to update the purchase items' })
  }
}

export const deletepurchaseitem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('delete * from Purchaseds_items where id = $1 returning *', [id])
    res.status(200).send("Purchased item deleted succesfully")
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Canot able to delete the purchased item' })
  }
}
