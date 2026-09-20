import React, { useEffect, useState } from 'react';
import { ClientServer } from '../ClientServer.js';

// import { positions } from '../data/data.js';

export default function Positions() {

  const [allPositions, SetAllPositions] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      const response = await ClientServer.get("/allPositions");
      console.log("all positions data are", response.data);
      SetAllPositions(response.data);
    }
    fetchPositions();
  }, [])

  return (
    <>
      <h3 className='title'>Holdings({allPositions.length})</h3>
      <div className='order-table'>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>

              {allPositions.map((stock, index) => {
                const curValue = stock.price * stock.qty;
                const isProfit = curValue - stock.avg * stock.qty >= 0.0;
                const profClass = isProfit ? "profit" : "loss";
                const dayClass = stock.isLoss ? "loss" : "profit";

                return (
                  <tr key={index} >
                    <td>{stock.product}</td>
                    <td>{stock.name}</td>
                    <td>{stock.avg.toFixed(2)}</td>
                    <td>{stock.price.toFixed(2)}</td>
                    <td className={profClass}>
                      {(curValue - stock.avg * stock.qty).toFixed(2)}
                    </td>
                    <td className={dayClass}>{stock.day}</td>
                  </tr>
                );
              })}
            </tr>
          </thead>
        </table>
      </div>
    </>

  )
}
