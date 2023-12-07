'use client'
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserNav } from "./user_nav";
import TeamSwitcher from "./team_switcher";
import { Input } from "../ui/input";
import { MainNav } from "./main_nav";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HeartPulse } from 'lucide-react';
import { Thermometer } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, XAxis, YAxis, Area, LineChart, CartesianGrid, Line } from "recharts";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MyDoctors } from "./my_doctors";
export default function Dashboard() {
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
                        <Button className="px-8">Predict</Button>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Heart Rate
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="m-4 grid items-center">
                                        <div className=" mt-3 grid grid-cols-2 gap-4 items-center justify-center">
                                            {/* Column 1 */}
                                            <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                                                <HeartPulse className="h-20 w-20  text-cyan-700" />
                                            </div>
                                            {/* Column 2 */}
                                            <div className="flex flex-col items-center pl-4">
                                                <p className=" font-semibold text-lg"><span className="text-red-700">110 BPM</span> </p>
                                            </div>
                                        </div>
                                        <div className=" mt-10 flex items-center justify-center">
                                            <h2 className=" font-bold text-red-800">You are getting a heart attack you should see a doctor now !</h2>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="m-4">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex items-center">
                                                <Avatar className="h-20 w-20">
                                                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                                    <AvatarFallback>SC</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <h2 className="font-semibold">Saif Ben Hmida</h2>
                                            </div>
                                        </div>
                                        <div className=" mt-3 grid grid-cols-2 gap-4 items-center justify-center">
                                            {/* Column 1 */}
                                            <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                                                <h3 className="mb-2 text-gray-500">Age</h3>
                                                <p className=" font-semibold">24</p>
                                            </div>

                                            {/* Column 2 */}
                                            <div className="flex flex-col items-center pl-4">
                                                <h3 className="mb-2  text-gray-500">Blood</h3>
                                                <p className=" font-semibold">A+</p>
                                            </div>
                                            {/* Column 1 */}
                                            <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                                                <h3 className="mb-2 text-gray-500">Weight</h3>
                                                <p className=" font-semibold">75</p>
                                            </div>

                                            {/* Column 2 */}
                                            <div className="flex flex-col items-center pl-4">
                                                <h3 className="mb-2  text-gray-500">Height</h3>
                                                <p className=" font-semibold">1.78m</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Temperature
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="m-4 grid items-center">
                                        <div className=" mt-3 grid grid-cols-2 gap-4 items-center justify-center">
                                            {/* Column 1 */}
                                            <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                                                <Thermometer className="h-20 w-20  text-cyan-700" />
                                            </div>
                                            {/* Column 2 */}
                                            <div className="flex flex-col items-center pl-4">
                                                <p className=" font-semibold text-lg"><span className="text-green-700">36°C</span> </p>
                                            </div>
                                        </div>
                                        <div className=" mt-10 flex items-center justify-center">
                                            <h2 className=" font-bold text-green-800">Your temperature is normal and healthy!</h2>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="lg:col-span-2" >
                                    <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Your Health Conditions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="mt-8 h-56">
                                        <ResponsiveContainer width="100%" height="100%" >
                                            <AreaChart data={areadata}
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
                                <Card className="w-full">
                                    <CardContent className="mt-11">
                                        <div className="flex  items-center justify-between m-4 space-x-4">
                                            <div className="">
                                                <h1 className="text-center font-semibold sm:text-xs lg:text-lg">General</h1>
                                                <CircularProgressbar className="mt-11" value={66} text={`${66}%`} styles={buildStyles({
                                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                    strokeLinecap: 'butt',
                                                    // Text size
                                                    textSize: '16px',
                                                    // How long animation takes to go from one percentage to another, in seconds
                                                    pathTransitionDuration: 0.5,
                                                    // Can specify path transition in more detail, or remove it entirely
                                                    // pathTransition: 'none',
                                                    // Colors
                                                    pathColor: `#DB0F27`,
                                                    textColor: '#C0C0C0',
                                                    trailColor: '#d6d6d6',
                                                    backgroundColor: '#3e98c7',
                                                })} />
                                            </div>
                                            <div >
                                                <h1 className="text-center font-semibold sm:text-xs lg:text-lg ">Oxygyne level</h1>
                                                <CircularProgressbar className="mt-11" value={95} text={`${95}%`} styles={buildStyles({
                                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                    strokeLinecap: 'butt',

                                                    // Text size
                                                    textSize: '16px',

                                                    // How long animation takes to go from one percentage to another, in seconds
                                                    pathTransitionDuration: 0.5,

                                                    // Can specify path transition in more detail, or remove it entirely
                                                    // pathTransition: 'none',

                                                    // Colors
                                                    pathColor: `#0583D2`,
                                                    textColor: '#C0C0C0',
                                                    trailColor: '#d6d6d6',
                                                    backgroundColor: '#3e98c7',
                                                })} />
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                                {/* <Card className="">
                                    <CardHeader>
                                        <CardTitle>My Doctors</CardTitle>
                                    </CardHeader>
                                    <CardContent className="">
                                        <MyDoctors />
                                    </CardContent>
                                </Card> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
