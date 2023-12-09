'use client'
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CalendarDays, HeartPulse } from 'lucide-react';
import { Thermometer } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, XAxis, YAxis, Area, LineChart, CartesianGrid, Line } from "recharts";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
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
import SendInvite from "./sendInvite";
import { MainNav } from "../dashboard/main_nav";
import { UserNav } from "../dashboard/user_nav";
import { UserSheet } from "../user_Sheet";
export default function Doctors() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pendingDoctors, SetPendingDoctors] = useState<string[]>([]);
    const [myDoctors, SetMyDoctors] = useState<string[]>([]);
    useEffect(() => {
        const fetchdata = async () => {
            const response = await fetch('http://127.0.0.1:8000/get_doctors', {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json', // Adjust the content type if needed,
                }
            });
            if (response.status !== 200) {
            }
            const responseBody = await response.json(); // Log the raw response body
            setData(responseBody)
        }
        fetchdata();
    }, []);
    useEffect(() => {
        const filtered = data.filter((item: { username?: string }) => {
            if (searchQuery.trim() === '') {
                return true; // Include all data when searchQuery is empty or only contains spaces
            }
            return item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredData(filtered);
    }, [searchQuery, data]);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchdata = async () => {
            const response = await fetch('http://127.0.0.1:8000/user/info', {
                headers: {
                    'Content-Type': 'application/json', // Adjust the content type if needed,
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 200) {
            }
            const responseBody = await response.json();
            SetPendingDoctors(responseBody.pending_doctors)
            SetMyDoctors(responseBody.doctors)
            console.log(responseBody)
        }
        fetchdata();
    }, [token]);
    const table = useReactTable({
        data: filteredData, columns, getCoreRowModel: getCoreRowModel(), onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="border-b bg-white">
                <div className="flex h-16 items-center px-4">
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <Button variant='ghost' onClick={async () => {
                            await setOpen(true)
                            document.getElementById('user_sheet_btn')!.click()
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
            <div className="h-screen">
                {/* filter components  */}
                <div className="flex flex-col items-center">
                    <Card className=" mt-4 w-[75%] ">
                        <h3 className="m-2 ml-4 scroll-m-20 text-2xl font-semibold tracking-tight">
                            Filters: <Button variant="outline" className={'right-0 float-right text-center'} onClick={() => { setSearchQuery('') }}  >
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
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value) }}
                                    // size="small"
                                    sx={{ width: 250 }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* table components */}
                <div className=" m-auto  w-[75%] flex-1 items-center ">
                    <div className='mt-4  rounded-lg border'>
                        <Table className="bg-white">
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
                                        {filteredData.length > 0 && (<div className="flex justify-end">
                                            <TableCell className={'sticky  right-0 z-0 '}>
                                                <SendInvite doctor_username={row.original.username} pending={pendingDoctors} doctors={myDoctors} />
                                            </TableCell>
                                        </div>
                                        )}


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
            {open && (<UserSheet />)}

        </>
    )

}
