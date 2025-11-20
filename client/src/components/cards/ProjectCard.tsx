type ProjectCardProps = {
    name: string;
    description: string;
    progress: number;
    className?: string;
}

const ProjectCard = ({ name, description, progress, className }: ProjectCardProps) => {
    return (
        <div className={className}>
            <h3>{name}</h3>
            <p>{description}</p>
            <small>Progress: {progress}%</small>
        </div>
    );
};

export default ProjectCard;