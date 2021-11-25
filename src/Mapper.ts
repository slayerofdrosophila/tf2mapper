import {SquareData} from "./SquareData";
import {mapVmf} from "./Geometry";

/**
 * The Mapper class
 * Performs few functions, only exists to hold everything.
 *
 * This file also contains the Counter class, which has one function (returns number and increments the number)
 * Only one counter is created which is then passed around everywhere so that each brush face / entity has a unique id
 * Kind of clunky but idk what else
 *
 * To find out about how it makes the file, go to the vmf() function
 * and look for usages of generateSolidsVmf()
 * Also look for generateEntitiesVmf and generateCeilingVmf
 */
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

    /**
     * Load function.
     * Says "any" but should be a .json file (with the Mapper object in it)
     * @param obj
     */
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

    /**
     * This calls a bunch of stuff and returns a gigantic string that is the entire vmf file.
     * For each square, it calls generateSolidsVmf().
     * Then it iterates again and calls generateEntitiesVmf() for each square.
     *
     * The mapVmf() function call at the end pastes some header / footer VMF ... thingies.
     * These are essential to the vmf file. (Maybe not the bottom part, but better to be safe)
     */
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

    leakCheck(){

        let impossible:SquareData = new SquareData(-1,-1,-1,false)
        let sq: SquareData = impossible
        console.log("heihgt " + this.mapHeight + " width " + this.mapWidth + " floots " + this.mapFloors)
        for (let zz = 0; zz < this.mapFloors; zz++){
                for (let ii = 0; ii < this.mapHeight; ii++){
                        for (let pp = 0; pp < this.mapWidth; pp++){
                            this.floors[zz][ii][pp].visited = false
                        }
                }
        }

        Loop1:
        for (let z = 0; z < this.mapFloors; z++){
            Loop2:
            for (let y = 0; y < this.mapHeight; y++){
                Loop3:
                for (let p = 0; p < this.mapWidth; p++){
                    if (this.floors[z][y][p].hasSpawn){
                        // this means it MUST have an entity.
                        // And it hopefully wont be enclosed in walls.
                        sq = this.floors[z][y][p]
                        break Loop1
                    }
                }
            }
        }
        // recursion?? lol
        if (sq == impossible){
            return true // this happens when there's no spawn rooms. So it cannot leak because it's not really finished.
        } else{
            let res = this.findLeak(sq)
            return res
        }
    }

    /**
     * Attempting to recurisvely find leaks.
     * Yes, this is a bad way to do it.
     * False = leaks
     * @param sq
     */
    findLeak(sq: SquareData): boolean {

        if (sq.visited){
            return true
        }

        /**
         * Important notes:
         * mapWidth / mapHeight / mapFloors are 1-indexed
         * xCoord / yCoord / zCoord are 0-indexed
         */

        // base cases
        sq.visited = true
        if (sq.xCoord === 0 && sq.hasWestWall === false){ // Left side
            return false
        }
        if (sq.xCoord === this.mapWidth - 1 && sq.hasEastWall === false){ // if at right edge of map and we can escape
            return false
        }
        if (sq.yCoord === 0 && sq.hasNorthWall === false){ // top of map
            return false
        }
        if (sq.yCoord === this.mapHeight && sq.hasSouthWall === false){ // bottom of map
            return false
        }
        if (sq.zCoord === this.mapFloors ){
            if (sq.hasCeiling === false && sq.zCoord !== this.topFloor){ // if at top and no roof
                return false
            }
        }
        if (sq.zCoord === 0 && sq.hasFloor === false){
            return false
        }
        let east = true
        let west = true
        let north = true
        let south = true
        let up = true
        let down = true
        // recursive cases
        // if 1. the search wont go out of bounds and
        // (2. the square doesnt have a wall there or 3. the adjacent square doesnt have a wall there)
        // then search that adjacent square
        if (sq.xCoord > 0 && (!sq.hasWestWall && !this.floors[sq.zCoord][sq.yCoord][sq.xCoord - 1].hasEastWall)){
            west = this.findLeak(this.floors[sq.zCoord][sq.yCoord][sq.xCoord - 1])
        }
        if (sq.xCoord < this.mapWidth - 1 && (!sq.hasEastWall && !this.floors[sq.zCoord][sq.yCoord][sq.xCoord + 1].hasWestWall)){
            east = this.findLeak(this.floors[sq.zCoord][sq.yCoord][sq.xCoord + 1])
        }
        if (sq.yCoord > 0 && (!sq.hasNorthWall && !this.floors[sq.zCoord][sq.yCoord - 1][sq.xCoord].hasSouthWall)){
            south = this.findLeak(this.floors[sq.zCoord][sq.yCoord - 1][sq.xCoord])
        }
        if (sq.yCoord < this.mapHeight - 1 && (!sq.hasSouthWall && !this.floors[sq.zCoord][sq.yCoord + 1][sq.xCoord].hasNorthWall)){
            north = this.findLeak(this.floors[sq.zCoord][sq.yCoord + 1][sq.xCoord])
        }
        if (sq.zCoord !== this.topFloor && !(sq.hasSky)){ // thing aboive has no floor
            if (!this.floors[sq.zCoord + 1][sq.yCoord][sq.xCoord].hasFloor){
                up = this.findLeak(this.floors[sq.zCoord + 1][sq.yCoord][sq.xCoord])
                }
            }
        if (sq.zCoord < this.mapFloors && !(sq.hasFloor) && sq.zCoord > 0){
            if (!this.floors[sq.zCoord - 1][sq.yCoord][sq.xCoord].hasSky){
                down = this.findLeak(this.floors[sq.zCoord - 1][sq.yCoord][sq.xCoord])
            }
        }
        if (north && south && east && west && up && down){
            return true
        } else{
            return false
        }
    }
}

/**
 * Every brush face needs a unique ID. Every entity also does too.
 * This was my "solution".
 */
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