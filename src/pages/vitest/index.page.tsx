import React from "react";
import { Counter } from "../../components/_/Counter";
import "./style.scss";

export function Page() {
  return (
    <>
      <h1>Vite Test page</h1>
      <p>
        Example of using <code>vite-plugin-ssr</code>.
      </p>
      <p>
        Interactive <Counter />
      </p>
    </>
  );
}
