# Assignment Submission Portal

This is a backend system for an assignment submission portal where users can upload assignments and admins can accept or reject them.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- bcrypt for password hashing

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/HarshaM07/assignment-portal-backend
   cd assignment-portal

2. npm install
3. npm install express mongoose dotenv bcryptjs jsonwebtoken
4. npm start 

## API Endpoints
## localhost:8080
3. **Endpoints:**
    - **User Endpoints:**
        - `POST /register` - Register a new user.
        - `POST /login` - User login.
        - `POST /upload` - Upload an assignment.
        - `GET /admins`- fetch all admins
    - **Admin Endpoints:**
        - `POST /register` - Register a new admin.
        - `POST /login` - Admin login.
        - `GET /assignments` - View assignments tagged to the admin.
        - `POST /assignments/:id/accept` - Accept an assignment.
        - `POST /assignments/:id/reject` - Reject an assignment.
