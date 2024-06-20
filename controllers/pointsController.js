import receipts from '../store/receiptsStore.js';
import pointsStore from '../store/pointsStore.js';

let lock = false;

export function getPoints(req, res) {
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

    const id = req.params.id;

    if (!receipts[id]) {
        return sendError(res, 404, 'Receipt not found');
    }

    if (tryLock()) {
        if (pointsStore[id] !== undefined) {
            res.json({ points: pointsStore[id] });
        } else {
            const points = calculatePoints(receipts[id]);
            pointsStore[id] = points;
            res.json({ points });
        }
        releaseLock();
    } else {
        res.status(503).json({ error: 'Service Unavailable. Please try again.' });
    }
}

function sendError(res, status, message) {
    res.status(status).json({ error: message });
}

function calculatePoints(receipt) {
    let points = 0;
    // console.log("Initial Points:", points);

    points += (receipt.retailer.match(/[a-z0-9]/gi) || []).length;
    // console.log("After Retailer Name Points:", points);

    if (receipt.total % 1 === 0) points += 50;
    if (receipt.total % 0.25 === 0) points += 25;
    // console.log("After Total Points:", points);

    points += 5 * Math.floor(receipt.items.length / 2);
    // console.log("After Item Pair Points:", points);

    receipt.items.forEach(item => {
        if (item.shortDescription.trim().length % 3 === 0) {
            let itemPoints = Math.ceil(item.price * 0.2);
            // console.log("Item Points:", itemPoints);
            points += itemPoints;
        }
    });

    const dateString = receipt.purchaseDate;
    const dayOfMonth = dateString.getUTCDate();

    // console.log(dayOfMonth, dateString);
    const isOddDay = dayOfMonth % 2 !== 0;

    if (isOddDay) {
        points += 6;
    }

    // console.log("After Date Points:", points);

    const purchaseTime = parseInt(receipt.purchaseTime.split(':')[0]);
    if (purchaseTime >= 14 && purchaseTime < 16) points += 10;
    // console.log("After Time Points:", points);

    return points;
}


