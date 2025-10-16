const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, project_id, assigned_to } = req.body;
    const userId = req.user.userId;

    const role = await ProjectMember.getMemberRole(project_id, userId);
    if (!role) return res.status(403).json({ message: "Vous n'êtes pas membre de ce projet" });

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      project_id,
      assigned_to: assigned_to || null
    });

    res.status(201).json({ message: 'Tâche créée avec succès', task });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const role = await ProjectMember.getMemberRole(projectId, userId);
    if (!role) return res.status(403).json({ message: "Vous n'êtes pas membre de ce projet" });

    const tasks = await Task.findByProjectId(projectId);
    res.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    const userId = req.user.userId;
    const role = await ProjectMember.getMemberRole(task.project_id, userId);
    if (!role) return res.status(403).json({ message: 'Accès refusé' });

    res.json(task);
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assigned_to } = req.body;
    const userId = req.user.userId;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    const role = await ProjectMember.getMemberRole(task.project_id, userId);
    if (!role) return res.status(403).json({ message: 'Accès refusé' });

    const updatedTask = await Task.update(id, {
      title,
      description,
      status,
      priority,
      assigned_to
    });

    res.json({ message: 'Tâche mise à jour', task: updatedTask });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    const role = await ProjectMember.getMemberRole(task.project_id, userId);
    if (role !== 'admin') return res.status(403).json({ message: 'Seuls les admins peuvent supprimer des tâches' });

    await Task.delete(id);
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask
};