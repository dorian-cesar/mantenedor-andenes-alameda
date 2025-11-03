const colorClasses = {
    blue: "border-blue-500 text-blue-500",
    red: "border-red-500 text-red-500",
    green: "border-green-500 text-green-500",
    yellow: "border-yellow-500 text-yellow-500",
};


export function DashboardCard1({ icon, title, data, color = "blue" }) {
    const colors = colorClasses[color] || colorClasses.blue;
    return (
        <div className={`w-full border-t-5 ${colors.split(" ")[0]} flex flex-col p-8 rounded-2xl bg-gray-200 shadow-xl`}
            title={`${title} · ${data}`}
        >
            <div className="w-full flex flex-col justify-between gap-4">
                <div className={`${colors.split(" ")[1]}`}>
                    {icon}
                </div>
                <h3 className="text-xl text-gray-500">{title}</h3>
            </div>

            <div className="w-full flex">
                <p
                    className="text-3xl font-bold"
                >
                    {data}
                </p>
            </div>
        </div>
    )
}