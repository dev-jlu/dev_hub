import { useQuery } from "@apollo/client/react";
import ProjectCard from "../components/cards/ProjectCard";
import MainLayout from "../layouts/MainLayout";
import type { GetProjectsQuery } from "../graphql/types";
import { GET_PROJECTS } from "../graphql/queries";
import styles from '../styles/ProjectsPage.module.css';
import ProjectForm from '../components/forms/ProjectForm';
import { useState } from "react";

const ProjectsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { loading, error, data } = useQuery<GetProjectsQuery>(GET_PROJECTS, {
        variables: { limit: 100 },
    });

    if (loading) {
        return <MainLayout>Loading projects...</MainLayout>;
    }
    if (error) {
        return <MainLayout>Error loading projects</MainLayout>;
    }

    return (
        <MainLayout>
            <div className={styles.headerRow}>
                <h1 className={styles.pageTitle}>🏗️ All Projects</h1>
                <button 
                    className={styles.createButton} 
                    onClick={() => setIsModalOpen(true)}
                >
                    + New Project
                </button>
            </div>
            
            <div className={styles.projectGrid}>
                {
                    data!.projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            description={project.description}
                            progress={Math.min(project.tasksCount * 10, 100)}
                            className={styles.fullProjectCard}
                        />
                    ))
                }
            </div>
            {data!.projects.length === 0 && <p className={styles.emptyState}>No projects found. Time to start a new one!</p>}

            {/* Modal Rendering */}
            {isModalOpen && <ProjectForm onClose={() => setIsModalOpen(false)} />}
        </MainLayout>
    );
};

export default ProjectsPage;