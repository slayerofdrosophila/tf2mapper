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
import flag_red from './assets/flag_red.png'
import flag_blu from './assets/flag_blu.png'
import door_north from './assets/door_north.png'
import door_south from './assets/door_south.png'
import door_east from './assets/door_east.png'
import door_west from './assets/door_west.png'
import ramp_north from './assets/ramp_north.png'
import ramp_south from './assets/ramp_south.png'
import ramp_east from './assets/ramp_east.png'
import ramp_west from './assets/ramp_west.png'
import below_wall_north from './assets/below_wall_north.png';
import below_wall_west from './assets/below_wall_west.png';
import below_wall_south from './assets/below_wall_south.png';
import below_wall_east from './assets/below_wall_east.png';
import above_wall_north from './assets/above_wall_north.png';
import above_wall_west from './assets/above_wall_west.png';
import above_wall_south from './assets/above_wall_south.png';
import above_wall_east from './assets/above_wall_east.png';


import './App.css';
import {on} from "cluster";
import {SquareData} from "./SquareData";
import {log} from "util";

/**
 * This does not really do much except:
 * handle key inputs
 * display things in the grid (on the App page)
 * @param props: data (squaredata); handleUpdate (refresh state and mirror square function); above/below(data of above/below cells)
 * @constructor
 */
// function Square(props: { data: SquareData; handleUpdate: (data: SquareData) => void}) {
function Square(props: { data: SquareData; handleUpdate: (data: SquareData) => void; above: SquareData | null; below: SquareData | null}) {

    // const [data, setData] = useState(props.data)
    const data = props.data
    const above = props.above
    const below = props.below

    var myDiv:HTMLSpanElement|null;

    // This repeats an incredible amount of times.
    // Unfortunately, I am not clever enough to think of a way around this.
    var no_floor_pic = null
    if (data.hasFloor){
        no_floor_pic = <img className={"Overlay"} src={floor}/>
    }
    var wall_north_pic = null
    if (data.hasNorthWall){
        wall_north_pic = <img className={"Overlay"} src={wall_north}/>
    }
    var wall_south_pic = null
    if (data.hasSouthWall){
        wall_south_pic = <img className={"Overlay"} src={wall_south}/>
    }
    var wall_west_pic = null
    if (data.hasWestWall){
        wall_west_pic = <img className={"Overlay"} src={wall_west}/>
    }
    var wall_east_pic = null
    if (data.hasEastWall){
        wall_east_pic = <img className={"Overlay"} src={wall_east}/>
    }
    var health_pic = null
    if (data.hasHealth){
        health_pic = <img className={"Overlay"} src={health_medium}/>
    }
    var ammo_medium_pic = null
    if (data.hasAmmoMedium){
        ammo_medium_pic = <img className={"Overlay"} src={ammo_medium}/>
    }
    var deathpit_pic = null
    if (data.hasPit){
        deathpit_pic = <img className={"Overlay"} src={deathpit}/>
    }
    var point_pic = null
    if (data.hasPoint){
        point_pic = <img className={"Overlay"} src={controlpoint}/>
    }
    var spawn_pic = null
    if (data.hasSpawn){
        if (data.spawnTeam == 2){
            spawn_pic = <img className={"Overlay"} src={spawn_red}/>
        } else{
            spawn_pic = <img className={"Overlay"} src={spawn_blu}/>
        }
    }
    var flag_pic = null
    if (data.hasFlag){
        if (data.flagTeam == 3){
            flag_pic = <img className={"Overlay"} src={flag_red}/>
        } else{
            flag_pic = <img className={"Overlay"} src={flag_blu}/>
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
    /*
    These are the "x-ray" walls and floors. They are only shown if "above" and "below" are passed in.
    They are only passed in if there is a floor above/below and xray is toggled on.
     */
    var below_wall_north_pic = null
    var below_wall_south_pic = null
    var below_wall_west_pic = null
    var below_wall_east_pic = null
    if (below != null){
        if (below.hasNorthWall){
            below_wall_north_pic = <img className={"Overlay"} src={below_wall_north}/>
        }
        if (below.hasSouthWall){
            below_wall_south_pic = <img className={"Overlay"} src={below_wall_south}/>
        }
        if (below.hasWestWall){
            below_wall_west_pic = <img className={"Overlay"} src={below_wall_west}/>
        }
        if (below.hasEastWall){
            below_wall_east_pic = <img className={"Overlay"} src={below_wall_east}/>
        }
    }
    var above_wall_north_pic = null
    var above_wall_south_pic = null
    var above_wall_west_pic = null
    var above_wall_east_pic = null
    if (above != null){
        if (above.hasNorthWall){
            above_wall_north_pic = <img className={"Overlay"} src={above_wall_north}/>
        }
        if (above.hasSouthWall){
            above_wall_south_pic = <img className={"Overlay"} src={above_wall_south}/>
        }
        if (above.hasWestWall){
            above_wall_west_pic = <img className={"Overlay"} src={above_wall_west}/>
        }
        if (above.hasEastWall){
            above_wall_east_pic = <img className={"Overlay"} src={above_wall_east}/>
        }
    }

    

    // This could definitely be a switch statement.
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
            data.hasHealth = !data.hasHealth
        } else if (event.key === "p"){
            // data.hasPit = !data.hasPit
        } else if (event.key === "c"){
            data.hasPoint = !data.hasPoint
        } else if (event.key === "f"){
            data.hasFlag = !data.hasFlag
        } else if (event.key === "s"){
            // if (data.spawnTeam == -1){
            //     data.spawnTeam = 2
            // }
            data.hasSpawn = !data.hasSpawn
        } else if(event.key === "a"){
            data.hasAmmoMedium = !data.hasAmmoMedium
        } else if(event.key === " "){
            data.hasFloor = !data.hasFloor
        } else if (event.key === "l"){
            data.hasLight = !data.hasLight
        }

        // mirrors this square and refreshes the state
        props.handleUpdate(data)

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
            {deathpit_pic}
            {no_floor_pic}
            {point_pic}
            {flag_pic}
            {wall_north_pic}{wall_south_pic}{wall_east_pic}{wall_west_pic}
            {below_wall_north_pic}{below_wall_south_pic}{below_wall_east_pic}{below_wall_west_pic}
            {above_wall_north_pic}{above_wall_south_pic}{above_wall_east_pic}{above_wall_west_pic}
            {spawn_pic}
            {health_pic}{ammo_medium_pic}
            {door_north_pic}{door_south_pic}{door_east_pic}{door_west_pic}
            {ramp_north_pic}{ramp_south_pic}{ramp_east_pic}{ramp_west_pic}
            {light_pic}

        </span>
    );
}

export default Square;
