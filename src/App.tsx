import React, {useState} from 'react';
import './App.css';

import Square from "./Square";
import {Mapper} from "./Mapper";
import {SquareData} from "./SquareData";

function App() {

    // store the rows inside some structure...
    // generate table from dimensions?
    // collect square data and put into vmf

    const [mapper, setMapper] = useState(new Mapper(11,7, 10))
    const [started, setStarted] = useState(false)

    function handleUpdate(data:SquareData) {
        mapper.mirror(data.xCoord, data.yCoord, data.zCoord)
        setMapper(mapper.clone())
    }
    //
    // var floors = mapper.floors
    // const display = floors.map(floor => {
    //     floor.map(row => {
    //         var squares: any[] = []
    //         for (const square in row) {
    //             squares.push(<td><Square data={row[square]} handleUpdate={handleUpdate}/></td>)
    //         }
    //         return (<tr>{squares}</tr>)
    //     })
    // })

    var floors = mapper.floors
    var rows = floors[4]

    // var rows = mapper.rows
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

    function exportVmf(){

        var c = document.createElement("a");
        c.download = "mallet.vmf";

        var t = new Blob([mapper.vmf()], {
            type: "text/plain"
        });
        c.href = window.URL.createObjectURL(t);
        c.click();


    }

    // problem: it can
    return (
        <div>
            <table>
                <tbody>
                <td>
                    <table style={{borderSpacing: "0px", borderCollapse: "separate"}}>
                        <tbody>
                            {grid}
                        </tbody>

                    </table>
                </td>
                    <td>
                        <button onClick={exportVmf}>Click here to export .VMF</button>
                        <p>Instructions</p>
                        <ul>
                            <li>Hover over a square to select it</li>
                            <li>Press an arrow key to place a wall there in that direction</li>
                            <li>Press S to place a spawn point (Left/up side is blue)</li>
                            <ul><li>Spawn points will face left-right towards the middle</li></ul>
                            <li>Press CTRL (any side) + an arrow key to place a shutter door there in that direction</li>
                            <li>Press C to place a KOTH capture point</li>
                            <ul><li>Only tested with 1 point</li></ul>
                            <li>Press H to place a medium health pack</li>
                            <ul><li>A for medium ammo</li>
                            <li>Putting a health and ammo on the same square works, but will put them on top of each other</li></ul>
                            <li>HINT: Zoom out to fit the entire grid on your screen, if needed</li>
                        </ul>

                        <p>Pro mapper tips</p>
                        <ul>
                            <li>Seal off the entire inside of your map with walls</li>
                            <ul><li>If you don't do this, the map won't work</li></ul>
                            <li>Doors take up the entire face of a wall</li>
                            <ul><li>If you make them intersect with a wall at the corner, it will still work, but will look bad</li></ul>
                            <li>You can place multiple spawns to create a large spawn room</li>
                            <ul><li>Each will have its own resupply cabinet, though</li></ul>
                            <li>Doors placed inside the same tile as a spawn room will only be usable by the team that owns the spawn</li>
                        </ul>
                        <br/> <p>check out the project: <a href={"https://github.com/slayerofdrosophila/tf2mapper"}>github.com/slayerofdrosophila/tf2mapper (Good luck)</a>
                    </p>
                    </td>
                </tbody>
            </table>



        </div>
    );
}

function StartScreen(){
    return(
        <div>
            <h3>Welcome to the Mallet easy TF2 map maker</h3>
            <p>Create TF2 maps (KOTH only) with a simple, in-your-browser map editor!</p>

            <form>
                <input/>
            </form>
        </div>
    )
}

export default App
