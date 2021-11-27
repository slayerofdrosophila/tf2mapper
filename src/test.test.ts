import {Mapper} from "./Mapper";
import assert = require("assert");

describe("interactions", () => {
    it("should set spawn team to 3 and mirror to 2", () => {
        const mapper = new Mapper(17, 9, 10)

        const data = mapper.floors[0][0][0]

        // this is done in Square.handleKeyUp:
        data.hasSpawn = true
        data.spawnTeam = 3

        mapper.mirror(data.xCoord, data.yCoord, data.zCoord)

        assert(data.spawnTeam === 3, "should be blue")

        const mirrorData = mapper.floors[0][8][16]

        assert(mirrorData.spawnTeam === 2, "shoul;d be red")
    })
})