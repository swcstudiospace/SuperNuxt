import { ledger } from "../ledger";

export default defineEventHandler(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 160);
  });
  return ledger.list();
});
