import { Person } from "./person";

export type Credits = {
   id: number;
   cast: Person[];
   crew: Person[];
};