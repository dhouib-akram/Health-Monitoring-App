'use client'

import { MainNav } from "@/components/dashboard/main_nav";
import TeamSwitcher from "@/components/dashboard/team_switcher";
import { UserNav } from "@/components/dashboard/user_nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserSheet } from "@/components/user_Sheet";
import { CalendarDays } from 'lucide-react';
import { useState } from "react";

function Layout({ children }: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false)
    return (
        <>
            <div>
                <div>
                    <div className="border-b bg-white">
                        <div className="flex h-16 items-center px-4">
                            <MainNav className="mx-6" />
                            <div className="ml-auto flex items-center space-x-4">
                                <Button variant='ghost' onClick={async () => {
                                    await setOpen(true)
                                    document.getElementById('user_sheet_btn')!.click()
                                    console.log('?')
                                }}>
                                    <CalendarDays />
                                </Button>
                                <div>
                                    <Input
                                        type="search"
                                        placeholder="Search..."
                                        className="md:w-[100px] lg:w-[300px]"
                                    />
                                </div>
                                <UserNav />
                            </div>
                        </div>
                    </div>
                    {/* Main content of each page goes here */}
                    <div>{children}</div>
                </div>
            </div>
            {open && (<UserSheet />)}
        </>

    );
}

export default Layout;
