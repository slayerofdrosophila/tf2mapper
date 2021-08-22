import {SquareData} from "./SquareData";
import {mapVmf} from "./Geometry";


class Mapper{

    mapWidth: number
    mapHeight: number
    mapFloors: number

    rows: SquareData[][] = [] // this contains row arrays

    floors: SquareData[][][] = [] // THIS now contains everything

    topFloor: number

    constructor(width: number, height: number, levels: number) {
        this.mapWidth = width
        this.mapHeight = height
        this.mapFloors = levels

        this.floors = [] // this contains row arrays
        this.topFloor = 0

        for (var z = 0; z < this.mapFloors; z++){
            var newfloor: SquareData[][] = []
            let lastFloor = false
            if (z == this.mapFloors - 1){
                lastFloor = true
            }
            for (var y = 0; y < this.mapHeight; y++){
                var newrow: SquareData[] = []
                for (var x = 0; x < this.mapWidth; x++){
                    var data = new SquareData(x,y,z,lastFloor)
                    newrow[x] = data
                }
                newfloor[y] = newrow
            }
            this.floors[z] = newfloor
        }

    }

    static fromJSON(obj:any):Mapper {
        const m = Object.create(Mapper.prototype)
        const floors:any[][][] = obj.floors
        Object.assign(m, obj, {floors: floors.map(rows => rows.map( row => row.map( square => SquareData.fromJSON(square))))})
        return m
    }

    clone():Mapper {
        const newmapper = new Mapper(this.mapWidth, this.mapHeight, this.mapFloors)
        newmapper.floors = this.floors.map(floor => floor.map(row => row.map(square => square.clone())))
        newmapper.topFloor = this.topFloor
        return newmapper;
    }

    mirror(x: number,y: number, z: number) {
        console.log(x,y,this.mapWidth,this.mapHeight )
        this.floors[z][this.mapHeight -1 - y][this.mapWidth -1 - x].mirrorValues(this.floors[z][y][x])
    }

    vmf(){

        const counter = new Counter()

        var worldString = ""
        for (let z = 0; z < this.mapFloors; z++){
            for (let i = 0; i < this.mapHeight; i++){
                for (let p = 0; p < this.mapWidth; p++){
                    let squareVmf = this.floors[z][i][p].generateSolidsVmf(counter)
                    worldString += squareVmf
                }
            }
        }
        worldString += this.floors[this.topFloor][this.mapHeight - 1][this.mapWidth - 1].generateCeiling().vmf(counter, "DEV/REFLECTIVITY_50") // default texture

        var entitiesString = ""
        for (let z = 0; z < this.mapFloors; z++){
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