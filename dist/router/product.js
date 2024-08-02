"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = require("../controller/product");
const router = (0, express_1.Router)();
router.post('/products', product_1.addProduct);
exports.default = router;
