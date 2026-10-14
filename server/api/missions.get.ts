import { listMissions } from "../utils/board";

export default defineEventHandler(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 160);
  });
  return listMissions();
});
