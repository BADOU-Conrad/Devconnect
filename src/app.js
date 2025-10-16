const express = require('express');
const bodyParser = require('body-parser');
const { setUserRoutes } = require('./routes/userRoutes');
const { setProjectRoutes } = require('./routes/projectRoutes');
const { setTaskRoutes } = require('./routes/taskRoutes');
const { setCommentRoutes } = require('./routes/commentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
setUserRoutes(app);
setProjectRoutes(app);
setTaskRoutes(app);
setCommentRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});