import { Request, Response } from 'express';
import pool from '../db';
import { SalesItem } from '../models/sales_items';

export const addsalesItem = async (req: Request, res: Response) => {
    const { salesId, productId, qty, GST, total, discount, subtotal } = req.body;
    try {

        const result = await pool.query('INSERT INTO Sales_item (sales_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [salesId, productId, qty, GST, total, discount, subtotal]);
        const salesItem: SalesItem = result.rows[0];
        res.status(201).json(salesItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getsalesitems = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('select * from  Sales_item ');
        const salesitems = result.rows
        res.status(200).json(salesitems)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Cannot get purchased items' })
    }
}


export const getsalesitemsbyid = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('select * FROM Sales_item where id = $1', [id]);
        const items: SalesItem = result.rows[0];
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
export const updatesalesitem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { salesId, productId, qty, GST, total, discount, subtotal } = req.body;
    try {
        const result = await pool.query('update Sales_item set salesId = $1, productId = $2, qty = $3, GST = $4, total = $5, discount = $6, subtotal = $7 where id = $8  returning *',
            [salesId, productId, qty, GST, total, discount, subtotal, id])
        const products: SalesItem = result.rows[0];
        res.status(200).json(products)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Canot able to update the sales items' })
    }
}

export const deletesalesitem = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('delete * from Sales_item where id = $1 returning *', [id])
        res.status(200).send("sales item deleted succesfully")
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Canot able to delete the sales item' })
    }
}
