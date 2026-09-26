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

import styles from "./consumptionchart.module.css";

type ConsumptionData = {
    month: string;
    consumption: number;
};

type ConsumptionChartProps = {
    data: ConsumptionData[];
    unit: string;
    color: string;
};

export default function ConsumptionChart({
    data,
    unit,
    color,
}: ConsumptionChartProps) {
    return (
        <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 10,
                        left: 10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value} ${unit}`}
                    />

                    <Tooltip
                        formatter={(value) => [
                            `${value} ${unit}`,
                            "Consumo",
                        ]}
                    />

                    <Line
                        type="monotone"
                        dataKey="consumption"
                        stroke={color}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}