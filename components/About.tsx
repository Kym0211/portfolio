import Reveal from "./Reveal";
import { location, now, skills, stats } from "@/data/skills";

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <Reveal className="eyebrow">01 — About</Reveal>
        <Reveal as="h2" className="section-title">
          A bit about me.
        </Reveal>
        <Reveal className="about">
          <div className="about-bio">
            <p>
              I&apos;m Kavyam, a third-year B.Tech student at{" "}
              <strong>IIT Ropar</strong> who likes building across the whole
              stack — from full-stack web apps to Solana validator
              infrastructure and developer tooling.
            </p>
            <p>
              Right now I&apos;m working on Solana infrastructure at{" "}
              <strong>Chainflow</strong>, sharpening my competitive programming
              in C++, and following curiosities into quantitative finance. I
              care about systems that are correct, fast, and well-understood end
              to end.
            </p>
            <div className="about-skills">
              <span className="about-label">Tools I reach for</span>
              <div className="chips stagger">
                {skills.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="snapshot">
            <div className="stat-grid stagger">
              {stats.map((stat) => (
                <div key={stat.label} className="stat">
                  <div className="n grad">{stat.value}</div>
                  <div className="l">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="snap-divider" />

            <div className="now">
              <span className="about-label">Right now</span>
              <ul className="now-list stagger">
                {now.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="snap-loc">{location}</div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
