module.exports = {
    validateUser: (user) => {
        const { username, email, password } = user;
        const errors = [];

        if (!username || username.length < 3) {
            errors.push("Username must be at least 3 characters long.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push("Invalid email format.");
        }

        if (!password || password.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }

        return errors.length ? errors : null;
    },

    validateProject: (project) => {
        const { title, description } = project;
        const errors = [];

        if (!title || title.length < 3) {
            errors.push("Project title must be at least 3 characters long.");
        }

        if (!description || description.length < 10) {
            errors.push("Project description must be at least 10 characters long.");
        }

        return errors.length ? errors : null;
    },

    validateTask: (task) => {
        const { title, projectId } = task;
        const errors = [];

        if (!title || title.length < 3) {
            errors.push("Task title must be at least 3 characters long.");
        }

        if (!projectId) {
            errors.push("Task must be associated with a project.");
        }

        return errors.length ? errors : null;
    },

    validateComment: (comment) => {
        const { content, taskId } = comment;
        const errors = [];

        if (!content || content.length < 1) {
            errors.push("Comment content cannot be empty.");
        }

        if (!taskId) {
            errors.push("Comment must be associated with a task.");
        }

        return errors.length ? errors : null;
    }
};