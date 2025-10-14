class UserController {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    async createUser(req, res) {
        const { email, password } = req.body;
        const { data, error } = await this.supabase
            .from('users')
            .insert([{ email, password }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(201).json(data);
    }

    async getUser(req, res) {
        const { id } = req.params;
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(200).json(data);
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const { email, password } = req.body;
        const { data, error } = await this.supabase
            .from('users')
            .update({ email, password })
            .eq('id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json(data);
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        const { error } = await this.supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(204).send();
    }
}

export default UserController;