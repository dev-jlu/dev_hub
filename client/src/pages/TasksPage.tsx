import TaskCard from "../components/cards/TaskCard";
import MainLayout from "../layouts/MainLayout";

// Sample Tasks
const sampleTasks = [
    { title: "Fix login bug", description: "Resolve issue with Authlogic", status: "pending" },
    { title: "Add GraphQL endpoint", description: "Create tasks query", status: "in_progress" },
    { title: "Add Users Groups", description: "Create users groups", status: "cancelled" },
    { title: "Deploy to Render", description: "Deploy Rails + React", status: "completed" },
];

const TasksPage = () => {
    return (
        <MainLayout>
            <h1>Tasks</h1>
            {
                sampleTasks.map((task, index) => (
                    <TaskCard 
                        key={index}
                        title={task.title}
                        description={task.description}
                        status={task.status as "pending" | "in_progress" | "cancelled" | "completed"} />
                ))
            }
        </MainLayout>
    );
};

export default TasksPage;