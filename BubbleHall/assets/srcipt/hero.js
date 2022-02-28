// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
//存放按钮按下的状态
const Input = {};
cc.Class({
  extends: cc.Component,

  properties: {
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
    //   初始化人物移动速度
    this._speed = 200;
    // 人物移动状态
    this.sp = cc.v2(0, 0);
    // 监听键盘输入
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onkeydown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onkeyup, this);
  },

  onkeydown(e) {
    Input[e.keyCode] = 1;
  },
  //   松开
  onkeyup(e) {
    Input[e.keyCode] = 0;
  },

  start() {},

  update(dt) {
    // 对话时人物不可移动
    if (window.dialog && window.dialog.active) return;
    //#region 人物移动逻辑
    if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
      // console.log("向左");
      this.sp.x = -1;
      //   this.node.x -= this._speed * dt;
    } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
      // console.log("向右");
      this.sp.x = 1;
      //   this.node.x += this._speed * dt;
    } else {
      this.sp.x = 0;
      //   console.log(this.sp.x);
    }

    if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
      // console.log("向上");
      this.sp.y = 1;
    } else if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
      //   console.log("向下");
      this.sp.y = -1;
      //   this.node.y -= this._speed * dt;
    } else {
      this.sp.y = 0;
    }
    // 设置人物的线性速度
    this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;

    if (this.sp.x) {
      // this.node.x += this.sp.x * this._speed * dt;
      this.lv.y = 0;
      this.lv.x = this.sp.x * this._speed;
    } else if (this.sp.y) {
      // this.node.y += this.sp.y * this._speed * dt;
      this.lv.x = 0;
      this.lv.y = this.sp.y * this._speed;
    } else {
      this.lv.x = this.lv.y = 0;
    }
    this.node.getComponent(cc.RigidBody).linearVelocity = this.lv;
    // // 具体的动画帧
    // let state = "";
    // if (this.sp.x == 1) {
    //   state = "hero_right";
    // } else if (this.sp.x == -1) {
    //   state = "hero_left";
    // } else if (this.sp.y == 1) {
    //   state = "hero_up";
    // } else if (this.sp.y == -1) {
    //   state = "hero_down";
    // }
    // // 调用动画
    // if (state) {
    //   this.setState(state);
    // }

    //#endregion
  },
  // start () {

  // },
  //   // 碰撞回调
  //   onCollisionEnter(other, self) {
  //     if (other.node.group == "smog") {
  //       other.node.active = false;
  //       other.node.getComponent(cc.TiledTile).gid = 0;
  //     }
  //   },
});
