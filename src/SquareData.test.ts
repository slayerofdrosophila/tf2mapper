import {SquareData} from "./SquareData";
import "./Geometry";
import {Point, Block, Side} from "./Geometry";
import {Mapper} from "./Mapper";

import "fs"
import {appendFile} from "fs";

const mapper = new Mapper(1,1,1)

mapper.floors[0][0][0].hasNorthRamp = true
mapper.floors[0][0][0].hasEastWall = false
mapper.floors[0][0][0].hasNorthDoor = true
mapper.floors[0][0][0].hasSpawn = true

appendFile("testdata1.vmf",mapper.vmf(), function (err){
    if (err) throw err;
    console.log("saved!!")
})

appendFile("testdata1.json",JSON.stringify(mapper), function (err){
    if (err) throw err;
    console.log("saved!!")
})
