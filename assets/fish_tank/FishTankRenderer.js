(function() {

  var FishTankRenderer = function() {};

  FishTankRenderer.prototype.init = function(container) {
    if (!FishTankRenderer.isWebGLEnabled()) {
      throw new Error('WebGL is not enabled in your browser.');
    }

    var mesh, geometry;

    this.spheres = [];

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
    this.camera.position.z = 3200;

    this.scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry(100, 32, 16);

    var path = 'assets/fish_tank/';
    var format = '.png';
    var urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ];

    const textureLoader = new THREE.CubeTextureLoader();
    var textureCube = textureLoader.load(urls);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      envMap: textureCube
    });

    for (var i = 0; i < 500; i++) {

      var mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = Math.random() * 100000 - 50000;
      mesh.position.y = Math.random() * 100000 - 50000;
      mesh.position.z = Math.random() * 100000 - 50000;

      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

      this.scene.add(mesh);

      this.spheres.push(mesh);

    }

    // Skybox

    var shader = THREE.ShaderLib["cube"];
    shader.uniforms["tCube"].value = textureCube;

    var material = new THREE.ShaderMaterial({

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        side: THREE.BackSide

      }),

      mesh = new THREE.Mesh(new THREE.BoxGeometry(100000, 100000, 100000), material);
    this.scene.add(mesh);

    var _params = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    };

    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;

    this.renderer = new THREE.WebGLRenderer(width, height, _params);
    container.appendChild(this.renderer.domElement);
    this.renderer.setSize(width, height);
  };

  var targetPosition = new THREE.Vector3();
  var frameClock = new THREE.Clock();
  FishTankRenderer.prototype.render = function(controlX, controlY) {
    var timer = 0.0001 * Date.now();
    var dt = frameClock.getDelta();

    targetPosition.x = controlX - this.camera.position.x;
    targetPosition.y = controlY - this.camera.position.y;

    targetPosition.x = THREE.MathUtils.lerp(this.camera.position.x, targetPosition.x, 0.5 * dt);
    targetPosition.y = THREE.MathUtils.lerp(this.camera.position.y, targetPosition.y, 0.5 * dt);

    this.camera.position.x = targetPosition.x;
    this.camera.position.y = targetPosition.y;

    this.camera.lookAt(this.scene.position);

    for (var i = 0, il = this.spheres.length; i < il; i++) {
      var sphere = this.spheres[i];
      sphere.position.x += 50 * Math.cos(timer + i);
      sphere.position.y += 50 * Math.sin(timer + i * 1.1);
    }

    this.renderer.render(this.scene, this.camera);
  };

  FishTankRenderer.isWebGLEnabled = function() {
    try {
      var canvas = document.createElement('canvas');
      return !!window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  };

  window.FishTankRenderer = FishTankRenderer;

})();
