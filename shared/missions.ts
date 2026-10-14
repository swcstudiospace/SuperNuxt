export const missionStatuses = [
  "standby",
  "fueling",
  "ascent",
  "coast",
  "hold",
] as const;

export type MissionStatus = (typeof missionStatuses)[number];

export interface Mission {
  id: string;
  code: string;
  name: string;
  vehicle: string;
  status: MissionStatus;
  window: string;
  crew: number;
  deltaV: number;
  site: string;
}

export const missions: Mission[] = [
  {
    id: "kite-4",
    code: "KITE-4",
    name: "Paper Lantern",
    vehicle: "Kite 4",
    status: "fueling",
    window: "04:12–04:26 UTC",
    crew: 4,
    deltaV: 9420,
    site: "Canaveral West",
  },
  {
    id: "harbor-bird",
    code: "HB-12",
    name: "Harbor Bird",
    vehicle: "Skiff",
    status: "standby",
    window: "11:40–12:05 UTC",
    crew: 2,
    deltaV: 3180,
    site: "Mahia",
  },
  {
    id: "lowell",
    code: "LWL-2",
    name: "Lowell Return",
    vehicle: "Cask",
    status: "coast",
    window: "18:02–18:16 UTC",
    crew: 6,
    deltaV: 11240,
    site: "Kourou",
  },
  {
    id: "north-glass",
    code: "NG-7",
    name: "North Glass",
    vehicle: "Kite 4",
    status: "hold",
    window: "22:15–22:40 UTC",
    crew: 0,
    deltaV: 870,
    site: "Vandenberg",
  },
  {
    id: "reed",
    code: "RD-19",
    name: "Reed Survey",
    vehicle: "Skiff",
    status: "ascent",
    window: "01:05–01:11 UTC",
    crew: 3,
    deltaV: 6540,
    site: "Canaveral West",
  },
  {
    id: "mica",
    code: "MC-3",
    name: "Mica Cargo",
    vehicle: "Cask",
    status: "standby",
    window: "09:30–10:00 UTC",
    crew: 0,
    deltaV: 2210,
    site: "Mahia",
  },
  {
    id: "osprey",
    code: "OSP-1",
    name: "Osprey Relay",
    vehicle: "Kite 4",
    status: "fueling",
    window: "16:48–17:02 UTC",
    crew: 5,
    deltaV: 10080,
    site: "Kourou",
  },
  {
    id: "amber",
    code: "AM-8",
    name: "Amber Line",
    vehicle: "Skiff",
    status: "coast",
    window: "07:20–07:34 UTC",
    crew: 1,
    deltaV: 4890,
    site: "Vandenberg",
  },
];

export function telemetryLine(index: number): { id: number; text: string } {
  const mission = missions[index % missions.length]!;
  const second = index * 3;
  const speed = 980 + ((index * 17) % 400);
  return {
    id: index,
    text: `${String(second).padStart(5, "0")}s   ${mission.code.padEnd(8, " ")} bus ${index % 8}   ${speed} m/s`,
  };
}
