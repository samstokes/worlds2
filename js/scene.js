var camera, scene, renderer, wineglass, light;
var PERSON_HEIGHT = 1.6;
var mobile = false;

init();
setup();
tweenCamera();
tweenLight();
render();

function init() {

    // renderer

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // scene

    scene = new THREE.Scene();

    // camera

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, PERSON_HEIGHT, 3);
    camera.focalLength = camera.position.distanceTo(scene.position);

    // controls

    controls = new THREE.OrbitControls(camera);
    controls.autoRotate = true;

    if (WEBVR.isAvailable() === true) {
        controls = new THREE.VRControls(camera);
        controls.standing = false;

        renderer = new THREE.VREffect(renderer);
        document.body.appendChild(WEBVR.getButton(renderer));
    }

    // events

    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener('resize', onWindowResize, false);

}

function setup() {
    // central room

    //var geometry = new THREE.TorusKnotGeometry(1.2, 0.25, 50, 12);
    var geometry = new THREE.BoxGeometry(20, 10, 15);
    //var texture = new THREE.TextureLoader().load(
    //        'assets/textures/stone_texture948.jpg' );
    var roomFaces = [
        /* +x */ 'assets/textures/stone_texture948.jpg',
        /* -x */ 'assets/textures/stone_texture948.jpg',
        /* +y */ 'assets/textures/Stone-texture.jpg',
        /* -y */ 'assets/textures/Stone Texture wall large rock grey image.jpg',
        /* +z */ 'assets/textures/stone_texture948.jpg',
        /* -z */ 'assets/textures/stone_texture948.jpg'
    ];
    var roomFaceMaterials = roomFaces.map(function (url) {
        var texture = new THREE.TextureLoader().load(url);
        var bumpTexture = new THREE.TextureLoader().load(url.replace(/\.jpg$/, '_bump.jpg'));
        var bumpScale = 0.5;
        if (url.match(/rock/)) { bumpScale = 5; }
        return new THREE.MeshStandardMaterial({
            map: texture,
            //bumpMap: bumpTexture,
            //bumpScale: bumpScale,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.BackSide
        });
    });
    //var texture = new THREE.CubeTextureLoader().load(roomFaces);
    //var walls = new THREE.MeshStandardMaterial({
    //    map: texture,
    //    side: 1
    //});
    var roomMaterial = new THREE.MeshFaceMaterial(roomFaceMaterials);
    var room = new THREE.Mesh(geometry, roomMaterial);
    scene.add(room);

    // light

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, 1.5, 0.5);
    scene.add(light);

    var ambient = new THREE.AmbientLight(0x888888);
    scene.add(ambient);

    var loader = new THREE.ObjectLoader();
    loader.load('models/wineglass.json', function (object) {
        wineglass = object;
        wineglass.position.set(1, -4.99, 2);
        wineglass.scale.set(0.2, 0.2, 0.2);
        scene.add(wineglass);
    });
}

var lastTimestamp;

function render(timestamp) {
    requestAnimationFrame(render);

    controls.update();

    timestep = timestamp * 0.001;
    //light.position.set(Math.sin(timestep * 0.3), Math.cos(timestep * 0.4), 0.5);
    //light.lookAt(scene.position);
    if (lastTimestamp !== undefined) {
        elapsed = timestamp - lastTimestamp;
    }
    lastTimestamp = timestamp;

    if (mobile) {
        camera.position.set(0, 0, 0)
        //camera.translateZ(5);
    }
    renderer.render(scene, camera);

}

function tweenCamera() {
    TweenMax.to(camera.position, 5, {
        x: -7 + Math.random() * 14,
        z: -4.5 + Math.random() * 9,
        onComplete: tweenCamera
    });
}

function tweenLight() {
    TweenMax.to(light.position, 10, {
        x: -9 + Math.random() * 18,
        y: -4 + Math.random() * 8,
        z: -6 + Math.random() * 12,
        onComplete: tweenLight
    });
}
