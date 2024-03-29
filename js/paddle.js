define(['behaviour'], function(Behaviour) {
    var State = {
        DEFAULT: 1,
        MOVE_LEFT: 2,
        MOVE_RIGHT: 3
    };
    var Paddle = Behaviour.extend({
        create: function(options) {
            Behaviour.prototype.create.apply(this, arguments);
            this.options = Object.assign({}, Paddle.defaultOptions, options);
        },
        start: function() {
            var material = new THREE.MeshLambertMaterial({
                color: 0xD43001
            });

            var paddleMesh = new THREE.Mesh(
                new THREE.BoxGeometry(this.options.paddleWidth, 5, 10, 1, 1, 1),
                material
            );
            paddleMesh.position.x = this.options.basePosition.x;
            paddleMesh.position.y = this.options.basePosition.y;
            paddleMesh.position.z = 5;
            this.mesh = paddleMesh;
            this.options.scene.add(paddleMesh);

            this.state = State.DEFAULT;

            this.options.domElement.addEventListener('keydown', this.onKeyDown.bind(this));
            this.options.domElement.addEventListener('keyup', this.onKeyUp.bind(this));
        },
        onKeyDown: function(e) {
            if (e.keyCode == this.options.keys.left) {
                this.state = State.MOVE_LEFT;
            } else if (e.keyCode == this.options.keys.right) {
                this.state = State.MOVE_RIGHT;
            }
        },
        onKeyUp: function(e) {
            if (e.keyCode == this.options.keys.left || e.keyCode == this.options.keys.right) {
                this.state = State.DEFAULT;
            }
        },
        update: function(delta) {
            Behaviour.prototype.update.apply(this, arguments);
            if (this.state == State.MOVE_LEFT) {
                this.mesh.position.x -= delta * 10 * this.options.speed;
            } else if (this.state == State.MOVE_RIGHT) {
                this.mesh.position.x += delta * 10 * this.options.speed;
            }
        },
        getHorizontalBounds: function() {
            return [this.mesh.position.x - this.options.paddleWidth/2, this.mesh.position.x + this.options.paddleWidth/2];
        }
    }).static({
        defaultOptions: {
            scene: null,
            domElement: null,
            paddleWidth: 40,
            basePosition: new THREE.Vector2(0, 0),
            speed: 10,
            keys: {
                left: 89, // y
                right: 88 // x
            }
        }
    });
    return Paddle;
});