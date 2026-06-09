"use client";

import { useEffect, useRef, useState } from "react";

type Entry = { id: string; name: string; message: string };

const NAME_MAX = 32;
const MSG_MAX = 120;

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.entries)) setEntries(data.entries);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const msg = message.trim();
    if (!msg || submitting) return;

    setError(null);
    setSubmitting(true);

    // optimistic insert
    const optimistic: Entry = {
      id: `tmp-${Date.now()}`,
      name: name.trim() || "you",
      message: msg,
    };
    setEntries((prev) => [optimistic, ...prev]);
    setMessage("");

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: msg,
          // honeypot: real users leave this empty
          website: honeypot.current?.value ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.entry) {
        throw new Error(data.error || "Something went wrong.");
      }
      // replace optimistic entry with the server's canonical one
      setEntries((prev) =>
        prev.map((en) => (en.id === optimistic.id ? data.entry : en)),
      );
    } catch (err) {
      // roll back
      setEntries((prev) => prev.filter((en) => en.id !== optimistic.id));
      setMessage(msg);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="panel-icon" aria-hidden="true">
          &#9997;
        </span>
        <div className="panel-titles">
          <h3>Sign the guestbook</h3>
          <div className="sub">
            Drop a note — say hi, leave feedback, or just wave.
          </div>
        </div>
        {entries.length > 0 && (
          <span className="gb-count">
            {entries.length} {entries.length === 1 ? "note" : "notes"}
          </span>
        )}
      </div>

      <div className="gb-log" ref={logRef} aria-live="polite">
        {entries.length === 0 ? (
          <div className="gb-empty">
            {loaded ? "Be the first to say hi." : "Loading notes…"}
          </div>
        ) : (
          entries.map((en) => (
            <div className="gb-entry" key={en.id}>
              <span className="gb-avatar" aria-hidden="true">
                {en.name.charAt(0).toUpperCase()}
              </span>
              <div className="gb-body">
                <span className="who">{en.name}</span>
                <span className="msg">{en.message}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <form className="gb-input" onSubmit={submit}>
        <input
          className="gb-name"
          type="text"
          value={name}
          maxLength={NAME_MAX}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
          autoComplete="off"
          aria-label="Your name (optional)"
        />
        <input
          type="text"
          value={message}
          maxLength={MSG_MAX}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="leave a message..."
          autoComplete="off"
          aria-label="Your message"
        />
        {/* honeypot field — hidden from humans */}
        <input
          ref={honeypot}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hp-field"
          aria-hidden="true"
        />
        <button type="submit" disabled={submitting || !message.trim()}>
          {submitting ? "…" : "Post"}
        </button>
      </form>

      {error && <div className="gb-error">{error}</div>}
      <div className="note">
        Notes are validated, rate-limited, and stored server-side.
      </div>
    </div>
  );
}
