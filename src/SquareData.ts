import {Point, Side, Wall} from "./Geometry";


class SquareData{

    xCoord = -1
    yCoord = -1

    hasNorthWall: boolean = false
    hasSouthWall: boolean = false
    hasEastWall: boolean = false
    hasWestWall: boolean = false

    hasHealth: boolean = false
    hasPit: boolean = false
    hasPoint: boolean = false

    constructor(x: number,y: number) {
        this.yCoord = y
        this.xCoord = x
    }
    mirrorValues(other:SquareData) {
        this.hasNorthWall = other.hasSouthWall
        this.hasSouthWall = other.hasNorthWall
        this.hasEastWall = other.hasWestWall
        this.hasWestWall = other.hasEastWall

        this.hasHealth = other.hasHealth
        this.hasPit = other.hasPit
        this.hasPoint = other.hasPoint
    }
    clone():SquareData {
        const newsq = new SquareData(this.xCoord, this.yCoord)
        newsq.hasNorthWall = this.hasNorthWall
        newsq.hasSouthWall = this.hasSouthWall
        newsq.hasEastWall = this.hasEastWall
        newsq.hasWestWall = this.hasWestWall

        newsq.hasHealth = this.hasHealth
        newsq.hasPit = this.hasPit
        newsq.hasPoint = this.hasPoint
        return newsq
    }
    
    generateVmf(mode: string, id: number){
        // origin
        // thickness
        // length
        // height

        const thickness = 32
        const height = 256
        const length = 256

        const origin = new Point(0,0,0)
        const up = [0,0,height]

        var wallNorth = null
        var wallSouth = null
        var wallWest = null
        var wallEast = null

        var walls = []

        if (mode === "west" ){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -length, 0)
            const side = new Side(right, origin, backward)

            wallWest = new Wall(side, up)
            walls[2] = wallWest
        }
        if (mode === "east"){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -length, 0)
            const side = new Side(right, origin, backward)

            wallEast = new Wall(side, up)
            wallEast.translate(length - thickness,0,0)
            walls[3] = wallEast
        }
        if (mode === "north"){
            const down = new Point(-0,-thickness,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            wallNorth = new Wall(side, up)
            walls[0] = wallNorth
        }
        if (mode === "south"){ // this is up n down wall
            const down = new Point(-0,-thickness,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            wallSouth = new Wall(side, up)
            wallSouth.translate(0,-length + thickness,0)
            walls[1] = wallSouth
        }


        walls.forEach(wall => wall.translate(length * this.xCoord, length * this.yCoord, 0))
        return walls
    }
}

export{SquareData}