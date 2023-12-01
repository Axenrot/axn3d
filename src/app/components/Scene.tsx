import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const ThreeScene: React.FC = () => {
  function initializeThreeScene() {
    const scene = new THREE.Scene();
    const spaceTexture = new THREE.TextureLoader().load("space-black.png");
    scene.background = spaceTexture;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#bg") as HTMLCanvasElement,
    });

    return { scene, camera, renderer };
  }

  function createTorus() {
    const geometry = new THREE.TorusGeometry(10, 1, 16, 10000);
    const material = new THREE.MeshStandardMaterial({
      color: 0xf54278,
    });
    const torus = new THREE.Mesh(geometry, material);

    return torus;
  }

  function addStar(scene: THREE.Scene) {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
      .fill(0)
      .map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);
  }

  function createMoon() {
    const moonMap = new THREE.TextureLoader().load("red-moon.jpg");
    const moonTexture = new THREE.TextureLoader().load("normal.jpg");

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(10),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: moonMap,
        normalMap: moonTexture,
      })
    );

    // const avatarBox = new THREE.Mesh(
    //   new THREE.BoxGeometry(3, 3, 3),
    //   new THREE.MeshBasicMaterial({ color: 0xffffff, map: avatarTexture })
    // );
    // return avatarBox;
    return sphere;
  }

  useEffect(() => {
    // Three.js script
    const { scene, camera, renderer } = initializeThreeScene();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    renderer.render(scene, camera);

    const torus = createTorus();
    // scene.add(torus);

    const portrait = createMoon();
    scene.add(portrait);

    Array(200)
      .fill(0)
      .forEach(() => addStar(scene));

    const pointLight = new THREE.PointLight(0xffffff, 100);
    pointLight.position.set(-20, 20, 0);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    // scene.add(lightHelper, gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);
      portrait.rotation.y += 0.001;
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;

      controls.update();

      renderer.render(scene, camera);
    }

    animate();

    // Cleanup function
    return () => {
      // Clean up Three.js resources (if necessary)
      // For example, dispose of geometry and material
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <canvas
      id="bg"
      className="fixed top-0 left-0 w-full h-full bg-white/50"
    ></canvas>
  );
};

export default ThreeScene;
