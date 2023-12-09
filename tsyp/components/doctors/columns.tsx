"use client";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import SendInvite from "./sendInvite";

export const columns: ColumnDef<any>[] = [

    {
        accessorKey: 'username',
        header: "Doctor Name"
        , cell: ({ row }) => {
            const element = row.original;
            return (
                <div className="items-center p-2 text-center">
                    {element.username || ""}
                </div>
            );
        },
    },
    {
        accessorKey: 'email',
        header: "Doctor Email",
        cell: ({ row }) => {
            const element = row.original
            return (
                <div className={'items-start p-2 text-center   '}>
                    {element.email || ""}
                </div>
            )
        },
    },
]
