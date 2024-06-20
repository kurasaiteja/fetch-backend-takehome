# Receipt Processor

## Overview

Receipt Processor is a web service designed to process receipt data and calculate points based on specific criteria. This service provides APIs to submit receipts and query the calculated points based on the receipt data.

## Features

- **Process Receipts**: Submit receipt data and receive a unique ID.
- **Calculate Points**: Retrieve points calculated based on the receipt content.

## Technology Stack

### Node.js

Node.js was chosen for its efficiency and scalability in handling asynchronous activities, making it excellent for I/O-bound applications such as web servers.

### Express.js

Express.js is a basic and versatile framework that offers simplicity and a broad middleware ecosystem, allowing for the rapid building of sophisticated APIs.

### express-validator

`express-validator` is an Express.js middleware that validates and cleans inputs. 

- **Security**: It helps to prevent dangerous data from entering the system, hence increasing security.
- **Data Integrity**: It guarantees that all data is in the appropriate format before processing, which reduces errors and improves reliability.
- **More control**: Supports precise, field-specific error messages, which improves user input correction and debugging.

### UUID (v7)

UUID version 7 generates unique identifiers for submitted receipts. It was chosen because:

- **Uniqueness**: It ensures that each receipt processed by the service is assigned a unique identification, which is crucial for monitoring and retrieving receipt data consistently.
- **Time-Based Ordering**: Allows for the sorting and retrieval of records in a temporal context, which improves performance in applications that handle data chronologically.
- **Privacy and Security**: Avoids using hardware-specific information like MAC addresses, which improves privacy and security.


## Prerequisites

Before you begin, ensure you have installed the following:
- [Node.js](https://nodejs.org/en/) (v20 recommended)
- [npm](https://www.npmjs.com/get-npm) (usually comes with Node.js)
- [Docker](https://www.docker.com/products/docker-desktop) (if running the application in a container)

### Installing Node.js and npm

#### Windows

1. Download the Windows Installer from the [Node.js website](https://nodejs.org/en/).
2. Run the installer.
3. Follow the prompts in the installer.
4. Restart your computer if necessary.

#### macOS

1. Download the macOS Installer from the [Node.js website](https://nodejs.org/en/).
2. Run the installer.
3. Follow the prompts in the installer.

Alternatively, use Homebrew:
```bash
brew install node
```

# Setup

Clone the project repository:
```bash
git clone https://github.com/kurasaiteja/fetch-backend-takehome.git
cd fetch-backend-takehome
```

Install dependencies:
```bash
npm install
```




# Running the Application
You can run the application directly on your machine or within a Docker container.

## Running Locally
To start the server locally:
```bash
node index.js
```

To run in development mode with hot reloading:
```bash
nodemon index.js
```

## Running with Docker
To build the Docker image and run the service:
```bash
docker build -t receipt-processor .
docker run -p 3000:3000 receipt-processor
```

# API Endpoints
## POST /receipts/process
Submits a receipt for processing.

**Request Body**:
``` 
{
  "retailer": "Store Name",
  "purchaseDate": "YYYY-MM-DD",
  "purchaseTime": "HH:MM",
  "items": [
    {
      "shortDescription": "Item Description",
      "price": "Price Format"
    }
  ],
  "total": "Total Cost"
}
```
**Responses**:
- 200 OK: Returns a JSON object with the unique receipt ID.
- 400 Bad Request: If the input validation fails.

## GET /receipts/{id}/points
Returns the points awarded for the receipt.

**URL Parameters**:
- id: The unique ID of the receipt.

**Responses**:
- 200 OK: Returns a JSON object with the number of points.
- 404 Not Found: If no receipt matches the provided ID.

# Code Structure
The project is organized into several files and directories, each responsible for specific functionalities:

## index.js
This is the entry point of the application. It sets up the Express server, defines the routes, and starts listening on the specified port.

## controllers/receiptsController.js
Handles the receipt processing logic. It includes validation rules using express-validator and a function to process and store receipts.

## controllers/pointsController.js
Handles the logic for calculating and returning points based on the receipt data.

## store/receiptsStore.js
A simple in-memory store for receipts.

## store/pointsStore.js
A simple in-memory store for points. This cache optimizes retrieval of points by avoiding recalculation.

# Design Decisions
## Caching with Points Store
**Purpose**: The points store is used to cache the points for each receipt after they are calculated. This approach improves the efficiency of the application by eliminating the need to recalculate points every time they are requested.

**Assumption**: Once a receipt is processed and assigned an ID, it is assumed that the receipt data does not change. Therefore, the points associated with a receipt do not need to be recalculated.

**Benefits**:
**Performance**: Reduces the computational load on the server by avoiding repeated calculations.

**Efficiency**: Provides faster responses to clients requesting points for a receipt that has already been processed.

**Simplicity**: Keeps the logic straightforward by only calculating points once and reusing the cached result.

## Points Calculation on GET Call

**Reason**: Points are calculated only when the GET call is made to retrieve them. This design ensures that the receipt data is processed and validated first, and points calculation is deferred until the data is actually needed.

**Efficiency**: By deferring the points calculation to the GET call, we ensure that resources are not wasted on calculations for receipts that might not be queried for points immediately or at all.

**Caching***: Once the points are calculated, they are stored in the points store, making subsequent retrievals faster and more efficient.