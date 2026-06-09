import Reveal from "./Reveal";
import { site } from "@/data/site";
import { socials } from "@/data/socials";

export default function Contact() {
  return (
    <footer id="contact">
      <div className="wrap">
        <Reveal className="foot">
          <div className="foot-cta">
            <div className="eyebrow">05 — Contact</div>
            <h2>Let&apos;s build something.</h2>
            <a className="mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <div className="foot-socials stagger">
            {socials.map((s) => (
              <a
                key={s.label}
                className="social"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </Reveal>

        <div className="foot-divider" />

        <div className="foot-bottom">
          <span className="copy">© 2026 Kavyam</span>
          <a className="to-top" href="#top">
            Back to top &#8593;
          </a>
        </div>
      </div>
    </footer>
  );
}
