import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_PROJECT, UPDATE_PROJECT } from '../../graphql/mutations';
import { GET_PROJECTS } from '../../graphql/queries';
import styles from './ProjectForm.module.css';
import { type ProjectType, type GetProjectsQuery, type ProjectMutationVariables } from '../../graphql/types';

interface ProjectFormProps {
    onClose: () => void;
    initialData?: { id: string, name: string, description: string }; 
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, initialData }) => {
    // Determine if we are updating or creating
    const isUpdate = !!initialData;
    
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [error, setError] = useState('');

    const mutation = isUpdate ? UPDATE_PROJECT : CREATE_PROJECT;
    const actionName = isUpdate ? 'Update' : 'Create';

    const [saveProject, { loading: projectLoading }] = useMutation<ProjectType, ProjectMutationVariables>(mutation, {
        update(cache, { data }) {
            if (!isUpdate && data) {
                const existingProjects = cache.readQuery<GetProjectsQuery>({ query: GET_PROJECTS, variables: { limit: 100 } });
                if (existingProjects) {
                    cache.writeQuery({
                        query: GET_PROJECTS,
                        variables: { limit: 100 },
                        data: { projects: [...existingProjects.projects, data] }
                    });
                }
            }
        },
        onCompleted: onClose,
        onError: (e) => setError(e.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }

        const variables = isUpdate
            ? { id: initialData?.id, name, description }
            : { name, description };

        saveProject({ variables }).catch(() => {
        });
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>{actionName} Project: {isUpdate ? name : ''}</h2>
                
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>Project Name *</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            required
                            disabled={projectLoading}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="description" className={styles.label}>Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textarea}
                            rows={3}
                            disabled={projectLoading}
                        />
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}
                    
                    <div className={styles.buttonGroup}>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className={styles.cancelButton}
                            disabled={projectLoading}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={projectLoading}>
                            {projectLoading ? `${actionName}ing...` : actionName + ' Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;