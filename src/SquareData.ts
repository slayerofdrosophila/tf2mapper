import {Block, Point, Side} from "./Geometry";
import {Counter} from "./Mapper";


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
    hasSpawn: boolean = false

    hasNorthDoor: boolean = false
    hasSouthDoor: boolean = false
    hasEastDoor: boolean = false
    hasWestDoor: boolean = false

    spawnTeam: number = 2 // 2 = BLU; 3 = RED

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
        this.hasSpawn = other.hasSpawn

        this.hasNorthDoor = other.hasNorthDoor
        this.hasSouthDoor = other.hasSouthDoor
        this.hasEastDoor = other.hasEastDoor
        this.hasWestDoor = other.hasWestDoor

        if (this.spawnTeam == 2){
            other.spawnTeam = 3
        } if (this.spawnTeam == 3){
            other.spawnTeam = 2
        }

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
        newsq.hasSpawn = this.hasSpawn
        newsq.spawnTeam = this.spawnTeam

        newsq.hasNorthDoor = this.hasNorthDoor
        newsq.hasSouthDoor = this.hasSouthDoor
        newsq.hasEastDoor = this.hasEastDoor
        newsq.hasWestDoor = this.hasWestDoor



        return newsq
    }

    // move this to a more appropriate class later! like Side or something
    generateBlock(height: number, thickness: number, direction: string){
        const origin = new Point(0,0,0)
        const up = [0,0,height]
        const floorup = [0,0,thickness]

        const length = 256


        if (direction == "west" ){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -length, 0)
            const side = new Side(right, origin, backward)

            const wall = new Block(side, up)
            return wall
        }
        if (direction == "east"){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -length, 0)
            const side = new Side(right, origin, backward)

            const wall = new Block(side, up)
            wall.translate(length - thickness,0,0)
            return wall
        }
        if (direction == "north"){
            const down = new Point(-0,-thickness,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            const wall = new Block(side, up)
            return wall
        }
        if (direction == "south"){ // this is up n down wall
            const down = new Point(-0,-thickness,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            const wall = new Block(side, up)
            wall.translate(0,-length + thickness,0)
            return wall
        }
        if (direction == "floor"){ // this is up n down wall
            const down = new Point(-0,-length,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            const wall = new Block(side, floorup)
            return wall
        }
        if (direction == "sky" || direction == "ceiling"){ // this is up n down wall
            const down = new Point(-0,-length,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, origin, down)

            const wall = new Block(side, floorup)
            wall.translate(0,0,height - thickness)
            return wall
        }
        throw new Error("Invalid block direction: " + direction);


    }

    generateSolidsVmf(counter: Counter){

        const thickness = 32
        const height = 256
        const length = 256


        var walls = []

        if (this.hasWestWall ){
            walls[2] = this.generateBlock(height, thickness, "west")
        }
        if (this.hasEastWall){
            walls[3] = this.generateBlock(height, thickness, "east")
        }
        if (this.hasNorthWall){
            walls[0] = this.generateBlock(height, thickness, "north")
        }
        if (this.hasSouthWall){ // this is up n down wall

            walls[1] = this.generateBlock(height, thickness, "south")
        }
        if (this.hasFloor){ // this is up n down wall

            walls[4] = this.generateBlock(height, thickness, "floor")
        }
        if (this.hasSky){ // this is up n down wall

            walls[5] = this.generateBlock(height, thickness, "sky")
        }

        var bobby = ""

        walls.forEach(wall => {
            if (wall != null) {
                wall.translate(length * this.xCoord, length * -this.yCoord, 0)
                bobby += "//"
                bobby += wall.vmf(counter)
            }})
        return bobby
    }

    generateEntitiesVmf(counter: Counter) {
        const thickness = 32
        const height = 256
        const length = 256

        var returnString = ""

        const down = new Point(-0,-length,0)
        const right = new Point(length, 0, 0)
        const side = new Side(right, new Point(0,0,0), down)

        const block = new Block(side, [0,0,height])
        block.translate(length * this.xCoord, length * -this.yCoord, 0)

        if (this.hasSpawn){
            const spawnCenter = new Point(length/2, -length/2, thickness)
            spawnCenter.translate(length * this.xCoord, length * -this.yCoord, 16)

            returnString += `
                entity
                {
                  "id" "${counter.count()}"
                  "classname" "func_respawnroom"
                  "StartDisabled" "0"
                  "TeamNum" "0"
                    "id" "${counter.count()}"
                    ${block.vmf(counter, "TOOLS/TOOLSTRIGGER")}
                  editor
                  {
                    "color" "220 30 220"
                    "visgroupshown" "1"
                    "visgroupautoshown" "1"
                    "logicalpos" "[0 500]"
                  }
                }      
                            entity
                {
                  "id" "${counter.count()}"
                  "classname" "info_player_teamspawn"
                  "angles" "0 0 0"
                  "spawnflags" "511"
                  "TeamNum" "${this.spawnTeam}"
                  "origin" "${spawnCenter.pointsvmf()}"
                  editor
                  {
                    "color" "220 30 220"
                    "visgroupshown" "1"
                    "visgroupautoshown" "1"
                    "logicalpos" "[0 500]"
                  }
                }`
        } // end of hasSpawn block



        if (this.hasNorthDoor || this.hasSouthDoor || this.hasWestDoor || this.hasEastDoor){ // if has any doors?
            // make: door

            const doorOrigin = new Point(length/2, -length/2, thickness)
            doorOrigin.translate(length * this.xCoord, length * -this.yCoord, height/2) // move door to the right square's corner

            var doorBlock = null

            var doors: Block[] = []
            var doorTriggers: Block[] = []

            var filterString = ""
            var filterEntityString = ""

            if (this.hasSpawn){ // 2 = RED, 3 = BLU
                if (this.spawnTeam === 2){
                    filterString = "\"filtername\" \"filter_red\""  
                    filterEntityString = `
                        entity
                            {
                              "id" "21403"
                              "classname" "filter_activator_tfteam"
                              "Negated" "Allow entities that match criteria"
                              "targetname" "filter_red"
                              "TeamNum" "2"
                              "origin" "${doorOrigin.pointsvmf()}"
                              editor
                              {
                                "color" "220 30 220"
                                "visgroupshown" "1"
                                "visgroupautoshown" "1"
                                "logicalpos" "[1000 4000]"
                              }
                            }
                        `
                } if (this.spawnTeam === 3){
                    filterString = "\"filtername\" \"filter_blu\""
                    filterEntityString = `
                        entity
                            {
                              "id" "21403"
                              "classname" "filter_activator_tfteam"
                              "Negated" "Allow entities that match criteria"
                              "targetname" "filter_blu"
                              "TeamNum" "3"
                              "origin" "${doorOrigin.pointsvmf()}"
                              editor
                              {
                                "color" "220 30 220"
                                "visgroupshown" "1"
                                "visgroupautoshown" "1"
                                "logicalpos" "[1000 4000]"
                              }
                            }
                        `
                }
            }




            if (this.hasNorthDoor){
                doors[0] = this.generateBlock(height, thickness/2, "north")
                doorTriggers[0] = this.generateBlock(height,thickness * 10, "north" )
                doors[0].translate(length * this.xCoord, length * -this.yCoord, 0)
                doorTriggers[0].translate(length * this.xCoord, length * -this.yCoord + thickness*4.5, 0)
            }
            if (this.hasSouthDoor){
                doors[1] = this.generateBlock(height, thickness/2, "south")
                doorTriggers[1] = this.generateBlock(height,thickness * 10, "south" )
                doors[1].translate(length * this.xCoord, length * -this.yCoord, 0)
                doorTriggers[1].translate(length * this.xCoord, length * -this.yCoord - thickness*4.5, 0)
            }
            if (this.hasWestDoor){
                doors[2] = this.generateBlock(height, thickness/2, "west")
                doorTriggers[2] = this.generateBlock(height,thickness * 10, "west" )
                doors[2].translate(length * this.xCoord, length * -this.yCoord, 0)
                doorTriggers[2].translate(length * this.xCoord - thickness*4.5, length * -this.yCoord, 0)
            }
            if (this.hasEastDoor){
                doors[3] = this.generateBlock(height, thickness/2, "east")
                doorTriggers[3] = this.generateBlock(height,thickness * 10, "east" )
                doors[3].translate(length * this.xCoord, length * -this.yCoord, 0)
                doorTriggers[3].translate(length * this.xCoord + thickness*4.5, length * -this.yCoord, 0)
            }


            for (var i = 0; i < doors.length; i++){
                if (doors[i] != null){

                    const doorNumber = "door" + counter.count()

                    returnString +=
                        `
                            entity
                    {
                        "id" "${counter.count()}"
                        "classname" "func_door"
                        "disablereceiveshadows" "0"
                        "disableshadows" "0"
                        "dmg" "0"
                        "forceclosed" "0"
                        "health" "0"
                        "ignoredebris" "0"
                        "lip" "0"
                        "locked_sentence" "0"
                        "loopmovesound" "0"
                        "movedir" "0 0 0"
                        "origin" "${doorOrigin.pointsvmf()}"
                        "renderamt" "255"
                        "rendercolor" "255 255 255"
                        "renderfx" "0"
                        "rendermode" "0"
                        "spawnflags" "1024"
                        "spawnpos" "0"
                        "speed" "1000"
                        "targetname" "${doorNumber}"
                        "unlocked_sentence" "0"
                        "wait" "-1"
                        
                        ${doors[i].vmf(counter, "METAL/METALDOOR001")} 
                        // this increments counter by 7
                        
                        editor
                        {
                            "color" "220 30 220"
                            "visgroupshown" "1"
                            "visgroupautoshown" "1"
                            "logicalpos" "[0 500]"
                        }
                    }
                    
                    entity
                    {
                      "id" "${counter.count()}" 
                      "classname" "trigger_multiple"
                      ${filterString}
                      "origin" "0 0 96"
                      "spawnflags" "1"
                      "StartDisabled" "0"
                      "targetname" "${doorNumber}"
                      "wait" "-1"
                      connections
                      {
                        "OnStartTouchAll" "${doorNumber},Open,,0,-1"
                        "OnEndTouchAll" "${doorNumber},Close,,0,-1"
                      }
                      
                      ${doorTriggers[i].vmf(counter, "TOOLS/TOOLSTRIGGER")}
                      
                                            editor
                          {
                            "color" "220 30 220"
                            "visgroupshown" "1"
                            "visgroupautoshown" "1"
                            "logicalpos" "[0 500]"
                          }
                    }
                    
                    ${filterEntityString}
                    
                    `
                }

            }

        } // end of hasNorthDoor block


        return returnString
    }

    createDoor(counter: Counter, direction: string, height: number, length: number, thickness: number){
        if (direction == "north"){
            const doorOrigin = new Point(length/2, -length/2, thickness)
            doorOrigin.translate(length * this.xCoord, length * -this.yCoord, height/2)
            const doorBlock = this.generateBlock(height, thickness / 2, "north")
        }

    }
}


export{SquareData}