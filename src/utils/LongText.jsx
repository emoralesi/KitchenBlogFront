import { useState } from "react";
import { Typography, Button } from "@mui/material";

export default function ExpandableText({ text, maxLength = 200 }) {
  const [expanded, setExpanded] = useState(false);

  const isLongText = text.length > maxLength;
  const displayText =
    expanded || !isLongText ? text : text.slice(0, maxLength) + "...";

  return (
    <div>
      <Typography
        variant="body1"
        color="text.primary"
        sx={{ whiteSpace: "pre-line" }}
      >
        {displayText}
      </Typography>

      {isLongText && (
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="text"
          size="small"
          sx={{ mt: 1, color: "primary.main", textTransform: "none" }}
        >
          {expanded ? "Ver menos" : "Ver más"}
        </Button>
      )}
    </div>
  );
}