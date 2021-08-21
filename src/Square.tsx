import React from 'react';

import square from './assets/square_blank.png';
import wall_north from './assets/wall_north.png';
import wall_west from './assets/wall_west.png';
import wall_south from './assets/wall_south.png';
import wall_east from './assets/wall_east.png';
import health_small from './assets/health_small.png';
import health_medium from './assets/health_medium.png'
import ammo_medium from './assets/ammo_medium.png'
import deathpit from './assets/deathpit.png';
import controlpoint from './assets/cp_neutral.png'
import spawn_red from './assets/spawn_red.png'
import door_north from './assets/door_north.png'
import door_south from './assets/door_south.png'
import door_east from './assets/door_east.png'
import door_west from './assets/door_west.png'

import './App.css';
import {on} from "cluster";
import {SquareData} from "./SquareData";

function Square(props: { data: SquareData; handleUpdate: (data: SquareData) => void }) {

    // const [data, setData] = useState(props.data)
    const data = props.data

    var myDiv:HTMLSpanElement|null;

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
        health_picture = <img className={"Overlay"} src={health_medium}/>
    }

    var ammo_medium_pic = null
    if (data.hasAmmoMedium){
        ammo_medium_pic = <img className={"Overlay"} src={ammo_medium}/>
    }

    var deathpit_picture = null
    if (data.hasPit){
        deathpit_picture = <img className={"Overlay"} src={deathpit}/>
    }

    var point_picture = null
    if (data.hasPoint){
        point_picture = <img className={"Overlay"} src={controlpoint}/>
    }

    var spawn_picture = null
    if (data.hasSpawn){
        spawn_picture = <img className={"Overlay"} src={spawn_red}/>
    }

    var door_north_pic = null
    if (data.hasNorthDoor){
        door_north_pic = <img className={"Overlay"} src={door_north}/>
    }

    var door_south_pic = null
    if (data.hasSouthDoor){
        door_south_pic = <img className={"Overlay"} src={door_south}/>
    }

    var door_east_pic = null
    if (data.hasEastDoor){
        door_east_pic = <img className={"Overlay"} src={door_east}/>
    }

    var door_west_pic = null
    if (data.hasWestDoor){
        door_west_pic = <img className={"Overlay"} src={door_west}/>
    }

    function handleKeyUp(event: any){
        if (event.key === "ArrowUp"){
            if (event.ctrlKey){
                data.hasNorthDoor = !data.hasNorthDoor
            } else{
                data.hasNorthWall = !data.hasNorthWall
            }
        } else if (event.key === "ArrowDown"){
            if (event.ctrlKey){
                data.hasSouthDoor = !data.hasSouthDoor
            } else{
                data.hasSouthWall = !data.hasSouthWall
            }
        } else if (event.key === "ArrowRight"){
            if (event.ctrlKey){
                data.hasEastDoor = !data.hasEastDoor
            } else{
                data.hasEastWall = !data.hasEastWall
            }
        } else if(event.key === "ArrowLeft"){
            if (event.ctrlKey){
                data.hasWestDoor = !data.hasWestWall
            } else{
                data.hasWestWall = !data.hasWestWall
            }
        } else if (event.key === "h"){
            if (data.hasHealth) {
                data.hasHealth = false
            } else{
                data.hasHealth = true
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
        } else if (event.key === "s"){
            data.hasSpawn = !data.hasSpawn
        }
        else if(event.key === "a"){
            data.hasAmmoMedium = !data.hasAmmoMedium
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
        <span className="Square"
             onKeyUp={handleKeyUp} // this is only called when this div element has focus
            onKeyPress={e => e.preventDefault()}
             tabIndex={0} // this is needed to make div element "focusable"
             ref={assignReference} // this is needed to get the div element so that we can call focus on it
             onMouseEnter={handleMouseEnter} // this is to call focus on div when mouse enters
        >
            <img src={square} />
            {deathpit_picture}{point_picture}
            {wall_north_picture}{wall_south_picture}{wall_east_picture}{wall_west_picture}
            {spawn_picture}
            {health_picture}{ammo_medium_pic}
            {door_north_pic}{door_south_pic}{door_east_pic}{door_west_pic}
        </span>
    );
}

export default Square;
