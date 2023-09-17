import React from "react";
import { Counter } from "../../components/_/Counter";

export function Page() {
  return (
    <>
      <h1>Exercise</h1>
      <ul>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  );
}
