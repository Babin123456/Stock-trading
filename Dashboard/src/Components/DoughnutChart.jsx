import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart({ data }) {

  if (!data || !data.datasets) {
    return <p>Doughnut data is missing</p>;
  }

  return <Doughnut data={data} />;
}
