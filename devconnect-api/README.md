# DevConnect API

DevConnect is an internal collaborative platform designed to facilitate communication and project management among development teams at CodeLab. This API serves as the backend for the DevConnect application, providing endpoints for managing users, projects, tasks, and comments.

## Features

- **User Management**: Create, read, update, and delete users. Users can have different roles (admin, user) for each project.
- **Project Management**: Create, read, update, and delete projects. Users can be assigned to projects with specific roles.
- **Task Management**: Create, read, update, and delete tasks associated with projects.
- **Comment Management**: Add comments to tasks for better collaboration and documentation.

## Technologies Used

- Node.js
- Express.js
- SQLite
- Sequelize (ORM)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- SQLite

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd devconnect-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Create the SQLite database and run the migrations:
     ```
     npm run migrate
     ```

4. Seed the database with default users (optional):
   ```
   npm run seed
   ```

5. Create a `.env` file based on the `.env.example` file and configure your environment variables.

### Running the Application

To start the server, run:
```
npm start
```

The server will listen on the specified port (default is 3000).

### API Endpoints

- **Users**
  - `POST /api/users` - Create a new user
  - `GET /api/users` - Get all users
  - `GET /api/users/:id` - Get a user by ID
  - `PUT /api/users/:id` - Update a user by ID
  - `DELETE /api/users/:id` - Delete a user by ID

- **Projects**
  - `POST /api/projects` - Create a new project
  - `GET /api/projects` - Get all projects
  - `GET /api/projects/:id` - Get a project by ID
  - `PUT /api/projects/:id` - Update a project by ID
  - `DELETE /api/projects/:id` - Delete a project by ID

- **Tasks**
  - `POST /api/tasks` - Create a new task
  - `GET /api/tasks` - Get all tasks
  - `GET /api/tasks/:id` - Get a task by ID
  - `PUT /api/tasks/:id` - Update a task by ID
  - `DELETE /api/tasks/:id` - Delete a task by ID

- **Comments**
  - `POST /api/comments` - Add a comment to a task
  - `GET /api/comments` - Get all comments
  - `GET /api/comments/:id` - Get a comment by ID
  - `PUT /api/comments/:id` - Update a comment by ID
  - `DELETE /api/comments/:id` - Delete a comment by ID

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.