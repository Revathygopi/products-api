"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchase_items_1 = require("../controller/purchase_items");
const router = (0, express_1.Router)();
router.post('/purchase-items', purchase_items_1.addPurchaseItem);
router.get('/purchaseditems', purchase_items_1.getpurchaseitems);
router.get('/purchase-items/:id', purchase_items_1.getpurchaseitemsbyid);
router.put('/purchase-item/:id', purchase_items_1.updatepurchaseitem);
router.delete('/purchase-item/:id', purchase_items_1.deletepurchaseitem);
exports.default = router;
