// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    tiledMap: cc.TiledMap,
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    //   开启物理引擎
    let p = cc.director.getPhysicsManager();
    p.enabled = true;
    // 碰撞局域的描绘
    p.debugDrawFlags = true;
    p.gravity = cc.v2(0, 0);
  },

  start() {
    // 每一小块的距离
    let tiledSize = this.tiledMap.getTileSize();
    //   拿到wall城墙

    let layer = this.tiledMap.getLayer("wall");
    // 拿到块数
    console.log(layer);

    let mapSize = this.tiledMap.getMapSize();
    for (let i = 0; i < mapSize.width; i++) {
      for (let j = 0; j < mapSize.height; j++) {
        let v2Tile = cc.v2(i, j);
        //拿到Tiled对象
        let oTiled = layer.getTiledTileAt(i, j, true);
        //对象不存在 继续下一次循环
        if (!oTiled) continue;
        //gid === 0 继续下一次循环
        if (0 === oTiled.gid) continue;
        //拿到tile对应的世界坐标
        let v2WorldPos = this.getPosByTile(v2Tile);
        //创建一个节点
        let oNode = new cc.Node();
        //设置父节点
        oNode.parent = this.node;
        //将世界坐标转化为this.node下的本地坐标
        oNode.setPosition(this.node.convertToNodeSpaceAR(v2WorldPos));
        //创建物理
        oNode.group = "wall";
        let body = oNode.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;
        let collider = oNode.addComponent(cc.PhysicsBoxCollider);
        // collider.offset = cc.v2(tiledSize.width /2, tiledSize.height / 2);
        collider.size = tiledSize;
        collider.apply();
      }
    }
  },

  //像素坐标转化为格子坐标
  getTiledByPos(worldPos) {
    let pos = this.tiledMap.node.convertToNodeSpaceAR(worldPos);
    let tilePos = cc.v2(0, 0);
    let tileSize = this.tiledMap.getTileSize();
    let mapSize = this.tiledMap.getMapSize();
    tilePos.x = Math.floor(pos.x / tileSize.width);
    tilePos.y = Math.floor(
      (tileSize.height * mapSize.height - pos.y) / tileSize.height
    );
    return tilePos;
  },

  //格子坐标转化为像素坐标
  getPosByTile(tile) {
    let tileSize = this.tiledMap.getTileSize();
    let mapSize = this.tiledMap.getMapSize();
    let x = tile.x * tileSize.width + tileSize.width / 2;
    let y =
      tileSize.height * mapSize.height -
      tile.y * tileSize.height -
      tileSize.height / 2;
    return cc.v2(x, y);
  },

  // update (dt) {},
});
