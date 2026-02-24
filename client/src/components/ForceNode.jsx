import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUnitChildren } from "../server";

const ForceNode = ({ node }) => {
  const [expanded, setExpanded] = React.useState(false);

  const { data: children, isLoading } = useQuery({
    queryKey: ["forces", node.id],
    queryFn: () => fetchUnitChildren(node.id),
    enabled: expanded,
  });

  return (
    <div style={{ marginLeft: 20 }}>
      <div
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setExpanded(!expanded)}
      >
        {node.name} ({node.force_type})
      </div>

      {expanded && (
        <div>
          {isLoading && <div>Loading...</div>}
          {children?.map((child) => (
            <ForceNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ForceNode;