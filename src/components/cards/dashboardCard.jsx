import Link from "next/link";
import {ArrowRight} from "lucide-react"

const colorClasses = {
    blue: "bg-sky-50 border-sky-200 text-sky-600 from-sky-600 to-sky-800",
    red: "bg-orange-50 border-orange-200 text-orange-600 from-orange-500 to-orange-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-600 from-emerald-500 to-emerald-700",
    green: "bg-green-50 border-green-200 text-green-500 from-green-500 to-green-700",
};


export function DashboardCard1({ icon, title, data, color = "blue" }) {
    const colors = colorClasses[color] || colorClasses.blue;
    return (
        <div className="border border-gray-700 rounded-xl p-4 flex items-center gap-4 bg-[#FFFFFF14]">
            <div className={`${colors.split(" ")[2]} bg-gray-900 p-3 rounded-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold">{data}</p>
            </div>
        </div>
    )
}

export function DashboardCard2({ link = "#", icon, title, description, color = "blue" }) {
    const colors = colorClasses[color] || colorClasses.blue;
    return (
        <Link href={link}>
            <div
                className={`${colors.split(" ")[0]} border-3 ${colors.split(" ")[1]} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col`}
            >
                <div className={`bg-linear-to-r ${colors.split(" ")[3]} ${colors.split(" ")[4]} text-white p-4 rounded-xl w-fit mb-4`}>
                    {icon}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 mb-4 grow">{description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-current border-opacity-20">
                    <div className={`text-xs font-semibold ${colors.split(" ")[2]}`}>Ir al panel</div>
                    <ArrowRight
                        className={`h-4 w-4 ${colors.split(" ")[2]} transition-transform group-hover:translate-x-1`}
                    />
                </div>
            </div>
        </Link>
    )
}