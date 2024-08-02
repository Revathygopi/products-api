"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplier_1 = require("../controller/supplier");
const router = (0, express_1.Router)();
router.post('/addsuppliers', supplier_1.addSupplier);
router.get('/getSupplier', supplier_1.getSupplier);
exports.default = router;
