"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletepurchaseitem = exports.updatepurchaseitem = exports.getpurchaseitemsbyid = exports.getpurchaseitems = exports.addPurchaseItem = void 0;
const db_1 = __importDefault(require("../db"));
const addPurchaseItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { purchaseLedgerId, productId, qty, GST, total, discount, subtotal } = req.body;
    try {
        const result = yield db_1.default.query('INSERT INTO Purchaseds_items (purchase_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [purchaseLedgerId, productId, qty, GST, total, discount, subtotal]);
        const purchaseItem = result.rows[0];
        res.status(201).json(purchaseItem);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.addPurchaseItem = addPurchaseItem;
const getpurchaseitems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('select * from  Purchaseds_items ');
        const purchaseditems = result.rows;
        res.status(200).json(purchaseditems);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Cannot get purchased items' });
    }
});
exports.getpurchaseitems = getpurchaseitems;
const getpurchaseitemsbyid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('SELECT * FROM Purchaseds_items WHERE id = $1', [id]);
        const items = result.rows[0];
        res.status(200).json(items);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.getpurchaseitemsbyid = getpurchaseitemsbyid;
const updatepurchaseitem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { purchaseLedgerId, productId, qty, GST, total, discount, subtotal } = req.body;
    try {
        const result = yield db_1.default.query('update Purchaseds_items set purchaseLedgerId = $1, productId = $2, qty = $3, GST = $4, total = $5, discount = $6, subtotal = $7 where id = $8  returning *', [purchaseLedgerId, productId, qty, GST, total, discount, subtotal, id]);
        const products = result.rows[0];
        res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Canot able to update the purchase items' });
    }
});
exports.updatepurchaseitem = updatepurchaseitem;
const deletepurchaseitem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('delete * from Purchaseds_items where id = $1 returning *', [id]);
        res.status(200).json({ mesaage: "Purchased item deleted succesfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Canot able to delete the purchased item' });
    }
});
exports.deletepurchaseitem = deletepurchaseitem;
