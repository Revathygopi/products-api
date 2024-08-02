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
exports.addProduct = void 0;
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
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        console.log('File:', req.file);
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
