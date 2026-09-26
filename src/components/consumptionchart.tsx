"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type ConsumptionData = {
    month: string;
    consumption: number;
};

type ConsumptionChartProps = {
    data: ConsumptionData[];
    unit: string;
};

export default function ConsumptionChart({
    data,
    unit,
}: ConsumptionChartProps) {
    return (
        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => [`${value} ${unit}`, "Consumo"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="consumption"
                        stroke="#127e83"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}