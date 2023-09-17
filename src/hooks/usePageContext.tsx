import React, { useContext } from "react";
import type { PageContext } from "../types/page.types";

const Context = React.createContext<PageContext>(undefined);

export function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: React.ReactNode;
}) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>;
}

// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vite-plugin-ssr.com/pageContext-anywhere
export function usePageContext() {
  const pageContext = useContext(Context);
  return pageContext;
}
