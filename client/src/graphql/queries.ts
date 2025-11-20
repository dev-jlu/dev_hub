import { gql } from "@apollo/client";

// Tasks
export const GET_TASKS = gql`
    query GetTasks($status: String, $projectId: ID, $limit: Int) {
        tasks(status: $status, projectId: $projectId, limit: $limit) {
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
    }
`;

// Projects
export const GET_PROJECTS = gql`
    query GetProjects($limit: Int) {
        projects(limit: $limit) {
            id
            name
            description
            tasksCount
        }
    }
`;