import React, { FC } from "react";
import { Link } from "../_/Link";
import logo from "../../assets/logo.svg";
import { PageContextProvider } from "../../hooks/usePageContext";
import "./global.scss";
import type { PageContext } from "../../types/page.types";

export const ReactRoot: FC<{
  children: React.ReactNode;
  pageContext: PageContext;
}> = ({ children, pageContext }) => (
  <React.StrictMode>
    <PageContextProvider pageContext={pageContext}>
      <Layout>
        <Sidebar>
          <Logo />
          <Link className="navitem" href="/">
            Home
          </Link>
          <Link className="navitem" href="/nonexistent">
            404
          </Link>
          <Link className="navitem" href="/vitest">
            Vitest
          </Link>
          <Link className="navitem" href="/admin">
            Admin
          </Link>
        </Sidebar>
        <Content>{children}</Content>
      </Layout>
    </PageContextProvider>
  </React.StrictMode>
);

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        maxWidth: 900,
        margin: "auto",
      }}
    >
      {children}
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: "1.8em",
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: "2px solid #eee",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href="/">
        <img src={logo} height={64} width={64} alt="logo" />
      </a>
    </div>
  );
}
