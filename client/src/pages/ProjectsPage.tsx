import { useQuery } from "@apollo/client/react";
import ProjectCard from "../components/cards/ProjectCard";
import MainLayout from "../layouts/MainLayout";
import type { GetProjectsQuery } from "../graphql/types";
import { GET_PROJECTS } from "../graphql/queries";

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
            <h1>Projects</h1>
            {
                data!.projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        name={project.name}
                        description={project.description}
                        progress={Math.min(project.tasksCount * 10, 100)} // temporal sample
                    />
                ))
            }
        </MainLayout>
    );
};

export default ProjectsPage;