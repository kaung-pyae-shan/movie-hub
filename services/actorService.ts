import { Serie } from "@/types/serie";
import { TMDB_CONFIG } from "./config";
import { Person } from "@/types/person";

type ActorResponse = {
   page: number;
   results: Person[];
   total_pages: number;
   total_results: number;
};

export const fetchPopularActors = async (
   page: number = 1,
): Promise<ActorResponse> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/person/popular?page=${page}`;

   const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch actors: ${response.statusText}`);
   }

   const data: ActorResponse = await response.json();
   return data;
};

export const fetchActorDetails = async (
   actorId: string,
): Promise<Person> => {
   const endpoint = `${TMDB_CONFIG.BASE_URL}/person/${actorId}`;

   const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
   });

   if (!response.ok) {
      throw new Error(`Failed to fetch actor details: ${response.statusText}`);
   }

   const data: Person = await response.json();
   return data;
};