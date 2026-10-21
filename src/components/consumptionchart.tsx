"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import styles from "./consumptionchart.module.css";

type ConsumptionData = {
    month: string;
    consumption?: number;
    currentMonth?: number;
    previousMonth?: number;
};

type ConsumptionChartProps = {
    data: ConsumptionData[];
    unit: string;
    color: string;
    comparison?: boolean;
};

export default function ConsumptionChart({
    data,
    unit,
    color,
    comparison = false,
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
                            `${value ?? 0} ${unit}`,
                            "Consumo",
                        ]}
                    />
                    {comparison && <Legend />}
                    {comparison ? (
                        <>
                            <Line
                                type="monotone"
                                dataKey="currentMonth"
                                name="Mês atual (acumulado)"
                                stroke={color}
                                strokeWidth={3}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="previousMonth"
                                name="Mês anterior (completo)"
                                stroke="#d28b32"
                                strokeWidth={3}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </>
                    ) : (
                        <Line
                            type="monotone"
                            dataKey="consumption"
                            name="Consumo"
                            stroke={color}
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}