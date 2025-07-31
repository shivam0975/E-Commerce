# E-Commerce Backend

## Description
This project is a backend application that manages users, products, and orders. It provides RESTful APIs for authentication, product management, and order processing.

## Folder Structure
```
backend
├── config
│   └── db.js
├── models
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes
│   ├── auth.js
│   ├── products.js
│   └── orders.js
├── middleware
│   └── authMiddleware.js
├── server.js
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Configure the database connection in `config/db.js`.
5. Start the server:
   ```
   node server.js
   ```

## Usage
- **Authentication**: Use the `/auth` routes for user login and registration.
- **Product Management**: Use the `/products` routes to manage product data.
- **Order Processing**: Use the `/orders` routes to create and retrieve orders.

## License
This project is licensed under the MIT License.
