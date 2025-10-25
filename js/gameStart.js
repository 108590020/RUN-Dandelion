const gameStart = {
    key: 'gameStart',
    preload: function(){
        //this point to Phaser object 
        this.load.image('bg1', '../images/bg/bg1.png');
        this.load.image('bg2', '../images/bg/bg2.png');
        this.load.image('bg3', '../images/bg/bg3.png');
        this.load.image('bg4', '../images/bg/bg4.png');
        this.load.image('footer', '../images/bg/footer.png');
        // this.load.spritesheet('user', '../images/player.png', {frameWidth: 144, frameHeight: 120});
        
        this.load.image('logo', '../images/ui/txt-title.png');
        this.load.image('startBtn', '../images/ui/btn-press-start.png');
        this.load.image('playerEnd', '../images/ui/player-end.png');
    },
    create: function(){
        //The coordinate system direction of the canvas
        //The origin (0, 0) is preset at the upper left corner
        //Angle direction is counterclockwise
        //positive x right y down
        this.bg4 = this.add.tileSprite(w/2, h/2, w, h, 'bg4');
        this.bg3 = this.add.tileSprite(w/2, h/2, w, h, 'bg3');
        this.bg2 = this.add.tileSprite(w/2, h/2, w, h, 'bg2');
        this.bg1 = this.add.tileSprite(w/2, h/2, w, h, 'bg1');
        this.footer = this.add.tileSprite(w/2, 360 + 45, w, 90, 'footer');

        //The size is according to the original image size
        this.logo = this.add.image(w/2, h/2 -70,'logo');
        this.logo.setScale(0.5);
        this.startBtn = this.add.image(w/2, h/2 +30,'startBtn');
        this.startBtn.setScale(0.5);
        this.playerEnd = this.add.image(w/2, h/2 +105,'playerEnd');
        this.playerEnd.setScale(0.3);

        this.startBtn.setInteractive();
        this.startBtn.on('pointerdown', () => {
            this.scene.start('gamePlay');
        })
    },
    update: function(){
        this.bg3.tilePositionX += 1;
        this.bg2.tilePositionX += 2;
        this.bg1.tilePositionX += 3;
        this.footer.tilePositionX += 3;
    }
}