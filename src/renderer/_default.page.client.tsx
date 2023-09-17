import React from "react";
import ReactDOM from "react-dom/client";
import { ReactRoot } from "../components/Layout/ReactRoot";
import { reactRootElementId } from "../constants";
import type { PageContextClient } from "../types/page.types";

export const clientRouting = true;
export const hydrationCanBeAborted = true;

let appRoot;
export async function render(pageContext: PageContextClient): Promise<void> {
  const container = document.getElementById(reactRootElementId);
  if (!container) {
    throw new Error(`Missing <div id='${reactRootElementId}'>`);
  }

  const { Page, pageProps } = pageContext;

  const page = (
    <ReactRoot pageContext={pageContext}>
      <Page {...pageProps} />
    </ReactRoot>
  );

  if (container.innerHTML === "" || !pageContext.isHydration) {
    // SPA
    if (!appRoot) {
      appRoot = ReactDOM.createRoot(container);
    }
    appRoot.render(page);
  } else {
    // SSR
    appRoot = ReactDOM.hydrateRoot(container, page);
  }
}
