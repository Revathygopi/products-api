"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const product_1 = __importDefault(require("./router/product"));
const supplier_1 = __importDefault(require("./router/supplier"));
const purchase_ledger_1 = __importDefault(require("./router/purchase_ledger"));
const purchase_items_1 = __importDefault(require("./router/purchase_items"));
const sales_items_1 = __importDefault(require("./router/sales_items"));
const sales_1 = __importDefault(require("./router/sales"));
const path_1 = __importDefault(require("path"));
const PORT = 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api', product_1.default);
app.use('/api', supplier_1.default);
app.use('/api', purchase_ledger_1.default);
app.use('/api', purchase_items_1.default);
app.use('/api', sales_items_1.default);
app.use('/api', sales_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
