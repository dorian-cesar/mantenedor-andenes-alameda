import { Users, BusFront, CircleParking, Clock } from 'lucide-react'

import { DashboardCard1 } from '@/components/cards/dashboardCard'

export default function DashboardPage() {
    return (
        <div className='flex gap-10'>
            <DashboardCard1 icon={<Users className='h-8 w-8' />} title={"Usuarios"} data={"1234"} color={"red"}></DashboardCard1>
            <DashboardCard1 icon={<BusFront className='h-8 w-8' />} title={"Buses"} data={"123"} color={"border-blue-500"}></DashboardCard1>
            <DashboardCard1 icon={<CircleParking className='h-8 w-8' />} title={"Parking"} data={"1331"} color={"border-blue-500"}></DashboardCard1>
            <DashboardCard1 icon={<Clock className='h-8 w-8' />} title={"Permanencias"} data={"13313131"} color={"border-blue-500"}></DashboardCard1>

            {/* <div className='flex border-t-3 border-amber-600 w-10 h-10 rounded-full animate-spin'></div>
            <div className='flex border-r-3 border-green-600 w-10 h-10 rounded-full animate-spin'></div>
            <div className='flex border-b-3 border-blue-600 w-10 h-10 rounded-full animate-spin'></div>
            <div className='flex border-l-3 border-red-600 w-10 h-10 rounded-full animate-spin'></div> */}
        </div>
    )
}