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
exports.deleteproduct = exports.updateproduct = exports.getproductbyid = exports.getproduct = exports.addProduct = void 0;
const db_1 = __importDefault(require("../db"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const addProduct = (req, res) => {
    upload.single('image')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const { name, qtyType, size } = req.body;
        const imageUrl = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || '';
        try {
            const result = yield db_1.default.query('INSERT INTO Product_list (name, qtyType, size, imageUrl) VALUES ($1, $2, $3, $4) RETURNING *', [name, qtyType, size, imageUrl]);
            const product = result.rows[0];
            res.status(201).json(product);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }));
};
exports.addProduct = addProduct;
const getproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('select * from Product_list');
        const product = result.rows;
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.getproduct = getproduct;
const getproductbyid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('select * from Product_list where id = $1', [id]);
        const product = result.rows[0];
        res.status(200).json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});
exports.getproductbyid = getproductbyid;
const updateproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload.single('image')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const { name, qtyType, size } = req.body;
        const { id } = req.params;
        const imageUrl = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || req.body.imageUrl;
        try {
            const result = yield db_1.default.query('Update  Product_list set name = $1, qtyType = $2, size = $3, imageUrl = $4 where id = $5 RETURNING *', [name, qtyType, size, imageUrl, id]);
            const product = result.rows[0];
            res.status(200).json(product);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }));
});
exports.updateproduct = updateproduct;
const deleteproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query(' delete from Product_list where id =$1 returning *', [id]);
        res.status(200).json({ meassage: 'Product deleted succesfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});
exports.deleteproduct = deleteproduct;
