import {Counter} from "./Mapper";

/**
 * Each brush (called a "block" in this program) is represented in the VMF by only 6 sides.
 * Each side is composed of 3 points.
 * Each point is a grouping of x,y,z coordinates.
 *
 * You can create a Block with as little as a single Side and a "displacement"
 * which is the "vector" of displacement of the face opposite the face you provide should go.
 *
 * e.g. a Side at (-1,-1,0), (1,-1,0), (1,1,0) (fourth one is assumed at -1, 1) and a displacement of (0,0,32)
 * gives you a Block 32 thick that is sitting on top of the origin
 */
class Point{
    x: number
    y: number
    z: number

    constructor(x: number,y: number,z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    translate(x: number,y: number,z: number){
        this.x += x
        this.y += y
        this.z += z
        return this
    }

    dilate(factor: number){ // multiplies its distance from 0,0,0 by the dilation factor
        this.x *= factor
        this.y *= factor
        this.z *= factor
        return this
    }

    displacement(point: Point){
        return([this.x - point.x, this.y - point.y, this.z - point.z])
    }

    clone(){
        return new Point(this.x, this.y, this.z)
    }

    vmf(){
        return (`(${this.x} ${this.y} ${this.z})`)
    }
    pointsvmf(){
        return (`${this.x} ${this.y} ${this.z}`)
    }
}

class Side{
    bottomLeft: Point
    topLeft: Point
    topRight: Point

    constructor(p1: Point,p2: Point,p3: Point) {
        this.bottomLeft= p1.clone()
        this.topLeft = p2.clone()
        this.topRight = p3.clone()
    }

    translate(x: number,y: number,z: number){
        this.bottomLeft.translate(x,y,z)
        this.topLeft.translate(x,y,z)
        this.topRight.translate(x,y,z)
        return this
    }
    dilate(factor: number){
        this.bottomLeft.dilate(factor)
        this.topLeft.dilate(factor)
        this.topRight.dilate(factor)
        return this
    }

    fourthPoint(){
        var displacement = this.topRight.displacement(this.topLeft)
        const fourth = this.bottomLeft.clone().translate(displacement[0], displacement[1], displacement[2])
        return fourth
    }

    clone(){
        return (new Side(this.bottomLeft, this.topLeft, this.topRight))
    }

    vmf(id: number, material: string = "DEV/REFLECTIVITY_50", sideNumber: number) {

        // sideNumber is like 012345
        // represents the direction it faces, like north, or bottom

        const uvStrings = ["\"uaxis\" \"[1 0 0 0] 0.25\"\n" +
        "\t\t\t\"vaxis\" \"[0 -1 0 0] 0.25\"", "\"uaxis\" \"[1 0 0 0] 0.25\"\n" +
        "\t\t\t\"vaxis\" \"[0 -1 0 0] 0.25\"", "\"uaxis\" \"[0 1 0 0] 0.25\"\n" +
        "\t\t\t\"vaxis\" \"[0 0 -1 0] 0.25\"", "\"uaxis\" \"[1 0 0 0] 0.25\"\n" +
        "\t\t\t\"vaxis\" \"[0 0 -1 0] 0.25\"", "\"uaxis\" \"[0 1 0 0] 0.25\"\n" +
        "\t\t\t\"vaxis\" \"[0 0 -1 0] 0.25\"", "\"uaxis\" \"[1 0 0 0] 0.25\"\n" +
        "\t\t\t\"vaxis\" \"[0 0 -1 0] 0.25\""]

        return `
        side
    {
      "id" "${id}"
      "plane" "${this.bottomLeft.vmf()} ${this.topLeft.vmf()} ${this.topRight.vmf()}"
      "material" "${material}"
      ${uvStrings[sideNumber]}
      "rotation" "0"
      "lightmapscale" "16"
      "smoothing_groups" "0"
    }
`
    }
}

class Block {
    side1: Side
    side2: Side

    constructor(side: Side, displacement: number[]) {
        this.side1 = side.clone()

        this.side2 = new Side(
            side.bottomLeft.clone().translate(displacement[0], displacement[1], displacement[2]),
            side.fourthPoint().clone().translate(displacement[0], displacement[1], displacement[2]),
            side.topRight.clone().translate(displacement[0], displacement[1], displacement[2])
        )
    }

    dilate(factor: number){
        this.side1.dilate(factor)
        this.side2.dilate(factor)
        return this
    }

    translate(x: number,y: number,z: number){
        this.side1.translate(x,y,z)
        this.side2.translate(x,y,z)
        return this
    }

    vmf(counter: Counter, material:string = "DEV/REFLECTIVITY_50"){

        const side3 = new Side(this.side2.bottomLeft, this.side1.bottomLeft, this.side1.fourthPoint())
        const side4 = new Side(this.side1.topRight, this.side2.topRight, this.side2.topLeft)
        const side5 = new Side(this.side2.topRight, this.side1.topRight, this.side1.topLeft)
        const side6 = new Side(this.side1.topLeft, this.side1.bottomLeft, this.side2.bottomLeft)

        return  `
            solid
              {
                "id" "${counter.count()}"
                ${this.side1.vmf(counter.count(), material,0)}
                ${this.side2.vmf(counter.count(), material,1)}
                ${side3.vmf(counter.count(), material,2)}
                ${side4.vmf(counter.count(), material,3)}
                ${side5.vmf(counter.count(), material,4)}
                ${side6.vmf(counter.count(), material,5)}
                editor
                {
                  "color" "0 249 146"
                  "visgroupshown" "1"
                  "visgroupautoshown" "1"
                }
              }
        `
    }
}
function mapVmf(worldData: string, entitiesData: string) {
    return(
        `
                versioninfo
{
  "editorversion" "400"
  "editorbuild" "8610"
  "mapversion" "4"
  "formatversion" "100"
  "prefab" "0"
}
visgroups
{
}
viewsettings
{
  "bSnapToGrid" "1"
  "bShowGrid" "1"
  "bShowLogicalGrid" "0"
  "nGridSpacing" "64"
  "bShow3DGrid" "0"
}
world
{
  "id" "1"
  "mapversion" "4"
  "classname" "worldspawn"
  "detailmaterial" "detail/detailsprites"
  "detailvbsp" "detail.vbsp"
  "maxpropscreenwidth" "-1"
  "skyname" "sky_day01_01"
  
  ${worldData}
}

${entitiesData}

cameras
{
  "activecamera" "-1"
}
cordon
{
  "mins" "(-1024 -1024 -1024)"
  "maxs" "(1024 1024 1024)"
  "active" "0"
}


`)
}

const originPoint = new Point(0,0,0)
export {Point, Side, Block, mapVmf, originPoint}