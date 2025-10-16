class TaskController {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    async createTask(taskData) {
        const { data, error } = await this.supabase
            .from('tasks')
            .insert([taskData]);

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async getTask(taskId) {
        const { data, error } = await this.supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .single();

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async updateTask(taskId, updatedData) {
        const { data, error } = await this.supabase
            .from('tasks')
            .update(updatedData)
            .eq('id', taskId);

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async deleteTask(taskId) {
        const { data, error } = await this.supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
}

export default TaskController;