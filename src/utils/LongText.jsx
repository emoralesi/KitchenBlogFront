import { useState } from "react";

export default function ExpandableText({ text, maxLength = 200 }) {
    const [expanded, setExpanded] = useState(false);

    const isLongText = text.length > maxLength;
    const displayText = expanded || !isLongText ? text : text.slice(0, maxLength) + "...";

    return (
        <div className="text-base">
            <p>{displayText}</p>
            {isLongText && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-500 hover:underline mt-2"
                >
                    {expanded ? "See Less" : "See More"}
                </button>
            )}
        </div>
    );
}