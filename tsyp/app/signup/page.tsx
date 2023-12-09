import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { UserAuthForm } from "@/components/userAuth"
import auth from '../../public/auth.jpg'
import { Card } from "@/components/ui/card"
import { CardContent } from "@mui/material"
export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
}
export default function SignUpPage() {
    return (
        <div className=" my-5 mx-11 flex justify-center items-center h-screen">
            <Card className=" border-none">
                <CardContent>
                    <div className="grid lg:grid-cols-2 gap-4 p-4 sm:grid-cols-1 md:grid-cols-1">
                        {/* First column with the image */}
                        <div>
                            <Image
                                src={auth}
                                alt="Your Image Alt Text"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Second column with the provided code */}
                        <div className="flex flex-col space-y-4 justify-center items-center text-center">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Create an account
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your email below to create your account
                                </p>
                                <UserAuthForm className="my-5" />
                                <p className="mt-3 px-8 text-center text-sm text-muted-foreground">
                                    Already have an account ?{' '}
                                    <Link
                                        href="/signin"
                                        className="underline underline-offset-4 hover:text-primary"
                                    >
                                        Sign In
                                    </Link>{' '}
                                    .
                                </p>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

        </div>
    );
}