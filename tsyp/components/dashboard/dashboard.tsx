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
import { CalendarDays, HeartPulse, GaugeCircle, Wind, Scale } from 'lucide-react';
import { Thermometer } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, XAxis, YAxis, Area, LineChart, CartesianGrid, Line } from "recharts";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MyDoctors } from "./my_doctors";
import { useEffect, useState } from "react";
import { UserSheet } from "../user_Sheet";
import { Icons } from "../icons";

interface HealthData {
    age: number;
    height: number;
    weight: number;
    gender: number;
    cholesterol: number;
    gluc: number;
    smoke: number;
    alco: number;
    active: number;
}

interface Measure {
    ap_hi: number;
    ap_lo: number;
    saturation_data: number;
    heart_rate_data: number;
    temp: number;
}

interface User {
    username: string;
    email: string;
    emergencyContactEmail: string;
    health_data: HealthData;
    pending_doctors: any[]; // Change this to the actual type if it's not an array of any
    doctors: any[]; // Change this to the actual type if it's not an array of any
    measure: Measure[];
    prediction: number;
    health_status: Record<string, any>; // Change this to the actual type if it's not an empty object
}
export default function Dashboard() {
    const token = localStorage.getItem('access_token');
    const [user, setUser] = useState<User>();
    const [mesure, setMesure] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
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
            console.log(responseBody)
            setUser(responseBody)
            setMesure(false)
        }
        fetchdata();
    }, [token, mesure]);
    async function GetMeasure() {
        setIsLoading(true)
        const response = await fetch('http://127.0.0.1:8000/getM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Adjust the content type if needed,
                'Authorization': `Bearer ${token}`
            }
        });
        const response2 = await fetch('http://127.0.0.1:8000/user/health-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Adjust the content type if needed,
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 200 && response2.status === 200) {
            const responseBody = await response.json();
            console.log(responseBody)
            setMesure(true)
            setIsLoading(false)
        }
        else {

        }
    }
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
            <div className="flex-col md:flex bg-gray-100">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-semibold tracking-tight">Welcome Back</h2>
                        <div className="space-x-2">
                            <Button className="px-8">Predict</Button>
                            <Button disabled={isLoading} className="px-8" onClick={() => { GetMeasure() }}>{isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}Get Mesure</Button>
                        </div>
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
                                                <p className=" font-semibold text-lg">
                                                    {user?.health_status?.heart_rate_status === 'Moderate' && (<span className="text-green-800">{user?.measure[user?.measure?.length - 1]?.heart_rate_data} BPM</span>)}
                                                    {user?.health_status?.heart_rate_status !== 'Moderate' && (<span className="text-red-800">{user?.measure[user?.measure?.length - 1]?.heart_rate_data} BPM</span>)}
                                                </p>
                                            </div>
                                        </div>

                                    </CardContent>
                                    <CardFooter className=" flex items-center justify-center">
                                        <div className=" mt-10 flex items-center justify-center">
                                            {user?.health_status?.heart_rate_status === 'Moderate' && (<h2 className=" font-bold text-green-800">{user?.health_status?.bmi_status}</h2>)}
                                        </div>
                                    </CardFooter>
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
                                            <div className="flex items-center mt-2 justify-center">
                                                <h2 className="font-semibold">{user?.username}</h2>
                                            </div>
                                            <div className="flex items-center mt-2 justify-center">
                                                <h2 className="font-semibold" ><span className=" text-gray-500">Emergency Contact : </span>{user?.emergencyContactEmail || 'ieee@supcom.tn'} </h2>
                                            </div>
                                        </div>
                                        <div className=" mt-3 grid grid-cols-2 gap-4 items-center justify-center">
                                            {/* Column 1 */}
                                            <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                                                <h3 className="mb-2 text-gray-500">Age</h3>
                                                <p className=" font-semibold">{user?.health_data?.age}</p>
                                            </div>

                                            {/* Column 2 */}
                                            <div className="flex flex-col items-center pl-4">
                                                <h3 className="mb-2  text-gray-500">Gender</h3>
                                                {user?.health_data.gender === 2 && (<p className=" font-semibold">Men</p>)}
                                                {user?.health_data.gender === 1 && (<p className=" font-semibold">Women</p>)}
                                            </div>
                                            {/* Column 1 */}
                                            <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                                                <h3 className="mb-2 text-gray-500">Weight</h3>
                                                <p className=" font-semibold">{user?.health_data.weight}</p>
                                            </div>

                                            {/* Column 2 */}
                                            <div className="flex flex-col items-center pl-4">
                                                <h3 className="mb-2  text-gray-500">Height</h3>
                                                <p className=" font-semibold">{user?.health_data.height}</p>
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
                                                <p className=" font-semibold text-lg"><span className="text-green-800">{user?.measure[user?.measure?.length - 1]?.temp}°C</span> </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-center">
                                        <div className=" mt-10 flex items-center justify-center">
                                            <h2 className=" font-bold text-green-800">Good</h2>
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            BMI
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="m-4 grid items-center">
                                        <div className=" mt-3 grid grid-cols-2 gap-4 items-center justify-center">
                                            {/* Column 1 */}
                                            <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                                                <Scale className="h-20 w-20  text-cyan-700" />
                                            </div>
                                            {/* Column 2 */}
                                            <div className="flex flex-col items-center pl-4">
                                                {user?.health_status?.bmi_status === 'Normal' && (<h2 className=" font-bold text-green-800">{parseFloat(user?.health_status?.bmi).toFixed(2)}</h2>)}
                                                {user?.health_status?.bmi_status !== 'Normal' && (<h2 className=" font-bold text-red-800">{parseFloat(user?.health_status?.bmi).toFixed(2)}</h2>)}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-center">
                                        <div className=" mt-10 flex items-center justify-center">
                                            {user?.health_status?.bmi_status === 'Normal' && (<h2 className=" font-bold text-green-800">{user?.health_status?.bmi_status}</h2>)}
                                            {user?.health_status?.bmi_status !== 'Normal' && (<h2 className=" font-bold text-red-800">{user?.health_status?.bmi_status}</h2>)}
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            systolic and diastolic pressure
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="m-4 grid items-center">
                                        <div className=" mt-3 grid grid-cols-2 gap-4 items-center justify-center">
                                            {/* Column 1 */}
                                            <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                                                <GaugeCircle className="h-20 w-20  text-cyan-700" />
                                            </div>
                                            {/* Column 2 */}
                                            <div className="flex flex-col items-center pl-4">
                                                {user?.health_status?.blood_pressure_status === 'Normal' && (<h2 className=" font-bold text-green-800"><span className=" text-gray-500">sys:</span>{user?.measure[user?.measure?.length - 1]?.ap_hi}</h2>)}
                                                {user?.health_status?.blood_pressure_status !== 'Normal' && (<h2 className=" font-bold text-red-800"><span className=" text-gray-500">sys:</span>{user?.measure[user?.measure?.length - 1]?.ap_hi}</h2>)}
                                                {user?.health_status?.blood_pressure_status !== 'Normal' && (<h2 className=" font-bold text-red-800"><span className=" text-gray-500">dia:</span>{user?.measure[user?.measure?.length - 1]?.ap_lo}</h2>)}
                                                {user?.health_status?.blood_pressure_status === 'Normal' && (<h2 className=" font-bold text-green-800"><span className=" text-gray-500">dia:</span>{user?.measure[user?.measure?.length - 1]?.ap_lo}</h2>)}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-center">
                                        <div className=" mt-10 flex items-center justify-center">
                                            {user?.health_status?.blood_pressure_status === 'Normal' && (<h2 className=" font-bold text-green-800">{user?.health_status?.blood_pressure_status}</h2>)}
                                            {user?.health_status?.blood_pressure_status !== 'Normal' && (<h2 className=" font-bold text-red-800">{user?.health_status?.blood_pressure_status}</h2>)}
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Oxygyne level
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="m-4 grid items-center">
                                        <div className=" mt-3 grid grid-cols-2 gap-4 items-center justify-center">
                                            {/* Column 1 */}
                                            <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                                                <Wind className="h-20 w-20  text-cyan-700" />
                                            </div>
                                            {/* Column 2 */}
                                            <div className="flex flex-col items-center pl-4">
                                                {user?.health_status?.saturation_status === 'Normal' && (<h2 className=" font-bold text-green-800">{user?.measure[user?.measure?.length - 1]?.saturation_data}%</h2>)}
                                                {user?.health_status?.saturation_status !== 'Normal' && (<h2 className=" font-bold text-red-800">{user?.measure[user?.measure?.length - 1]?.saturation_data}%</h2>)}

                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-center">
                                        <div className=" mt-10 flex items-center justify-center">
                                            {user?.health_status?.saturation_status === 'Normal' && (<h2 className=" font-bold text-green-800">{user?.health_status?.saturation_status}</h2>)}
                                            {user?.health_status?.saturation_status !== 'Normal' && (<h2 className=" font-bold text-red-800">{user?.health_status?.saturation_status}</h2>)}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {open && (<UserSheet />)}

        </>
    )
}
