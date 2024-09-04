import { Request, Response } from 'express';
import pool from '../db';
import { PurchaseLedger } from '../models/purchase_ledger';
import { PurchaseItem } from '../models/purchase_items';
const format = require('pg-format');


export const addPurchaseLedger = async (req: Request, res: Response) => {
  const { supplierId, invoiceDate, GSTN, items } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const ledgerValues = [[supplierId, invoiceDate, GSTN]];
    const ledgerQuery = format('INSERT INTO Purchase_ledger (supplier_id, invoice_date, GSTN) VALUES %L RETURNING id', ledgerValues);
    const ledgerResult = await client.query(ledgerQuery);
    const purchaseLedgerId = ledgerResult.rows[0].id;
    const itemPromises = items.map(async (item: any) => {
      const itemValues = [purchaseLedgerId, item.productId, item.qty, item.GST, item.total, item.discount, item.subtotal];
      const itemQuery = format('INSERT INTO Purchaseds_items (purchase_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES %L', [itemValues]);
      await client.query(itemQuery);

      const stockUpdateQuery = 'UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2';
      await client.query(stockUpdateQuery, [item.qty, item.productId]);
      const productUpdateQuery = 'UPDATE Product_list SET size = size::integer + $1 WHERE id = $2';
      await client.query(productUpdateQuery, [item.qty, item.productId]);

    });

    await Promise.all(itemPromises);


    await client.query('COMMIT');

    res.status(201).json({ message: 'Purchase ledger and items created successfully.', id: purchaseLedgerId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding purchase ledger:', error);
    res.status(500).json({ error: 'Purchase ledger and items could not be created' });
  } finally {
    client.release();
  }
};

export const getAllPurchaseLedgers = async (req: Request, res: Response) => {

  const {page='1',limit='10'}=req.query;
  const currentPage = parseInt(page as string)||1;
  const pageSize = parseInt(limit as string)||10;
  const offset = (currentPage-1)*pageSize;
  try {

    const countResult = await pool.query('select count(*) from purchase_ledger');
    const totalItems = parseInt(countResult.rows[0].count,10);
    const totalPages = Math.ceil(totalItems/pageSize);
    const ledgerResult = await pool.query('SELECT * FROM Purchase_ledger limit $1 offset $2',[pageSize,offset]);
    const purchaseLedgers = ledgerResult.rows;
    const results = await Promise.all(purchaseLedgers.map(async (ledger: any) => {
      const itemsResult = await pool.query('SELECT * FROM Purchaseds_items WHERE purchase_ledger_id = $1', [ledger.id]);
      return {
        ...ledger,
        items: itemsResult.rows
      };
    }));

    res.status(200).json({
      currentPage: page,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: totalPages,
      data: results
    });
  } catch (error) {
    console.error('Error retrieving purchase ledgers with items:', error);
    res.status(500).json({ error: 'Unable to retrieve purchase ledgers with items' });
  }
};


export const getpurchaseledgerbyid = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ledgerResult = await pool.query('select * from Purchase_ledger where id = $1', [id]);
    const purchaseLedger = ledgerResult.rows[0];
    const itemsResult = await pool.query('select * from Purchaseds_items where purchase_ledger_id = $1', [id]);

    purchaseLedger.items = itemsResult.rows;
    res.status(200).json(purchaseLedger);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Canot get purchase ledger by id' });
  }
};
export const updatepurchaseledger = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { supplierId, invoiceDate, GSTN, items } = req.body;

  console.log(`Updating Purchase Ledger with ID: ${id}`);

  try {
    await pool.query('BEGIN');
    await pool.query(
      'UPDATE Purchase_ledger SET supplier_id = $1, invoice_date = $2, GSTN = $3 WHERE id = $4 returning *',
      [supplierId, invoiceDate, GSTN, id]
    );

    await pool.query('DELETE FROM Purchaseds_items WHERE purchase_ledger_id = $1', [id]);

    const itemPromises = items.map(async (item: PurchaseItem) => {

      await pool.query(
        'INSERT INTO Purchaseds_items (purchase_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, item.productId, item.qty, item.GST, item.total, item.discount, item.subtotal]
      );
      await pool.query(
        'UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2',
        [item.qty, item.productId]
      );
    });

    await Promise.all(itemPromises);
    await pool.query('COMMIT');
    res.status(200).json({ message: 'Purchase ledger and items updated successfully.' });
  } catch (error) {

    await pool.query('ROLLBACK');
    console.error('Error updating purchase ledger:', error);
    res.status(500).json({ error: 'Purchase ledger and items could not be updated' });
  }
};


export const deletepurchaseledger = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');

    const itemsResult = await pool.query('SELECT product_id, qty FROM Purchaseds_items WHERE purchase_ledger_id = $1', [id]);
    await pool.query('DELETE FROM Purchaseds_items WHERE purchase_ledger_id = $1', [id]);

    const stockUpdatePromises = itemsResult.rows.map((item: any) =>
      pool.query('UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2', [item.qty, item.product_id])
    );
    await Promise.all(stockUpdatePromises);
    await pool.query('DELETE FROM Purchase_ledger WHERE id = $1', [id]);
    await pool.query('COMMIT');

    res.status(200).json({ message: 'Purchase ledger and items deleted successfully.' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error deleting purchase ledger:', error);
    res.status(500).json({ error: 'Purchase ledger and items could not be deleted' });
  }
};

