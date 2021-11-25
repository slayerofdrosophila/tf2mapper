import React, {useState} from 'react';
import './App.css';

import Square from "./Square";
import {Mapper} from "./Mapper";
import {SquareData} from "./SquareData";
import {setupMaster} from "cluster";
import SidePanel from "./SidePanel";

/**
 * Welcome
 * @constructor
 */
function App() {

    // store the rows inside some structure...
    // generate table from dimensions?
    // collect square data and put into vmf

    // default: 17,9,10
    const [mapper, setMapper] = useState(new Mapper(17,9, 10))
    const [currentFloor, setCurrentFloor] = useState(0)
    const [topFloor, setTopFloor] = useState(10)

    const [sideVisible, setSideVisible] = useState(true)
    const [leakStatusColor, setLeakStatusColor] = useState("black")
    const [dismissedAlert, setDismissedAlert] = useState(false)

    // This happens every time a button is pressed.
    // This App passes this function into the Square s.
    // The setMapper(clone) is to refresh the state of the Mapper and cause the pictures to change.
    function handleUpdate(data:SquareData) {
        console.log("handle update");
        mapper.mirror(data.xCoord, data.yCoord, data.zCoord)
        setMapper(mapper.clone())
    }

    // This was old code for creating the grid. I am emotionally attached to it.
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

    // This renders the grid thingy
    // if you want multi-layers: somehow render the lower level at the same time, underneath??
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

    // The important bit is the JSON.stringify(mapper)
    // The entire Mapper object is pasted
    function exportJson(){
        var c = document.createElement("a");
        c.download = "mallet.json";

        var t = new Blob([JSON.stringify(mapper)], {
            type: "text/plain"
        });
        c.href = window.URL.createObjectURL(t);
        c.click();
    }

    function loadJson(event: any){
        const fileReader = new FileReader()
        fileReader.readAsText(event.target.files[0], "UTF-8")
        fileReader.onload = e => {
            // @ts-ignore
            setMapper(Mapper.fromJSON(JSON.parse(e.target.result as string)))
        }
    }

    function leak(){
        let conf = true
        if (!dismissedAlert){
            // eslint-disable-next-line no-restricted-globals
            let conf = confirm("This may crash the app or your browser. Please save before using. \nIf the app crashes, press X on the upper right corner.")
        }
        if (conf) {
            setDismissedAlert(true)
            let res = mapper.leakCheck()
            if (res) {
                setLeakStatusColor("green")
                console.log("Not leaking")
            } else {
                setLeakStatusColor("red")
                console.log("leaking")
            }
        }
    }

    function handleKeyUp(e: any){

        if (e.key == " "){ // for some reason space causes the floor to change??? because isNaN thinks it is a number???
            return
        }

        if (!isNaN(e.key)){ // if key is a number, change the floor to that number (one based indexing)
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

        if (e.key == "["){ // [ and ] are for going up and down 1 level, in case that's more convenient
            if (currentFloor > 1){
                setCurrentFloor(currentFloor-1)
            }
        }

        if (e.key == "]"){
            if (currentFloor < 10){
                setCurrentFloor(currentFloor+1)
            }
        }
    }

    function visible(){
        if (sideVisible){
            setSideVisible(false)
        } else{
            setSideVisible(true)
        }
    }

    function leakText(){
        if (leakStatusColor === "red"){
            return " leaking"
        } else if (leakStatusColor === "green"){
            return " not leaking"
        } else {
            return " not checked yet"
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
                        <button onClick={exportJson}>Click here to export .JSON (SAVE FILE)</button>
                        <input type={"file"} name={"file"} onChange={loadJson}></input>
                        <button onClick={visible} style={{float: 'right'}}> Show/Hide Side Info</button>
                        <br></br><button onClick={leak}>Check for leaks (MAY HANG OR CRASH)</button>
                        <text style={{color: leakStatusColor}}>{leakText()}</text>
                        <p>check out the project: <a href={"https://github.com/slayerofdrosophila/tf2mapper"}>github.com/slayerofdrosophila/tf2mapper (Good luck)</a></p>
                    </td>
                {sideVisible && <SidePanel/>}
                </tbody>
            </table>
        </div>
    );
}


export default App