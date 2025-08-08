"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import LoginLink from "@/components/auth/LoginLink";

export function RegisterButton() {
    const { open } = useSidebar();

    return (
        <Button asChild variant="outline" size="sm" className="w-full justify-center">
            <LoginLink href="/api/login">
                <IconBrandGoogleFilled />
                {open && <span className="ml-2">Login</span>}
            </LoginLink>
        </Button>
    );
}