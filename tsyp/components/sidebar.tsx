'use client'
import { useState } from "react";
import Image from 'next/image';
import gwgLogo from '../public/images/gwg_logo_3.png';
import control from '../public/images/control.png';
import { Link } from "lucide-react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation"
import { cn } from "@/lib/utils"




export const Sidebar = ({ items }: any) => {
    const [open, setOpen] = useState(true);
    const [activeIndex, setActiveIndex] = useState(-1);

    const router = useRouter()
    return (
        <div className={`bg-cyan-900 ${open ? "w-72" : "w-20"} relative min-h-screen p-2 pt-8 duration-300`}>
            <Image
                src={control}
                alt="GWG Logo"
                onClick={() => setOpen(!open)}
                className={`border-dark-purple absolute -right-3 top-3 w-7 cursor-pointer
           rounded-full border-2  ${!open && "rotate-180"}`}
            />
            <div className="flex items-center gap-x-4">
                <Image
                    src={gwgLogo}
                    alt="GWG Logo"
                    className={`cursor-pointer rounded-full duration-500 ${open && "rotate-[360deg]"}`}
                    width={42} // Adjust the width as needed
                    height={42} // Adjust the height as needed
                />
                <h1 className={`text-xl font-medium text-white duration-200 ${!open && "scale-0"}`}>GWG</h1>
            </div>
            <ul className="ml-0 pt-6">
                {/* {items?.map((item, index) => (
                    <li
                        key={index}
                        className={`hover:bg-light-gray text-gray mt-1 flex cursor-pointer gap-x-2 rounded-md   text-sm `}
                    >
                        <Button variant="ghost" className={` w-full px-2 ${open && " justify-start text-start"}  text-white duration-200 ${index == activeIndex ? "bg-white text-cyan-900" : ""} `} onClick={() => {
                            setActiveIndex(index);
                            router.push(item.href);
                        }}>
                            <IconSideBar item={item} />
                            <span className={` ml-2  overflow-hidden  whitespace-nowrap  ${!open && "hidden"}`}>{item.title}</span>
                        </Button>
                    </li>
                ))} */}
            </ul>
        </div>
    );
};
