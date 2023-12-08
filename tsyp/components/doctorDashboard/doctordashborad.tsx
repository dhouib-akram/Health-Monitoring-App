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
import { MyPatients } from "./patients";
export default function DoctorDashboard() {
    const areadata = [
        {
            "day": "monday",
            "last_week": 4000,
            "recent_week": 2400
        },
        {
            "day": "tuesday",
            "last_week": 3000,
            "recent_week": 2700
        },
        {
            "day": "wednesday",
            "last_week": 1000,
            "recent_week": 1400
        },
        {
            "day": "thursday",
            "last_week": 5000,
            "recent_week": 6000
        },
        {
            "day": "friday",
            "last_week": 4000,
            "recent_week": 2400
        },
        {
            "day": "saturday",
            "last_week": 3000,
            "recent_week": 2400
        },
        {
            "day": "sunday",
            "last_week": 4000,
            "recent_week": 5400
        },
    ];
    return (
        <>
            <div className="flex-col md:flex bg-gray-100">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-semibold tracking-tight">Welcome Back</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 sm:grid-cols-1">
                                <Card className="" >
                                    <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Patients Health Conditions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="mt-8 h-56">
                                        <ResponsiveContainer width="100%" height="100%" >
                                            <AreaChart width={730} height={250} data={areadata}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="day" />
                                                <YAxis />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="last_week" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                                <Area type="monotone" dataKey="recent_week" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card className="">
                                    <CardHeader>
                                        <CardTitle>My Patients</CardTitle>
                                    </CardHeader>
                                    <CardContent className="">
                                        <MyPatients />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
