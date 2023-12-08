'use client'
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HeartPulse } from 'lucide-react';
import { Thermometer } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, XAxis, YAxis, Area, LineChart, CartesianGrid, Line } from "recharts";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { columns } from "./columns";
import { useState } from "react";
import { Input } from "../ui/input";
import {
    TextField as MuiTextField,
    Box as MuiBox,
    Button as MuiButton,
    Select as MuiSelect,
    MenuItem as MuiMenuItem,
    InputLabel as MuiInputLabel,
    FormControl as MuiFormControl,
    Chip as MuiChip,
    OutlinedInput as MuiOutlinedInput,
    SelectChangeEvent as MuiSelectChangeEvent,
} from "@mui/material";
export default function Doctors() {
    const [sorting, setSorting] = useState<SortingState>([])
    const data = [
        { name: "John Doe", user_email: "john@example.com", role_name: "admin" },
        { name: "Jane Doe", user_email: "jane@example.com", role_name: "ssc" },
        { name: "Bob Smith", user_email: "bob@example.com", role_name: "admin" },
        { name: "Alice Johnson", user_email: "alice@example.com", role_name: "ssc" },
        { name: "Alice Johnson", user_email: "alice@example.com", role_name: "ssc" },
        { name: "Alice Johnson", user_email: "alice@example.com", role_name: "ssc" },
        { name: "Alice Johnson", user_email: "alice@example.com", role_name: "ssc" },
        { name: "Alice Johnson", user_email: "alice@example.com", role_name: "ssc" },
        { name: "Alice Johnson", user_email: "alice@example.com", role_name: "ssc" },
        { name: "Alice Johnson", user_email: "alice@example.com", role_name: "ssc" },
        { name: "Alice Johnson", user_email: "alice@example.com", role_name: "ssc" },
        { name: "Alice Johnson", user_email: "alice@example.com", role_name: "ssc" },
    ];
    const table = useReactTable({
        data: data, columns, getCoreRowModel: getCoreRowModel(), onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })
    return (
        <>
            <div className="m-5">
                {/* filter components  */}
                <div className="flex flex-col items-center">
                    <Card className=" mt-4 w-full ">
                        <h3 className="m-2 ml-4 scroll-m-20 text-2xl font-semibold tracking-tight">
                            Filters: <Button variant="outline" className={'right-0 float-right text-center'}  >
                                <span className={''}> Reset</span>
                            </Button>
                        </h3>
                        <CardContent className={'p-4 pt-0'}>
                            <div className="mt-2 flex  flex-wrap  gap-6">
                                <MuiTextField
                                    size="small"
                                    id="outlined-uncontrolled"
                                    label="Search Users"
                                    variant={"outlined"}
                                    // size="small"
                                    sx={{ width: 250 }}
                                />
                                <MuiFormControl size="small" sx={{ width: 250 }}>
                                    <MuiInputLabel id="demo-simple-select-label">Roles</MuiInputLabel>
                                    <MuiSelect
                                        size="small"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                    >
                                    </MuiSelect>
                                </MuiFormControl>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* table components */}
                <div className="fflex m-auto  flex-1 items-center">
                    <div className='mt-4  rounded-md border'>
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (<TableRow className={''} key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead className={'text-center'} key={header.id}>
                                                {header.isPlaceholder ? null : <Button
                                                    className={'text-xs'}
                                                    variant="ghost"
                                                > {header.getContext().column.columnDef.header as any || ""}
                                                </Button>}

                                            </TableHead>)
                                    })}
                                </TableRow>))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>))}

                                    </TableRow>))) : (<TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>)}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    )

}
