import { missionStatuses, type MissionStatus } from "../../../shared/missions";
import { updateMissionStatus } from "../../utils/board";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<{ status?: MissionStatus }>(event);
  if (!id || !body?.status || !missionStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Mission id and a known status are required.",
    });
  }
  const mission = updateMissionStatus(id, body.status);
  if (!mission) {
    throw createError({ statusCode: 404, statusMessage: "Unknown mission" });
  }
  return mission;
});
