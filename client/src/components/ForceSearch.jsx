import { useQuery } from "@tanstack/react-query";
import { searchForces } from "../server";

export const useForceSearch = (searchTerm) => {
  return useQuery({
    queryKey: ["forceSearch", searchTerm],
    queryFn: () => searchForces(searchTerm),
    enabled: !!searchTerm,
  });
};