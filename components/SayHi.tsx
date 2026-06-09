import Reveal from "./Reveal";
import Guestbook from "./Guestbook";
import { site } from "@/data/site";

export default function SayHi() {
  return (
    <section id="say">
      <div className="wrap">
        <Reveal className="eyebrow">04 — Say hi</Reveal>
        <Reveal as="h2" className="section-title">
          No pressure, just say hi.
        </Reveal>
        <Reveal as="p" className="section-lead">
          Support the work if it helped — or just leave a note. Both make my day.
        </Reveal>
        <Reveal className="duo">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-icon" aria-hidden="true">
                &#9749;
              </span>
              <div className="panel-titles">
                <h3>Buy me a coffee</h3>
                <div className="sub">
                  If something here was useful, fuel the next build.
                </div>
              </div>
            </div>
            <a
              href={site.coffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: "inline-flex" }}
            >
              &#9749; Send a coffee &#8594;
            </a>
            <div className="coffee-perks stagger">
              <span>Fuels late-night debugging sessions</span>
              <span>Keeps new side-projects shipping</span>
            </div>
            <div className="note">Every coffee genuinely helps — thank you.</div>
          </div>
          <Guestbook />
        </Reveal>
      </div>
    </section>
  );
}
