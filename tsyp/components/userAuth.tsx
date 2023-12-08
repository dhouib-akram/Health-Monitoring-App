"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Icons } from "./icons"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
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
                        />

                        <Label htmlFor="password" className="text-left">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            disabled={isLoading}
                        />
                    </div>
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
                                />
                            </div>

                        </div>
                    </div>
                    <div className="mt-2 grid gap-1">
                        <div className="grid gap-1 grid-cols-2">
                            <div>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Cholesterol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="apple">Normal</SelectItem>
                                            <SelectItem value="banana">Above Normal</SelectItem>
                                            <SelectItem value="blueberry">Well Above Normal</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Glucose" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="apple">Normal</SelectItem>
                                            <SelectItem value="banana">Above Normal</SelectItem>
                                            <SelectItem value="blueberry">Well Above Normal</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="date" className="text-left">
                            Age
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="my-3">
                        <div className=" my-2 grid gap-4 grid-cols-2">
                            <div className="flex items-center">
                                <Switch id="alcohol-intake" />
                                <Label htmlFor="alcohol-intake">Alcohol Intake</Label>
                            </div>
                            <div className="flex items-center">
                                <Switch id="smoking" />
                                <Label htmlFor="smoking">Smoking</Label>
                            </div>
                        </div>
                        <div className="grid gap-4 grid-cols-2">
                            <div className="flex items-center">
                                <Switch id="physical-activity" />
                                <Label htmlFor="physical-activity">Physical Activity</Label>
                            </div>
                            <div className="flex items-center">
                                <Switch id="cardiovascular-disease" />
                                <Label htmlFor="cardiovascular-disease">Cardiovascular Disease</Label>
                            </div>
                        </div>
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign Up with Email
                    </Button>
                </div>
            </form>
        </div>
    )
}