class ProjectController {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    async createProject(req, res) {
        const { title, description } = req.body;
        const { data, error } = await this.supabase
            .from('projects')
            .insert([{ title, description }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(201).json(data);
    }

    async getProject(req, res) {
        const { id } = req.params;
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(200).json(data);
    }

    async updateProject(req, res) {
        const { id } = req.params;
        const { title, description } = req.body;
        const { data, error } = await this.supabase
            .from('projects')
            .update({ title, description })
            .eq('id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json(data);
    }

    async deleteProject(req, res) {
        const { id } = req.params;
        const { error } = await this.supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(204).send();
    }
}

export default ProjectController;