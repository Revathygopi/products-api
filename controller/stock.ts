import { Request, Response } from 'express';
import pool from '../db';

export const addStock = async (req: Request, res: Response) => {
  const { quantity } = req.body;
  const { id } = req.params;
  console.log('productId:', id, ' quantity:', quantity);
  try {
    const checkQuery = 'SELECT * FROM Stock_items WHERE product_id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      const insertQuery = 'INSERT INTO Stock_items (product_id, stock_count) VALUES ($1, $2)';
      await pool.query(insertQuery, [id, quantity]);
      return res.status(201).json({ message: 'Product added and stock set successfully.' });
    } else {
      const stockUpdateQuery = 'UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2';
      const updateResult = await pool.query(stockUpdateQuery, [quantity, id]);

      if (updateResult.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({ message: 'Stock added successfully.' });
    }
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Unable to add stock' });
  }
};

export const getStockCount = async (req: Request, res: Response) => {


  try {
    const query = 'SELECT * FROM Stock_items ';
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving stock count:', error);
    res.status(500).json({ error: 'Unable to retrieve stock count' });
  }
};



