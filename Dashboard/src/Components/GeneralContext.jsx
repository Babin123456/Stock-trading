import React, { useState } from 'react';
import { BuyActionWindow } from "./BuyActionWindow.jsx";

export const GeneralContext = React.createContext({
  openBuyWindow: (uid, mode, price) => { },
  closeBuyWindow: () => { },
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUid, setSelectedStockUid] = useState("");
  const [orderMode, setOrderMode] = useState("BUY");
  const [defaultPrice, setDefaultPrice] = useState(0.0);

  const handleOpenBuyWindow = (uid, mode = "BUY", price = 0.0) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUid(uid);
    setOrderMode(mode?.toUpperCase() === "SELL" ? "SELL" : "BUY");
    setDefaultPrice(Number(price) || 0.0);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUid("");
    setOrderMode("BUY");
    setDefaultPrice(0.0);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStockUid}
          initialMode={orderMode}
          defaultPrice={defaultPrice}
        />
      )}
    </GeneralContext.Provider>
  );
};
