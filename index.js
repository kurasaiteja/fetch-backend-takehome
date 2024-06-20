import express from 'express';
import { processReceipt, receiptValidationRules, validate } from './controllers/receiptsController.js';

const app = express();
app.use(express.json());
app.post('/receipts/process', receiptValidationRules, validate, processReceipt);

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
