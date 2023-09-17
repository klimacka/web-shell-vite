import React from "react";
import ReactDOMServer from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr/server";
import { ReactRoot } from "../components/Layout/ReactRoot";
import { reactRootElementId } from "../constants";
import type { PageContextServer } from "../types/page.types";
import type { TemplateWrapped } from "vite-plugin-ssr/dist/types/node/runtime/html/renderHtml";

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient: Array<keyof PageContextServer> = ["pageProps"];

export function render(pageContext: PageContextServer): TemplateWrapped {
  let pageHtml = "";
  const urlPath = pageContext.urlPathname;

  if (!pageContext.Page) {
    // SPA
    console.info(`SPA rendering ${urlPath}`);
    pageHtml = "";
  } else {
    // SSR / HTML-only
    console.info(`SSR-endering ${urlPath}`);
    const { Page, pageProps } = pageContext;
    pageHtml = ReactDOMServer.renderToString(
      <ReactRoot pageContext={pageContext}>
        <Page {...pageProps} />
      </ReactRoot>,
    );
  }

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="${reactRootElementId}">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
