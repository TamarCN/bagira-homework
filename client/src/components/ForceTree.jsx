import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUnitChildren } from "../server";
import ForceNode from "./ForceNode";
import { useForceSearch } from "./ForceSearch";

const ForceTree = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: rootForces, isLoading } = useQuery({
    queryKey: ["forces", null],
    queryFn: () => fetchUnitChildren(null),
  });

  const { data: searchResults, isFetching } = useForceSearch(debouncedTerm);

  return (
    <div style={{ width: 500, margin: "0 auto" }}>
      <input
        type="text"
        placeholder="Search by name or force type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 20,
          borderRadius: 4,
          border: "1px solid #ccc"
        }}
      />

      {isFetching && <div>Searching...</div>}

    {debouncedTerm ? (
        searchResults?.length ? (
          searchResults.map((force) => (
            <div key={force.id} style={{ marginBottom: 10 }}>
              {force.path.map((node, idx) => (
                <span key={node.id}>
                  {node.name}
                  {idx < force.path.length - 1 && " > "}
                </span>
              ))}
              {" "}
              ({force.force_type})
            </div>
          ))
        ) : (
          <div>No results found</div>
        )
      ) : (
        <>
          {isLoading && <div>Loading root forces...</div>}
          {rootForces?.map((node) => (
            <ForceNode key={node.id} node={node} />
          ))}
        </>
      )}
    </div>
  );
};

export default ForceTree;