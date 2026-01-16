// import React from "react";
import { useState } from "react";
import "./AmountSelector.css";

// All sums are in hundreds of a currency like: cents/öre/pence/
const amounts = [10000, 25000, 50000];

// Select predefined sums for topping up your wallet.
const AmountSelector = ({ onSelect }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);

  const confirmSelection = () => {
    if (selectedAmount) {
      onSelect(selectedAmount);
    }

  }
  return (
    <div className="amount-selector">
      <h2>Fyll på din plånbok</h2>
      <div className="amount-container">
        {amounts.map(amount =>
          <label key={amount}
            className="amount-label"
          >
            <span className="amount-header">
              Rull {amount / 100}
              <input
                onClick={() => setSelectedAmount(amount)}
                className="amount-input"
                type="radio"
                name="delivery"
                value={amount}
              />
            </span>
            <span className="amount-info">
              {/* <span id="delivery-0-name" class="item-name">Standard</span> */}
              <small id="amount-description"
                className="amount-description"
              >
                Fyll på din plånbok med
              </small>
            </span>
            <strong id="amount-total" className="amount-total">{amount / 100} SEK</strong>
          </label>
        )}

      </div>
      <button className="btn confirm-amount-btn"
        disabled={!selectedAmount}
        onClick={confirmSelection}
      >Bekräfta belopp</button>
    </div>
  );
}

export default AmountSelector
