import {
  missions as seed,
  type Mission,
  type MissionStatus,
} from "../../shared/missions";

const board: Mission[] = seed.map((mission) => ({ ...mission }));

export function listMissions(): Mission[] {
  return board.map((mission) => ({ ...mission }));
}

export function updateMissionStatus(
  id: string,
  status: MissionStatus,
): Mission | null {
  const mission = board.find((item) => item.id === id);
  if (!mission) return null;
  mission.status = status;
  return { ...mission };
}
