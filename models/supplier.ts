import { Product } from '../models/product';

export interface Supplier {
  id: number;
  name: string;
  address: string;
  GSTN: string;
  products: Product[];
}
