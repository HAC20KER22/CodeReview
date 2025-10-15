"use client";
import React, { useState } from "react";

export default function CodeCard({
  filename,
  code,
}: {
  filename: string;
  code: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div>
        <h2>{filename}</h2>
        <button onClick={() => setShow(!show)}>
          {show ? "Hide Code" : "Show Code"}
        </button>
      </div>

      {show && <pre>{code}</pre>}
    </div>
  );
}
