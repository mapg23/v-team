import { useEffect, useRef } from "react";

export default function PieChart({ total, used }) {
  const canvasRef = useRef(null); // istället för använda document.getElementByid
  const chartRef = useRef(null); // för att spara instans

  // useEffect körs när komponent renderas
  useEffect(() => {
    if (!window.Chart) return; // om CDN inte hunnit ladda

    const ctx = canvasRef.current;
    const free = total - used;

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Lediga cyklar", "Hyrda cyklar"],
        datasets: [
          {
            data: [free, used],
            backgroundColor: ["#ff5555", "#55cc55"], // röd / grön
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
  }, [total, used]); // om dessa ändras körs return

  return (
    <div style={{ width: "300px", height: "300px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
