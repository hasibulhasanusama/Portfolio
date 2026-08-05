/* AUDIO ENGINE */
const AudioEngine = {
    ctx: null,
    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
    },
    playHover() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 0.08);
    },
    playClick() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 0.12);
    },
    playDoorOpen() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(70, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(35, this.ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 0.8);
    }
};

/* DATA STORE */
let isAdminMode = false;
let activeOpenDoor = null;

const PORTFOLIO_DATA = {
    profile: {
        name: "ALEXANDER VANCE",
        title: "Lead Architectural & WebGL Engineer",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        cvUrl: "#",
        bio: "Crafting immersive 3D spatial experiences, Gothic architectural rendering, and next-gen interactive web environments."
    },
    101: {
        title: "About Me & Career",
        desc: "Over 8 years of engineering high-performance WebGL 3D scenes for web and spatial computing.",
        experience: [
            { role: "Lead 3D Architect", company: "Vanguard Spatial", years: "2021 - Present", desc: "Leading WebGL engine development for architectural tours." },
            { role: "Senior Graphics Dev", company: "Nexus Engine", years: "2018 - 2021", desc: "Built shader pipelines and physical light baking tools." }
        ]
    },
    102: {
        title: "Featured Works",
        items: [
            { name: "3D Gothic Mansion", desc: "Real-time shadow-mapped indoor environment with custom lighting.", link: "#" },
            { name: "WebGL Car Configurator", desc: "Interactive 60FPS PBR material customizer.", link: "#" },
            { name: "Spatial Data Globe", desc: "Global telemetry visualizer rendering 100k+ instanced points.", link: "#" }
        ]
    },
    103: {
        title: "Core Skills",
        skills: [
            { name: "Three.js & WebGL", level: 95 },
            { name: "GLSL Shaders & PBR", level: 88 },
            { name: "JavaScript / ES6+", level: 92 },
            { name: "Blender 3D Modeling", level: 82 },
            { name: "GSAP Animations", level: 90 }
        ]
    },
    104: {
        title: "Awards & Honors",
        list: [
            { title: "Best WebGL Experience 2024", org: "Awwwards Site of the Day" },
            { title: "Architectural Graphics Innovation", org: "3D Web Summit London" },
            { title: "Top Open-Source Contributor", org: "Three.js Community" }
        ]
    },
    105: {
        title: "Certificates",
        certs: [
            { name: "AWS Certified Solutions Architect", year: "2023" },
            { name: "Three.js Master Developer Certification", year: "2022" },
            { name: "Professional Unreal Engine Dev", year: "2021" }
        ]
    },
    106: {
        title: "Get In Touch",
        email: "alexander.vance@architect3d.com",
        phone: "+1 (555) 019-2834",
        location: "New York City, USA"
    }
};

/* THREE.JS SCENE SETUP */
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x1a120c);
scene.fog = new THREE.FogExp2();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9; 
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.02; 
controls.minDistance = 1.0;                 
controls.maxDistance = 25.0;                
controls.enablePan = true;  

/* TEXTURE GENERATORS */
function createRoyalMarbleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a0503';
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.strokeStyle = 'rgba(180, 140, 60, 0.08)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 1024, 0);
        ctx.bezierCurveTo(
            Math.random() * 1024, 300,
            Math.random() * 1024, 700,
            Math.random() * 1024, 1024
        );
        ctx.stroke();
    }

    ctx.strokeStyle = '#1a0d06';
    ctx.lineWidth = 6;
    const tileSize = 256;
    for (let x = 0; x <= 1024; x += tileSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += tileSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);
    return tex;
}

function createDoorPlateCanvas(num, text) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; 
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(0.5, '#7a5c12');
    grad.addColorStop(1, '#3a2703');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = '#0a0502';
    ctx.lineWidth = 28;
    ctx.strokeRect(20, 20, 984, 472);

    ctx.fillStyle = '#080402';
    ctx.font = '900 150px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(num, 512, 220);

    ctx.font = '700 55px "Cinzel", serif';
    ctx.fillText(text.toUpperCase(), 512, 370);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;

    return texture;
}

function createProfileCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1536;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#090402';
    ctx.fillRect(0, 0, 1536, 2048);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 32;
    ctx.strokeRect(40, 40, 1456, 1968);

    ctx.fillStyle = '#d4af37';
    ctx.font = '900 92px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(PORTFOLIO_DATA.profile.name, 768, 1520);

    ctx.fillStyle = '#9e9082';
    ctx.font = '600 48px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(PORTFOLIO_DATA.profile.title, 768, 1660);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(768, 760, 440, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 328, 320, 880, 880);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(768, 760, 450, 0, Math.PI * 2);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 20;
        ctx.stroke();
        texture.needsUpdate = true;
    };
    img.src = PORTFOLIO_DATA.profile.avatarUrl;
    return texture;
}

/* AMBIENT LIGHTING */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); 
scene.add(ambientLight);

const fillLight = new THREE.PointLight(0xd4af37, 3.0, 30);
fillLight.position.set(0, 8, 0);
scene.add(fillLight);

/* MATERIALS */
const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f0805, roughness: 0.9, metalness: 0.1 });
const floorMat = new THREE.MeshStandardMaterial({ map: createRoyalMarbleTexture(), roughness: 0.80, metalness: 0.05});

const doorWoodMat = new THREE.MeshStandardMaterial({ 
    color: 0x2b1810,      
    roughness: 0.85,      
    metalness: 0.05       
});

const frameWoodMat = new THREE.MeshStandardMaterial({ 
    color: 0x1c0e08,      
    roughness: 0.9, 
    metalness: 0.0 
});

const goldMetallicMat = new THREE.MeshStandardMaterial({ 
    color: 0xc5a059, 
    metalness: 0.8, 
    roughness: 0.35 
});

const brassHandleMat = new THREE.MeshStandardMaterial({ 
    color: 0xd4af37, 
    metalness: 0.9, 
    roughness: 0.25 
});

// Room Floor & Ceiling
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorMat);
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
scene.add(floor);

const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: 0x030101, roughness: 0.95 }));
ceiling.position.y = 12; ceiling.rotation.x = Math.PI / 2;
scene.add(ceiling);

/* ROYAL CHANDELIER */
function createChandelier(x, y, z) {
    const chandelierGroup = new THREE.Group();

    const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.5, 16);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const rod = new THREE.Mesh(rodGeo, goldMat);
    rod.position.y = 1.75;
    chandelierGroup.add(rod);

    const ringGeo = new THREE.TorusGeometry(1.8, 0.1, 16, 32);
    const ring = new THREE.Mesh(ringGeo, goldMat);
    ring.rotation.x = Math.PI / 2;
    chandelierGroup.add(ring);

    const crystalMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 0.9, thickness: 0.5 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffea8c });

    const bulbCount = 8;
    const radius = 1.8;

    for (let i = 0; i < bulbCount; i++) {
        const angle = (i / bulbCount) * Math.PI * 2;
        const bx = Math.cos(angle) * radius;
        const bz = Math.sin(angle) * radius;

        const bulbGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
        bulbMesh.position.set(bx, 0.1, bz);
        chandelierGroup.add(bulbMesh);

        const crystalGeo = new THREE.ConeGeometry(0.12, 0.5, 6);
        const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
        crystalMesh.position.set(bx, -0.4, bz);
        crystalMesh.rotation.z = Math.PI;
        chandelierGroup.add(crystalMesh);
    }

    const chandelierLight = new THREE.PointLight(0xffea8c, 3, 25);
    chandelierLight.position.set(0, -0.2, 0);
    chandelierLight.castShadow = true;
    chandelierGroup.add(chandelierLight);

    chandelierGroup.position.set(x, y, z);
    return chandelierGroup;
}

const royalChandelier = createChandelier(0, 8.5, 0);
scene.add(royalChandelier);

// Walls
function createWall(w, h, x, y, z, rotY) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
    wall.position.set(x, y, z); wall.rotation.y = rotY; wall.receiveShadow = true;
    scene.add(wall);
}
createWall(40, 12, 0, 6, -20, 0);             
createWall(40, 12, -20, 6, 0, Math.PI / 2);    
createWall(40, 12, 20, 6, 0, -Math.PI / 2);   
createWall(40, 12, 0, 6, 20, Math.PI);        

/* DOORS CONFIGURATION */
const interactiveObjects = [];

const doorsConfig = [
    { id: "101", title: "About Me", pos: [-7, 3.8, -19.8], rotY: 0, camPos: [-7, 3.8, -12], camTarget: [-7, 3.8, -19.8], insidePos: [-7, 3.8, -28] },
    { id: "102", title: "Projects", pos: [7, 3.8, -19.8], rotY: 0, camPos: [7, 3.8, -12], camTarget: [7, 3.8, -19.8] },
    { id: "103", title: "Skills", pos: [19.8, 3.8, -7], rotY: -Math.PI / 2, camPos: [12, 3.8, -7], camTarget: [19.8, 3.8, -7] },
    { id: "104", title: "Awards", pos: [19.8, 3.8, 7], rotY: -Math.PI / 2, camPos: [12, 3.8, 7], camTarget: [19.8, 3.8, 7] },
    { id: "105", title: "Documents", pos: [7, 3.8, 19.8], rotY: Math.PI, camPos: [7, 3.8, 12], camTarget: [7, 3.8, 19.8] },
    { id: "106", title: "Contact", pos: [-7, 3.8, 19.8], rotY: Math.PI, camPos: [-7, 3.8, 12], camTarget: [-7, 3.8, 19.8] }
];

doorsConfig.forEach(cfg => {
    const frameGroup = new THREE.Group();
    frameGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    frameGroup.rotation.y = cfg.rotY;

    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 8.0, 0.35), frameWoodMat);
    frameGroup.add(outerFrame);

    const pivot = new THREE.Group();
    pivot.position.set(-1.6, 0, 0.08);
    frameGroup.add(pivot);

    const door = new THREE.Mesh(new THREE.BoxGeometry(3.2, 7.3, 0.18), doorWoodMat);
    door.position.set(1.6, 0, 0);
    door.castShadow = true;
    pivot.add(door);

    const panel1 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.7, 0.24), doorWoodMat);
    panel1.position.set(1.6, 1.2, 0);
    pivot.add(panel1);

    const panel2 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.7, 0.24), doorWoodMat);
    panel2.position.set(1.6, -1.8, 0);
    pivot.add(panel2);

    const handlePlate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.9, 0.26), brassHandleMat);
    handlePlate.position.set(2.85, 0, 0);
    pivot.add(handlePlate);

    const handleKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.35, 16), brassHandleMat);
    handleKnob.rotation.x = Math.PI / 2;
    handleKnob.position.set(2.85, 0, 0.22);
    pivot.add(handleKnob);

    const plateTex = createDoorPlateCanvas(cfg.id, cfg.title);
    const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 1.1), 
        new THREE.MeshBasicMaterial({ map: plateTex })
    );
    plate.position.set(1.6, 1.85, 0.13);
    pivot.add(plate);

    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, -3.5, 2.0);
    frameGroup.add(spotTarget);

    const doorSpot = new THREE.SpotLight(0xfffaed, 0.8); 
    doorSpot.position.set(0, 4.0, 1.8);
    doorSpot.target = spotTarget;
    doorSpot.angle = Math.PI / 5; 
    doorSpot.penumbra = 0.8;
    doorSpot.distance = 18;
    doorSpot.castShadow = true;
    frameGroup.add(doorSpot);

    door.userData = { doorId: cfg.id, title: cfg.title, pivot: pivot, camPos: cfg.camPos, camTarget: cfg.camTarget };
    plate.userData = door.userData;

    interactiveObjects.push(door, plate);
    scene.add(frameGroup);
});

/* PROFILE FRAME WITH FIXED MATERIAL & SPOTLIGHT */
const profileFrame = new THREE.Mesh(new THREE.BoxGeometry(6.6, 8.6, 0.22), goldMetallicMat);
profileFrame.position.set(-19.8, 5.8, 0);
profileFrame.rotation.y = Math.PI / 2;
scene.add(profileFrame);

const profileTex = createProfileCanvas();
const profileArt = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 8.2), new THREE.MeshBasicMaterial({ map: profileTex }));
profileArt.position.set(-19.67, 5.8, 0);
profileArt.rotation.y = Math.PI / 2;
profileArt.userData = {
    doorId: "profile",
    title: "Profile Wall Art",
    camPos: [-12, 5.8, 0],
    camTarget: [-19.8, 5.8, 0]
};
interactiveObjects.push(profileArt);
scene.add(profileArt);

const profileSpot = new THREE.SpotLight(0xfffaed, 0.4);
profileSpot.position.set(-16, 9.5, 0);
profileSpot.target = profileArt;
profileSpot.angle = Math.PI / 6;
profileSpot.penumbra = 0.9;
scene.add(profileSpot);

/* CROSSED SWORDS & SHIELD WALL EMBLEM */
/* DOUBLE CANDLE WALL SCONCE (FOR 4 CORNERS) */
function createCornerCandleLamp(x, y, z, rotY) {
    const sconceGroup = new THREE.Group();

    // ম্যাটেরিয়াল (ব্ল্যাক আয়রন, গোল্ড/ব্রাস ও ক্যান্ডেল ফ্লেম)
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.4 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.3 });
    const candleWaxMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.9 });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const glassTrayMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, transmission: 0.8, transparent: true });

    // ১. দেয়ালের ব্যাকপ্লেট (Black Circle Base)
    const backplate = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24), ironMat);
    backplate.rotation.x = Math.PI / 2;
    sconceGroup.add(backplate);

    // ২. বাঁকানো আয়রন কার্ভ আর্মস (Curved Iron Arms)
    function createCurvedArm(direction) {
        const armGroup = new THREE.Group();

        // কার্ভড রড
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(direction * 0.4, -0.4, 0.2),
            new THREE.Vector3(direction * 0.7, -0.1, 0.4),
            new THREE.Vector3(direction * 0.75, 0.3, 0.45)
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.035, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, ironMat);
        armGroup.add(tubeMesh);

        // গ্লাস ট্রে (Glass Plate under candle)
        const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.15, 0.04, 16), glassTrayMat);
        tray.position.set(direction * 0.75, 0.3, 0.45);
        armGroup.add(tray);

        // মোমবাতি স্ট্যান্ড/হোল্ডার (Candle Tube)
        const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16), candleWaxMat);
        candle.position.set(direction * 0.75, 0.58, 0.45);
        armGroup.add(candle);

        // ক্যান্ডেল সকেট স্লিভ (Base Accent)
        const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.12, 16), brassMat);
        socket.position.set(direction * 0.75, 0.35, 0.45);
        armGroup.add(socket);

        // ক্যান্ডেল বাল্ব/ফ্লেম (Flame Tip)
        const flameGeo = new THREE.ConeGeometry(0.07, 0.25, 12);
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.set(direction * 0.75, 0.92, 0.45);
        armGroup.add(flame);

        // সফট ওয়ার্ম পয়েন্ট লাইট
        const candleLight = new THREE.PointLight(0xff9933, 0.8, 6);
        candleLight.position.set(direction * 0.75, 0.95, 0.5);
        armGroup.add(candleLight);

        return armGroup;
    }

    // বাম ও ডান দুটি ক্যান্ডেল আর্ম যোগ করা
    sconceGroup.add(createCurvedArm(-1)); // Left Candle
    sconceGroup.add(createCurvedArm(1));  // Right Candle

    sconceGroup.position.set(x, y, z);
    sconceGroup.rotation.y = rotY;
    scene.add(sconceGroup);
}

/* ALL 4 CORNER CANDLE LAMPS */
// ১. সামনের বাম কর্নার
createCornerCandleLamp(-18.8, 5.5, -18.8, Math.PI / 4);

// ২. সামনের ডান কর্নার
createCornerCandleLamp(18.8, 5.5, -18.8, -Math.PI / 4);

// ৩. পেছনের ডান কর্নার
createCornerCandleLamp(18.8, 5.5, 18.8, -Math.PI * 0.75);

// ৪. পেছনের বাম কর্নার
createCornerCandleLamp(-18.8, 5.5, 18.8, Math.PI * 0.75);

/* DYNAMIC WOOD TEXTURE GENERATOR FOR SHIELD */
function createRealWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // বেস ডার্ক মেহগনি/ওক ব্যাকগ্রাউন্ড
    ctx.fillStyle = '#2c180b';
    ctx.fillRect(0, 0, 512, 512);

    // কাঠের প্রাকৃতিক রিং এবং ফাইবার স্ট্রিপস
    ctx.strokeStyle = 'rgba(60, 32, 12, 0.4)';
    for (let i = 0; i < 200; i++) {
        ctx.lineWidth = Math.random() * 4 + 1;
        ctx.beginPath();
        ctx.arc(256 + (Math.random() * 40 - 20), 256 + (Math.random() * 40 - 20), i * 2.5, 0, Math.PI * 2);
        ctx.stroke();
    }

    // কাঠের ফাইবার লাইন
    ctx.strokeStyle = 'rgba(15, 8, 3, 0.5)';
    for (let j = 0; j < 80; j++) {
        ctx.lineWidth = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, 0);
        ctx.lineTo(Math.random() * 512, 512);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

// গ্লোবাল উড টেক্সচার ইনস্ট্যান্স
const realWoodTexture = createRealWoodTexture();

/* CROSSED SWORDS & WOODEN SHIELD EMBLEM */
function createSwordsEmblem(x, y, z, rotY) {
    const group = new THREE.Group();

    // ১. টেক্সচারযুক্ত রাজকীয় কাঠের ম্যাটেরিয়াল (Dark Royal Carved Wood)
    const royalWoodMat = new THREE.MeshStandardMaterial({ 
        map: realWoodTexture,
        color: 0x5a3219,     
        roughness: 0.65, 
        metalness: 0.1 
    });

    const plaqueShape = new THREE.Shape();
    plaqueShape.moveTo(0, 1.2);
    plaqueShape.quadraticCurveTo(1.0, 1.0, 1.0, 0);
    plaqueShape.quadraticCurveTo(0.8, -1.2, 0, -1.6);
    plaqueShape.quadraticCurveTo(-0.8, -1.2, -1.0, 0);
    plaqueShape.quadraticCurveTo(-1.0, 1.0, 0, 1.2);

    const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.06, bevelThickness: 0.06 };
    const plaqueGeo = new THREE.ExtrudeGeometry(plaqueShape, extrudeSettings);
    const plaque = new THREE.Mesh(plaqueGeo, royalWoodMat);
    plaque.position.z = -0.05;
    plaque.castShadow = true;
    group.add(plaque);

    // ২. বাস্তবসম্মত স্টিল চাকুর ব্লেড ও অ্যান্টিক ব্রাস হ্যান্ডেল
    const realKnifeSteelMat = new THREE.MeshStandardMaterial({ 
        color: 0x999999,   
        metalness: 0.8,   
        roughness: 0.3    
    });
    
    const darkBrassMat = new THREE.MeshStandardMaterial({ 
        color: 0x3d3015,   
        metalness: 0.6, 
        roughness: 0.5 
    });

    // ৩. চাকু/তরবারি
    function createSword() {
        const sword = new THREE.Group();

        // ব্লেড
        const bladeGeo = new THREE.BoxGeometry(0.1, 3.2, 0.02);
        const blade = new THREE.Mesh(bladeGeo, realKnifeSteelMat);
        blade.position.y = 0.6;
        blade.castShadow = true;
        sword.add(blade);

        // গার্ড
        const guardGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.15, 16);
        const guard = new THREE.Mesh(guardGeo, darkBrassMat);
        guard.position.y = -0.8;
        sword.add(guard);

        // হ্যান্ডেল গ্রিপ (কাঠের তৈরি)
        const handleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 12);
        const handle = new THREE.Mesh(handleGeo, royalWoodMat);
        handle.position.y = -1.25;
        sword.add(handle);

        // হেড
        const pommelGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const pommel = new THREE.Mesh(pommelGeo, darkBrassMat);
        pommel.position.y = -1.65;
        sword.add(pommel);

        return sword;
    }

    const sword1 = createSword();
    sword1.rotation.z = Math.PI / 4;
    sword1.position.z = 0.08;
    group.add(sword1);

    const sword2 = createSword();
    sword2.rotation.z = -Math.PI / 4;
    sword2.position.z = 0.08;
    group.add(sword2);

    // ৪. মাঝখানের কাঠের খোদাই করা গোল্ডেন-উড ট্রিম শিল্ড
    const centerShieldGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.08, 32);
    const centerShield = new THREE.Mesh(centerShieldGeo, royalWoodMat);
    centerShield.rotation.x = Math.PI / 2;
    centerShield.position.z = 0.15;
    centerShield.castShadow = true;
    group.add(centerShield);

    // বর্ডার স্টিল রিং
    const innerRingGeo = new THREE.TorusGeometry(0.5, 0.02, 16, 32);
    const innerRing = new THREE.Mesh(innerRingGeo, realKnifeSteelMat);
    innerRing.position.z = 0.20;
    group.add(innerRing);

    group.position.set(x, y, z);
    group.rotation.y = rotY;
    scene.add(group);
}

/* ALL WALL EMBLEMS BETWEEN DOORS */
createSwordsEmblem(0, 5.5, -19.8, 0);
createSwordsEmblem(19.8, 5.5, 0, -Math.PI / 2);
createSwordsEmblem(0, 5.5, 19.8, Math.PI);

/* INITIAL CAMERA START POSITION */
camera.position.set(0, 4.5, 0.1);
controls.target.set(0, 4, -10);

/* KEYBOARD CONTROLS SYSTEM */
const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (keys.hasOwnProperty(e.key.toLowerCase()) || keys.hasOwnProperty(e.key)) {
        keys[e.key.toLowerCase()] = true;
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key.toLowerCase()) || keys.hasOwnProperty(e.key)) {
        keys[e.key.toLowerCase()] = false;
        keys[e.key] = false;
    }
});

function handleKeyboardMovement() {
    const moveSpeed = 0.25;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const sideDir = new THREE.Vector3(-dir.z, 0, dir.x);

    if (keys.w || keys.ArrowUp) {
        camera.position.addScaledVector(dir, moveSpeed);
        controls.target.addScaledVector(dir, moveSpeed);
    }
    if (keys.s || keys.ArrowDown) {
        camera.position.addScaledVector(dir, -moveSpeed);
        controls.target.addScaledVector(dir, -moveSpeed);
    }
    if (keys.a || keys.ArrowLeft) {
        camera.position.addScaledVector(sideDir, -moveSpeed);
        controls.target.addScaledVector(sideDir, -moveSpeed);
    }
    if (keys.d || keys.ArrowRight) {
        camera.position.addScaledVector(sideDir, moveSpeed);
        controls.target.addScaledVector(sideDir, moveSpeed);
    }
}

/* CAMERA NAVIGATION FUNCTION */
function moveCameraTo(targetKey) {
    AudioEngine.playClick();
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    if (targetKey === 'center') {
        gsap.to(camera.position, { duration: 1.5, x: 0, y: 4.5, z: 0.1, ease: "power2.inOut" });
        gsap.to(controls.target, { duration: 1.5, x: 0, y: 4, z: -10, ease: "power2.inOut" });
        return;
    }

    const targetObj = interactiveObjects.find(o => o.userData.doorId === targetKey);
    if (targetObj) {
        const u = targetObj.userData;
        triggerDoorOpenSequence(targetObj, u);
    }
}

/* RAYCASTING & HOVER */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('door-tooltip');
let hoveredObject = null;

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        const data = obj.userData;

        if (hoveredObject !== obj) {
            hoveredObject = obj;
            AudioEngine.playHover();
        }

        tooltip.style.display = 'block';
        tooltip.style.left = e.clientX + 'px';
        tooltip.style.top = e.clientY + 'px';
        tooltip.innerHTML = data.doorId === "profile" ? "🖼️ <b>Royal Portrait</b>" : `🚪 Chamber ${data.doorId}: <b>${data.title}</b>`;
        document.body.style.cursor = 'pointer';
    } else {
        hoveredObject = null;
        tooltip.style.display = 'none';
        document.body.style.cursor = 'default';
    }
});

window.addEventListener('click', (e) => {
    if (e.target.closest('header') || e.target.closest('.modal-overlay')) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        const clickedObj = intersects[0].object;
        const data = clickedObj.userData;
        if (data.doorId) triggerDoorOpenSequence(clickedObj, data);
    }
});

function triggerDoorOpenSequence(obj, data) {
    AudioEngine.playClick();

    gsap.to(camera.position, { duration: 1.5, x: data.camPos[0], y: data.camPos[1], z: data.camPos[2], ease: "power2.inOut" });
    gsap.to(controls.target, { duration: 1.5, x: data.camTarget[0], y: data.camTarget[1], z: data.camTarget[2], ease: "power2.inOut" });

    if (activeOpenDoor && activeOpenDoor !== data.pivot) {
        gsap.to(activeOpenDoor.rotation, { duration: 0.6, y: 0 });
    }

    if (data.pivot) {
        activeOpenDoor = data.pivot;
        AudioEngine.playDoorOpen();
        gsap.to(data.pivot.rotation, {
            duration: 1.0, y: -Math.PI / 2.2, ease: "power2.out", delay: 0.4,
            onComplete: () => showModal(data.doorId)
        });
    } else {
        setTimeout(() => showModal(data.doorId), 600);
    }
}

/* MODAL ENGINE */
function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    document.getElementById('toast-message').innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

const modal = document.getElementById('contentModal');
const modalDoorTag = document.getElementById('modalDoorTag');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

function showModal(doorId) {
    modalDoorTag.innerText = doorId === "profile" ? "PORTRAIT" : `CHAMBER ${doorId}`;
    modalBody.innerHTML = '';

    if (doorId === "profile") {
        const p = PORTFOLIO_DATA.profile;
        modalTitle.innerText = p.name;
        modalBody.innerHTML = `
            <p style="color:var(--gold-primary); font-weight:700; font-size:16px; font-family:'Cinzel', serif;">${p.title}</p>
            <p style="margin-top:10px;">${p.bio}</p>
            <a href="${p.cvUrl}" target="_blank" class="btn-action"><i class="fa-solid fa-scroll"></i> Download Official Scroll</a>
        `;
    } else {
        const info = PORTFOLIO_DATA[doorId];
        modalTitle.innerText = info.title;

        if (doorId === "101") {
            modalBody.innerHTML = `
                <p>${info.desc}</p>
                <div class="grid-layout">
                    ${info.experience.map(e => `
                        <div class="info-card">
                            <h4>${e.role}</h4>
                            <p style="color:var(--gold-primary); font-weight:600;">${e.company} (${e.years})</p>
                            <p style="font-size:12px; margin-top:4px;">${e.desc}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (doorId === "102") {
            modalBody.innerHTML = `
                <div class="grid-layout">
                    ${info.items.map(i => `
                        <div class="info-card">
                            <h4>${i.name}</h4>
                            <p>${i.desc}</p>
                            <a href="${i.link}" class="btn-action" style="padding:6px 12px; font-size:11px;">View Demo</a>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (doorId === "103") {
            modalBody.innerHTML = `
                <div class="grid-layout">
                    ${info.skills.map(s => `
                        <div class="info-card">
                            <h4>${s.name}</h4>
                            <p style="color:var(--gold-primary); font-weight:700;">Proficiency: ${s.level}%</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (doorId === "104") {
            modalBody.innerHTML = `
                <div class="grid-layout">
                    ${info.list.map(a => `
                        <div class="info-card">
                            <h4>${a.title}</h4>
                            <p style="color:var(--gold-primary);">${a.org}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (doorId === "105") {
            modalBody.innerHTML = `
                <div class="grid-layout">
                    ${info.certs.map(c => `
                        <div class="info-card">
                            <h4>${c.name}</h4>
                            <p>Issued: ${c.year}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (doorId === "106") {
            modalBody.innerHTML = `
                <div class="info-card">
                    <p><strong><i class="fa-solid fa-envelope"></i> Email:</strong> ${info.email}</p>
                    <p style="margin-top:6px;"><strong><i class="fa-solid fa-phone"></i> Phone:</strong> ${info.phone}</p>
                    <p style="margin-top:6px;"><strong><i class="fa-solid fa-location-dot"></i> Location:</strong> ${info.location}</p>
                </div>
            `;
        }
    }
    modal.classList.add('active');
}

function closeModal() {
    AudioEngine.playClick();
    modal.classList.remove('active');
    if (activeOpenDoor) {
        gsap.to(activeOpenDoor.rotation, { duration: 0.8, y: 0 });
        activeOpenDoor = null;
    }
}

/* RENDER LOOP */
function animate() {
    requestAnimationFrame(animate);

    handleKeyboardMovement();

    camera.position.x = Math.max(-18, Math.min(18, camera.position.x));
    camera.position.z = Math.max(-18, Math.min(18, camera.position.z));
    camera.position.y = Math.max(1, Math.min(10, camera.position.y));

    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});