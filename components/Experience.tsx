import Reveal from "./Reveal";
import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <Reveal className="eyebrow">02 — Experience</Reveal>
        <Reveal as="h2" className="section-title">
          Where I&apos;ve worked.
        </Reveal>
        <Reveal className="timeline">
          {experience.map((exp) => (
            <div className="exp" key={`${exp.org}-${exp.role}`}>
              <div className="exp-top">
                <div>
                  <span className="exp-role">{exp.role}</span> ·{" "}
                  <span className="exp-org">{exp.org}</span>
                </div>
                <span className="exp-date ph">{exp.date}</span>
              </div>
              <p>{exp.description}</p>
              <ul className="exp-highlights stagger">
                {exp.highlights.map((h) =>
                  typeof h === "string" ? (
                    <li key={h}>{h}</li>
                  ) : (
                    <li key={h.link.label}>
                      {h.text}{" "}
                      <a
                        className="exp-link"
                        href={h.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {h.link.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
              <div className="tags">
                {exp.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
