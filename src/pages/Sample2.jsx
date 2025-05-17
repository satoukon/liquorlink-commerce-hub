import React, { useState } from 'react';
import { Value } from "@radix-ui/react-select";


function Sample2() {
    const [cash, setCash] = useState('15');
    const [newCurrency, setNewCurrency] = useState('1');
    const [convertedValue, setConvertedValue] = useState();
    return (
        <div >
            <label htmlFor="cash">Amount:</label>
            <input style={{ color: 'black' }}
                type="number"
                id="cash"
                name="cash"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
            />
            <br />

            <label htmlFor="newcurrency">New Currency:</label>
            <select name="newcurrency" id="newcurrency" style={{ color: 'black' }}
                value={newCurrency}
                onChange={(e) => {
                    setNewCurrency(e.target.value)
                    setConvertedValue(cash * parseFloat(e.target.value))
                }
                }
            >
                <option value="1">USD</option>
                <option value="0.90">EUR</option>
                <option value="0.75">GBP</option>
                <option value="1.40">CAD</option>
                <option value="1.56">AUD</option>
                <option value="145.94">JPY</option>
                <option value="7.21">CNY</option>
                <option value="55.80">PHP</option>
            </select>

            <p> {convertedValue}</p>
        </div>
    );
}


export default Sample2;