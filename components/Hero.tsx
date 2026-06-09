import { site } from "@/data/site";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-inner">
        <div className="badge">
          <span className="pulse" /> Open to internships &amp; collaborations
        </div>
        <h1 className="title">
          I build fast,
          <br />
          <span className="grad">correct systems.</span>
        </h1>
        <p className="tagline">{site.tagline}</p>
        <div className="cta-row">
          <a href="#work" className="btn btn-primary">
            See my work &#8594;
          </a>
          <a href="#contact" className="btn btn-ghost">
            Get in touch
          </a>
        </div>
      </div>
      <div className="scroll-hint">
        <span className="bar" />
        scroll
      </div>
    </header>
  );
}
