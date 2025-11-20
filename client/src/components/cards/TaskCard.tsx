type TaskCardProps = {
    title: string,
    description: string,
    status: "pending" | "in_progress" | "cancelled" | "completed";
};

const TaskCard = ({ title, description, status }: TaskCardProps) => {
    let borderColor = "#3498db";
    if (status == "in_progress") {
        borderColor = "#f1c40f";
    } else if (status == "completed") {
        borderColor = "#2ecc71";
    } else if (status == "cancelled") {
        borderColor = "#c81616ff";
    }

    return (
        <div style={{
            border: `2px solid ${borderColor}`,
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            backgroundColor: "#fff",
        }}>
            <h3>{title}</h3>
            <p>{description}</p>
            <small>{status.replace("_", " ")}</small>
        </div>
    );
};

export default TaskCard;