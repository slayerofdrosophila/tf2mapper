

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

    vmf(id: number){
        return `
        side
    {
      "id" "${id}"
      "plane" "${this.bottomLeft.vmf()} ${this.topLeft.vmf()} ${this.topRight.vmf()}"
      "material" "DEV/REFLECTIVITY_50"
      "uaxis" "[1 0 0 0] 0.25"
      "vaxis" "[0 -1 0 0] 0.25"
      "rotation" "0"
      "lightmapscale" "16"
      "smoothing_groups" "0"
    }
`
    }
}

class Wall{
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

    vmf(id: number){

        const side3 = new Side(this.side2.bottomLeft, this.side1.bottomLeft, this.side1.fourthPoint())
        const side4 = new Side(this.side1.topRight, this.side2.topRight, this.side2.topLeft)
        const side5 = new Side(this.side2.topRight, this.side1.topRight, this.side1.topLeft)
        const side6 = new Side(this.side1.topLeft, this.side1.bottomLeft, this.side2.bottomLeft)

        return  `
        solid
  {
    "id" "${id}"
    ${this.side1.vmf(1)}
    ${this.side2.vmf(2)}
    ${side3.vmf(3)}
    ${side4.vmf(4)}
    ${side5.vmf(5)}
    ${side6.vmf(6)}
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


${worldVmf(worldData)}
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
function worldVmf(worldData: string){
    return(`
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
`
    )
} 

export {Point, Side, Wall, mapVmf}