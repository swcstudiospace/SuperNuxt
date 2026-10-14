import { createError } from "h3";
import { z } from "zod";
import { missions } from "../../shared/missions";

const briefingInput = z.object({
  missionId: z.string().min(1),
});

export interface Briefing {
  missionId: string;
  headline: string;
  note: string;
}

export const serverFns = {
  briefing(input: unknown): Briefing {
    const parsed = briefingInput.parse(input);
    const mission = missions.find((item) => item.id === parsed.missionId);
    if (!mission) {
      throw createError({
        statusCode: 404,
        statusMessage: "Unknown mission",
      });
    }
    return {
      missionId: mission.id,
      headline: `${mission.code} is ${mission.status}`,
      note: `${mission.name} flies on ${mission.vehicle} from ${mission.site}. Window ${mission.window}. Crew ${mission.crew}.`,
    };
  },
};

export type ServerFnName = keyof typeof serverFns;
