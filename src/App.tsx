import React, {useState} from 'react';
import './App.css';

import Square from "./Square";
import {Mapper} from "./Mapper";
import {SquareData} from "./SquareData";
import {setupMaster} from "cluster";

function App() {

    // store the rows inside some structure...
    // generate table from dimensions?
    // collect square data and put into vmf

    const [mapper, setMapper] = useState(new Mapper(17,9, 10))
    const [currentFloor, setCurrentFloor] = useState(0)
    const [topFloor, setTopFloor] = useState(10)

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
    var rows = floors[currentFloor]

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

    function handleKeyUp(e: any){

        if (e.key == " "){ // for some reason space causes the floor to change??? because isNaN thinks it is a number???
            return
        }

        if (!isNaN(e.key)){
            let number = parseInt(e.key)
            if (number == 0){
                number = 10
            }
            setCurrentFloor(number - 1)
        }

        if (e.key == "`"){
            mapper.topFloor = currentFloor
            setMapper(mapper.clone())
        }
    }

    return (
        <div>
            <table>
                <tbody>
                <td>
                    <h1>Floor: {currentFloor + 1}      Top floor: {mapper.topFloor + 1}</h1>
                    <table onKeyUp={handleKeyUp} style={{borderSpacing: "0px", borderCollapse: "separate"}}>
                        <tbody>
                            {grid}
                        </tbody>

                    </table>
                    <button onClick={exportVmf}>Click here to export .VMF</button>
                    <p>check out the project: <a href={"https://github.com/slayerofdrosophila/tf2mapper"}>github.com/slayerofdrosophila/tf2mapper (Good luck)</a></p>
                </td>
                    <td>
                        <div>
                            <p>Instructions</p>
                            <table>
                                <thead>
                                <th scope="col">Key</th>
                                <th scope="col">Prefab</th>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Arrow Key</td>
                                    <td>Wall</td>
                                </tr>
                                <tr>
                                    <td>CTRL + Arrow</td>
                                    <td>Shutter Door</td>
                                </tr>
                                <tr>
                                    <td>Space</td>
                                    <td>Floor (1st level has all floor filled by default)</td>
                                </tr>
                                <tr>
                                    <td>S</td>
                                    <td>Spawn Room (no walls/door)</td>
                                </tr>
                                <tr>
                                    <td>C</td>
                                    <td>KOTH Cap Point</td>
                                </tr>
                                <tr>
                                    <td>H / A</td>
                                    <td>Med. Health / Ammo</td>
                                </tr>
                                <tr>
                                    <td>Number key (1-0)</td>
                                    <td>Switch level</td>
                                </tr>
                                <tr>
                                    <td>~</td>
                                    <td>Set current level as top level (places ceiling over it)</td>
                                </tr>
                                </tbody>
                            </table>
                            <ul>
                                <li>Hover over a square to select it</li>
                                <li>Press the appropriate key to put a certain prefab there</li>
                                <li>Pressing the key again will remove it</li>
                                <li>Each square can hold 1 of everything, if desired</li>
                                <li>HINT: Zoom out to fit the entire grid on your screen</li>
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
                        </div>
                    </td>
                </tbody>
            </table>



        </div>
    );
}


export default App