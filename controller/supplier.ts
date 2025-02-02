import { Request, Response } from 'express';
import pool from '../db';
import { Supplier } from '../models/supplier';

export const addSupplier = async (req: Request, res: Response) => {
  const { name, address, gstn, products } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Supplier_list (name, address, gstn, products) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, address, gstn, JSON.stringify(products)]
    );
    const supplier: Supplier = result.rows[0];
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getSupplier = async (req: Request, res: Response) => {
  const {search = '', page = '1',limit = '10'}=req.query;
  const currentPage = parseInt(page as string)||1;
  const pageSize = parseInt(limit as string)||10;
  const offset = (currentPage-1)*pageSize;
  try {
    const countResult = await pool.query('select count(*) from Supplier_list where name ilike $1',[`%${search}%`]);
    const totalItems = parseInt(countResult.rows[0].count,10);
    const totalPages = Math.ceil(totalItems/pageSize)
    const result = await pool.query('SELECT * FROM Supplier_list   where name ilike $1 limit $2 offset $3',[`%${search}%`,pageSize,offset]);
    const supplier = result.rows;
    res.status(200).json({
      currentPage: page,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: totalPages,
      supplier
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getsupplierbyid = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM Supplier_list WHERE id = $1',
      [id]
    );
    const supplier: Supplier = result.rows[0];
    res.status(200).json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
export const updatesupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, gstn, products } = req.body;
  try {
    const result = await pool.query('UPDATE Supplier_list SET name= $1, address = $2, GSTN = $3, products = $4  WHERE id = $5  RETURNING *',
      [name, address, gstn, JSON.stringify(products),id])
    const supplier: Supplier = result.rows[0];
    res.status(200).json(supplier)
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Canot able to update the supplier' })
  }
}

export const deletesupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Supplier_list WHERE id = $1 RETURNING *', [id])
    res.status(200).json({meassage:"Supplier deleted succesfully"})
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Canot able to delete the supplier' })
  }
}

