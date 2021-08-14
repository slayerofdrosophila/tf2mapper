import {SquareData} from "./SquareData";


class Mapper{

    mapWidth: number
    mapHeight: number

    rows: SquareData[][] = [] // this contains row arrays

    constructor(width: number, height: number) {
        this.mapWidth = width
        this.mapHeight = height

        this.rows = [] // this contains row arrays

        for (var y = 0; y < this.mapHeight; y++){
            var newrow: SquareData[] = []
            for (var x = 0; x < this.mapWidth; x++){
                var data = new SquareData(x,y)
                newrow[x] = data
            }
            (this.rows)[y] = newrow
        }
    }

    clone():Mapper {
        const newmapper = new Mapper(this.mapWidth, this.mapHeight)
        newmapper.rows = this.rows.map(row => row.map(square => square.clone()))
        return newmapper;
    }

    mirror(x: number,y: number) {
        console.log(x,y,this.mapWidth,this.mapHeight )
        this.rows[this.mapHeight -1 - y][this.mapWidth -1 - x].mirrorValues(this.rows[y][x])
    }

    vmf(){
        var returnString = ""
        for (var i = 0; i < this.mapHeight; i++){
            for (var p = 0; p < this.mapWidth; p++){
                var squareVmf = this.rows[i][p].generateVmf(875675)
                returnString += squareVmf
            }
        }
        return returnString
    }
}

export {Mapper}