import type { Mission } from "../shared/missions";

export function composeDeskReply(
  prompt: string,
  missions: readonly Mission[],
): string {
  const asked = prompt.toLowerCase();
  const hits = missions.filter((mission) => {
    const haystack =
      `${mission.code} ${mission.name} ${mission.site} ${mission.status}`.toLowerCase();
    return asked
      .split(/\s+/)
      .some((word) => word.length > 2 && haystack.includes(word));
  });

  if (!asked) {
    return "Desk is listening. Ask about a mission code, a site, or who is on hold.";
  }

  if (hits.length > 0) {
    const lines = hits.map(
      (mission) =>
        `${mission.code} ${mission.name} is ${mission.status} at ${mission.site}, window ${mission.window}, crew ${mission.crew}.`,
    );
    return `Local desk brief, no outside model. ${lines.join(" ")}`;
  }

  if (asked.includes("hold")) {
    const held = missions.filter((mission) => mission.status === "hold");
    if (held.length === 0) return "Nothing is on hold.";
    return `On hold: ${held.map((mission) => mission.code).join(", ")}.`;
  }

  return `I can brief the eight missions on this desk. I don't call an external model. Try "KITE-4", "Mahia", or "who is on hold". You asked: "${prompt}".`;
}
