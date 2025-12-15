// import React from "react";

// All sums are in hundreds of a currency like: cents/öre/pence/
const amounts = [10000, 25000, 50000];

// Select predefined sums for topping up your wallet.
const AmountSelector = ({ onSelect })=> {
    return (
        <div className="amount-selector">
            <h2>Fyll på din plånbok</h2>
            {amounts.map( amount =>
                <button key={amount} onClick={() => onSelect(amount)}>
                    {amount / 100} SEK
                </button>
            )}
        </div>
    );
}

export default AmountSelector
