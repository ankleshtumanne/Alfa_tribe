Stock Posts Management System
A Node.js application for managing stock-related posts with features like user authentication, post creation, liking posts, commenting, and real-time updates (optional). This project is built with Express.js and MongoDB, following RESTful principles.

Table of Contents
Features
Tech Stack
Installation
API Documentation
Authentication Routes
Post Routes
Comment Routes
Like System
Pagination and Real-time Updates
Project Structure
License

Features
User Registration & Login with JWT authentication.
Post Creation for users to submit stock-related posts.
Commenting System allowing users to add comments to posts.
Liking System for users to like and unlike posts.
Filtering & Sorting posts based on stock symbol, tags, and likes or creation date.
Real-time Updates using Socket.io (optional).
Paginated Post Retrieval for better performance and scalability.

Tech Stack
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Authentication: JWT (JSON Web Token)
Real-time Communication (Optional): Socket.io

Set up your environment variables by creating a .env file in the root directory:

User Registration
POST /api/auth/register
Registers a new user.
Request:
{
  "username": "exampleuser",
  "email": "example@example.com",
  "password": "password123"
}
responce:
{
  "success": true,
  "message": "User registered successfully",
  "userId": "1234567890"
}

User Login
POST /api/auth/login
Authenticates a user and returns a JWT token.
Request:{
  "email": "example@example.com",
  "password": "password123"
}
responce:
{
  "token": "jwt_token_here",
  "user": {
    "id": "1234567890",
    "username": "exampleuser",
    "email": "example@example.com"
  }
}

Post Routes
Create Post
POST /api/posts
Requires JWT authentication. Creates a new stock post.
Request:{
  "stockSymbol": "AAPL",
  "title": "Apple Stock News",
  "description": "Apple stocks have risen...",
  "tags": "tech,stocks"
}
responce:
{
  "success": true,
  "postId": "1234567890",
  "message": "Post created successfully"
}