import {SquareData} from "./SquareData";
import "./Geometry";
import {Point, Block, Side} from "./Geometry";
import {Mapper} from "./Mapper";

import "fs"
import {appendFile} from "fs";

const mapper = new Mapper(1,1,1)

mapper.rows[0][0].hasNorthWall = false
mapper.rows[0][0].hasEastWall = false
mapper.rows[0][0].hasNorthDoor = true
mapper.rows[0][0].hasSpawn = true

appendFile("testdata1.vmf",mapper.vmf(), function (err){
    if (err) throw err;
    console.log("saved!!")
})

const sd = new SquareData(0,0,0)
const sd2 = new SquareData(1,0,0)

//  forward
//  |
// up
// origin -- right0


// const wall1 = sd.generateVmf("west")
// const wall2 = sd.generateVmf("south")
//
// const wall3 = sd2.generateVmf("east")
//
// console.log(wall1.vmf(1))
// console.log(wall2.vmf(7))
// console.log(wall3.vmf(13))