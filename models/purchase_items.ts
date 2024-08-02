export interface PurchaseItem {
  id: number;
  purchaseLedgerId: number;
  productId: number;
  qty: number;
  GST: number;
  total: number;
  discount: number;
  subtotal: number;
}
