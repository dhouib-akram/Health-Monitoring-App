import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/dashboard";
import Doctors from "@/components/doctors/doctors";

export default async function DoctorPage() {
    return (
        <section className="">
            <Doctors />
        </section>
    )
}
