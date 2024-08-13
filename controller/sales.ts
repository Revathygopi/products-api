import { Request, Response } from 'express';
import pool from '../db';
import { SalesItem } from '../models/sales_items';
const format = require('pg-format');

export const addSalesLedger = async (req: Request, res: Response) => {
  const { mobile, customerName, adhar, address, invoiceDate, GSTN, items } = req.body;

  try {
    await pool.query('BEGIN');
    const ledgerValues = [[mobile, customerName, adhar, address, invoiceDate, GSTN]];
    const ledgerQuery = format('insert into Sales_ledger (mobile, customer_name, adhar, address, invoice_date, GSTN) values %L returning id',
      ledgerValues);
    const ledgerResult = await pool.query(ledgerQuery);
    const salesLedgerId: number = ledgerResult.rows[0].id;

    const itemPromises = items.map(async (item: SalesItem) => {
      const itemValues = [[salesLedgerId, item.productId, item.qty, item.GST, item.total, item.discount, item.subtotal]]
      const itemQuery = format('insert into Sales_item (sales_ledger_id, product_id, qty, GST, total, discount, subtotal) values %L', [itemValues])
      await pool.query(itemQuery);
      const stockUpdateQuery = 'UPDATE Stock_items SET stock_count = stock_count - $1 WHERE product_id = $2';
      await pool.query(stockUpdateQuery, [item.qty, item.productId]);


    });
    await Promise.all(itemPromises);
    await pool.query('COMMIT');

    res.status(201).json({ message: 'Sales ledger and items created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sales ledger and items are not created' });
  }
}
export const getAllSalesLedgers = async (req: Request, res: Response) => {
  try {
    const ledgerResult = await pool.query('select * from Sales_ledger');
    const salesLedgers = ledgerResult.rows;
    res.status(200).json(salesLedgers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Cannot get sales ledgers' });
  }
};

export const getSalesLedgerById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ledgerResult = await pool.query('select * from Sales_ledger WHERE id = $1', [id]);

    const salesLedger = ledgerResult.rows[0];
    const itemsResult = await pool.query('select * from Sales_item where sales_ledger_id = $1', [id]);

    salesLedger.items = itemsResult.rows;
    res.status(200).json(salesLedger);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Cannot get sales ledger by id' });
  }
};

export const updateSalesLedger = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { mobile, customerName, adhar, address, invoiceDate, GSTN, items } = req.body;

  try {
    await pool.query('BEGIN');
    await pool.query(
      'update Sales_ledger SET mobile = $1, customer_name = $2, adhar = $3, address = $4, invoice_date = $5, GSTN = $6 where id = $7',
      [mobile, customerName, adhar, address, invoiceDate, GSTN, id]
    );

    await pool.query('delete from Sales_item where sales_ledger_id = $1', [id]);

    const itemPromises = items.map((item: SalesItem) =>{
      pool.query(
        'insert into Sales_item (sales_ledger_id, product_id, qty, GST, total, discount, subtotal) values ($1, $2, $3, $4, $5, $6, $7)',
        [id, item.productId, item.qty, item.GST, item.total, item.discount, item.subtotal]
      )
       pool.query(
        'UPDATE Stock_items SET stock_count = stock_count - $1 WHERE product_id = $2',
        [item.qty, item.productId]
      );
    }
    );
    
    await Promise.all(itemPromises);
    await pool.query('COMMIT');
    res.status(200).json({
      message: 'Sales ledger and items updated successfully.',
    });

    res.status(200).json({ message: 'Sales ledger and items updated successfully.' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.log(error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Sales ledger and items could not be updated' });
    }
  }
};


export const deleteSalesLedger = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');
    const itemsResult = await pool.query('SELECT product_id, qty FROM Sales_item WHERE sales_ledger_id = $1', [id]);
    await pool.query('delete from Sales_item where sales_ledger_id = $1', [id]);
    const stockUpdatePromises = itemsResult.rows.map((item: any) =>
      pool.query('UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2', [item.qty, item.product_id])
    );
    await Promise.all(stockUpdatePromises);
    await pool.query('delete from Sales_ledger where id = $1', [id]);
    await pool.query('COMMIT');
    res.status(200).json({ message: 'Sales ledger and items deleted successfully.' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.log(error);
    res.status(500).json({ error: 'Sales ledger and items are not deleted' });
  }
};


    

   