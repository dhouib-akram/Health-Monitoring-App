import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
function handleEventClick(info: any) {
    console.log(info.event.end)
}
import styled from "@emotion/styled";

export const StyleWrapper = styled.div`
  .fc-button.fc-prev-button, .fc-button.fc-next-button, .fc-button.fc-button-primary{
    background: #006064;
    background-image: none;
}
  .fc-toolbar-title {
    font-size: 20px; /* Adjust the font size of the current month text */
    color: #333333; /* Adjust the color of the current month text */
  }
`
export function UserSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="hidden" id='user_sheet_btn'>Open</Button>
            </SheetTrigger>
            <SheetContent className="flex h-screen w-[800px] flex-col sm:max-w-[800px]">
                <div className="mt-5">
                    <h1 className=" font-semibold text-center">My Appointments</h1>
                    <StyleWrapper>
                        <FullCalendar
                            initialView="dayGridMonth"
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                            selectable={true}
                            select={(item: any) => { console.log(item) }}
                            eventClick={handleEventClick}
                            events={[
                                { title: 'app 1', start: '2023-12-05', end: '2023-12-05' },
                                { title: 'app 2', start: '2023-12-06', end: '2023-12-06' }
                            ]}
                            locale="ang"
                        />
                    </StyleWrapper>
                </div>
            </SheetContent>
        </Sheet>
    )
}
