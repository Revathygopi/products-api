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
exports.deletesalesitem = exports.updatesalesitem = exports.getsalesitemsbyid = exports.getsalesitems = exports.addsalesItem = void 0;
const db_1 = __importDefault(require("../db"));
const addsalesItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { salesId, productId, qty, GST, total, discount, subtotal } = req.body;
    try {
        const result = yield db_1.default.query('INSERT INTO Sales_item (sales_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [salesId, productId, qty, GST, total, discount, subtotal]);
        const salesItem = result.rows[0];
        res.status(201).json(salesItem);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.addsalesItem = addsalesItem;
const getsalesitems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('select * from  Sales_item ');
        const salesitems = result.rows;
        res.status(200).json(salesitems);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Cannot get purchased items' });
    }
});
exports.getsalesitems = getsalesitems;
const getsalesitemsbyid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('select * FROM Sales_item where id = $1', [id]);
        const items = result.rows[0];
        res.status(200).json(items);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.getsalesitemsbyid = getsalesitemsbyid;
const updatesalesitem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { salesId, productId, qty, GST, total, discount, subtotal } = req.body;
    try {
        const result = yield db_1.default.query('update Sales_item set salesId = $1, productId = $2, qty = $3, GST = $4, total = $5, discount = $6, subtotal = $7 where id = $8  returning *', [salesId, productId, qty, GST, total, discount, subtotal, id]);
        const products = result.rows[0];
        res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Canot able to update the sales items' });
    }
});
exports.updatesalesitem = updatesalesitem;
const deletesalesitem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('delete * from Sales_item where id = $1 returning *', [id]);
        res.status(200).send("sales item deleted succesfully");
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Canot able to delete the sales item' });
    }
});
exports.deletesalesitem = deletesalesitem;
