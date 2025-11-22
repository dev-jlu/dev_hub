import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_TASK, UPDATE_TASK } from '../../graphql/mutations';
import { GET_PROJECTS, GET_TASKS } from '../../graphql/queries';
import type { GetProjectsQuery, TaskMutationVariables, TaskType } from '../../graphql/types';
import styles from './TaskForm.module.css';

interface TaskFormProps {
    onClose: () => void;
    initialData?: TaskType;
}

const TASK_STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const TaskForm: React.FC<TaskFormProps> = ({ onClose, initialData }) => {
    const isUpdate = !!initialData;
    const initialProjectId = initialData?.project?.id || '';

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [projectId, setProjectId] = useState(initialProjectId);
    const [status, setStatus] = useState(initialData?.status || 'pending');
    const [error, setError] = useState('');

    // --- Data Fetching: Projects for Dropdown ---
    const { 
        loading: projectsLoading, 
        data: projectsData 
    } = useQuery<GetProjectsQuery>(GET_PROJECTS, {
        variables: { limit: 100 },
        fetchPolicy: 'cache-first',
    });

    const mutation = isUpdate ? UPDATE_TASK : CREATE_TASK;
    const actionName = isUpdate ? 'Update' : 'Create';

    const [executeMutation, { loading: taskMutating }] = useMutation<TaskType, TaskMutationVariables>(mutation, {
        refetchQueries: [
            { query: GET_TASKS, variables: { limit: 100 } }
        ],
        onCompleted: onClose, 
        onError: (e) => setError(e.message),
    });

    useEffect(() => {
        if (!isUpdate && projectsData && projectsData.projects.length > 0 && !projectId) {
            setProjectId(projectsData.projects[0].id);
        }
    }, [isUpdate, projectsData, projectId]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }
        
        if (!isUpdate && !projectId) {
            setError("Project is required for a new task.");
            return;
        }

        const variables = isUpdate
            ? { 
                id: initialData?.id, 
                title,
                description,
              }
            : { 
                title,
                description,
                projectId 
              };

        executeMutation({ variables }).catch(() => {});
    };

    const projects = projectsData?.projects || [];
    const isLoading = projectsLoading || taskMutating;

    if (projectsLoading) {
        return (
            <div className={styles.modalBackdrop}>
                <div className={styles.modalContent}>
                    <p className={styles.loadingText}>Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>{actionName} Task: {isUpdate ? initialData?.title : ''}</h2>
                
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    {/* Title */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="title" className={styles.label}>Task Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* Description */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="description" className={styles.label}>Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textarea}
                            rows={3}
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* Status (Only in Update Mode) */}
                    {isUpdate && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="status" className={styles.label}>Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskType['status'])}
                                className={styles.select}
                                disabled
                            >
                                {TASK_STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Project Dropdown (Only in Create Mode) */}
                    {!isUpdate && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="projectId" className={styles.label}>Assign to Project *</label>
                            <select
                                id="projectId"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                className={styles.select}
                                required
                                disabled={isLoading}
                            >
                                <option value="" disabled>Select a Project</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            {projects.length === 0 && (
                                <p className={styles.warningText}>No projects found. Create one first!</p>
                            )}
                        </div>
                    )}
                    
                    {/* Display Project Name in Update Mode */}
                    {isUpdate && (
                        <div className={styles.readOnlyInfo}>
                            Project: <strong>{initialData?.project?.name || 'N/A'}</strong>
                        </div>
                    )}


                    {error && <p className={styles.errorText}>{error}</p>}
                    
                    <div className={styles.buttonGroup}>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className={styles.cancelButton}
                            disabled={isLoading}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={isLoading || (!isUpdate && projects.length === 0)}>
                            {taskMutating ? `${actionName}ing...` : `${actionName} Task`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;