import { useQuery } from "@apollo/client/react";
import TaskCard from "../components/cards/TaskCard";
import MainLayout from "../layouts/MainLayout";
import { GET_TASKS } from "../graphql/queries";
import type { GetTasksQuery } from "../graphql/types";
import styles from "../styles/TasksPage.module.css";

const groupTasksByStatus = (tasks: Task[]) => {
    const grouped: Record<string, Task[]> = {};
    const statusOrder: (Task['status'])[] = ["pending", "in_progress", "completed", "cancelled"];

    statusOrder.forEach(status => {
        grouped[status] = [];
    });

    tasks.forEach(task => {
        const status = task.status || 'pending';
        if (grouped[status]) {
            grouped[status].push(task);
        } else {
            grouped[status] = [task];
        }
    });
    
    const sortedKeys = statusOrder.filter(key => grouped[key].length > 0)
                                 .concat(Object.keys(grouped).filter(key => !statusOrder.includes(key as Task['status']) && grouped[key].length > 0));
    
    return { grouped, sortedKeys };
}

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

    const tasks = data?.tasks || [];
    const { grouped, sortedKeys } = groupTasksByStatus(tasks);

    return (
        <MainLayout>
            <h1>📝 All Tasks</h1>
            {
                tasks.length === 0 ? (
                    <p className={styles.emptyState}>No tasks found. Get to work!</p>
                ) : (
                    <div className={styles.kanbanContainer}>
                        {sortedKeys.map((status) => (
                            <div key={status} className={styles.kanbanColumn}>
                            <h2 className={styles.columnHeader}>
                                {status.replace(/_/g, ' ')} ({grouped[status].length})
                            </h2>
                            <div className={styles.taskList}>
                                {grouped[status].map((task) => (
                                    <TaskCard 
                                        key={task.id}
                                        title={task.title}
                                        description={task.description}
                                        status={task.status} 
                                        className={styles.fullTaskCard}
                                    />
                                ))}
                            </div>
                        </div>
                        ))}
                    </div>
                )
            }
        </MainLayout>
    );
};

export default TasksPage;