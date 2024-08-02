import { Request, Response } from 'express';
import pool from '../db';
import multer from 'multer';
import { Product } from '../models/product';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export const addProduct = (req: Request, res: Response) => {
  upload.single('image')(req, res, async (err) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { name, qtyType, size } = req.body;
    const imageUrl = req.file?.path || '';

    try {
      const result = await pool.query(
        'INSERT INTO Product_list (name, qtyType, size, imageUrl) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, qtyType, size, imageUrl]
      );
      const product: Product = result.rows[0];
      res.status(201).json(product);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  });
};
