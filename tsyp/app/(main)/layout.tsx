'use client'

import { MainNav } from "@/components/dashboard/main_nav";
import TeamSwitcher from "@/components/dashboard/team_switcher";
import { UserNav } from "@/components/dashboard/user_nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserSheet } from "@/components/user_Sheet";
import { CalendarDays } from 'lucide-react';
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster"

function Layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            <div style={{ 'backgroundColor': '#f7f6f9' }} className="h-full">
                {/* Main content of each page goes here */}
                <div >{children}</div>
                <Toaster />
            </div>
        </>

    );
}

export default Layout;
