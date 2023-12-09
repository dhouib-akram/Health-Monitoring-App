"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Icons } from "./icons"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { useRouter } from "next/navigation"

//sign in page
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserSignInForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState(false)
    const router = useRouter()
    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        await SignIn()
    }

    async function SignIn() {
        const response = await fetch(`http://127.0.0.1:8000/login`, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            const data = await response.json()
            localStorage.setItem('access_token', data.access_token);
            console.log('login Successfully')
            setIsLoading(false)
            router.push('/dashboard')
        }
        else {
            setIsLoading(false)
            setError(true)
            console.log('error')
        }
    }


    return (
        <div className={cn("grid gap-6", className)} {...props}>
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
                    Incorrect Username or Password
                </div>
            </>)}
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label htmlFor="email" className="text-left">
                            Username
                        </Label>
                        <Input
                            id="email"
                            type="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <Label htmlFor="password" className="text-left">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In with Username
                    </Button>
                </div>
            </form>
        </div>
    )
}