import React, {Component, useState} from "react";
import {Mapper} from "./Mapper";


class SidePanel extends Component<any, any>{

    state = {
        visible: true
    }

    render() {
        return(
            <div>
                <td>
                    <div>
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
                                <td>SHIFT + Arrow</td>
                                <td>Ramp to next floor (1:1)</td>
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
                                <td>L</td>
                                <td>Light</td>
                            </tr>
                            <tr>
                                <td>Number key (1-0)</td>
                                <td>Switch level</td>
                            </tr>
                            <tr>
                                <td>Square brackets ([ and ])</td>
                                <td>Switch level</td>
                            </tr>
                            <tr>
                                <td>~</td>
                                <td>Set current level as top level (places ceiling over all tiles)</td>
                            </tr>
                            </tbody>
                        </table>
                        <ul>
                            <li>Hover over a square to select it</li>
                            <li>Press the appropriate key to put a certain prefab there</li>
                            <li>Pressing the key again will remove it</li>
                            <li>Each square can hold 1 of everything, if desired</li>
                        </ul>

                        <p>Pro mapper tips</p>
                        <ul>
                            <li>Zoom out if your screen doesn't fit the whole grid</li>
                            <li>Seal off the inside of your map with walls</li>
                            <ul><li>If you don't do this, the map won't work</li></ul>
                            <li>Lighting is not necessary, but if you add 1 light, make sure to light the whole map</li>
                            <li>Doors take up the entire face of a wall</li>
                            <ul><li>If you make them intersect with a wall at the corner, it will still work, but will look bad</li></ul>
                            <li>Doors placed inside the same tile as a spawn room will only be usable by the team that owns the spawn</li>
                        </ul>


                    </div>
                </td>
            </div>
            )

    }
}


export default SidePanel