import {Block, originPoint, Point, Side} from "./Geometry";
import {Counter} from "./Mapper";
import {spawn} from "child_process";

const length = 256
const height = 256

class SquareData{

    xCoord = -1
    yCoord = -1
    zCoord = 0

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

    spawnTeam: number = 2 // 3 = BLU; 2 = RED

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

        this.hasNorthDoor = other.hasSouthDoor
        this.hasSouthDoor = other.hasNorthDoor
        this.hasEastDoor = other.hasWestDoor
        this.hasWestDoor = other.hasEastDoor

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

    translate(item: Block){
        return item.translate(length * this.xCoord, length * -this.yCoord, 0)
    }
    translatePoint(item: Point){
        return item.translate(length * this.xCoord, length * -this.yCoord, 0)
    }

    // move this to a more appropriate class later! like Side or something
    generateBlock(height: number, thickness: number, direction: string){

        const up = [0,0,height]
        const floorup = [0,0,thickness]

        if (direction == "west" ){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -length, 0)
            const side = new Side(right, originPoint, backward)

            const wall = new Block(side, up)
            return wall
        }
        if (direction == "east"){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -length, 0)
            const side = new Side(right, originPoint, backward)

            const wall = new Block(side, up)
            wall.translate(length - thickness,0,0)
            return wall
        }
        if (direction == "north"){
            const down = new Point(-0,-thickness,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, originPoint, down)

            const wall = new Block(side, up)
            return wall
        }
        if (direction == "south"){ // this is up n down wall
            const down = new Point(-0,-thickness,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, originPoint, down)

            const wall = new Block(side, up)
            wall.translate(0,-length + thickness,0)
            return wall
        }
        if (direction == "floor"){ // this is up n down wall
            const down = new Point(-0,-length,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, originPoint, down)

            const wall = new Block(side, floorup)
            return wall
        }
        if (direction == "sky" || direction == "ceiling"){ // this is up n down wall
            const down = new Point(-0,-length,0)
            const right = new Point(length, 0, 0)
            const side = new Side(right, originPoint, down)

            const wall = new Block(side, floorup)
            wall.translate(0,0,height - thickness)
            return wall
        }
        if (direction == "almostfill"){
            const down = new Point(1, -length + 1, 1)
            const origin2 = new Point(1,-1,1)
            const right = new Point(length-1, -1,1)
            const side = new Side(right, origin2, down)
            const wall = new Block(side, [0,0,(height-2)])

            return wall
        }
        if (direction == "westcabinet"){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -height, 0)
            const side = new Side(right, originPoint, backward)

            const wall = new Block(side, up)
            wall.translate(0,0,thickness)
            return wall
        }
        if (direction == "eastcabinet"){
            const right = new Point(thickness,0,0)
            const backward = new Point(0, -height, 0)
            const side = new Side(right, originPoint, backward)

            const wall = new Block(side, up)
            wall.translate(length - thickness,-length + thickness*1.5,thickness)
            return wall
        }

        throw new Error("Invalid block direction: " + direction);


    }

    generateSolidsVmf(counter: Counter){

        const thickness = 32

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

        var returnString = ""

        const down = new Point(-0,-length,0)
        const right = new Point(length, 0, 0)
        const side = new Side(right, new Point(0,0,0), down)

        const block = new Block(side, [0,0,height])
        block.translate(length * this.xCoord, length * -this.yCoord, 0)

        if (this.hasSpawn){
            const spawnCenter = new Point(length/2, -length/2, thickness)
            spawnCenter.translate(length * this.xCoord, length * -this.yCoord, 16)

            const spawnName = "spawn" + counter.count()

            const resupName = "resupply" + counter.count()

            let cabinetDisp: [number,number,number] = [16,-48,thickness]
            if (this.spawnTeam == 2){
                cabinetDisp = [length-16,-length+48,thickness]
            }

            let cabinetDirection = "westcabinet"
            if (this.spawnTeam == 2){
                cabinetDirection = "eastcabinet"
            }

            let spawnAngles = "0 0 0" // this faces east
            if (this.spawnTeam == 2){
                spawnAngles = "0 180 0" // this faces west
            }

            returnString += `
                entity
                {
                  "id" "${counter.count()}"
                  "classname" "func_respawnroom"
                  "StartDisabled" "0"
                  "TeamNum" "0"
                    "id" "${spawnName}"
                    ${block.vmf(counter, "TOOLS/TOOLSTRIGGER")}
                  editor
                  {
                    "color" "220 30 220"
                    "visgroupshown" "1"
                    "visgroupautoshown" "1"
                    "logicalpos" "[0 500]"
                  }
                }      
                
                // this is the spawn poijnt
                            entity
                {
                  "id" "${counter.count()}"
                  "classname" "info_player_teamspawn"
                  "angles" "${spawnAngles}"
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
                }
                
                // now for the visualizer
                entity
                    {
                      "id" "13"
                      "classname" "func_respawnroomvisualizer"
                      "disablereceiveshadows" "0"
                      "disableshadows" "0"
                      "InputFilter" "0"
                      "origin" "0 0 96"
                      "renderamt" "255"
                      "rendercolor" "255 255 255"
                      "renderfx" "0"
                      "rendermode" "0"
                      "respawnroomname" "${spawnName}"
                      "solid_to_enemies" "1"
                      "Solidity" "1"
                      "spawnflags" "2"
                      "StartDisabled" "0"
                      "targetname" "door1"
                      "vrad_brush_cast_shadows" "0"
                      ${this.translate(this.generateBlock(height, thickness, "almostfill")).vmf(counter, "OVERLAYS/NO_ENTRY")}
                      editor
                        {
                            "color" "220 30 220"
                            "visgroupshown" "1"
                            "visgroupautoshown" "1"
                            "logicalpos" "[0 500]"
                          }
                        }
                        
                        // now for the cabinet
                        // this is locker
                        entity
                        {
                        "id" "${counter.count()}"
                        "classname" "prop_dynamic"
                        "angles" "${spawnAngles}"
                        "DisableBoneFollowers" "0"
                        "disablereceiveshadows" "0"
                        "disableshadows" "0"
                        "ExplodeDamage" "0"
                        "ExplodeRadius" "0"
                        "fademaxdist" "0"
                        "fademindist" "-1"
                        "fadescale" "1"
                        "MaxAnimTime" "10"
                        "maxdxlevel" "0"
                        "MinAnimTime" "5"
                        "mindxlevel" "0"
                        "model" "models/props_gameplay/resupply_locker.mdl"
                        "modelscale" "1.0"
                        "PerformanceMode" "0"
                        "pressuredelay" "0"
                        "RandomAnimation" "0"
                        "renderamt" "255"
                        "rendercolor" "255 255 255"
                        "renderfx" "0"
                        "rendermode" "0"
                        "SetBodyGroup" "0"
                        "skin" "0"
                        "solid" "6"
                        "spawnflags" "0"
                        "targetname" "${resupName}"
                        "origin" "${this.translatePoint(originPoint.clone()).translate(...cabinetDisp).pointsvmf()}"
                        editor
                        {
                        "color" "220 30 220"
                        "visgroupshown" "1"
                        "visgroupautoshown" "1"
                        "logicalpos" "[0 0]"
                        }
                        }
                        
                        // for the regen volume
                        entity
                        {
                        "id" "${counter.count()}"
                        "classname" "func_regenerate"
                        "associatedmodel" "${resupName}"
                        "StartDisabled" "0"
                        "TeamNum" "0"
                        ${this.translate(this.generateBlock(96, 64, cabinetDirection)).vmf(counter, "TOOLS/TOOLSTRIGGER")}
                        editor
                        {
                        "color" "220 30 220"
                        "visgroupshown" "1"
                        "visgroupautoshown" "1"
                        "logicalpos" "[0 1500]"
                        }
                        }
                `
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
                doorTriggers[0] = this.generateBlock(height,thickness * 6, "north" )
                doors[0].translate(length * this.xCoord, length * -this.yCoord, 0)
                doorTriggers[0].translate(length * this.xCoord, length * -this.yCoord + thickness*3, 0)
            }
            if (this.hasSouthDoor){
                doors[1] = this.generateBlock(height, thickness/2, "south")
                doorTriggers[1] = this.generateBlock(height,thickness * 6, "south" )
                doors[1].translate(length * this.xCoord, length * -this.yCoord, 0)
                doorTriggers[1].translate(length * this.xCoord, length * -this.yCoord - thickness*3, 0)
            }
            if (this.hasWestDoor){
                doors[2] = this.generateBlock(height, thickness/2, "west")
                doorTriggers[2] = this.generateBlock(height,thickness * 6, "west" )
                doors[2].translate(length * this.xCoord, length * -this.yCoord, 0)
                doorTriggers[2].translate(length * this.xCoord - thickness*3, length * -this.yCoord, 0)
            }
            if (this.hasEastDoor){
                doors[3] = this.generateBlock(height, thickness/2, "east")
                doorTriggers[3] = this.generateBlock(height,thickness * 6, "east" )
                doors[3].translate(length * this.xCoord, length * -this.yCoord, 0)
                doorTriggers[3].translate(length * this.xCoord + thickness*3, length * -this.yCoord, 0)
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
                        "movedir" "-90 0 0"
                        "origin" "${doorOrigin.pointsvmf()}"
                        "renderamt" "255"
                        "rendercolor" "255 255 255"
                        "renderfx" "0"
                        "rendermode" "0"
                        "spawnflags" "0"
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
                      "targetname" "${"trigger"+doorNumber}"
                      "wait" "1"
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

        if (this.hasPoint){
            // 1st is the block, then the other stuff

            const center = new Point(this.xCoord*length + length/2, -this.yCoord*length -length/2, this.zCoord*length + thickness)

            returnString += `
            entity
                {
                "id" "${counter.count()}"
                "classname" "trigger_capture_area"
                "area_cap_point" "cp_koth"
                "area_time_to_cap" "10"
                "StartDisabled" "0"
                "team_cancap_2" "1"
                "team_cancap_3" "1"
                "team_numcap_2" "1"
                "team_numcap_3" "1"
                "team_spawn_2" "0"
                "team_spawn_3" "0"
                "team_startcap_2" "1"
                "team_startcap_3" "1"
                connections
                {
                "OnCapTeam1" "cp_koth_prop,Skin,1,0,-1"
                "OnCapTeam2" "cp_koth_prop,Skin,2,0,-1"
                "OnCapTeam1" "koth_gamerules,SetRedKothClockActive,,0,-1"
                "OnCapTeam2" "koth_gamerules,SetBlueKothClockActive,,0,-1"
                "OnCapTeam1" "koth_gamerules,SetRedTeamRespawnWaveTime,8,0,-1"
                "OnCapTeam1" "koth_gamerules,SetBlueTeamRespawnWaveTime,4,0,-1"
                "OnCapTeam2" "koth_gamerules,SetRedTeamRespawnWaveTime,4,0,-1"
                "OnCapTeam2" "koth_gamerules,SetBlueTeamRespawnWaveTime,8,0,-1"
                }
                ${this.generateBlock(height, thickness, "almostfill").translate(length * this.xCoord, length * -this.yCoord, 0).vmf(counter, "TOOLS/TOOLSTRIGGER")}
                editor
                {
                "color" "220 30 220"
                // comment
                "visgroupshown" "1"
                "visgroupautoshown" "1"
                "logicalpos" "[0 1000]"
                }
                }
                
                // now for the other random stuff
                
                entity
                {
                "id" "${counter.count()}"
                "classname" "tf_gamerules"
                "ctf_overtime" "1"
                "hud_type" "0"
                "targetname" "koth_gamerules"
                "origin" "${center.pointsvmf()}"
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
                "classname" "logic_auto"
                "spawnflags" "1"
                connections
                {
                "OnMultiNewRound" "koth_gamerules,SetRedTeamRespawnWaveTime,6,0,-1"
                "OnMultiNewRound" "koth_gamerules,SetBlueTeamRespawnWaveTime,6,0,-1"
                "OnMultiNewRound" "koth_gamerules,SetRedTeamGoalString,#KOTH_SETUP_GOAL,0,-1"
                "OnMultiNewRound" "koth_gamerules,SetBlueTeamGoalString,#KOTH_SETUP_GOAL,0,-1"
                }
                "origin" "${center.pointsvmf()}"
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
                "classname" "tf_logic_koth"
                "timer_length" "180"
                "unlock_point" "30"
                "origin" "${center.pointsvmf()}"
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
                "classname" "team_control_point_master"
                "cpm_restrict_team_cap_win" "0"
                "custom_position_x" "-1"
                "custom_position_y" "-1"
                "partial_cap_points_rate" "0"
                "play_all_rounds" "0"
                "score_style" "0"
                "StartDisabled" "0"
                "switch_teams" "0"
                "team_base_icon_2" "sprites/obj_icons/icon_base_red"
                "team_base_icon_3" "sprites/obj_icons/icon_base_blu"
                "origin" "${center.pointsvmf()}"
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
                "classname" "prop_dynamic"
                "angles" "0 0 0"
                "DisableBoneFollowers" "0"
                "disablereceiveshadows" "0"
                "disableshadows" "0"
                "ExplodeDamage" "0"
                "ExplodeRadius" "0"
                "fademaxdist" "0"
                "fademindist" "-1"
                "fadescale" "1"
                "MaxAnimTime" "10"
                "maxdxlevel" "0"
                "MinAnimTime" "5"
                "mindxlevel" "0"
                "model" "models/props_gameplay/cap_point_base.mdl"
                "modelscale" "1.0"
                "PerformanceMode" "0"
                "pressuredelay" "0"
                "RandomAnimation" "0"
                "renderamt" "255"
                "rendercolor" "255 255 255"
                "renderfx" "0"
                "rendermode" "0"
                "SetBodyGroup" "0"
                "skin" "0"
                "solid" "6"
                "spawnflags" "0"
                "StartDisabled" "0"
                "targetname" "cp_koth_prop"
                "origin" "${center.pointsvmf()}"
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
                "classname" "team_control_point"
                "angles" "0 0 0"
                "point_default_owner" "0"
                "point_group" "0"
                "point_index" "0"
                "point_printname" "Control Point"
                "point_start_locked" "0"
                "point_warn_on_cap" "0"
                "point_warn_sound" "ControlPoint.CaptureWarn"
                "random_owner_on_restart" "0"
                "spawnflags" "0"
                "StartDisabled" "0"
                "targetname" "cp_koth"
                "team_bodygroup_0" "3"
                "team_bodygroup_2" "1"
                "team_bodygroup_3" "1"
                "team_icon_0" "sprites/obj_icons/icon_obj_neutral"
                "team_icon_2" "sprites/obj_icons/icon_obj_red"
                "team_icon_3" "sprites/obj_icons/icon_obj_blu"
                "team_model_0" "models/effects/cappoint_hologram.mdl"
                "team_model_2" "models/effects/cappoint_hologram.mdl"
                "team_model_3" "models/effects/cappoint_hologram.mdl"
                "team_timedpoints_2" "0"
                "team_timedpoints_3" "0"
                "origin" "${center.pointsvmf()}"
                editor
                {
                "color" "220 30 220"
                "visgroupshown" "1"
                "visgroupautoshown" "1"
                "logicalpos" "[0 500]"
                }
                }
            `
        }

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