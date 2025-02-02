
'use client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Pie,
    ResponsiveContainer,
    Cell,
    PieChart,
} from 'recharts';
export const IssuePie = ({ data }) => {
    const COLORS = ['#00ff00', '#00ccff', '#ffcc00', '#ff4c4c'];

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Issue Severity Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
                {data.map((entry, index) => (
                    <div key={`label-${index}`} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span>{entry.name}: {entry.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
