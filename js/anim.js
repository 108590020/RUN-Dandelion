const keyFrame = (self) => {
    if (!self.anims.exists('run')) {
        self.anims.create({
            key: 'run',
            frames: self.anims.generateFrameNumbers('user', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
    }
    if (!self.anims.exists('jump')) {
        self.anims.create({
            key: 'jump',
            frames: self.anims.generateFrameNumbers('user', { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
    }
    if (!self.anims.exists('speed')) {
        self.anims.create({
            key: 'speed',
            frames: self.anims.generateFrameNumbers('user', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });
    }
    if (!self.anims.exists('deel')) {
        self.anims.create({
            key: 'deel',
            frames: self.anims.generateFrameNumbers('user', { start: 6, end: 6 }),
            frameRate: 5,
            repeat: -1
        });
    }
}