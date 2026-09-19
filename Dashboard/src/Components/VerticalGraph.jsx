import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Holdings',
        },
    },
};


export function VerticalGraph({data}) {
    return <Bar options={options} data={data} />;
}


// export function VerticalGraph({ data }) {

//     console.log("GRAPH DATA:", data);
//     console.log("DATASETS:", data?.datasets);

//     if (!data || !Array.isArray(data.datasets)) {
//         return <p>Chart data is not available</p>;
//     }

//     return <Bar options={options} data={data} />;
// }