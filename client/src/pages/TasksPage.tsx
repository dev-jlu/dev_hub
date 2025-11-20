import { useQuery } from "@apollo/client/react";
import TaskCard from "../components/cards/TaskCard";
import MainLayout from "../layouts/MainLayout";
import { GET_TASKS } from "../graphql/queries";
import type { GetTasksQuery } from "../graphql/types";

const TasksPage = () => {
    const { loading, error, data } = useQuery<GetTasksQuery>(GET_TASKS, {
        variables: { limit: 20 },
    });

    if (loading) {
        return <MainLayout>Loading tasks...</MainLayout>;
    }
    if (error) {
        return <MainLayout>Error loading tasks</MainLayout>;
    }
    return (
        <MainLayout>
            <h1>Tasks</h1>
            {
                data!.tasks.map((task) => (
                    <TaskCard 
                        key={task.id}
                        title={task.title}
                        description={task.description}
                        status={task.status} />
                ))
            }
        </MainLayout>
    );
};

export default TasksPage;