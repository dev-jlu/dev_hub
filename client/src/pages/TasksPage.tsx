import React, { useState } from 'react'; 
import { useQuery } from "@apollo/client/react";
import TaskCard from "../components/cards/TaskCard";
import MainLayout from "../layouts/MainLayout";
import { GET_TASKS } from "../graphql/queries";
import type { GetTasksQuery } from "../graphql/types";
import styles from '../styles/TasksPage.module.css'; 
import TaskForm from '../components/forms/TaskForm'; 

type Task = GetTasksQuery['tasks'][number];

interface GroupedTasksResult {
    grouped: Record<string, Task[]>;
    sortedKeys: Array<Task['status']>;
}

const groupTasksByStatus = (tasks: Task[]): GroupedTasksResult => {
    const grouped: Record<string, Task[]> = {};
    const statusOrder: (Task['status'])[] = ["pending", "in_progress", "completed", "cancelled"];

    statusOrder.forEach(status => {
        grouped[status] = [];
    });

    tasks.forEach((task: Task) => {
        if (!task || !task.status) return; 
        
        const status = task.status;
        if (grouped[status]) {
            grouped[status].push(task);
        } else {
            grouped[status] = [task];
        }
    });
    
    // Ensure we only include keys that are defined in statusOrder for predictable column display
    const sortedKeys = statusOrder.filter(key => grouped[key].length > 0);

    return {
        grouped,
        sortedKeys: sortedKeys as Array<Task['status']>
    };
};

const TasksPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); 
    
    const { loading, error, data } = useQuery<GetTasksQuery>(GET_TASKS, {
        variables: { limit: 100 },
    });

    if (loading) {
        return <MainLayout>Loading tasks...</MainLayout>;
    }
    if (error) {
        return <MainLayout>Error loading tasks: {error.message}</MainLayout>;
    }
    
    const tasks = data?.tasks?.filter(t => t != null) || [];
    const { grouped, sortedKeys } = groupTasksByStatus(tasks as Task[]);

    return (
        <MainLayout>
             <div className={styles.headerRow}>
                <h1 className={styles.pageTitle}>📝 All Tasks</h1>
                <button 
                    className={styles.createButton} 
                    onClick={() => setIsModalOpen(true)}
                >
                    + New Task
                </button>
            </div>
            
            {tasks.length === 0 && !isModalOpen ? (
                <p className={styles.emptyState}>No tasks found. Get to work!</p>
            ) : (
                <div className={styles.kanbanContainer}>
                    {
                        sortedKeys.map((status: Task['status']) => (
                            <div key={status} className={styles.kanbanColumn}>
                                <h2 className={styles.columnHeader}>
                                    {status.replace(/_/g, ' ')} ({grouped[status].length})
                                </h2>
                                <div className={styles.taskList}>
                                    {
                                        grouped[status].map((task: Task) => (
                                            <TaskCard 
                                                key={task.id}
                                                id={task.id}
                                                title={task.title}
                                                description={task.description}
                                                status={task.status} 
                                                project={task.project}
                                                assignee={task.assignee}
                                                className={styles.fullTaskCard}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
            
            {/* Modal Rendering */}
            {isModalOpen && <TaskForm onClose={() => setIsModalOpen(false)} />}
        </MainLayout>
    );
};

export default TasksPage;