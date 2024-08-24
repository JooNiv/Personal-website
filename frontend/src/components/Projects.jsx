import Project from './Project';
import projectsData from '../../data/projects.json'; 

const Projects = (projectsRef) => {
    return (
        <div id="projects" className="container mx-auto max-w-2xl flex justify-center flex-wrap pb-0">
            {projectsData.map((project, index) => (
            <Project
                key={index} // A unique key for each item
                title={project.title}
                description={project.description}
                link={project.link}
                image_path={project.image_path}
            />
            ))}
        </div>
    )
}

export default Projects