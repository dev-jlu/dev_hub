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

export type TasksQueryVariables = {
    status?: string; 
    projectId?: string; 
    assigneeId?: string; 
    limit?: number;
}

export type ProjectType = {
    id: string;
    name: string;
    description: string;
    tasksCount: number;
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
        errors: string[];
    };
};

export type LoginMutationVariables = {
    email: string;
    password: string;
}

export type GetCurrentUserQuery = {
    currentUser: UserType;
};