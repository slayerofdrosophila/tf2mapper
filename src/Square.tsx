import React from 'react';

import square from './assets/square_blank.png';
import floor from './assets/floor.png'
import wall_north from './assets/wall_north.png';
import wall_west from './assets/wall_west.png';
import wall_south from './assets/wall_south.png';
import wall_east from './assets/wall_east.png';
import health_small from './assets/health_small.png';
import health_medium from './assets/health_medium.png'
import ammo_medium from './assets/ammo_medium.png'
import deathpit from './assets/deathpit.png';
import controlpoint from './assets/cp_neutral.png'
import light from './assets/light.png'
import spawn_red from './assets/spawn_red.png'
import spawn_blu from './assets/spawn_blu.png'
import door_north from './assets/door_north.png'
import door_south from './assets/door_south.png'
import door_east from './assets/door_east.png'
import door_west from './assets/door_west.png'
import ramp_north from './assets/ramp_north.png'
import ramp_south from './assets/ramp_south.png'
import ramp_east from './assets/ramp_east.png'
import ramp_west from './assets/ramp_west.png'


import './App.css';
import {on} from "cluster";
import {SquareData} from "./SquareData";

/**
 * This does not really do much except:
 * handle key inputs
 * display things in the grid (on the App page)
 * @param props
 * @constructor
 */
function Square(props: { data: SquareData; handleUpdate: (data: SquareData) => void }) {

    // const [data, setData] = useState(props.data)
    const data = props.data

    var myDiv:HTMLSpanElement|null;

    var no_floor_pic = null
    if (!data.hasFloor){
        no_floor_pic = <img className={"Overlay"} src={floor}/>
    }

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
        if (data.spawnTeam == 2){
            spawn_picture = <img className={"Overlay"} src={spawn_red}/>
        } else{
            spawn_picture = <img className={"Overlay"} src={spawn_blu}/>
        }

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
    var ramp_north_pic = null
    if (data.hasNorthRamp){
        ramp_north_pic = <img className={"Overlay"} src={ramp_north}/>
    }
    var ramp_south_pic = null
    if (data.hasSouthRamp){
        ramp_south_pic = <img className={"Overlay"} src={ramp_south}/>
    }
    var ramp_east_pic = null
    if (data.hasEastRamp){
        ramp_east_pic = <img className={"Overlay"} src={ramp_east}/>
    }
    var ramp_west_pic = null
    if (data.hasWestRamp){
        ramp_west_pic = <img className={"Overlay"} src={ramp_west}/>
    }

    var light_pic = null
    if (data.hasLight){
        light_pic = <img className={"Overlay"} src={light}/>
    }

    function handleKeyUp(event: any){
        console.log(event.key)
        if (event.key === "ArrowUp"){
            if (event.ctrlKey){
                data.hasNorthDoor = !data.hasNorthDoor
            } else if(event.shiftKey){
                data.hasNorthRamp = !data.hasNorthRamp
            } else{
                data.hasNorthWall = !data.hasNorthWall
            }
        } else if (event.key === "ArrowDown"){
            if (event.ctrlKey){
                data.hasSouthDoor = !data.hasSouthDoor
            } else if(event.shiftKey){
                data.hasSouthRamp = !data.hasSouthRamp
            } else{
                data.hasSouthWall = !data.hasSouthWall
            }
        } else if (event.key === "ArrowRight"){
            if (event.ctrlKey){
                data.hasEastDoor = !data.hasEastDoor
            } else if(event.shiftKey){
                data.hasEastRamp = !data.hasEastRamp
            } else{
                data.hasEastWall = !data.hasEastWall
            }
        } else if(event.key === "ArrowLeft"){
            if (event.ctrlKey){
                data.hasWestDoor = !data.hasWestDoor
            } else if(event.shiftKey){
                data.hasWestRamp = !data.hasWestRamp
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
            // if (data.hasPit) {
            //     data.hasPit = false
            // } else{
            //     data.hasPit = true
            // }
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
        } else if(event.key === " "){
            data.hasFloor = !data.hasFloor
        } else if (event.key === "l"){
            data.hasLight = !data.hasLight
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
            {deathpit_picture}
            {no_floor_pic}
            {point_picture}
            {wall_north_picture}{wall_south_picture}{wall_east_picture}{wall_west_picture}
            {spawn_picture}
            {health_picture}{ammo_medium_pic}
            {door_north_pic}{door_south_pic}{door_east_pic}{door_west_pic}
            {ramp_north_pic}{ramp_south_pic}{ramp_east_pic}{ramp_west_pic}
            {light_pic}
        </span>
    );
}

export default Square;
