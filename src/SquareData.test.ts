import {SquareData} from "./SquareData";
import "./Geometry";
import {Point, Block, Side} from "./Geometry";
import {Mapper} from "./Mapper";

const mapper = new Mapper(5,5)

mapper.rows[0][0].hasNorthWall = true
mapper.rows[0][0].hasWestWall = true
mapper.rows[4][2].hasEastWall = true

console.log(mapper.vmf())

const sd = new SquareData(0,0)
const sd2 = new SquareData(1,0)

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