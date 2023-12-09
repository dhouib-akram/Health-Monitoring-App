"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Icons } from "./icons"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Value } from "@radix-ui/react-select"
import { Collapse } from 'react-collapse';
import { set } from "date-fns"
import { redirect } from "next/dist/server/api-utils"

import { useRouter } from 'next/navigation';
import { stat } from "fs"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [status, setStatus] = React.useState('')
    const [isAdditionalFieldsVisible, setAdditionalFieldsVisible] = React.useState(false);
    const [errorPass, setErrorPass] = React.useState(false)
    const [errorStatus, setErrorStatus] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [formData, setFormData] = React.useState({
        email: '',
        username: '',
        password: '',
        role: '',
        emergencyContactEmail: '',
        health_data: {
            weight: '', height: '', cholesterol: '', gluc: '', smoke: 0, alco: 0, age: '', gender: '', active: 0
        },
        // Add more properties as needed
    });
    const [password, setPassword] = React.useState('')
    const [ConfirmPassword, setConfirmPassword] = React.useState('')

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        await SignUp()
        // setTimeout(() => {
        // }, 3000)
    }
    async function SignUp() {
        if (password === ConfirmPassword) {
            if (status == 'doctor' || status === 'user') {
                setFormData({ ...formData, password: password })
                console.log(formData)
                try {
                    const response = await fetch(`http://127.0.0.1:8000/register`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST', body: JSON.stringify({
                            ...formData
                        })

                    })
                    if (response.status === 200) {
                        const data = await response.json()
                        localStorage.setItem('access_token', data.access_token);
                        localStorage.setItem('role', status);
                        setIsLoading(false)
                        router.push('/dashboard');
                    }
                    else {
                        setError(true)
                        setErrorStatus(false)
                        setErrorPass(false)
                        setIsLoading(false)
                    }
                }
                catch (e) {
                    console.log(e)
                }
            }
            else {
                setErrorStatus(true)
                setIsLoading(false)
            }
        }
        else {
            setErrorPass(true)
            setIsLoading(false)
        }
    }
    return (
        <div className={cn("grid gap-6", className)} {...props}>
            {errorPass && (<>
                <div
                    style={{
                        backgroundColor: '#FFEBEE', // Red-200
                        color: '#F44336', // Red-600
                        border: '1px solid #F44336', // Red-600
                        padding: '10px',
                        borderRadius: '4px',
                    }}
                >
                    Not Matched Passwords
                </div>
            </>)}
            {error && (<>
                <div
                    style={{
                        backgroundColor: '#FFEBEE', // Red-200
                        color: '#F44336', // Red-600
                        border: '1px solid #F44336', // Red-600
                        padding: '10px',
                        borderRadius: '4px',
                    }}
                >
                    Username already exists. Please choose a different username.
                </div>
            </>)}
            {errorStatus && (<>
                <div
                    style={{
                        backgroundColor: '#FFEBEE', // Red-200
                        color: '#F44336', // Red-600
                        border: '1px solid #F44336', // Red-600
                        padding: '10px',
                        borderRadius: '4px',
                    }}
                >
                    Status is required.
                </div>
            </>)}
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <div className="grid gap-1 grid-cols-2 text-left">
                            <div className="">
                                <Label htmlFor="email" className="text-left">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    required
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="username" className="text-left">
                                    username
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    disabled={isLoading}
                                    value={formData.username}
                                    required
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>

                        </div>
                        <div className="grid gap-1 grid-cols-2 text-left">
                            <div className="">
                                <Label htmlFor="password" className="text-left">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    disabled={isLoading}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="Confirmpassword" className="text-left">
                                    C.Password
                                </Label>
                                <Input
                                    id="Confirmpassword"
                                    type="password"
                                    disabled={isLoading}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-1 grid-cols-1 text-left">
                            <Label htmlFor="Confirmpassword" className="text-left">
                                Status
                            </Label>
                            <Select value={status} onValueChange={(value) => {
                                setStatus(value);
                                setFormData({ ...formData, role: value })
                                setAdditionalFieldsVisible(value !== 'doctor');
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup >
                                        <SelectItem value="doctor">Doctor</SelectItem>
                                        <SelectItem value="user">Patient</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Collapse isOpened={isAdditionalFieldsVisible}>
                        <>
                            <div className="grid gap-1">
                                <div className="grid gap-1 grid-cols-2 text-left">
                                    <div className="">
                                        <Label htmlFor="height" className=" justify-self-start">
                                            Height
                                        </Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            disabled={isLoading}
                                            value={formData.health_data.height}
                                            onChange={(e) => setFormData({ ...formData, health_data: { ...formData.health_data, height: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="Weight" className="text-left">
                                            Weight
                                        </Label>
                                        <Input
                                            id="Weight"
                                            type="number"
                                            disabled={isLoading}
                                            value={formData.health_data.weight}
                                            onChange={(e) => setFormData({ ...formData, health_data: { ...formData.health_data, weight: e.target.value } })}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="mt-2 grid gap-1">
                                <div className="grid gap-1 grid-cols-2 text-left">
                                    <div>
                                        <Select onValueChange={(value) => { setFormData({ ...formData, health_data: { ...formData.health_data, cholesterol: value } }) }}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Cholesterol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="1">Normal</SelectItem>
                                                    <SelectItem value="2">Above Normal</SelectItem>
                                                    <SelectItem value="3">Well Above Normal</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select value={formData.health_data.gluc} onValueChange={(value) => { setFormData({ ...formData, health_data: { ...formData.health_data, gluc: value } }) }}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Glucose" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="1">Normal</SelectItem>
                                                    <SelectItem value="2">Above Normal</SelectItem>
                                                    <SelectItem value="3">Well Above Normal</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>
                            </div>
                            <div className="grid gap-1 grid-cols-2 text-left">
                                <div className="">
                                    <Label htmlFor="date" className="text-left">
                                        Age
                                    </Label>
                                    <Input
                                        id="date"
                                        type="number"
                                        disabled={isLoading}
                                        value={formData.health_data.age}
                                        onChange={(e) => setFormData({ ...formData, health_data: { ...formData.health_data, age: e.target.value } })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="date" className="text-left">
                                        Gender
                                    </Label>
                                    <Select value={formData.health_data.gender} onValueChange={(value) => { setFormData({ ...formData, health_data: { ...formData.health_data, gender: value } }) }}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="2">Female</SelectItem>
                                                <SelectItem value="1">Male</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="mt-1 grid gap-1 grid-cols-1">
                                <Label htmlFor="emergency" className="text-left">
                                    Emergency Email
                                </Label>
                                <Input
                                    id="emergency"
                                    type="email"
                                    disabled={isLoading}
                                    value={formData.emergencyContactEmail}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactEmail: e.target.value })}
                                />
                            </div>
                            <div className="my-3">
                                <div className=" my-2 grid gap-4  sm:grid-cols-1 lg:grid-cols-2 ">
                                    <div className="flex items-center">
                                        <Switch id="alcohol-intake" checked={formData.health_data.alco === 1} onCheckedChange={(value) => {
                                            const number = value ? 1 : 0;
                                            setFormData({ ...formData, health_data: { ...formData.health_data, alco: number } })
                                        }} />
                                        <Label htmlFor="alcohol-intake">Alcohol Intake</Label>
                                    </div>
                                    <div className="flex items-center">
                                        <Switch id="smoking" checked={formData.health_data.smoke === 1} onCheckedChange={(value) => {
                                            const number = value ? 1 : 0;
                                            setFormData({ ...formData, health_data: { ...formData.health_data, smoke: number } })
                                        }} />
                                        <Label htmlFor="smoking">Smoking</Label>
                                    </div>
                                </div>
                                <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                                    <div className="flex items-center">
                                        <Switch id="physical-activity" checked={formData.health_data.active === 1} onCheckedChange={(value) => {
                                            const number = value ? 1 : 0;
                                            setFormData({ ...formData, health_data: { ...formData.health_data, active: number } })
                                        }} />
                                        <Label htmlFor="physical-activity">Physical Activity</Label>
                                    </div>
                                    <div className="flex items-center">
                                        <Switch id="cardiovascular-disease" />
                                        <Label htmlFor="cardiovascular-disease">Cardiovascular Disease</Label>
                                    </div>
                                </div>
                            </div>
                        </>
                    </Collapse>

                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign Up with Username
                    </Button>
                </div>
            </form>
        </div>
    )
}