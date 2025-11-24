const getRandom = (max, min) =>{
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
        
        this.load.image('congratulations', '../images/ui/txt-congratulations.png');
        this.load.image('playAgainBtn', '../images/ui/btn-play-again.png');
        this.load.spritesheet('user', '../images/player.png', {frameWidth: 144, frameHeight: 120});

        this.load.image('gameover', '../images/ui/txt-game-over.png');
        this.load.image('tryAgainBtn', '../images/ui/btn-try-again.png');

        this.iskeyJump = true;   // 是否可以跳躍

        this.monsterArr = [];    // 存放所有怪物實體
        this.monsterArr2 = [];   // 存放所有怪物實體2
        this.masIdx = 0;         // 怪物索引
        this.masIdx2 = 1;        // 怪物索引2
        this.gameStop = false;   // 控制遊戲是否停止
        this.bgSpeed = 1.3;      // 速度
        this.TimeStep = 30;      // 遊戲時間
    },
    create: function(){
        this.bg4 = this.add.tileSprite(400, 225, w, h, 'bg4');
        this.bg3 = this.add.tileSprite(400, 225, w, h, 'bg3');
        this.bg2 = this.add.tileSprite(400, 225, w, h, 'bg2');
        this.bg1 = this.add.tileSprite(400, 225, w, h, 'bg1');
        this.footer = this.add.tileSprite(400, 404, 800, 90, 'footer');
        
        //設定人物位置與加入物理效果
        this.player = this.physics.add.sprite(150, 150, 'user');
        this.player.setCollideWorldBounds(true); //角色邊界限制
        this.player.setBounce(1); //設定彈跳值
        this.player.setScale(scale); //設定顯示大小

        // 定義可切換的碰撞框尺寸與 offset（依圖片調整數值）
        this.playerSizes = {
            normal: { width: 110, height: 90, offsetX: 17, offsetY: 15 },
            speed:  { width: 144, height: 120, offsetX: 0,  offsetY: 0 },
            jump:   { width: 110, height: 120, offsetX: 17, offsetY: 0 }
        };
        const initSize = this.playerSizes.normal;
        this.player.body.setSize(initSize.width, initSize.height, false);
        this.player.body.setOffset(initSize.offsetX, initSize.offsetY);
        this.player.currentSize = 'normal';

        // // 運動參數（可視情況調整）
        // this.MOVE = {
        // ACCEL: 1200,    // 加速度
        // MAX_SPEED: 220,// 最大水平速度
        // DRAG: 900       // 空檔時阻力
        // };

        // // 設定拖曳與最大速度
        // this.player.setDragX(this.MOVE.DRAG);
        // this.player.setMaxVelocity(this.MOVE.MAX_SPEED, 1000);
        
        // key debounce（放在 create()，在 this.cursors 初始化後）

        this.KEY_DEBOUNCE = 2000; // 1 秒（毫秒）
        this.lastKeyTime = { left: 0, right: 0, up: 0, down: 0, space: 0 };

        this.canProcessKey = (keyName) => {
        const now = Date.now();
        if (!this.lastKeyTime[keyName] || now - this.lastKeyTime[keyName] >= this.KEY_DEBOUNCE) {
            this.lastKeyTime[keyName] = now;
            return true;
        }
        return false;
        };


        //設定文字
        this.timeText = this.add.text(25, h - 46, `TIME: ${this.TimeStep}`, { fontSize: '22px', fill: '#FFFFFF' })

        // 遊戲計時器
        if (this.gametime) {
            clearInterval(this.gametime);
            this.gametime = null;
        }

        this.gametime = setInterval(()=>{
            this.TimeStep--;
            //重新設定文字
            this.timeText.setText(`TIME: ${this.TimeStep}`);
            if(this.TimeStep < 20 && this.TimeStep > 10 ){
                this.bgSpeed = 1.6;
            }else if(this.TimeStep < 10 && this.TimeStep > 0 ){
                this.bgSpeed = 3;
            }else if(this.TimeStep <= 0){
                this.gameStop = true;
                clearInterval(this.gametime);
                // 把場景物件上用來儲存 interval 的參考清掉，
                // 當作「沒有正在運行的計時器」的旗標（並幫助垃圾回收在適當情況下回收參考）。
                // 但它本身不會停止 interval——必須先呼叫 clearInterval(this.gametime)。
                this.gametime = null;
                let congratulations = this.add.image(w / 2, h / 2 - 50, 'congratulations');
                congratulations.setScale(0.8);
                let playAgainBtn = this.add.image(w / 2, h / 2 + 40, 'playAgainBtn');
                playAgainBtn.setScale(0.6);
                playAgainBtn.setInteractive();
                playAgainBtn.on('pointerdown', () => this.scene.start('gamePlay'));
                this.input.keyboard.once('keydown-SPACE', () => {
                    this.scene.start('gamePlay');
                });
            }
        }, 1000);

        
        // 動畫影格
        keyFrame(this);

        // 加入物理效果
        const addPhysics = GameObject =>{
            this.physics.add.existing(GameObject);
            GameObject.body.immovable = true;
            GameObject.body.moves = false;
        }
        

        // 怪物的座標與大小
        const masPos = [
            {name: 'rock1', x: w + 200, y: 320, w: 160, h: 83},
            {name: 'rock2', x: w + 200, y: h / 2 - 30 , w: 200, h: 94},
            {name: 'rock3', x: w + 200, y: 70, w: 130, h: 160},
        ]
        

        //碰撞到後停止遊戲
        const hittest = (player, rock) => {
            this.gameStop = true;
            clearInterval(this.gametime);
            this.gametime = null;
            this.player.setBounce(0);
            this.player.setSize(110, 100, 0);
            this.player.anims.play('deel', true);
            let gameover = this.add.image(w / 2, h / 2 - 40, 'gameover');
            gameover.setScale(0.8);
            let tryAgainBtn = this.add.image(w / 2, h / 2 + 30, 'tryAgainBtn');
            tryAgainBtn.setScale(0.6);
            tryAgainBtn.setInteractive();
            tryAgainBtn.on('pointerdown', () => this.scene.start('gamePlay'));
            this.input.keyboard.once('keydown-SPACE', () => {
                this.scene.start('gamePlay');   
            });
            console.log('player', this.player.x, this.player.body.x, this.player.body.width);
            console.log('rock', this.monsterArr[this.masIdx].x, this.monsterArr[this.masIdx].body.x, this.monsterArr[this.masIdx].body.width);
            // 調試用：印出 player 與第一個怪物的 body 與 sprite 座標
            // if (this.monsterArr && this.monsterArr[0]) {
                
            // }
        }
        
            
        // 產生兩組怪物，每一組由三種不同怪物隨機挑選10個組合
        // i 的範圍可更改，i太小可能挑選到一樣的怪物
        for (let i = 0; i < 10; i++) {
            let BoolIdx = getRandom(2, 0);
            let BoolIdx2 = getRandom(2, 0);
            this['rock'+ i] = this.add.tileSprite(masPos[BoolIdx].x, masPos[BoolIdx].y, masPos[BoolIdx].w, masPos[BoolIdx].h, masPos[BoolIdx].name);
            this['rockB'+ i] = this.add.tileSprite(masPos[BoolIdx2].x, masPos[BoolIdx2].y, masPos[BoolIdx2].w, masPos[BoolIdx2].h, masPos[BoolIdx2].name);
            addPhysics(this['rock'+i]);
            addPhysics(this['rockB'+i]);
            this.monsterArr.push(this['rock'+ i]);
            this.monsterArr2.push(this['rockB'+ i]);
            this.physics.add.collider(this.player, this['rock'+i], hittest);
            this.physics.add.collider(this.player, this['rockB'+i], hittest);
        }


        // 地板加入物理效果
        addPhysics(this.footer);

        // 地板跟人物碰撞綁定
        this.physics.add.collider(this.player, this.footer);

        //播放動畫
        this.player.anims.play('run', true);

    },
    update: function(){
        if(this.gameStop) return;

        this.bg3.tilePositionX += 1 * this.bgSpeed;
        this.bg2.tilePositionX += 2 * this.bgSpeed;
        this.bg1.tilePositionX += 3 * this.bgSpeed;
        this.footer.tilePositionX += 3 * this.bgSpeed;

        // 第一組怪物的一隻從右框外移動到左框外
        this.monsterArr[this.masIdx].x -= 3 * this.bgSpeed;   
        // 第二組怪物的一隻從右框外移動到左框外
        if(this.TimeStep < 10 && this.TimeStep > 0 ){
            this.monsterArr2[this.masIdx2].x -= 3 * this.bgSpeed;
        }

        // 移動到左框外後重置到右框外
        // 檢測怪物是否超出邊界然後返回
        for (let i = 0; i < this.monsterArr.length; i++) {
            if(this.monsterArr[i].x <= -100){
                this.monsterArr[i].x = w + 200;
                this.masIdx = getRandom(this.monsterArr.length - 1, 0);
            }
            if(this.monsterArr2[i].x <= -100){
                this.monsterArr2[i].x = w + getRandom(400, 200);
                this.masIdx2 = getRandom(this.monsterArr2.length - 1, 0);
            }
        }
        

        //  // 啟動鍵盤事件
        // let cursors = this.input.keyboard.createCursorKeys();
        // if (cursors.right.isDown) {
        //     this.player.setVelocityX(200);
        //     this.player.setSize(144, 120, 0); //碰撞邊界
        //     this.player.anims.play('speed', true);
        //     this.player.flipX = false;
        // } else if (cursors.left.isDown) {
        //     this.player.setVelocityX(-300);
        //     this.player.setSize(144, 120, 0); //碰撞邊界
        //     this.player.anims.play('speed', true);
        //     this.player.flipX = true;
        // } else {
        //     this.player.setVelocityX(0);
        //     this.player.anims.play('run', true);
        //     this.player.setSize(110, 90, 0); //碰撞邊界
        //     this.player.flipX = false;
        // }
        // if (cursors.up.isDown) {
        //     if(this.iskeyJump){
        //         this.iskeyJump = false;
        //         this.player.setVelocityY(-300);
        //     }
        // }else{
        //     this.iskeyJump = true;
        // }

        // // 在 update() 裡：取得游標
        // let cursors = this.input.keyboard.createCursorKeys();

        

        // // 決定欲求的狀態（優先 jump，其次左右速度）
        // let desiredSizeKey = 'normal';
        // let targetVelocityX = 0;

        // if (cursors.up.isDown) {
        //     // 跳躍時的大小（如果你同時允許左右+跳躍，可把此處合併邏輯）
        //     desiredSizeKey = 'jump';
        //     // note: 要實作跳躍請保留你的 setVelocityY（僅示例）
        //     if (this.iskeyJump) {
        //         this.iskeyJump = false;
        //         this.player.setVelocityY(-300);
        //     }
        // } 

        // if (cursors.right.isDown) {     
        //     targetVelocityX = 200;   // 想要的水平速度（視情況可調小）
        //     desiredSizeKey = 'speed';
        //     this.player.flipX = false;
        //     this.player.anims.play('speed', true);
        // } else if (cursors.left.isDown) {
        //     targetVelocityX = -200;
        //     desiredSizeKey = 'speed';
        //     this.player.flipX = true;
        //     this.player.anims.play('speed', true);
        // } else {
        //     // idle
        //     targetVelocityX = 0;
        //     if (this.player.currentSize !== 'normal') {
        //         // only play run animation when idle (or adjust per your anim logic)
        //         this.player.anims.play('run', true);
        //         this.player.flipX = false;
        //     }
        // }

        // // 將速度指派到物理 body（使用物理引擎移動）
        // this.player.setVelocityX(targetVelocityX);

        // // 只在狀態改變時切換碰撞框，避免每幀重設
        // if (this.player.currentSize !== desiredSizeKey) {
        //     const ns = this.playerSizes[desiredSizeKey];
        //     this.player.body.setSize(ns.width, ns.height, false);
        //     this.player.body.setOffset(ns.offsetX, ns.offsetY);
        //     this.player.currentSize = desiredSizeKey;
        // }

        

        // /* PLAYER 控制 (平滑加速) */
        // this.cursors = this.input.keyboard.createCursorKeys();
        // let desiredSizeKey = 'normal';
        // let accel = 0;

        // // Jump 優先（若你要按鍵一次跳，保留你的 iskeyJump 邏輯）
        // if (this.cursors.up.isDown) {
        // // 僅在可跳時觸發一次跳躍
        // if (this.iskeyJump) {
        //     this.iskeyJump = false;
        //     this.player.setVelocityY(-300);
        // }
        // desiredSizeKey = 'jump';
        // }

        // // 左右輸入決定加速度方向與 speed 狀態
        // if (this.cursors.right.isDown) {
        //     accel = this.MOVE.ACCEL;
        //     desiredSizeKey = 'speed';
        //     this.player.flipX = false;
        //     this.player.anims.play('speed', true);
        // } else if (this.cursors.left.isDown) {
        //     accel = -this.MOVE.ACCEL;
        //     desiredSizeKey = 'speed';
        //     this.player.flipX = true;
        //     this.player.anims.play('speed', true);
        // } else {
        //     // no horizontal input -> keep run animation or idle
        //     accel = 0;
        //     if (!this.player.anims.isPlaying || this.player.currentSize === 'normal') {
        //         this.player.anims.play('run', true);
        //         this.player.flipX = false;
        //     }
        // }

        // // 指派加速度（物理引擎處理速度變化與拖曳）
        // this.player.setAccelerationX(accel);

        // // 當速度接近 0 時確保完全停止（避免慢速滑動殘留）
        // if (Math.abs(this.player.body.velocity.x) < 5 && accel === 0) {
        //     this.player.setVelocityX(0);
        //     this.player.setAccelerationX(0);
        // }

        // // 只在狀態改變時切換碰撞框（避免每幀重設造成問題）
        // if (this.player.currentSize !== desiredSizeKey) {
        //     const ns = this.playerSizes[desiredSizeKey];
        //     this.player.body.setSize(ns.width, ns.height, false);
        //     this.player.body.setOffset(ns.offsetX, ns.offsetY);
        //     this.player.currentSize = desiredSizeKey;
        // }
        
        // 確保有 cursors（如果你在 create() 已設定 this.cursors，會直接使用）
        const cursors = this.cursors || this.input.keyboard.createCursorKeys();

        // --- 一次性按鍵：Up / Down（JustDown + debounce） ---
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
        if (this.canProcessKey('up')) {
            if (this.iskeyJump) {
            this.iskeyJump = false;
            this.player.setVelocityY(-300); // 跳躍速度，可微調
            }
        }
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
        if (this.canProcessKey('down')) {
            // 例：下鍵一次性行為（蹲下/互動等），請改成你想要做的事
            // this.player.setVelocityY(200);
        }
        }

        // --- 左右連續移動（isDown）與單次 dash（JustDown + debounce） ---
        // 連續移動行為
        if (cursors.left.isDown) {
        if (this.MOVE) {
            this.player.setAccelerationX(-this.MOVE.ACCEL);
        } else {
            this.player.setVelocityX(-200); // 若沒 this.MOVE，直接用速度（可調）
        }
        this.player.flipX = true;
        this.player.anims.play('speed', true);
        } else if (cursors.right.isDown) {
        if (this.MOVE) {
            this.player.setAccelerationX(this.MOVE.ACCEL);
        } else {
            this.player.setVelocityX(200);
        }
        this.player.flipX = false;
        this.player.anims.play('speed', true);
        } else {
        // 無左右輸入：停加速度或把速度設為 0
        if (this.MOVE) {
            this.player.setAccelerationX(0);
            // 讓 drag 倒速生效（需在 create() 設 this.player.setDragX(...)）
        } else {
            this.player.setVelocityX(0);
        }
        this.player.anims.play('run', true);
        }

        // 左/右 按一下要做單次效果（dash 範例），受 debounce 控制
        if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
        if (this.canProcessKey('left')) {
            // Dash 範例（短暫加速）：可視需求移除或調整
            this.player.setVelocityX(-400);
            // 可加一個小 timeout 還原速度（選用）
            this.time.delayedCall(150, () => {
            if (!cursors.left.isDown) {
                if (this.MOVE) this.player.setAccelerationX(0); else this.player.setVelocityX(0);
            }
            });
        }
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        if (this.canProcessKey('right')) {
            this.player.setVelocityX(400);
            this.time.delayedCall(150, () => {
            if (!cursors.right.isDown) {
                if (this.MOVE) this.player.setAccelerationX(0); else this.player.setVelocityX(0);
            }
            });
        }
        }
    }
}

// 每當變換一次方向時不重複判定setSize，直到輸入不同方向按鍵