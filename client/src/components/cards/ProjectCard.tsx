type ProjectCardProps = {
    name: string;
    description: string;
    progress: number;
}

const ProjectCard = ({ name, description, progress }: ProjectCardProps) => {
    return (
        <div
        style={{
            border: "2px solid #34495e",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            backgroundColor: "#fff",
        }}>
            <h3>{name}</h3>
            <p>{description}</p>
            <small>Progress: {progress}%</small>
        </div>
    );
};

export default ProjectCard;