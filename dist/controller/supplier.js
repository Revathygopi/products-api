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
exports.deletesupplier = exports.updatesupplier = exports.getsupplierbyid = exports.getSupplier = exports.addSupplier = void 0;
const db_1 = __importDefault(require("../db"));
const addSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, gstn, products } = req.body;
    try {
        const result = yield db_1.default.query('INSERT INTO Supplier_list (name, address, gstn, products) VALUES ($1, $2, $3, $4) RETURNING *', [name, address, gstn, JSON.stringify(products)]);
        const supplier = result.rows[0];
        res.status(201).json(supplier);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.addSupplier = addSupplier;
const getSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search = '', page = '1', limit = '10' } = req.query;
    const currentPage = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (currentPage - 1) * pageSize;
    try {
        const countResult = yield db_1.default.query('select count(*) from Supplier_list where name ilike $1', [`%${search}%`]);
        const totalItems = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalItems / pageSize);
        const result = yield db_1.default.query('SELECT * FROM Supplier_list   where name ilike $1 limit $2 offset $3', [`%${search}%`, pageSize, offset]);
        const supplier = result.rows;
        res.status(200).json({
            currentPage: page,
            pageSize: pageSize,
            totalItems: totalItems,
            totalPages: totalPages,
            supplier
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getSupplier = getSupplier;
const getsupplierbyid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('SELECT * FROM Supplier_list WHERE id = $1', [id]);
        const supplier = result.rows[0];
        res.status(200).json(supplier);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.getsupplierbyid = getsupplierbyid;
const updatesupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, address, gstn, products } = req.body;
    try {
        const result = yield db_1.default.query('UPDATE Supplier_list SET name= $1, address = $2, GSTN = $3, products = $4  WHERE id = $5  RETURNING *', [name, address, gstn, JSON.stringify(products), id]);
        const supplier = result.rows[0];
        res.status(200).json(supplier);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Canot able to update the supplier' });
    }
});
exports.updatesupplier = updatesupplier;
const deletesupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('DELETE FROM Supplier_list WHERE id = $1 RETURNING *', [id]);
        res.status(200).json({ meassage: "Supplier deleted succesfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Canot able to delete the supplier' });
    }
});
exports.deletesupplier = deletesupplier;
