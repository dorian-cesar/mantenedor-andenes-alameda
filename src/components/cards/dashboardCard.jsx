export function DashboardCard1({ icon, title, data, color = "blue" }) {
    return (
        <div className={`w-full border-t-5 border-${color}-500 flex flex-col justify-center items-center p-5 rounded-2xl bg-gray-200 shadow-xl`}
        title={`${title} · ${data}`}
        >
            <div className="flex items-center justify-center gap-4 mb-4">
                <div className={`text-${color}-500`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>

            <div className="w-full flex items-center justify-center">
                <p>{data}</p>
            </div>
        </div>
    )
}