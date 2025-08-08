"use client";

import React from "react";

type LoginLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
};

export default function LoginLink({ href = "/api/login", onClick, children, ...rest }: LoginLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      const currentUrl = window.location.href;
      const encodedUrl = encodeURIComponent(currentUrl);
      const maxAgeSeconds = 600; // 10 minutes
      document.cookie = `redirect=${encodedUrl}; path=/; max-age=${maxAgeSeconds}; samesite=Lax`;
    } catch {
      // ignore client cookie errors
    }

    if (onClick) {
      onClick(event);
    }

    // Ensure navigation happens after cookie is set
    event.preventDefault();
    window.location.href = href;
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}


