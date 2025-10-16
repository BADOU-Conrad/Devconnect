const Comment = require('../models/Comment');
const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');

const createComment = async (req, res) => {
  try {
    const { content, task_id } = req.body;
    const user_id = req.user.userId;

    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    const role = await ProjectMember.getMemberRole(task.project_id, user_id);
    if (!role) return res.status(403).json({ message: "Vous n'êtes pas membre de ce projet" });

    const comment = await Comment.create({ content, task_id, user_id });
    res.status(201).json({ message: 'Commentaire ajouté avec succès', comment });
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    const role = await ProjectMember.getMemberRole(task.project_id, userId);
    if (!role) return res.status(403).json({ message: 'Accès refusé' });

    const comments = await Comment.findByTaskId(taskId);
    res.json(comments);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existing = await Comment.findById(id);
    if (!existing) return res.status(404).json({ message: 'Commentaire non trouvé' });

    // autoriser auteur ou admin du projet
    const task = await Task.findById(existing.task_id);
    const role = await ProjectMember.getMemberRole(task.project_id, userId);
    if (existing.user_id !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Comment.delete(id);
    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  createComment,
  getTaskComments,
  deleteComment
};