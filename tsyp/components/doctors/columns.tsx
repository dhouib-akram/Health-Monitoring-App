"use client";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const columns: ColumnDef<any>[] = [

    {
        accessorKey: 'name',
        header: "Doctor Name"
        , cell: ({ row }) => {
            const element = row.original;
            return (
                <div className="items-center p-2 text-center">
                    {element.name || ""}
                </div>
            );
        },
    },
    {
        accessorKey: 'user_email',
        header: "Doctor Email",
        cell: ({ row }) => {
            const element = row.original
            return (
                <div className={'items-start p-2 text-center   '}>
                    {element.user_email || ""}
                </div>
            )
        },
    },
    {
        accessorKey: 'role_name',
        header: "Doctor Role",
        cell: ({ row }) => {
            const element = row.original
            return (
                <div className={'items-center p-2 text-center '}>
                    {element.role_name || ""}
                </div>
            )
        },
    },
]
