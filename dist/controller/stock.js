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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.createCategory = exports.getAllCategories = void 0;
const db_1 = __importDefault(require("../db"));
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT * FROM product_categories');
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ message: "Product is not created" });
    }
});
exports.getAllCategories = getAllCategories;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const result = yield db_1.default.query('INSERT INTO product_categories (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: "Product is not created" });
    }
});
exports.createCategory = createCategory;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('SELECT * FROM product_categories WHERE id = $1', [id]);
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: "Product is not created" });
    }
});
exports.getCategoryById = getCategoryById;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = yield db_1.default.query('UPDATE product_categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: "Product is not created" });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.query('DELETE FROM product_categories WHERE id = $1', [id]);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ message: "Product is not created" });
    }
});
exports.deleteCategory = deleteCategory;
