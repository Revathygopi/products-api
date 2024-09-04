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
exports.deletepurchaseledger = exports.updatepurchaseledger = exports.getpurchaseledgerbyid = exports.getAllPurchaseLedgers = exports.addPurchaseLedger = void 0;
const db_1 = __importDefault(require("../db"));
const format = require('pg-format');
const addPurchaseLedger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { supplierId, invoiceDate, GSTN, items } = req.body;
    const client = yield db_1.default.connect();
    try {
        yield client.query('BEGIN');
        const ledgerValues = [[supplierId, invoiceDate, GSTN]];
        const ledgerQuery = format('INSERT INTO Purchase_ledger (supplier_id, invoice_date, GSTN) VALUES %L RETURNING id', ledgerValues);
        const ledgerResult = yield client.query(ledgerQuery);
        const purchaseLedgerId = ledgerResult.rows[0].id;
        const itemPromises = items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const itemValues = [purchaseLedgerId, item.productId, item.qty, item.GST, item.total, item.discount, item.subtotal];
            const itemQuery = format('INSERT INTO Purchaseds_items (purchase_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES %L', [itemValues]);
            yield client.query(itemQuery);
            const stockUpdateQuery = 'UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2';
            yield client.query(stockUpdateQuery, [item.qty, item.productId]);
            const productUpdateQuery = 'UPDATE Product_list SET size = size::integer + $1 WHERE id = $2';
            yield client.query(productUpdateQuery, [item.qty, item.productId]);
        }));
        yield Promise.all(itemPromises);
        yield client.query('COMMIT');
        res.status(201).json({ message: 'Purchase ledger and items created successfully.', id: purchaseLedgerId });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Error adding purchase ledger:', error);
        res.status(500).json({ error: 'Purchase ledger and items could not be created' });
    }
    finally {
        client.release();
    }
});
exports.addPurchaseLedger = addPurchaseLedger;
const getAllPurchaseLedgers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = '1', limit = '10' } = req.query;
    const currentPage = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (currentPage - 1) * pageSize;
    try {
        const countResult = yield db_1.default.query('select count(*) from purchase_ledger');
        const totalItems = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalItems / pageSize);
        const ledgerResult = yield db_1.default.query('SELECT * FROM Purchase_ledger limit $1 offset $2', [pageSize, offset]);
        const purchaseLedgers = ledgerResult.rows;
        const results = yield Promise.all(purchaseLedgers.map((ledger) => __awaiter(void 0, void 0, void 0, function* () {
            const itemsResult = yield db_1.default.query('SELECT * FROM Purchaseds_items WHERE purchase_ledger_id = $1', [ledger.id]);
            return Object.assign(Object.assign({}, ledger), { items: itemsResult.rows });
        })));
        res.status(200).json({
            currentPage: page,
            pageSize: pageSize,
            totalItems: totalItems,
            totalPages: totalPages,
            data: results
        });
    }
    catch (error) {
        console.error('Error retrieving purchase ledgers with items:', error);
        res.status(500).json({ error: 'Unable to retrieve purchase ledgers with items' });
    }
});
exports.getAllPurchaseLedgers = getAllPurchaseLedgers;
const getpurchaseledgerbyid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ledgerResult = yield db_1.default.query('select * from Purchase_ledger where id = $1', [id]);
        const purchaseLedger = ledgerResult.rows[0];
        const itemsResult = yield db_1.default.query('select * from Purchaseds_items where purchase_ledger_id = $1', [id]);
        purchaseLedger.items = itemsResult.rows;
        res.status(200).json(purchaseLedger);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Canot get purchase ledger by id' });
    }
});
exports.getpurchaseledgerbyid = getpurchaseledgerbyid;
const updatepurchaseledger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { supplierId, invoiceDate, GSTN, items } = req.body;
    console.log(`Updating Purchase Ledger with ID: ${id}`);
    try {
        yield db_1.default.query('BEGIN');
        yield db_1.default.query('UPDATE Purchase_ledger SET supplier_id = $1, invoice_date = $2, GSTN = $3 WHERE id = $4 returning *', [supplierId, invoiceDate, GSTN, id]);
        yield db_1.default.query('DELETE FROM Purchaseds_items WHERE purchase_ledger_id = $1', [id]);
        const itemPromises = items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.default.query('INSERT INTO Purchaseds_items (purchase_ledger_id, product_id, qty, GST, total, discount, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, item.productId, item.qty, item.GST, item.total, item.discount, item.subtotal]);
            yield db_1.default.query('UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2', [item.qty, item.productId]);
        }));
        yield Promise.all(itemPromises);
        yield db_1.default.query('COMMIT');
        res.status(200).json({ message: 'Purchase ledger and items updated successfully.' });
    }
    catch (error) {
        yield db_1.default.query('ROLLBACK');
        console.error('Error updating purchase ledger:', error);
        res.status(500).json({ error: 'Purchase ledger and items could not be updated' });
    }
});
exports.updatepurchaseledger = updatepurchaseledger;
const deletepurchaseledger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.query('BEGIN');
        const itemsResult = yield db_1.default.query('SELECT product_id, qty FROM Purchaseds_items WHERE purchase_ledger_id = $1', [id]);
        yield db_1.default.query('DELETE FROM Purchaseds_items WHERE purchase_ledger_id = $1', [id]);
        const stockUpdatePromises = itemsResult.rows.map((item) => db_1.default.query('UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2', [item.qty, item.product_id]));
        yield Promise.all(stockUpdatePromises);
        yield db_1.default.query('DELETE FROM Purchase_ledger WHERE id = $1', [id]);
        yield db_1.default.query('COMMIT');
        res.status(200).json({ message: 'Purchase ledger and items deleted successfully.' });
    }
    catch (error) {
        yield db_1.default.query('ROLLBACK');
        console.error('Error deleting purchase ledger:', error);
        res.status(500).json({ error: 'Purchase ledger and items could not be deleted' });
    }
});
exports.deletepurchaseledger = deletepurchaseledger;
