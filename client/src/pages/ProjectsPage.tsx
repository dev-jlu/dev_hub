import ProjectCard from "../components/cards/ProjectCard";
import MainLayout from "../layouts/MainLayout";

// Sample projects
const sampleProjects = [
    { name: "DevHub App", description: "Project management app", progress: 40 },
    { name: "Website Redesign", description: "Update company website", progress: 70 },
];

const ProjectsPage = () => {
    return (
        <MainLayout>
            <h1>Projects</h1>
            {
                sampleProjects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        {...project}
                    />
                ))
            }
        </MainLayout>
    );
};

export default ProjectsPage;