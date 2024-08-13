import { SalesItem } from "./sales_items";
export interface SalesLedger {
    id: number;
    mobile: string;
    customerName: string;
    adhar: string;
    address: string;
    invoiceDate: Date;
    GSTN: string;
    items: SalesItem[]
  }