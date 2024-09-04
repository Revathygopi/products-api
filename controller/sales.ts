import { Request, Response } from 'express';
import pool from '../db';
import { SalesItem } from '../models/sales_items';
const format = require('pg-format');


export const addSalesLedger = async (req: Request, res: Response) => {
  const { mobile, customerName, adhar, address, invoiceDate, GSTN, items } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

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
      await client.query(stockUpdateQuery, [item.qty, item.productId]);
      const productUpdateQuery = 'UPDATE Product_list SET size = size::integer - $1 WHERE id = $2';
      await client.query(productUpdateQuery, [item.qty, item.productId]);

    });

    await Promise.all(itemPromises);
    await client.query('COMMIT');
    res.status(201).json({ message: 'Sales ledger and items created successfully.', id: salesLedgerId });
  }
  catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Sales ledger and items are not created' });
  }
  finally {
    client.release();
  }
};

export const getAllSalesLedgers = async (req: Request, res: Response) => {

  const {page='1',limit='10'}=req.query;
  const currentPage = parseInt(page as string)||1;
  const pageSize = parseInt(limit as string)||10;
  const offset = (currentPage-1)*pageSize;

  try {
    const countResult = await pool.query('select count(*) from Sales_ledger');
    const totalItems = parseInt(countResult.rows[0].count,10);
    const totalPages = Math.ceil(totalItems/pageSize);
    const ledgerResult = await pool.query('select * from Sales_ledger limit $1 offset $2',[pageSize,offset]);
    const salesLedgers = ledgerResult.rows;
    const results = await Promise.all(salesLedgers.map(async (ledger: any) => {
      const itemsResult = await pool.query('SELECT * FROM Sales_item WHERE sales_ledger_id = $1', [ledger.id]);
      return {
        ...ledger,
        items: itemsResult.rows
      };
    }));
    res.status(200).json({currentPage: page,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: totalPages,
      data: results
    });
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

    const itemPromises = items.map((item: SalesItem) => {
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




