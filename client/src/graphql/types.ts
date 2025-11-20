export type TaskType = {
    id: string;
    title: string;
    description: string;
    status: "pending" | "in_progress" | "cancelled" | "completed";
    project?: { id: string, name: string, description: string } | null;
    assignee?: { id: string; name: string, email: string } | null;
};

export type GetTasksQuery = {
    tasks: TaskType[];
};

export type ProjectType = {
    id: string;
    name: string;
    description: string;
    task_count: number;
};

export type GetProjectsQuery = {
    projects: ProjectType[];
};

export type UserType = {
    id: string;
    name: string;
    email: string;
};

export type LoginMutation = {
    login: {
        user: UserType | null;
    };
};

export type LoginMutationVariables = {
    email: string;
    password: string;
}