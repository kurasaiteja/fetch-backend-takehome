import { v7 as uuidv7 } from 'uuid';
import { body, validationResult } from 'express-validator';
import receipts from '../store/receiptsStore.js';

let lock = false;

const receiptValidationRules = [
  body('retailer').trim().isLength({ min: 1 }).withMessage('Retailer name is required'),
  body('purchaseDate').isISO8601().toDate().withMessage('Invalid purchase date'),
  body('purchaseTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid purchase time'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.shortDescription').trim().isLength({ min: 1 }).withMessage('Item description is required'),
  body('items.*.price').isDecimal({ decimal_digits: '2,' }).withMessage('Invalid item price format'),
  body('total').isDecimal({ decimal_digits: '2,' }).withMessage('Invalid total format')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

function processReceipt(req, res) {
    const tryLock = () => {
        if (!lock) {
            lock = true;
            return true;
        }
        return false;
    };

    const releaseLock = () => {
        lock = false;
    };

    if (tryLock()) {
        const id = uuidv7();
        receipts[id] = req.body;
        res.json({ id });
        releaseLock();
    } else {
        res.status(503).json({ error: 'Service Unavailable. Please try again.' });
    }
}

export { processReceipt, receiptValidationRules, validate };
