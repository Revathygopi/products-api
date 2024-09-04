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

    const { name, qtytype, size, price, gst } = req.body;
    const imageUrl = req.file?.path || '';

    try {
      const result = await pool.query(
        'INSERT INTO Product_list (name, qtytype, size, price,gst, imageUrl) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *',
        [name, qtytype, size, price, gst, imageUrl]
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
  const { search = '', sort = 'date', order = 'desc', page = '1', limit = '10' } = req.query;

  const validSortOptions = ['date', 'price', 'name'];
  const validOrderOptions = ['asc', 'desc'];

  const sortBy = validSortOptions.includes(sort as string) ? sort : 'date';
  const sortOrder = validOrderOptions.includes(order as string) ? order : 'desc';
  const currentPage = parseInt(page as string) || 1;
  const pageSize = parseInt(limit as string) || 10;

  const offset = (currentPage - 1) * pageSize;

  try {
    const result = await pool.query(`
      SELECT * FROM Product_list
      WHERE name ILIKE $1
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $2 OFFSET $3
    `, [`%${search}%`, pageSize, offset]);
    const countResult = await pool.query(`
      SELECT COUNT(*) FROM Product_list
      WHERE name ILIKE $1
    `, [`%${search}%`]);

    const products = result.rows;
    const totalProducts = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).json({
      products,
      totalProducts,
      currentPage,
      totalPages
      
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

    const { name, qtytype, size, price, gst } = req.body;
    const { id } = req.params;
    const imageUrl = req.file?.path || '';

    try {
      const result = await pool.query(
        'Update  Product_list set name = $1, qtytype = $2, size = $3, price = $4, gst = $5, imageUrl = $6 where id = $7 RETURNING *',
        [name, qtytype, size, price, gst, imageUrl, id]
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
    res.status(200).json({ meassage: 'Product deleted succesfully' });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }

}

