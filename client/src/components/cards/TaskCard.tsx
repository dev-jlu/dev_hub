import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { DELETE_TASK, UPDATE_TASK_STATUS } from '../../graphql/mutations.ts';
import { GET_TASKS } from '../../graphql/queries.ts'; 
import TaskForm from '../forms/TaskForm.tsx';
// I am re-adding the import, assuming you will handle the CSS definition.
// The previous error was a build/linking issue that might resolve in the final application.
import styles from '../../styles/TaskCard.module.css';
import { type GetTasksQuery, type ProjectType } from '../../graphql/types.ts';

interface TaskCardProps {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    project?: ProjectType;
    className?: string;
}

const statusOptions: Array<TaskCardProps['status']> = [
    'pending',
    'in_progress',
    'completed',
    'cancelled',
];

const TaskCard: React.FC<TaskCardProps> = ({ id, title, description, status: initialStatus, project, className }) => {
    // Local state for status, managed by the dedicated dropdown update
    const [status, setStatus] = useState(initialStatus); 
    
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. DELETE_TASK mutation hook
    const [deleteTask] = useMutation(DELETE_TASK, {
        update(cache) {
            // Optimistically remove task from cache
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
    
    // 2. UPDATE_TASK_STATUS mutation hook
    const [updateStatus] = useMutation(UPDATE_TASK_STATUS, {
        onError: (e) => {
            setError(`Failed to update status: ${e.message}`);
            // Revert status on error
            setStatus(initialStatus); 
        }
    });

    // Handler for status change (uses dedicated mutation)
    const handleStatusChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TaskCardProps['status'];
        
        // Optimistic update
        setStatus(newStatus);
        setError(null);

        try {
            await updateStatus({
                variables: { id, status: newStatus },
            });
        } catch (e) {
            // Error handled by onError hook
        }
    }, [id, initialStatus, updateStatus]);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            await deleteTask({ variables: { id } });
        } catch (e) {
            // Error handled by onError
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
        setIsConfirming(false);
    }
    
    // Determine card color based on current status state
    const getStatusColor = (currentStatus: string) => {
        switch (currentStatus) {
            case 'completed': return '#2ecc71'; // Green
            case 'in_progress': return '#3498db'; // Blue
            case 'cancelled': return '#e74c3c'; // Red
            case 'pending':
            default: return '#f39c12'; // Yellow/Orange
        }
    };
    
    const cardColor = getStatusColor(status);

    return (
        <>
            <div className={`${styles.card} ${className}`} style={{ borderLeftColor: cardColor }}>
                <div className={styles.header}>
                    <h4 className={styles.title}>{title}</h4>
                    
                    <div className={styles.actions}>
                        
                        {/* 1. Edit Button */}
                        {!isConfirming && (
                            <button 
                                onClick={handleOpenEdit} 
                                className={styles.editButton}
                                title="Edit Task"
                                disabled={isDeleting}
                            >
                                {/* Pencil Icon (Inline SVG) */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M15.5 13.5l-1.93-1.93a1.94 1.94 0 0 0-2.74 0L1 13.79V16h2.21l10.82-10.82a1.94 1.94 0 0 0 0-2.74L13.5 0.5a1.94 1.94 0 0 0-2.74 0L.5 10.21V12.42l3.47 3.47 11.53-11.53zM12.5 1.5l1 1-2.71 2.71-1-1L12.5 1.5zM2 13.79l9.31-9.31 1 1-9.31 9.31H2z"/>
                                </svg>
                            </button>
                        )}


                        {/* 2. Delete Confirmation/Button */}
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
                                {/* Trash Can Icon (Inline SVG) */}
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
                    {/* Status Select/Dropdown - Manages status using UPDATE_TASK_STATUS */}
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
                    // CRITICAL CHANGE: Only pass fields that should be updated via the general edit form (title, desc, project).
                    // Status is handled separately via the dropdown on the card.
                    initialData={{ id, title, description, status, project }} 
                />
            )}
        </>
    );
};

export default TaskCard;