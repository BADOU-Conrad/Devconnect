const ProjectMember = require('../models/ProjectMember');

// Middleware to check user roles for specific routes
const roleMiddleware = (role) => {
    return async (req, res, next) => {
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
        const projectId = req.params.projectId; // Assuming project ID is passed in the route parameters

        try {
            const projectMember = await ProjectMember.findOne({
                where: {
                    userId: userId,
                    projectId: projectId,
                },
            });

            if (!projectMember) {
                return res.status(403).json({ message: 'Access denied: You are not a member of this project.' });
            }

            if (projectMember.role !== role) {
                return res.status(403).json({ message: `Access denied: Requires ${role} role.` });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = roleMiddleware;