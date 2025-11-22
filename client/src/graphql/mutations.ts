import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                id
                name
                email
            }
            message
            errors
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout {
            message
            errors
        }
    }
`;

export const CREATE_TASK = gql`
    mutation CreateTask($projectId: ID!, $title: String!, $description: String) {
        createTask(projectId: $projectId, title: $title, description: $description) {
            task {
                id
                title
                description
                status
                project {
                    id
                    name
                    description
                }
                assignee {
                    id
                    name
                    email
                }
            }
            errors
        }
    }
`;

export const UPDATE_TASK = gql`
    mutation UpdateTask($id: ID!, $title: String, $description: String, $assigneeId: ID) {
        updateTask(id: $id, title: $title, description: $description, assigneeId: $assigneeId) {
            task {
                id
                title
                description
                status
                project {
                    id
                    name
                    description
                }
                assignee {
                    id
                    name
                    email
                }
            }
            errors
        }
    }
`;

export const UPDATE_TASK_STATUS = gql`
    mutation UpdateTaskStatus($id: ID!, $status: String!) {
        updateTaskStatus(id: $id, status: $status) {
            task {
                id
                title
                description
                status
                project {
                    id
                    name
                    description
                }
                assignee {
                    id
                    name
                    email
                }
            }
            errors
        }
    }
`;

export const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!) {
        deleteTask(id: $id) {
            success
            errors
        }
    }
`;

export const CREATE_PROJECT = gql`
    mutation CreateProject($name: String!, $description: String) {
        createProject(name: $name, description: $description) {
            project {
                id
                name
                description
                tasksCount
            }
            errors
        }
    }
`;

export const UPDATE_PROJECT = gql`
    mutation UpdateProject($id: ID!, $name: String, $description: String) {
        updateProject(id: $id, name: $name, description: $description) {
            project {
                id
                name
                description
                tasksCount
            }
            errors
        }
    }
`;

export const DELETE_PROJECT = gql`
    mutation DeleteProject($id: ID!) {
        deleteProject(id: $id) {
            success
            errors
        }
    }
`;