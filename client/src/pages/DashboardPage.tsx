import MainLayout from "../layouts/MainLayout";
import { useQuery } from "@apollo/client/react";
import { type GetTasksQuery, type GetCurrentUserQuery, type GetProjectsQuery } from "../graphql/types";
import { GET_CURRENT_USER, GET_PROJECTS, GET_TASKS } from "../graphql/queries";
import TaskCard from "../components/cards/TaskCard";
import ProjectCard from "../components/cards/ProjectCard";

const DashboardPage = () => {
    const { data: userData, loading: userLoading, error: userError } = useQuery<GetCurrentUserQuery>(GET_CURRENT_USER);
    const { data: tasksData, loading: tasksLoading, error: tasksError } = useQuery<GetTasksQuery>(GET_TASKS);
    const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery<GetProjectsQuery>(GET_PROJECTS);

    if (userLoading || tasksLoading || projectsLoading) {
        return <MainLayout>Loading...</MainLayout>;
    }
    if (userError) {
        return <MainLayout>Error loading user: {userError.message}</MainLayout>;
    }
    if (tasksError) {
        return <MainLayout>Error loading user: {tasksError.message}</MainLayout>;
    }
    if (projectsError) {
        return <MainLayout>Error loading user: {projectsError.message}</MainLayout>;
    }

    const user = userData?.currentUser;
    const tasks = tasksData?.tasks;
    const projects = projectsData?.projects;

    return (
        <MainLayout>
            <h1>Welcome, {user?.name}</h1>

            {/* Tasks */}
            <section>
                <h2>Your Tasks</h2>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {
                        tasks?.map((task) => (
                            <TaskCard
                                key={task.id}
                                title={task.title}
                                description={task.description}
                                status={task.status}
                            />
                        ))
                    }
                </div>
            </section>

            {/* Projects */}
            <section>
                <h2>Your Projects</h2>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {
                        projects?.map((project) => (
                            <ProjectCard
                                key={project.id}
                                name={project.description}
                                description={project.description}
                                progress={Math.min(project.tasksCount * 10, 100)}
                            />
                        ))
                    }
                </div>
            </section>
        </MainLayout>
    );
};

export default DashboardPage;