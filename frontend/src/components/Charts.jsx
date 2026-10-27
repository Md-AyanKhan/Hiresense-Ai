import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
} from "chart.js";
import { Bar, Doughnut, Radar } from "react-chartjs-2";
import { chartColors } from "../data/navigation.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "rgba(255,255,255,0.68)", boxWidth: 12, usePointStyle: true }
    }
  },
  scales: {
    x: { ticks: { color: "rgba(255,255,255,0.55)" }, grid: { color: "rgba(255,255,255,0.06)" } },
    y: { ticks: { color: "rgba(255,255,255,0.55)" }, grid: { color: "rgba(255,255,255,0.06)" } }
  }
};

export function DoughnutChart({ dataMap }) {
  const labels = Object.keys(dataMap || {});
  const values = Object.values(dataMap || {});
  return (
    <Doughnut
      data={{
        labels,
        datasets: [{ data: values, backgroundColor: chartColors, borderColor: "#0A151C", borderWidth: 3 }]
      }}
      options={{ ...commonOptions, cutout: "62%", scales: undefined }}
    />
  );
}

export function BarChart({ dataMap }) {
  const labels = Object.keys(dataMap || {});
  const values = Object.values(dataMap || {});
  return (
    <Bar
      data={{
        labels,
        datasets: [{ label: "Score", data: values, backgroundColor: chartColors, borderRadius: 8 }]
      }}
      options={commonOptions}
    />
  );
}

export function RadarChart({ dataMap }) {
  const labels = Object.keys(dataMap || {}).map((label) => label.replaceAll("_", " "));
  const values = Object.values(dataMap || {});
  return (
    <Radar
      data={{
        labels,
        datasets: [
          {
            label: "ATS Breakdown",
            data: values,
            backgroundColor: "rgba(77,225,193,0.16)",
            borderColor: "#4DE1C1",
            pointBackgroundColor: "#FF7A76"
          }
        ]
      }}
      options={{
        ...commonOptions,
        scales: {
          r: {
            angleLines: { color: "rgba(255,255,255,0.08)" },
            grid: { color: "rgba(255,255,255,0.08)" },
            pointLabels: { color: "rgba(255,255,255,0.62)", font: { size: 11 } },
            ticks: { display: false }
          }
        }
      }}
    />
  );
}
