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
export const getproduct = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('select * from Product_list');
    const product = result.rows;
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export const getproductbyid = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await pool.query('select * from Product_list where id = $1', [id])
    const product: Product = result.rows[0];
    res.status(200).json(product);

  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }
}
export const updateproduct = async (req: Request, res: Response) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { name, qtyType, size } = req.body;
    const { id } = req.params;
    const imageUrl = req.file?.path || req.body.imageUrl;

    try {
      const result = await pool.query(
        'Update  Product_list set name = $1, qtyType = $2, size = $3, imageUrl = $4 where id = $5 RETURNING *',
        [name, qtyType, size, imageUrl, id]
      );
      const product: Product = result.rows[0];
      res.status(200).json(product);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  });
}
export const deleteproduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(' delete from Product_list where id =$1 returning *', [id]);
    res.status(200).send('Product deleted succesfully');
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }

}

