import React, { FC } from "react";
import { usePageContext } from "../../hooks/usePageContext";

export const Link: FC<{
  href?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ href, className, children }) => {
  const pageContext = usePageContext();
  const classNames = [
    className,
    pageContext.urlPathname === href && "is-active",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      {...{
        href,
        className,
        children,
      }}
      className={classNames}
    />
  );
};
