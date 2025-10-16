const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const owner_id = req.user.userId;

    const project = await Project.create({ name, description, owner_id });
    await ProjectMember.addMember({ project_id: project.id, user_id: owner_id, role: 'admin' });

    res.status(201).json({ message: 'Projet créé avec succès', project });
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const projects = await Project.findByUserId(userId);
    res.json(projects);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const role = await ProjectMember.getMemberRole(id, userId);
    if (!role) return res.status(403).json({ message: 'Accès refusé à ce projet' });

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    const members = await ProjectMember.findByProjectId(id);
    res.json({ ...project, members, userRole: role });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.userId;

    const role = await ProjectMember.getMemberRole(id, userId);
    if (role !== 'admin') return res.status(403).json({ message: 'Seuls les admins peuvent modifier le projet' });

    const updatedProject = await Project.update(id, { name, description });
    res.json({ message: 'Projet mis à jour', project: updatedProject });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const role = await ProjectMember.getMemberRole(id, userId);
    if (role !== 'admin') return res.status(403).json({ message: 'Seuls les admins peuvent supprimer le projet' });

    await Project.delete(id);
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role } = req.body;
    const requesterId = req.user.userId;

    const requesterRole = await ProjectMember.getMemberRole(id, requesterId);
    if (requesterRole !== 'admin') return res.status(403).json({ message: 'Seuls les admins peuvent ajouter des membres' });

    const member = await ProjectMember.addMember({ project_id: id, user_id, role: role || 'user' });
    res.status(201).json({ message: 'Membre ajouté avec succès', member });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const requesterId = req.user.userId;

    const requesterRole = await ProjectMember.getMemberRole(id, requesterId);
    if (requesterRole !== 'admin') return res.status(403).json({ message: 'Seuls les admins peuvent retirer des membres' });

    await ProjectMember.removeMember(id, userId);
    res.json({ message: 'Membre retiré avec succès' });
  } catch (error) {
    console.error('Erreur lors du retrait du membre:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { role } = req.body;
    const requesterId = req.user.userId;

    const requesterRole = await ProjectMember.getMemberRole(id, requesterId);
    if (requesterRole !== 'admin') return res.status(403).json({ message: 'Seuls les admins peuvent modifier les rôles' });

    await ProjectMember.updateRole(id, userId, role);
    res.json({ message: 'Rôle mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole
};