import React, { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { 
    DELETE_TASK, 
    UPDATE_TASK, 
    UPDATE_TASK_STATUS 
} from '../../graphql/mutations.ts'; 
import { GET_TASKS, GET_USERS } from '../../graphql/queries.ts'; 
import TaskForm from '../forms/TaskForm.tsx';
import styles from '../../styles/TaskCard.module.css';
import { 
    type GetTasksQuery, 
    type ProjectType, 
    type GetUsersQuery,
    type TaskType,
    type UserType,
} from '../../graphql/types.ts';

interface TaskCardProps {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'; 
    project?: ProjectType | null;
    assignee?: UserType | null;
    className?: string;
}

const statusOptions: Array<TaskCardProps['status']> = [
    'pending',
    'in_progress',
    'completed',
    'cancelled',
];

const TaskCard: React.FC<TaskCardProps> = ({ 
    id, 
    title, 
    description, 
    status: initialStatus, 
    project, 
    assignee: initialAssignee, 
    className 
}) => {
    const [status, setStatus] = useState(initialStatus); 
    const [assignee, setAssignee] = useState(initialAssignee);

    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: usersData, loading: loadingUsers } = useQuery<GetUsersQuery>(GET_USERS);
    const users = useMemo(() => usersData?.users || [], [usersData]);

    const [deleteTask] = useMutation(DELETE_TASK, {
        update(cache) {
            const existingTasks: any = cache.readQuery({ query: GET_TASKS, variables: { limit: 100 } });
            if (existingTasks && existingTasks.tasks) {
                const newTasks = existingTasks.tasks.filter((t: any) => t.id !== id);
                cache.writeQuery<GetTasksQuery>({
                    query: GET_TASKS,
                    variables: { limit: 100 },
                    data: { tasks: newTasks }
                });
            }
        },
        onError: (e) => {
            setError(`Failed to delete task: ${e.message}`);
            setIsDeleting(false);
        }
    });
    
    const [updateTaskStatus] = useMutation<TaskType>(UPDATE_TASK_STATUS, {
        onError: (e) => {
            setError(`Failed to update status: ${e.message}`);
            setStatus(initialStatus); 
        }
    });

    const [updateAssignee] = useMutation(UPDATE_TASK, {
        onError: (e) => {
            setError(`Failed to update assignee: ${e.message}`);
            setAssignee(initialAssignee); 
        }
    });

    const handleStatusChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TaskCardProps['status'];
        
        // Optimistic update
        setStatus(newStatus);
        setError(null);

        try {
            await updateTaskStatus({
                variables: { id, status: newStatus },
            });
        } catch (e) {
        }
    }, [id, updateTaskStatus, initialStatus]);

    const handleAssigneeChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAssigneeId = e.target.value || null;
        const newAssignee = users.find(u => u.id === newAssigneeId) || null;

        setAssignee(newAssignee);
        setError(null);

        try {
            await updateAssignee({ 
                variables: { 
                    id, 
                    assigneeId: newAssigneeId 
                },
            });
        } catch (e) {
        }
    }, [id, updateAssignee, users, initialAssignee]);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            await deleteTask({ variables: { id } });
        } catch (e) {
        } finally {
            setIsConfirming(false);
        }
    };

    const handleOpenEdit = () => {
        if (isConfirming) return;
        setIsEditing(true);
    }
    
    const handleCloseEdit = () => {
        setIsEditing(false);
    }
    
    const getStatusColor = (currentStatus: string) => {
        switch (currentStatus) {
            case 'completed': return '#2ecc71'; 
            case 'in_progress': return '#3498db';
            case 'cancelled': return '#e74c3c';
            case 'pending':
            default: return '#f39c12';
        }
    };
    
    const cardColor = getStatusColor(status);
    const assigneeName = assignee?.name || 'Unassigned';

    return (
        <>
            <div className={`${styles.card} ${className}`} style={{ borderLeftColor: cardColor }}>
                <div className={styles.header}>
                    <h4 className={styles.title}>{title}</h4>
                    
                    <div className={styles.actions}>
                        
                        {/* Edit Button */}
                        {!isConfirming && (
                            <button 
                                onClick={handleOpenEdit} 
                                className={styles.editButton}
                                title="Edit Task"
                                disabled={isDeleting}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M15.5 13.5l-1.93-1.93a1.94 1.94 0 0 0-2.74 0L1 13.79V16h2.21l10.82-10.82a1.94 1.94 0 0 0 0-2.74L13.5 0.5a1.94 1.94 0 0 0-2.74 0L.5 10.21V12.42l3.47 3.47 11.53-11.53zM12.5 1.5l1 1-2.71 2.71-1-1L12.5 1.5zM2 13.79l9.31-9.31 1 1-9.31 9.31H2z"/>
                                </svg>
                            </button>
                        )}


                        {/* Delete Confirmation/Button */}
                        {isConfirming ? (
                            <div className={styles.confirmActions}>
                                <button 
                                    onClick={() => setIsConfirming(false)} 
                                    className={styles.cancelDeleteButton}
                                    disabled={isDeleting}
                                >
                                    No
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    className={styles.confirmDeleteButton}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? '...' : 'Yes, Delete'}
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsConfirming(true)} 
                                className={styles.deleteButton}
                                title="Delete Task"
                                disabled={isDeleting}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4l.6 9a1 1 0 0 0 1 1h6.764a1 1 0 0 0 1-1l.6-9H4.118zM6.5 2h3v.5a.5.5 0 0 1-1 0V2h-1v.5a.5.5 0 0 1-1 0V2z"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {error && <p className={styles.errorText}>{error}</p>}

                <p className={styles.description}>{description}</p>
                
                <div className={styles.footer}>
                    {/* Status Select/Dropdown */}
                    <select 
                        value={status} 
                        onChange={handleStatusChange} 
                        className={styles.statusSelect}
                        style={{ backgroundColor: cardColor, borderColor: cardColor }}
                        title="Change Task Status"
                    >
                        {statusOptions.map(opt => (
                            <option key={opt} value={opt}>
                                {opt.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>

                    {/* Assignee Select/Dropdown */}
                    <div className={styles.assigneeContainer}>
                        <label className={styles.assigneeLabel}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            </svg>
                        </label>
                        <select 
                            value={assignee?.id || ''} 
                            onChange={handleAssigneeChange} 
                            className={styles.assigneeSelect}
                            title={`Assigned to: ${assigneeName}`}
                            disabled={loadingUsers}
                        >
                            <option value="">{loadingUsers ? 'Loading...' : 'Unassigned'}</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Project Tag */}
                    <span className={styles.projectTag} title={project?.name}>
                        {project?.name}
                    </span>
                </div>
                
                {isConfirming && <p className={styles.confirmationText}>Delete "{title}"?</p>}
            </div>
            
            {/* Conditional Rendering of the Edit Modal */}
            {isEditing && (
                <TaskForm 
                    onClose={handleCloseEdit} 
                    initialData={{ 
                        id, 
                        title, 
                        description, 
                        status, 
                        project,
                        assignee
                    }} 
                />
            )}
        </>
    );
};

export default TaskCard;