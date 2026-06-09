/** A bullet that optionally turns part of its text into a link. */
export type Highlight = {
  text: string;
  link: { label: string; href: string };
};

export type Experience = {
  role: string;
  org: string;
  date: string;
  description: string;
  highlights: readonly (string | Highlight)[];
  tags: readonly string[];
};

export const experience: readonly Experience[] = [
  {
    role: "Developer",
    org: "Chainflow",
    date: "Nov 2025 — Present",
    description:
      "I handle the development work at Chainflow's Solana validator operation — building and maintaining internal tooling end to end.",
    highlights: [
      "Built an offline-signer tool for secure, air-gapped transaction signing.",
      "Developed facilitator services that power validator workflows.",
      {
        text: "Maintaining",
        link: { label: "nakaflow.io", href: "https://nakaflow.io" },
      },
    ],
    tags: ["Solana", "TypeScript", "Validator Ops", "Tooling", "Bash"],
  },
];
