export const skills: readonly string[] = [
  "TypeScript",
  "React / Next.js",
  "Node",
  "Python",
  "Solana / Web3",
  "C++",
  "PostgreSQL",
];

export type Stat = { value: string; label: string };

export const stats: readonly Stat[] = [
  { value: "3rd", label: "year @ IIT Ropar" },
  { value: "10+", label: "projects shipped" },
  { value: "∞", label: "cups of coffee" },
];

/** "Right now" list shown in the About snapshot card. */
export const now: readonly string[] = [
  "Solana validator infrastructure @ Chainflow",
  "Competitive programming in C++",
  "Exploring quantitative finance",
];

export const location = "IIT Ropar · India";
