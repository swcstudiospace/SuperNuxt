import { createLedger } from "../src/domain/ledger";
import { missions } from "../shared/missions";

export const ledger = createLedger(missions);
