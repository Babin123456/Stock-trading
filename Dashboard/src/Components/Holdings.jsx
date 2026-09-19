import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ClientServer } from '../ClientServer.js';
import { VerticalGraph } from './VerticalGraph.jsx';


export default function Holdings() {
  const [allHodings, setAllHoldings] = useState([]);

  useEffect(() => {
    const fetchHoldings = async () => {
      const response = await ClientServer.get("/allHoldings");

      // console.log(response.data);

      setAllHoldings(response.data);
    }
    fetchHoldings();
  }, [])


  const labels = allHodings.map((subarray) => subarray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock price",
        data: allHodings.map((stock) => stock.price),
        backgroundColor: "rgba(255,99,132,0.5)"
      },
    ]

  };


  return (
    <>
      <h3 className='title'>Holdings({allHodings.length})</h3>
      <div className='order-table'>
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Curr. val</th>
              <th>P&L</th>
              <th>Net Chag.</th>
              <th>Day chag.</th>
            </tr>

            {allHodings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index} >
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </thead>
        </table>
      </div>

      <div className='row'>
        <div className='col'>
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total Investment</p>
        </div>
        <div className='col'>
          <h5>
            31,428<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className='col'>
          <h5>
            1,553.40(+5.20%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  )
}
