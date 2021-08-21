import {SquareData} from "./SquareData";
import {mapVmf} from "./Geometry";


class Mapper{

    mapWidth: number
    mapHeight: number
    mapFloors: number

    rows: SquareData[][] = [] // this contains row arrays

    floors: SquareData[][][] = [] // THIS now contains everything

    constructor(width: number, height: number, levels: number) {
        this.mapWidth = width
        this.mapHeight = height
        this.mapFloors = levels

        this.floors = [] // this contains row arrays

        for (var z = 0; z < this.mapFloors; z++){
            var newfloor: SquareData[][] = []
            for (var y = 0; y < this.mapHeight; y++){
                var newrow: SquareData[] = []
                for (var x = 0; x < this.mapWidth; x++){
                    var data = new SquareData(x,y,z)
                    newrow[x] = data
                }
                newfloor[y] = newrow
            }
            this.floors[z] = newfloor
        }

    }

    clone():Mapper {
        const newmapper = new Mapper(this.mapWidth, this.mapHeight, this.mapFloors)
        newmapper.floors = this.floors.map(floor => floor.map(row => row.map(square => square.clone())))
        return newmapper;
    }

    mirror(x: number,y: number, z: number) {
        console.log(x,y,this.mapWidth,this.mapHeight )
        this.floors[z][this.mapHeight -1 - y][this.mapWidth -1 - x].mirrorValues(this.floors[z][y][x])
    }

    vmf(){

        const counter = new Counter()

        var worldString = ""
        for (let z = 0; z < this.mapHeight; z++){
            for (let i = 0; i < this.mapHeight; i++){
                for (let p = 0; p < this.mapWidth; p++){
                    let squareVmf = this.floors[z][i][p].generateSolidsVmf(counter)
                    worldString += squareVmf
                }
            }
        }
        var entitiesString = ""
        for (let z = 0; z < this.mapHeight; z++){
            for (let i = 0; i < this.mapHeight; i++){
                for (let p = 0; p < this.mapWidth; p++){
                    let squareVmf = this.floors[z][i][p].generateEntitiesVmf(counter)
                    entitiesString += squareVmf
                }
            }
        }
        const returnString = mapVmf(worldString, entitiesString)
        return returnString
    }
}

class Counter{
    runningCount: number

    constructor() {
        this.runningCount = 0
    }

    count(){
        this.runningCount++
        return this.runningCount
    }
}

export {Mapper, Counter}