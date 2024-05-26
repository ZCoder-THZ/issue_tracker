import React from 'react';
import { Badge } from "@/components/ui/badge"
 // Adjust the import according to your setup

// Define a type for the status prop
type Status = "OPEN" | "IN_PROGRESS" | "CLOSED";

// Define the props interface
interface IssueBadgeProps {
  status: Status;
}

const getBadgeVariant = (status: Status): string => {
  switch (status) {
    case "OPEN":
      return "destructive"; // Green
    case "IN_PROGRESS":
      return "outline"; // Red
    case "CLOSED":
      return "default"; // Secondary color
    default:
      return "default"; // Default variant if status is unrecognized
  }
};

 const IssueBadge: React.FC<IssueBadgeProps> = ({ status }) => {
  return (
    <Badge variant={getBadgeVariant(status)}>
      {status}
    </Badge>
  );
};
export default IssueBadge

