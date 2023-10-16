import { questionTypes } from "types";

export type questionParams = ReturnType<typeof questionTypes.parse>;
