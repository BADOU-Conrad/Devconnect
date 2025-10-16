# DevConnect - Collaborative Platform

## Overview
DevConnect is a collaborative platform designed for developers to manage projects, tasks, and comments efficiently. It integrates with Supabase for backend services, providing a seamless experience for user authentication and data management.

## Features
- User management (create, update, delete users)
- Project management (create, update, delete projects)
- Task management (create, update, delete tasks)
- Comment management (create, update, delete comments)

## Technologies Used
- Node.js
- Express.js
- Supabase
- JavaScript

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/devconnect-supabase.git
   ```
2. Navigate to the project directory:
   ```
   cd devconnect-supabase
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
1. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Application
To start the application, run:
```
npm start
```
The server will start on `http://localhost:3000`.

## API Endpoints
- **Users**
  - `POST /users` - Create a new user
  - `GET /users/:id` - Get user details
  - `PUT /users/:id` - Update user information
  - `DELETE /users/:id` - Delete a user

- **Projects**
  - `POST /projects` - Create a new project
  - `GET /projects/:id` - Get project details
  - `PUT /projects/:id` - Update project information
  - `DELETE /projects/:id` - Delete a project

- **Tasks**
  - `POST /tasks` - Create a new task
  - `GET /tasks/:id` - Get task details
  - `PUT /tasks/:id` - Update task information
  - `DELETE /tasks/:id` - Delete a task

- **Comments**
  - `POST /comments` - Create a new comment
  - `GET /comments/:id` - Get comment details
  - `PUT /comments/:id` - Update comment information
  - `DELETE /comments/:id` - Delete a comment

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.