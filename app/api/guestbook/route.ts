import { NextResponse } from "next/server";
import { addEntry, checkRateLimit, listEntries } from "@/lib/guestbook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await listEntries();
    // expose only what the client renders
    return NextResponse.json({
      entries: entries.map((e) => ({
        id: e.id,
        name: e.name,
        message: e.message,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load guestbook." },
      { status: 500 },
    );
  }
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // honeypot — bots fill hidden fields; humans never do
  if (typeof body.website === "string" && body.website.trim() !== "") {
    // pretend success so bots don't learn the field is a trap
    return NextResponse.json({
      entry: { id: "ignored", name: "anon", message: "" },
    });
  }

  const ip = clientIp(req);
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Slow down a little — try again in a minute." },
      { status: 429 },
    );
  }

  const result = await addEntry({ name: body.name, message: body.message });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    entry: {
      id: result.entry.id,
      name: result.entry.name,
      message: result.entry.message,
    },
  });
}
