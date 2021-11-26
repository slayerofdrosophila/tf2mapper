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

const mapstr = JSON.stringify(mapper)
const newmapper = Mapper.fromJSON(JSON.parse(mapstr))

appendFile("testdata1.vmf",newmapper.vmf(), function (err){
    if (err) throw err;
    console.log("saved!!")
})


