export type TaskType = {
    id: string;
    title: string;
    description: string;
    status: "pending" | "in_progress" | "cancelled" | "completed";
    project?: ProjectType | null;
    assignee?: UserType | null;
};

export type GetTasksQuery = {
    tasks: TaskType[];
};

export type TaskMutationVariables = {
    projectId?: string;
    title?: string;
    description?: string;
    status?: string;
    assigneeId?: string;
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

export type ProjectMutationVariables = {
    name?: string;
    description?: string;
}

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

export type RegisterMutation = {
    createUser: {
        user: UserType | null;
        errors: string[];
    }
}

export type RegisterMutationVariables = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export type GetCurrentUserQuery = {
    currentUser: UserType;
};

export type GetUsersQuery = {
    users: UserType[];
}