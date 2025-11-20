type TaskCardProps = {
    title: string;
    description: string;
    status: "pending" | "in_progress" | "cancelled" | "completed";
    className?: string;
};

const TaskCard = ({ title, description, status, className }: TaskCardProps) => {
    let borderColor = "#3498db";
    if (status == "in_progress") {
        borderColor = "#f1c40f";
    } else if (status == "completed") {
        borderColor = "#2ecc71";
    } else if (status == "cancelled") {
        borderColor = "#c81616ff";
    }

    return (
        <div className={className} 
            style={{
                borderLeft: `5px solid ${borderColor}`
            }
        }>
            <h3>{title}</h3>
            <p>{description}</p>
            <small style={{
                fontWeight: 'bold',
                color: borderColor
            }}>{status.replace("_", " ")}</small>
        </div>
    );
};

export default TaskCard;