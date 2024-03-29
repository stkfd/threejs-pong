define(['behaviour', 'ball', 'play-area', 'rotatable-camera', 'paddle'], function (Behaviour, Ball, PlayArea, RotatableCamera, Paddle) {
    'use strict';

    var Game = Behaviour.extend({
        create: function () {
            Behaviour.prototype.create.apply(this, arguments);

            this.width = 1200;
            this.height = 600;
            this.canvasWrapper = document.getElementById('game-canvas');
        },
        start: function () {
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(this.width, this.height);
            this.canvasWrapper.appendChild(this.renderer.domElement);

            this.scene = new THREE.Scene();


            this.cameraScript = this.addChild(
                new RotatableCamera({
                    aspectRatio: this.width / this.height,
                    scene: this.scene,
                    renderer: this.renderer,
                    domElement: this.renderer.domElement
                })
            );

            this.addLights();

            var fieldWidth = 180;
            var fieldHeight = 250;

            var plane = this.addChild(
                new PlayArea({
                    scene: this.scene,
                    width: fieldWidth,
                    height: fieldHeight
                })
            );

            var paddleSpeed = 10;

            var paddle1 = this.addChild(
                new Paddle({
                    scene: this.scene,
                    domElement: window,
                    paddleWidth: 40,
                    basePosition: new THREE.Vector2(0, -125),
                    speed: paddleSpeed,
                    keys: {
                        left: 89, // y
                        right: 88 // x
                    }
                })
            );

            var paddle2 = this.addChild(
                new Paddle({
                    scene: this.scene,
                    domElement: window,
                    paddleWidth: 40,
                    basePosition: new THREE.Vector2(0, 125),
                    speed: paddleSpeed,
                    keys: {
                        left: 37, // left arrow
                        right: 39 // right arrow
                    }
                })
            );

            this.addChild(
                new Ball({
                    scene: this.scene,
                    bounds: {
                        x: [fieldWidth/(-2), fieldWidth/2],
                        y: [fieldHeight/(-2), fieldHeight/2]
                    },
                    paddles: [paddle1, paddle2]
                })
            );

            this.clock = new THREE.Clock(true);
            this.delta = 0;
            this.update(this.delta);
        },
        /**
         * Add lights to the scene
         */
        addLights: function () {
            var mainLight = new THREE.PointLight(0xF8D898);
            mainLight.position.x = -1000;
            mainLight.position.y = 0;
            mainLight.position.z = 1000;
            mainLight.intensity = 3;
            mainLight.distance = 5000;
            this.scene.add(mainLight);

            var offLight = new THREE.PointLight(0xF8D898);
            offLight.position.x = 1000;
            offLight.position.y = 0;
            offLight.position.z = 1000;
            offLight.intensity = 1;
            offLight.distance = 5000;
            this.scene.add(offLight);
        },
        /**
         * Calls itself every frame through requestAnimationFrame and manages passing and calculating
         * the time delta to its child objects
         */
        update: function () {
            this.delta = this.clock.getDelta();
            Behaviour.prototype.update.apply(this, [this.delta]);
            this.renderer.render(this.scene, this.cameraScript.camera);
            requestAnimationFrame(this.update.bind(this));
        }
    });

    return {
        Game: Game,
        init: function () {
            var g = new Game();
            g.start();
        }
    }
});
