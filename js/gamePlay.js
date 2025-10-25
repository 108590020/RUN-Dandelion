const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (min > max) {
        // javascript
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const gamePlay = {
    key: 'gamePlay',
    preload: function(){
        this.load.image('bg1', '../images/bg/bg1.png');
        this.load.image('bg2', '../images/bg/bg2.png');
        this.load.image('bg3', '../images/bg/bg3.png');
        this.load.image('bg4', '../images/bg/bg4.png');
        this.load.image('footer', '../images/bg/footer.png');
        this.load.image('rock1', '../images/item-level-1-rock.png');
        this.load.image('rock2', '../images/item-level-2-smoke-sm.png');
        this.load.image('rock3', '../images/item-level-1-branch.png');
        this.load.image('gameover', '../images/ui/txt-game-over.png');
        this.load.image('playAgainBtn', '../images/ui/btn-play-again.png');
        this.load.spritesheet('user', '../images/player.png', {frameWidth: 144, frameHeight: 120});
        
        this.monsterArr = [];    // 存放所有怪物實體
        this.monsterArr2 = [];   // 存放所有怪物實體2
        this.masIdx = 0;         // 怪物索引
        this.masIdx2 = 1;        // 怪物索引2

        this.timeInt = 30;
        this.bgSpeed = 1;
        this.gameStop = false;
        this.hasJumped = false;
        this.hasHitFloor = true;

    },
    create: function(){
        this.bg4 = this.add.tileSprite(w/2, h/2, w, h, 'bg4');
        this.bg3 = this.add.tileSprite(w/2, h/2, w, h, 'bg3');
        this.bg2 = this.add.tileSprite(w/2, h/2, w, h, 'bg2');
        this.bg1 = this.add.tileSprite(w/2, h/2, w, h, 'bg1');
        this.footer = this.add.tileSprite(w/2, 360 + 45, w, 90, 'footer');

        this.physics.add.existing(this.footer);
        // Set the object not to move and fall
        this.footer.body.immovable = true;
        // Whether the object's position and rotation are affected by its velocity, acceleration, drag and gravity
        this.footer.body.moves = false;
        //Set character position and add physical effects
        this.player = this.physics.add.sprite(150, 150, 'user');
        //Set character bounce value
        this.player.setBounce(1);
        //Set character WorldBounds
        this.player.setCollideWorldBounds(true); 
        //Set character display size
        this.player.setScale(0.7);
        //Set character collision bounds
        this.player.setSize(130, 80);
        //Bind objects that need to collide together
        
        keyFrame(this);

        // set collision return（will return and set hasHitFloor = true 
        // when collided every time）
        // 函式簽名 scene.physics.add.collider(object1, object2, collideCallback, processCallback, callbackContext)
        this.physics.add.collider(this.player, this.footer, 
            () => {this.hasHitFloor = true}, null, this
        );
        
        //碰撞後停止遊戲
        const hitTest = (player, rock) => {
            
            console.log('trigger hit test');
            // this.gameStop = true;
            this.player.setBounce(0);
            // this.player.setSize(110, 100, 0);
            this.player.anims.play('deel', true);
            clearInterval(timer);
            let gameover = this.add.image(w / 2, h / 2 - 40, 'gameover');
            gameover.setScale(0.8);
            let playAgainBtn = this.add.image(w / 2, h / 2 + 30, 'playAgainBtn');
            playAgainBtn.setScale(0.6);
            playAgainBtn.setInteractive();
            playAgainBtn.on('pointerdown', () => this.scene.start('gamePlay'));
        }
        
        // monster position
        const masPos = [
            {name: 'rock1', x: w + 200, y: 320, w: 160, h: 83},
            {name: 'rock2', x: w + 200, y: h / 2 - 30 , w: 200, h: 94},
            {name: 'rock3', x: w + 200, y: 70, w: 130, h: 160},
        ]

        // 加入物理效果
        const addPhysics = (GameObject) => {
            this.physics.add.existing(GameObject);
            GameObject.body.immovable = true;
            GameObject.body.moves = false;
        }

        // 產生怪物
        for (let i = 0; i < 10; i++) {
            console.log('create monster', i);
            let BoolIdx = getRandomInt(2, 0); //return 0, 1, 2
            let BoolIdx2 = getRandomInt(2, 0);
            this['rock'+ i] = this.add.tileSprite(masPos[BoolIdx].x, masPos[BoolIdx].y, masPos[BoolIdx].w, masPos[BoolIdx].h, masPos[BoolIdx].name);
            this['rockB'+ i] = this.add.tileSprite(masPos[BoolIdx2].x, masPos[BoolIdx2].y, masPos[BoolIdx2].w, masPos[BoolIdx2].h, masPos[BoolIdx2].name);
            this.monsterArr.push(this['rock'+ i]);
            this.monsterArr2.push(this['rockB'+ i]);
            addPhysics(this['rock'+i]);
            addPhysics(this['rockB'+i]);
            this.physics.add.collider(this.player, this['rock'+i], hitTest);
            this.physics.add.collider(this.player, this['rockB'+i], hitTest);
        }

        // // 檢測怪物是否超出邊界然後返回
        // for (let i = 0; i < this.monsterArr.length; i++) {
        //     if(this.monsterArr[i].x <= -100){
        //         this.monsterArr[i].x = w + 200;
        //         this.masIdx = getRandom(this.monsterArr.length - 1, 0);
        //     }
        //     if(this.monsterArr2[i].x <= -100){
        //         this.monsterArr2[i].x = w + getRandom(400, 200);
        //         this.masIdx2 = getRandom(this.monsterArr2.length - 1, 0);
        //     }
        // }

        this.TimeText = this.add.text(w-180, h-50, `Time: ${this.timeInt}`, { color: '#fff', fontSize: '30px'});
        
        let timer = setInterval(() =>{
            this.timeInt--;
            if(this.timeInt < 20 && this.timeInt > 10){
                this.speedLv += 0.1;
            }
            if(this.timeInt < 10 && this.timeInt > 0){
                this.speedLv = 3;
            }
            this.TimeText.setText(`Time: ${this.timeInt}`);
            if(this.timeInt <= 0){
                this.againBtn = this.add.image(w/2, h/2 +30,'playAgainBtn');
                this.againBtn.setInteractive();
                this.againBtn.on('pointerdown', () => {
                    // console.log('click again btn');
                    this.scene.start('gamePlay');
                })
                this.gameStop = true;
                clearInterval(timer);
            }
        }, 1000)

        

    },
    update: function(){

        
        if(this.gameStop) return;
        this.bg3.tilePositionX += 1 * this.speedLv;
        this.bg2.tilePositionX += 2 * this.speedLv;
        this.bg1.tilePositionX += 3 * this.speedLv;
        this.footer.tilePositionX += 3 * this.speedLv;

        this.monsterArr[this.masIdx].x -= 3 * this.bgSpeed;

        if(this.TimeStep < 10 && this.TimeStep > 0 ){
            this.monsterArr2[this.masIdx2].x -= 3 * this.bgSpeed;
        }

        const keyboard = this.input.keyboard.createCursorKeys();

        // console.log(this.hasHitFloor);
        if (keyboard.right.isDown) {
            this.player.anims.play('speed', true);
            // flip the image
            this.player.flipX = false;
            // set velocity to move forward in physics world
            this.player.setVelocityX(200);
        }else if (keyboard.left.isDown) {
            this.player.anims.play('speed', true);
            this.player.flipX = true;
            this.player.setVelocityX(-260);
        }else {
            if(!this.hasHitFloor) {
                this.player.anims.play('jump', true);
            } else {
                this.player.anims.play('run', true);;
            }
            this.player.flipX = false;
            this.player.setVelocityX(0);
        }
        if (keyboard.up.isDown) {
            if (!this.hasJumped) {
                this.player.setVelocityY(-300);
                this.player.anims.play('jump', true);
                this.hasJumped = true;
                this.hasHitFloor = false;
            } 
        }else {
            this.hasJumped = false;
        }
    }
}