import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function PieChart({ bikeStatusMap }) {
    const canvasRef = useRef(null); // istället för använda document.getElementByid
    const chartRef = useRef(null); // för att spara instans

    // useEffect körs när komponent renderas
    useEffect(() => {
        const ctx = canvasRef.current;

        chartRef.current = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Hyrda cyklar", "Lediga cyklar"],
                datasets: [
                    {
                        data: [bikeStatusMap.used, bikeStatusMap.available],
                        backgroundColor: ["var(--col-blue)", "#55cc55"], // blue / grön
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                },
            },
        });

        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [bikeStatusMap]); // om dessa ändras körs rerender

    return (
        <div style={{ width: "250px", height: "250px" }}>
            <canvas ref={canvasRef} />
        </div>
    );
}
