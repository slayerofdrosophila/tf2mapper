import React from 'react';

import square from './assets/square_blank.png';
import wall_north from './assets/wall_north.png';
import wall_west from './assets/wall_west.png';
import wall_south from './assets/wall_south.png';
import wall_east from './assets/wall_east.png';
import health_small from './assets/health_small.png';
import deathpit from './assets/deathpit.png';
import controlpoint from './assets/cp_neutral.png'

import './App.css';
import {on} from "cluster";
import {SquareData} from "./SquareData";

function Square(props: { data: SquareData; handleUpdate: (data: SquareData) => void }) {

    // const [data, setData] = useState(props.data)
    const data = props.data

    var myDiv:HTMLDivElement|null;

    var wall_north_picture = null
    if (data.hasNorthWall){
        wall_north_picture = <img className={"Overlay"} src={wall_north}/>
    }

    var wall_south_picture = null
    if (data.hasSouthWall){
        wall_south_picture = <img className={"Overlay"} src={wall_south}/>
    }

    var wall_west_picture = null
    if (data.hasWestWall){
        wall_west_picture = <img className={"Overlay"} src={wall_west}/>
    }

    var wall_east_picture = null
    if (data.hasEastWall){
        wall_east_picture = <img className={"Overlay"} src={wall_east}/>
    }

    var health_picture = null
    if (data.hasHealth){
        health_picture = <img className={"Overlay"} src={health_small}/>
    }

    var deathpit_picture = null
    if (data.hasPit){
        deathpit_picture = <img className={"Overlay"} src={deathpit}/>
    }

    var point_picture = null
    if (data.hasPoint){
        point_picture = <img className={"Overlay"} src={controlpoint}/>
    }

    function handleKeyUp(event: any){
        if (event.key === "ArrowUp"){
            if (data.hasNorthWall) {
                data.hasNorthWall = false
            } else{
                data.hasNorthWall = true
            }
        } else if (event.key === "ArrowDown"){
            if (data.hasSouthWall) {
                data.hasSouthWall = false
            } else{
                data.hasSouthWall = true
            }
        } else if (event.key === "ArrowRight"){
            if (data.hasEastWall) {
                data.hasEastWall = false
            } else{
                data.hasEastWall = true
            }
        } else if(event.key === "ArrowLeft"){
            if (data.hasWestWall) {
                data.hasWestWall = false
            } else{
                data.hasWestWall = true
            }
        } else if (event.key === "h"){
            if (data.hasHealth) {
                data.hasHealth = false
            } else{
                data.hasEastWall = true
            }
        } else if (event.key === "p"){
            if (data.hasPit) {
                data.hasPit = false
            } else{
                data.hasPit = true
            }
        } else if (event.key === "c"){
            if (data.hasPoint) {
                data.hasPoint = false
            } else{
                data.hasPoint = true
            }
        }
        props.handleUpdate(data)
        // setData({...data}) // this updates the state, very importatnt
    }

    function handleMouseEnter() {
        if (myDiv != null) {
            myDiv.focus();
        }
    }
    function assignReference(x:HTMLDivElement|null) {
        myDiv = x
    }

    return (
        <div className="Square"
             onKeyUp={handleKeyUp} // this is only called when this div element has focus
             tabIndex={0} // this is needed to make div element "focusable"
             ref={assignReference} // this is needed to get the div element so that we can call focus on it
             onMouseEnter={handleMouseEnter} // this is to call focus on div when mouse enters
        >
            <img src={square} />
            {deathpit_picture}{point_picture}
            {wall_north_picture}{wall_south_picture}{wall_east_picture}{wall_west_picture}
            {health_picture}
        </div>
    );
}

export default Square;
