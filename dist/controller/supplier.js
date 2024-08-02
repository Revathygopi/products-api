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
exports.getSupplier = exports.addSupplier = void 0;
const db_1 = __importDefault(require("../db"));
const addSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, GSTN, products } = req.body;
    try {
        const result = yield db_1.default.query('INSERT INTO Supplier_list (name, address, GSTN, products) VALUES ($1, $2, $3, $4) RETURNING *', [name, address, GSTN, JSON.stringify(products)]);
        const supplier = result.rows[0];
        res.status(201).json(supplier);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.addSupplier = addSupplier;
const getSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT * FROM Supplier_list');
        const products = result.rows;
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getSupplier = getSupplier;
