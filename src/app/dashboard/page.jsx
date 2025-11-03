import { Users, BusFront, CircleParking, Clock } from 'lucide-react'

import { DashboardCard1 } from '@/components/cards/dashboardCard'

export default function DashboardPage() {
    return (
        <div className='flex gap-10'>
            <DashboardCard1 icon={<Users className='h-10 w-10' />} title={"Usuarios"} data={"1234"} color={"red"}></DashboardCard1>
            <DashboardCard1 icon={<BusFront className='h-10 w-10' />} title={"Buses"} data={"123"} color={"border-blue-500"}></DashboardCard1>
            <DashboardCard1 icon={<CircleParking className='h-10 w-10' />} title={"Parking"} data={"1331"} color={"border-blue-500"}></DashboardCard1>
            <DashboardCard1 icon={<Clock className='h-10 w-10' />} title={"Permanencias"} data={"13313131"} color={"border-blue-500"}></DashboardCard1>
        </div>
    )
}