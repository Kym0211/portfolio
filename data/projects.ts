export type Project = {
  title: string;
  description: string;
  tags: readonly string[];
  href: string;
};

export const projects: readonly Project[] = [
  {
    title: "Offline Signing CLI",
    description:
      "A CLI for secure, air-gapped Solana transaction signing — production tooling built for Chainflow's validator operations.",
    tags: ["TypeScript", "Solana", "CLI", "Chainflow"],
    href: "https://github.com/ChainflowSOL/offline-signing-cli",
  },
  {
    title: "Chainflow x402 Facilitator",
    description:
      "An x402 payment facilitator for Solana — pay-per-call API access settled on-chain via stake-weighted QoS, built for Chainflow.",
    tags: ["Solana", "x402", "Payments", "Chainflow"],
    href: "https://github.com/ChainflowSOL/chainflow-facilitator-docs",
  },
  {
    title: "Custom Syscall",
    description:
      "A custom syscall for the Agave validator that fetches multiple sysvars in a single call, improving on-chain efficiency.",
    tags: ["Rust", "Solana", "Agave"],
    href: "https://github.com/Kym0211/custom-syscall",
  },
  {
    title: "OracleMind",
    description:
      "A decentralized prediction market on Solana — create markets, place bets, and claim rewards — with a full-stack Next.js UI and live group chat.",
    tags: ["Rust", "Anchor", "Next.js"],
    href: "https://github.com/Kym0211/OracleMind",
  },
  {
    title: "Jito BAM Explorer",
    description:
      "A real-time backend service that monitors Jito blocks and detects potential MEV activity on Solana.",
    tags: ["Node.js", "TypeScript", "Solana"],
    href: "https://github.com/Kym0211/bam_transaction_explorer",
  },
  {
    title: "Rollup Stub",
    description:
      "An Anchor program that stores Merkle roots on-chain, cutting storage needs for off-chain state verification.",
    tags: ["Rust", "Anchor", "Solana"],
    href: "https://github.com/Kym0211/rollup_stub",
  },
];
