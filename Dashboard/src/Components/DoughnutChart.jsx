import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


// export function DoughnoutChart({ data }) {
//   return <Doughnut data={data} />;
// }

export function DoughnutChart({ data }) {

  console.log("DOUGHNUT DATA:", data);

  if (!data || !data.datasets) {
    return <p>Doughnut data is missing</p>;
  }

  return <DoughnutChart data={data} />;
}