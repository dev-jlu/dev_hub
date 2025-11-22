import MainLayout from "../layouts/MainLayout";
import { useQuery } from "@apollo/client/react";
import { type GetTasksQuery, type GetCurrentUserQuery, type GetProjectsQuery, type TasksQueryVariables } from "../graphql/types";
import { GET_CURRENT_USER, GET_PROJECTS, GET_TASKS } from "../graphql/queries";
import TaskCard from "../components/cards/TaskCard";
import ProjectCard from "../components/cards/ProjectCard";
import styles from "../styles/Dashboard.module.css"
import { Link } from "react-router-dom";

const DashboardPage = () => {
    const { data: userData, loading: userLoading, error: userError } = useQuery<GetCurrentUserQuery>(GET_CURRENT_USER);
    const userId = userData?.currentUser?.id;
    const { data: tasksData, loading: tasksLoading, error: tasksError } = useQuery<GetTasksQuery, TasksQueryVariables>(GET_TASKS, {
        variables: {
            assigneeId: userId!,
        },
        skip: !userId,
    });
    const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery<GetProjectsQuery>(GET_PROJECTS);

    if (userLoading || projectsLoading) {
        return <MainLayout>Loading...</MainLayout>;
    }
    if (userError) {
        return <MainLayout>Error loading user: {userError.message}</MainLayout>;
    }

    if (tasksLoading) {
        return <MainLayout>Loading...</MainLayout>;
    }
    if (tasksError) {
        return <MainLayout>Error loading user: {tasksError.message}</MainLayout>;
    }
    if (projectsError) {
        return <MainLayout>Error loading user: {projectsError.message}</MainLayout>;
    }

    console.log(userData)
    const user = userData?.currentUser;
    const tasks = tasksData?.tasks || [];
    const totalTasks = tasks?.length;
    const incompleteTasks = tasks?.filter(t => t.status !== 'completed').length;
    const urgentTasks = tasks.slice(0, 3);
    const projects = projectsData?.projects;
    const activeProjects = projects?.length;

    return (
        <MainLayout>
            <h1 className={styles.welcomeTitle}>Welcome, {user?.name}!</h1>

            {/* Summary Widgets */}
            <section className={styles.widgetGrid}>
                <div className={styles.widgetCard}>
                    <h2>Total Tasks</h2>
                    <p className={styles.widgetValue}>{totalTasks} 📋</p>
                </div>
                <div className={styles.widgetCard}>
                    <h2>Active Projects</h2>
                    <p className={styles.widgetValue}>{activeProjects} 🏗️</p>
                </div>
                <div className={styles.widgetCard}>
                    <h2>Incomplete Tasks</h2>
                    <p className={styles.widgetValue}>{incompleteTasks} 🚨</p>
                </div>
            </section>
            <hr />

            {/* Tasks Overview */}
            <section className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <h2>Your Next Tasks</h2>
                    <Link to="/tasks" className={styles.viewAllLink}>View All Tasks →</Link>
                </div>
                <div className={styles.cardList}>
                    {
                        urgentTasks?.length > 0 ? (
                            urgentTasks?.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    description={task.description}
                                    status={task.status}
                                    project={task.project}
                                    assignee={task.assignee}
                                    className={styles.taskCardStyle}
                                />
                            ))
                        ) : (<p className={styles.emptyState}>No urgent tasks to show.</p>)
                    }
                </div>
            </section>
            <hr />

            {/* Projects Overview */}
            <section className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <h2>Your Active Projects</h2>
                    <Link to="/projects" className={styles.viewAllLink}>View All Projects →</Link>
                </div>
                <div className={styles.cardList}>
                    {
                        projects?.slice(0, 3).map((project) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id}
                                name={project.description}
                                description={project.description}
                                progress={Math.min(project.tasksCount * 10, 100)}
                                className={styles.projectCardStyle}
                            />
                        ))
                    }
                </div>
            </section>
        </MainLayout>
    );
};

export default DashboardPage;