import { useQuery } from "@apollo/client/react";
import ProjectCard from "../components/cards/ProjectCard";
import MainLayout from "../layouts/MainLayout";
import type { GetProjectsQuery } from "../graphql/types";
import { GET_PROJECTS } from "../graphql/queries";
import styles from "../styles/ProjectsPage.module.css"

const ProjectsPage = () => {
    const { loading, error, data } = useQuery<GetProjectsQuery>(GET_PROJECTS, {
        variables: { limit: 10 },
    });

    if (loading) {
        return <MainLayout>Loading projects...</MainLayout>;
    }
    if (error) {
        return <MainLayout>Error loading projects</MainLayout>;
    }

    return (
        <MainLayout>
            <h1 className={styles.pageTitle}>🏗️ All Projects</h1>
            <div className={styles.projectGrid}>
                {
                    data!.projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            name={project.name}
                            description={project.description}
                            progress={Math.min(project.tasksCount * 10, 100)} // temporal sample
                            className={styles.fullProjectCard}
                        />
                    ))
                }
            </div>
            {data!.projects.length === 0 && <p className={styles.emptyState}>No projects found.</p>}
        </MainLayout>
    );
};

export default ProjectsPage;