import { createLedger } from "@supernuxt/core";
import { missions } from "#shared/missions";

export const ledger = createLedger(missions);
