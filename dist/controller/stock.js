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
exports.getStockCount = exports.addStock = void 0;
const db_1 = __importDefault(require("../db"));
const addStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quantity } = req.body;
    const { id } = req.params;
    console.log('productId:', id, ' quantity:', quantity);
    try {
        const checkQuery = 'SELECT * FROM Stock_items WHERE product_id = $1';
        const checkResult = yield db_1.default.query(checkQuery, [id]);
        if (checkResult.rows.length === 0) {
            const insertQuery = 'INSERT INTO Stock_items (product_id, stock_count) VALUES ($1, $2)';
            yield db_1.default.query(insertQuery, [id, quantity]);
            return res.status(201).json({ message: 'Product added and stock set successfully.' });
        }
        else {
            const stockUpdateQuery = 'UPDATE Stock_items SET stock_count = stock_count + $1 WHERE product_id = $2';
            const updateResult = yield db_1.default.query(stockUpdateQuery, [quantity, id]);
            if (updateResult.rowCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.status(200).json({ message: 'Stock added successfully.' });
        }
    }
    catch (error) {
        console.error('Error adding stock:', error);
        res.status(500).json({ error: 'Unable to add stock' });
    }
});
exports.addStock = addStock;
const getStockCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM Stock_items ';
        const result = yield db_1.default.query(query);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error retrieving stock count:', error);
        res.status(500).json({ error: 'Unable to retrieve stock count' });
    }
});
exports.getStockCount = getStockCount;
