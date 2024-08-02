import { Request, Response } from 'express';
import pool from '../db';
import { Supplier } from '../models/supplier';

export const addSupplier = async (req: Request, res: Response) => {
  const { name, address, GSTN, products } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Supplier_list (name, address, GSTN, products) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, address, GSTN, JSON.stringify(products)]
    );
    const supplier: Supplier = result.rows[0];
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error});
  }
};

export const getSupplier = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM Supplier_list');
    const products = result.rows;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error});
  }
};
