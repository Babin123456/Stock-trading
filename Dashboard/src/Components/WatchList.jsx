import React, { useState, useContext } from 'react';
import { watchlist } from '../data/data.js';
import { Tooltip, Grow } from "@mui/material";
import { BarChartOutlined, KeyboardArrowDown, KeyboardArrowUp, MoreHoriz } from "@mui/icons-material";
import { DoughnutChart } from './DoughnutChart.jsx';
import { GeneralContext } from './GeneralContext.jsx';

export const WatchList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWatchlist = watchlist.filter((stock) =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const labels = filteredWatchlist.map((item) => item.name);

  const data = {
    labels,
    datasets: [
      {
        label: 'Price',
        data: filteredWatchlist.map((stock) => stock.price),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ]
  };

  return (
    <div className='watchlist-container'>
      <div className='search-container'>
        <input
          type="text"
          name="search"
          id="search"
          placeholder='Search eg: infy, bse, tcs...'
          className='search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className='counts'>{filteredWatchlist.length}/50</span>
      </div>

      <ul className='list'>
        {filteredWatchlist.length > 0 ? (
          filteredWatchlist.map((stock, index) => (
            <WatchListItem stock={stock} key={stock.name || index} />
          ))
        ) : (
          <li style={{ padding: "16px", textAlign: "center", color: "#888", fontSize: "0.85rem" }}>
            No stocks found matching "{searchTerm}"
          </li>
        )}
      </ul>

      {filteredWatchlist.length > 0 && <DoughnutChart data={data} />}
    </div>
  );
};

export const WatchListItem = ({ stock }) => {
  const [showWatchListAction, setShowListAction] = useState(false);

  const handleMouseEnter = () => {
    setShowListAction(true);
  };
  const handleMouseLeave = () => {
    setShowListAction(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className='item'>
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className='itemInfo'>
          <span className='percent'>{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className='price'>{stock.price}</span>
        </div>
      </div>
      {showWatchListAction && <WatchListAction stock={stock} />}
    </li>
  );
};

const WatchListAction = ({ stock }) => {
  const { openBuyWindow } = useContext(GeneralContext);

  const handleBuy = (e) => {
    e.stopPropagation();
    openBuyWindow(stock.name, "BUY", stock.price);
  };

  const handleSell = (e) => {
    e.stopPropagation();
    openBuyWindow(stock.name, "SELL", stock.price);
  };

  return (
    <span className="actions-wrapper">
      <Tooltip
        title="Buy (B)"
        placement='top'
        arrow
        TransitionComponent={Grow}
      >
        <button type="button" className='buy' onClick={handleBuy}>
          Buy
        </button>
      </Tooltip>
      <Tooltip
        title="Sell (S)"
        placement='top'
        arrow
        TransitionComponent={Grow}
      >
        <button type="button" className='sell' onClick={handleSell}>
          Sell
        </button>
      </Tooltip>
      <Tooltip
        title="Analytics (A)"
        placement='top'
        arrow
        TransitionComponent={Grow}
      >
        <button type="button" className='actions'>
          <BarChartOutlined className='icon' />
        </button>
      </Tooltip>
      <Tooltip
        title="More"
        placement='top'
        arrow
        TransitionComponent={Grow}
      >
        <button type="button" className='actions'>
          <MoreHoriz className='icon' />
        </button>
      </Tooltip>
    </span>
  );
};
