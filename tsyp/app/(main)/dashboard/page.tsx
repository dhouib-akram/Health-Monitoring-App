import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/dashboard";
import DoctorDashboard from "@/components/doctorDashboard/doctordashborad";
import { useEffect } from "react";
import FullDashboard from "@/components/fullDashboard";
export default async function DashboardPage() {

    return (
        <section className="">
            <FullDashboard />
            {/* <DoctorDashboard /> */}
        </section>
    )
}
