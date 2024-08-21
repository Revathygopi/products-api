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
exports.deleteSalesLedger = exports.updateSalesLedger = exports.getSalesLedgerById = exports.getAllSalesLedgers = exports.addSalesLedger = void 0;
const db_1 = __importDefault(require("../db"));
const format = require('pg-format');
const addSalesLedger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile, customerName, adhar, address, invoiceDate, GSTN, items } = req.body;
    try {
        yield db_1.default.query('BEGIN');
        const ledgerValues = [[mobile, customerName, adhar, address, invoiceDate, GSTN]];
        const ledgerQuery = format('insert into Sales_ledger (mobile, customer_name, adhar, address, invoice_date, GSTN) values %L returning id', ledgerValues);
        const ledgerResult = yield db_1.default.query(ledgerQuery);
        const salesLedgerId = ledgerResult.rows[0].id;
        const itemPromises = items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const itemValues = [[salesLedgerId, item.productId, item.qty, item.GST, item.total, item.discount, item.subtotal]];
            const itemQuery = format('insert into Sales_item (sales_ledger_id, product_id, qty, GST, total, discount, subtotal) values %L', [itemValues]);
            yield db_1.default.query(itemQuery);
            const stockUpdateQuery = 'UPDATE Stock_items SET stock_count = stock_count - $1 WHERE product_id = $2';
            yield db_1.default.query(stockUpdateQuery, [item.qty, item.productId]);
        }));
        yield Promise.all(itemPromises);
        yield db_1.default.query('COMMIT');
        res.status(201).json({ message: 'Sales ledger and items created successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sales ledger and items are not created' });
    }
});
exports.addSalesLedger = addSalesLedger;
const getAllSalesLedgers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ledgerResult = yield db_1.default.query('select * from Sales_ledger');
        const salesLedgers = ledgerResult.rows;
        const results = yield Promise.all(salesLedgers.map((ledger) => __awaiter(void 0, void 0, void 0, function* () {
            const itemsResult = yield db_1.default.query('SELECT * FROM Sales_item WHERE sales_ledger_id = $1', [ledger.id]);
            return Object.assign(Object.assign({}, ledger), { items: itemsResult.rows });
        })));
        res.status(200).json(results);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Cannot get sales ledgers' });
    }
});
exports.getAllSalesLedgers = getAllSalesLedgers;
const getSalesLedgerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ledgerResult = yield db_1.default.query('select * from Sales_ledger WHERE id = $1', [id]);
        const salesLedger = ledgerResult.rows[0];
        const itemsResult = yield db_1.default.query('select * from Sales_item where sales_ledger_id = $1', [id]);
        salesLedger.items = itemsResult.rows;
        res.status(200).json(salesLedger);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Cannot get sales ledger by id' });
    }
});
exports.getSalesLedgerById = getSalesLedgerById;
const updateSalesLedger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { mobile, customerName, adhar, address, invoiceDate, GSTN, items } = req.body;
    try {
        yield db_1.default.query('BEGIN');
        yield db_1.default.query('update Sales_ledger SET mobile = $1, customer_name = $2, adhar = $3, address = $4, invoice_date = $5, GSTN = $6 where id = $7', [mobile, customerName, adhar, address, invoiceDate, GSTN, id]);
        yield db_1.default.query('delete from Sales_item where sales_ledger_id = $1', [id]);
        const itemPromises = items.map((item) => {
            db_1.default.query('insert into Sales_item (sales_ledger_id, product_id, qty, GST, total, discount, subtotal) values ($1, $2, $3, $4, $5, $6, $7)', [id, item.productId, item.qty, item.GST, item.total, item.discount, item.subtotal]);
            db_1.default.query('UPDATE Stock_items SET stock_count = stock_count - $1 WHERE product_id = $2', [item.qty, item.productId]);
        });
        yield Promise.all(itemPromises);
        yield db_1.default.query('COMMIT');
        res.status(200).json({
            message: 'Sales ledger and items updated successfully.',
        });
        res.status(200).json({ message: 'Sales ledger and items updated successfully.' });
    }
    catch (error) {
        yield db_1.default.query('ROLLBACK');
        console.log(error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Sales ledger and items could not be updated' });
        }
    }
});
exports.updateSalesLedger = updateSalesLedger;
const deleteSalesLedger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.query('BEGIN');
        const itemsResult = yield db_1.default.query('SELECT product_id, qty FROM Sales_item WHERE sales_ledger_id = $1', [id]);
        yield db_1.default.query('delete from Sales_item where sales_ledger_id = $1', [id]);
        const stockUpdatePromises = itemsResult.rows.map((item) => db_1.default.query('UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2', [item.qty, item.product_id]));
        yield Promise.all(stockUpdatePromises);
        yield db_1.default.query('delete from Sales_ledger where id = $1', [id]);
        yield db_1.default.query('COMMIT');
        res.status(200).json({ message: 'Sales ledger and items deleted successfully.' });
    }
    catch (error) {
        yield db_1.default.query('ROLLBACK');
        console.log(error);
        res.status(500).json({ error: 'Sales ledger and items are not deleted' });
    }
});
exports.deleteSalesLedger = deleteSalesLedger;
