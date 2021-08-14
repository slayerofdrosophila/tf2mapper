import {Point, Side, Wall} from "./Geometry";


class SquareData{

    xCoord = -1
    yCoord = -1

    hasNorthWall: boolean = false
    hasSouthWall: boolean = false
    hasEastWall: boolean = false
    hasWestWall: boolean = false
    hasFloor: boolean = true
    hasSky: boolean = true

    hasHealth: boolean = false
    hasPit: boolean = false
    hasPoint: boolean = false
    hasSpwan: boolean = false

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
        this.hasFloor = other.hasFloor
        this.hasSky = other.hasSky
        this.hasSpwan = other.hasSpwan
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
        newsq.hasFloor = this.hasFloor
        newsq.hasSky = this.hasSky
        newsq.hasSpwan = this.hasSpwan
        return newsq
    }

    generateSolidsVmf(id: number){
        // origin
        // thickness
        // length
        // height

        const thickness = 32
        const height = 256
        const length = 256

        const origin = new Point(0,0,0)
        const up = [0,0,height]
        const floorup = [0,0,thickness]

        var walls = []

        if (this.hasWestWall ){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -length, 0)
            const side = new Side(right, origin, backward)

            const wallWest = new Wall(side, up)
            walls[2] = wallWest
        }
        if (this.hasEastWall){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -length, 0)
            const side = new Side(right, origin, backward)

            const wallEast = new Wall(side, up)
            wallEast.translate(length - thickness,0,0)
            walls[3] = wallEast
        }
        if (this.hasNorthWall){
            const down = new Point(-0,-thickness,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            const wallNorth = new Wall(side, up)
            walls[0] = wallNorth
        }
        if (this.hasSouthWall){ // this is up n down wall
            const down = new Point(-0,-thickness,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            const wallSouth = new Wall(side, up)
            wallSouth.translate(0,-length + thickness,0)
            walls[1] = wallSouth
        }
        if (this.hasFloor){ // this is up n down wall
            const down = new Point(-0,-length,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            const floor = new Wall(side, floorup)
            walls[4] = floor
        }
        if (this.hasSky){ // this is up n down wall
            const down = new Point(-0,-length,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            const sky = new Wall(side, floorup)
            sky.translate(0,0,height - thickness)
            walls[5] = sky
        }

        var bobby = ""

        walls.forEach(wall => {
            if (wall != null) {
                wall.translate(length * this.xCoord, length * -this.yCoord, 0)
                bobby += wall.vmf(id)
                id += 6
            }})
        return bobby
    }

    generateEntitiesVmf(id: number) {
        const thickness = 32
        const height = 256
        const length = 256
        var bobby = ""
        if (this.hasSpwan){
            const spawnCenter = new Point(length/2, -length/2, thickness)
            spawnCenter.translate(length * this.xCoord, length * -this.yCoord, 0)
            bobby += `entity
{
  "id" "3"
  "classname" "info_player_teamspawn"
  "angles" "0 0 0"
  "spawnflags" "511"
  "origin" "${spawnCenter.pointsvmf()}"
  editor
  {
    "color" "220 30 220"
    "visgroupshown" "1"
    "visgroupautoshown" "1"
    "logicalpos" "[0 500]"
  }
}`
        }
        return bobby
    }
}


export{SquareData}