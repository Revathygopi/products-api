import { Product } from '../models/product';

export interface Supplier {
  id: number;
  name: string;
  address: string;
  gstn: string;
  products: Product[];
}
