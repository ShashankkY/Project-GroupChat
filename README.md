# GroupChat Application

A real-time group chat application built with Node.js, Express, Socket.IO, and MySQL.

## Features

- User authentication (signup/login)
- Real-time messaging
- Message persistence in database
- JWT-based authentication
- Responsive UI

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GroupChat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory with the following variables:
   ```
   DB_NAME=groupchat_db
   DB_USER=root
   DB_PASSWORD=your_password
   DB_HOST=localhost
   PORT=3000
   JWT_SECRET=your_super_secret_jwt_key_2024
   JWT_EXPIRES_IN=24h
   ```

4. **Setup MySQL database**
   - Create a MySQL database named `groupchat_db`
   - Update the database credentials in `.env` file

5. **Run the application**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - The application will redirect to the login page

## Project Structure

```
GroupChat/
├── app.js                 # Main server file
├── db.js                  # Database configuration
├── models/                # Sequelize models
│   ├── User.js
│   └── Message.js
├── controllers/           # Route controllers
│   ├── authController.js
│   └── messageController.js
├── routes/                # Express routes
│   ├── authRoutes.js
│   └── messageRoutes.js
├── views/                 # HTML templates
│   ├── login.html
│   ├── signup.html
│   └── chat.html
├── public/                # Static files
│   ├── login.js
│   ├── signup.js
│   └── chat.js
└── package.json
```

## API Endpoints

- `POST /signup` - User registration
- `POST /login` - User authentication
- `POST /messages` - Send a message
- `GET /messages` - Get all messages

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT, bcrypt
- **Frontend**: HTML, CSS, JavaScript

## License

ISC 