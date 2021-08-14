import React, {useState} from 'react';
import './App.css';

import Square from "./Square";
import {Mapper} from "./Mapper";
import {SquareData} from "./SquareData";

function App() {

    // store the rows inside some structure...
    // generate table from dimensions?
    // collect square data and put into vmf

    const [mapper, setMapper] = useState(new Mapper(31,15))

    function handleUpdate(data:SquareData) {
        mapper.mirror(data.xCoord, data.yCoord)
        setMapper(mapper.clone())
    }

    var rows = mapper.rows
    const grid = rows.map(row => {
        var squares: any[] = []
            for (const square in row) {
                squares.push(<td><Square data={row[square]} handleUpdate={handleUpdate}/></td>)
            }
        return (<tr>
            {squares}
        </tr>)
        }
    )

    return (
        <div>
            <table>
                <tbody>
                <tr>
                    {grid}
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default App;
