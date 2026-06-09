import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <Reveal className="eyebrow">03 — Work</Reveal>
        <Reveal as="h2" className="section-title">
          Selected projects.
        </Reveal>
        <div className="grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.href} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
