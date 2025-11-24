const config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    parent: 'app',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 850 // 世界重力（像素 / 秒^2）
            },
            debug: true
        },
    },
    scene: [ gameStart,
        gamePlay
        ]
}
const game = new Phaser.Game(config);