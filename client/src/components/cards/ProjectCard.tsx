import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { DELETE_PROJECT } from '../../graphql/mutations';
import { GET_PROJECTS } from '../../graphql/queries';
import ProjectForm from '../forms/ProjectForm';
import styles from '../../styles/ProjectCard.module.css';
import { type GetProjectsQuery } from '../../graphql/types';

interface ProjectCardProps {
    id: string;
    name: string;
    description: string;
    progress: number;
    className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, name, description, progress, className }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [deleteProject] = useMutation(DELETE_PROJECT, {
        update(cache) {
            const existingProjects = cache.readQuery<GetProjectsQuery>({ query: GET_PROJECTS, variables: { limit: 100 } });
            
            if (existingProjects && existingProjects.projects) {
                const newProjects = existingProjects.projects.filter(p => p.id !== id);
                
                // Write the filtered list back to the cache
                cache.writeQuery({
                    query: GET_PROJECTS,
                    variables: { limit: 100 },
                    data: { projects: newProjects }
                });
            }
        },
        onError: (e) => {
            setError(`Failed to delete project: ${e.message}`);
            setIsDeleting(false);
        }
    });

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);
        
        try {
            await deleteProject({ variables: { id } });
        } catch (e) {
        } finally {
            setIsConfirming(false);
        }
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
        setIsConfirming(false);
    }
    
    const handleOpenEdit = () => {
        if (isConfirming) return; 
        setIsEditing(true);
    }

    const progressColor = progress < 30 ? '#e74c3c' : progress < 70 ? '#f39c12' : '#2ecc71';

    return (
        <>
            <div className={`${styles.card} ${className}`}>
                <div className={styles.header}>
                    <h3 className={styles.name}>{name}</h3>
                    
                    {/* Action Buttons */}
                    <div className={styles.actions}>
                        
                        {/* Edit Button */}
                        {!isConfirming && (
                            <button 
                                onClick={handleOpenEdit} 
                                className={styles.editButton}
                                title="Edit Project"
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
                                title="Delete Project"
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
                
                <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>Progress ({progress}%)</div>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFiller} 
                            style={{ 
                                width: `${progress}%`,
                                backgroundColor: progressColor 
                            }}
                        ></div>
                    </div>
                </div>
                {isConfirming && <p className={styles.confirmationText}>Are you sure you want to delete this project?</p>}
            </div>
            
            {/* Conditional Rendering of the Edit Modal */}
            {isEditing && (
                <ProjectForm 
                    onClose={handleCloseEdit} 
                    initialData={{ id, name, description }} 
                />
            )}
        </>
    );
};

export default ProjectCard;