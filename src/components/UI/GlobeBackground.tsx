"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TEX = {
  albedo: '/globe/2k_earth_nightmap.jpg',
  normal: '/globe/2k_earth_normal_map.tif',
  rough: '/globe/2k_earth_specular_map.tif',
  clouds: '/globe/2k_earth_clouds.jpg'
};

type Props = { className?: string; initialRotationDeg?: number };

export default function GlobeBackground({ className = 'pointer-events-none absolute inset-0', initialRotationDeg = -30 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    ref.current.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    const root = new THREE.Group();
    scene.add(root);
    const key = new THREE.DirectionalLight(0xffe7b3, 1.2); key.position.set(3, 2, 2.5); scene.add(key);
    const fill = new THREE.DirectionalLight(0x9fc7ff, 0.6); fill.position.set(-2.5, 1.5, -1.5); scene.add(fill);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const earthGeo = new THREE.SphereGeometry(1, 96, 96);
    const loader = new THREE.TextureLoader();
    const safeLoad = (url?: string) => new Promise<THREE.Texture | null>(res => { if (!url) return res(null); loader.load(url, t => { t.colorSpace = THREE.SRGBColorSpace; res(t); }, undefined, () => res(null)); });
    const earthMat = new THREE.MeshPhysicalMaterial({ color: 0x113355, roughness: 0.9 });
    const earth = new THREE.Mesh(earthGeo, earthMat); earth.rotation.y = THREE.MathUtils.degToRad(initialRotationDeg); root.rotation.z = THREE.MathUtils.degToRad(23.5); root.add(earth);
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.003, 96, 96), new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.35, depthWrite: false })); root.add(clouds);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.06, 96, 96), new THREE.ShaderMaterial({ side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: { glowColor: { value: new THREE.Color(0x2b4a92) }, intensity: { value: 0.85 } }, vertexShader: 'varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}', fragmentShader: 'varying vec3 vNormal;uniform vec3 glowColor;uniform float intensity;void main(){float f=pow(1.0 - vNormal.z,3.0);gl_FragColor=vec4(glowColor,f*0.25*intensity);}' }));
    root.add(atmosphere);
    (async () => {
      const [albedo, normal, rough, cloudsTex] = await Promise.all([safeLoad(TEX.albedo), safeLoad(TEX.normal), safeLoad(TEX.rough), safeLoad(TEX.clouds)]);
      if (albedo) { earthMat.map = albedo; earthMat.color.set(0xffffff); }
      if (normal) { earthMat.normalMap = normal; earthMat.normalScale = new THREE.Vector2(0.35, 0.35); }
      if (rough) { earthMat.roughnessMap = rough; earthMat.roughness = 0.78; }
      if (cloudsTex) { (clouds.material as THREE.MeshLambertMaterial).map = cloudsTex; (clouds.material as THREE.MeshLambertMaterial).needsUpdate = true; } else { clouds.visible = false; }
      earthMat.needsUpdate = true;
    })();
    const resize = () => { const el = ref.current!; const { clientWidth: w, clientHeight: h } = el; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }; resize(); const ro = new ResizeObserver(resize); ro.observe(ref.current);
    let auto = true, rotationY = earth.rotation.y, velocity = 0, dragging = false, lastX = 0; let parX = 0, parY = 0;
    const pd = (e: PointerEvent) => { dragging = true; auto = false; lastX = e.clientX; };
    const pm = (e: PointerEvent) => { if (dragging){ const dx=(e.clientX-lastX)/200; lastX=e.clientX; velocity=dx; } };
    const pu = () => { dragging=false; setTimeout(()=>auto=true,2200); };
    renderer.domElement.addEventListener('pointerdown', pd); window.addEventListener('pointermove', pm); window.addEventListener('pointerup', pu);
    const mm = (e: MouseEvent) => { const el = ref.current!; const r = el.getBoundingClientRect(); const mx=(e.clientX-r.left)/r.width; const my=(e.clientY-r.top)/r.height; parX=(mx-0.5)*0.25; parY=(my-0.5)*0.2; }; window.addEventListener('mousemove', mm);
    const clock = new THREE.Clock(); let raf=0; const tick=()=>{ clock.getDelta(); if (auto && !dragging) velocity += 0.0006; velocity*=0.94; rotationY+=velocity; earth.rotation.y=rotationY; clouds.rotation.y=rotationY*1.03; root.rotation.x += (parY-root.rotation.x)*0.08; root.rotation.y += (parX-root.rotation.y)*0.08; renderer.render(scene,camera); raf=requestAnimationFrame(tick); }; raf=requestAnimationFrame(tick);
    return ()=>{ cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('pointermove', pm); window.removeEventListener('pointerup', pu); window.removeEventListener('mousemove', mm); renderer.domElement.removeEventListener('pointerdown', pd); ref.current?.removeChild(renderer.domElement); scene.traverse(obj=>{ // @ts-ignore
      if (obj.geometry) obj.geometry.dispose?.(); // @ts-ignore
      if (obj.material){ const m=obj.material; if(Array.isArray(m)) m.forEach(x=>x.dispose?.()); else m.dispose?.(); }}); renderer.dispose(); };
  }, [initialRotationDeg]);
  return <div ref={ref} className={`${className} -z-10 w-full h-full`} aria-hidden />;
}
