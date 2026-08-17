// বোতামে ক্লিক করলে ছবি ডানে-বামে স্লাইড করার ফাংশন
window.slideCarousel = function(btn, direction) {
    const container = btn.parentElement;
    const track = container.querySelector('.carousel-track');
    const slideWidth = track.clientWidth;
    track.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
};

// স্ক্রোল হওয়ার সাথে সাথে বাটন হাইড/শো করার ফাংশন
window.handleCarouselScroll = function(track) {
    const container = track.parentElement;
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    if (!prevBtn || !nextBtn) return;

    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;

    // একদম শুরুতে থাকলে বামের অ্যারো হাইড হবে
    if (scrollLeft <= 10) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
    }

    // একদম শেষে থাকলে ডানের অ্যারো হাইড হবে
    if (scrollLeft >= maxScroll - 10) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'flex';
    }
};/* AUDIO ENGINE */
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
        name: "Imtiaz Khandoker",
        title: "SOFTWARE ENGINEER & 3D WEB DEVELOPER",
        avatarUrl:"https://scontent.fdac138-2.fna.fbcdn.net/v/t39.30808-6/764661125_1814656906386765_1344996224163794065_n.jpg?stp=dst-jpg_tt6&cstp=mx2014x2048&ctp=s2014x2048&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ZpCnOAF8p7oQ7kNvwHy6QPp&_nc_oc=AdrP32L1x0DDw3TV_i9kZrqX44maliqJcpIXw-K0Ce4gxMqzU5S24jeoubkDR8AywBI&_nc_zt=23&_nc_ht=scontent.fdac138-2.fna&_nc_gid=MQUlPoCBaZDH6EnSbHwqLg&_nc_ss=7b2a8&oh=00_AQFw3xrNijMlAtwjeW2l22AyCX8yDO2Z8oSgvrmi-CC93A&oe=6A87FFB8",
        cvUrl: "Imtiaz Resume.pdf",
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
            { name: "OCTA", desc: "Organized Cyber Threat Alliance platform for threat intelligence and cyber security collaboration.", link: "#" },
            { name: "Smart Parking System", desc: "Automated parking management using Arduino, IR sensors, and servo motor.", link: "#" },
            { name: "Alert Rader System", desc: "Real-time object detection and radar visualization using Arduino and Processing.", link: "#" },
            { name: "3D Portfolio", desc: "Interactive 3D portfolio with animations, smooth transitions, and responsive design.", link: "#" }
        ]
    },
  103: {
    title: "Core Skills & Languages",
    skills: [
        { name: "HTML", level: 93 },
        { name: "CSS", level: 95 },
        { name: "JavaScript / ES6+", level: 92 },
        { name: "Java", level: 90 },
        { name: "C", level: 80 },
        { name: "MySQL", level: 89 }
    ],
    languages: [
        { name: "Bangla", level: 99 },
        { name: "English", level: 70 },
        { name: "Hindi", level: 90 },
        { name: "Arabic", level: 60 }
    ]
},
104: {
    title: "Awards & Certificates",
    awards: [
      { 
    title: "CyberSecurity Awards Day 2026", 
    subtitle: "IDEA Presentation Competition",
    images: [
        "download (3).jfif",
        "download (4).jfif",
        "download (5).jfif"
    ]
},
        { 
            title: "BIZ case Battle 2026", 
            subtitle: "Business Idea Presentation Competition",
            image: "download.jfif"
        },
        { 
            title: "Innovate for Humanity 2026", 
            subtitle: "Idea Context",
            image: "download (1).jfif"
        },
                { 
            title: "SimpleLearn SKIllUP", 
            subtitle: "OOPs in Java",
            image: "download (2).jfif"
        }
    ]
},
    105: {
    title: "Get In Touch",
    email: "hasibulhasanusama@gmail.com",
    phone: "+880 1708302032",
    location: "Gazipur,Dhaka,Bangladesh",
    facebook: "https://facebook.com/hasibulhasanosama", // আপনার লিংক বসাবেন
    whatsapp: "https://wa.me/8801708302032",
    github: "https://github.com/hasibulhasanusama",
    linkedin: "https://linkedin.com/in/hasibul-hasan-usama-1435653b7",
    discord: "https://discord.com/users/hasibulhasanusama_65967"
},
    106: {
        title: "AI Assistant",
        description: "Ask anything about Hasibul Hasan Usama"
    }
};

/* THREE.JS SCENE SETUP */
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x1a120c);
scene.fog = new THREE.FogExp2();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// ক্যামেরা তৈরির পর এটি বসাবেন
const isMobile = window.innerWidth < 768;
camera.fov = isMobile ? 75 : 60; // মোবাইলে ৭৫, পিসিতে ৬০
camera.updateProjectionMatrix();
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
    { id: "105", title: "Contact", pos: [7, 3.8, 19.8], rotY: Math.PI, camPos: [7, 3.8, 12], camTarget: [7, 3.8, 19.8] },
    { id: "106", title: "AI", pos: [-7, 3.8, 19.8], rotY: Math.PI, camPos: [-7, 3.8, 12], camTarget: [-7, 3.8, 19.8] }
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


/* ORBIT CONTROLS SMOOTHNESS & ZOOM CONFIG */
 /* ORBIT CONTROLS SMOOTHNESS & ZOOM CONFIG */
/* ORBIT CONTROLS */
if (typeof controls !== 'undefined' && controls) {

    controls.enableDamping = true;
    controls.dampingFactor = 0.035;

    // Pan বন্ধ
    controls.enablePan = false;

    // Rotate
    controls.enableRotate = true;
    controls.rotateSpeed = 0.6;

    // Zoom
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;

    // Camera angle
    controls.minPolarAngle = 0.1;
    controls.maxPolarAngle = Math.PI / 1.8;

    // Zoom limit
    controls.minDistance = 2;
    controls.maxDistance = 20;
}
/* KEYBOARD CONTROLS SYSTEM (WITH SMOOTH PHYSICS) */
const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

const velocity = new THREE.Vector3();
const targetVelocity = new THREE.Vector3();

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.fov = width < 768 ? 75 : 60;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// কীবোর্ড প্রেস ট্র্যাকিং ইভেন্ট লিসেনার
window.addEventListener('keydown', (e) => {
    // ইনপুট ফিল্ডে টাইপ করার সময় কীবোর্ড দিয়ে ক্যামেরা মুভমেন্ট বন্ধ থাকবে
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// টাচ/মাউস ড্র্যাগ এবং ক্লিকের পার্থক্য নির্ণয়ের ট্র্যাকিং
let pointerStartX = 0, pointerStartY = 0;

window.addEventListener('pointerdown', (e) => {
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
});

// মাউস ও টাচ ট্যাপ ইভেন্ট লিসেনার (দরজা খোলার জন্য)
window.addEventListener('pointerup', (event) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    // ইউজার যদি স্ক্রিন ড্র্যাগ বা স্লাইড করে, তবে দরজা খুলবে না (শুধুমাত্র ডিরেক্ট ট্যাপ/ক্লিকে খুলবে)
    const deltaX = Math.abs(event.clientX - pointerStartX);
    const deltaY = Math.abs(event.clientY - pointerStartY);
    if (deltaX > 8 || deltaY > 8) return;

    const mousePos = getPointerPos(event);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePos, camera);

    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        while (clickedObject && (!clickedObject.userData || !clickedObject.userData.doorId) && clickedObject.parent) {
            clickedObject = clickedObject.parent;
        }

        const data = clickedObject ? clickedObject.userData : null;
        if (data && data.doorId) {
            triggerDoorOpenSequence(clickedObject, data);
        }
    }
});

// স্মুথ কীবোর্ড মুভমেন্ট লজিক (Inertia + Lerp)
function handleKeyboardMovement() {

    if (typeof modal !== 'undefined' && modal && modal.classList.contains('active')) {
        return;
    }

    const maxSpeed = 0.12;
    const acceleration = 0.08;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const sideDir = new THREE.Vector3(-dir.z, 0, dir.x);
    const moveDir = new THREE.Vector3();

    if (keys.w || keys.ArrowUp) moveDir.add(dir);
    if (keys.s || keys.ArrowDown) moveDir.sub(dir);
    if (keys.a || keys.ArrowLeft) moveDir.sub(sideDir);
    if (keys.d || keys.ArrowRight) moveDir.add(sideDir);

    if (moveDir.lengthSq() > 0) {
        moveDir.normalize();
        targetVelocity.copy(moveDir.multiplyScalar(maxSpeed));
    } else {
        targetVelocity.set(0, 0, 0);
    }

    velocity.lerp(targetVelocity, acceleration);

    if (velocity.lengthSq() > 0.00001) {

        const nextX = camera.position.x + velocity.x;
        const nextZ = camera.position.z + velocity.z;

        // Safe distance from walls
        const minX = -17.0;
        const maxX = 17.0;
        const minZ = -17.0;
        const maxZ = 17.0;

        // X movement
        if (nextX >= minX && nextX <= maxX) {
            camera.position.x = nextX;
            controls.target.x += velocity.x;
        }

        // Z movement
        if (nextZ >= minZ && nextZ <= maxZ) {
            camera.position.z = nextZ;
            controls.target.z += velocity.z;
        }

        controls.update();
    }
}

/* CAMERA NAVIGATION FUNCTION */
function moveCameraTo(targetKey) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
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
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && (!obj.userData || !obj.userData.doorId) && obj.parent) {
            obj = obj.parent;
        }

        if (obj && obj.userData && obj.userData.doorId) {
            const data = obj.userData;
            if (hoveredObject !== obj) {
                hoveredObject = obj;
                if (typeof AudioEngine !== 'undefined') AudioEngine.playHover();
            }

            if (tooltip) {
                tooltip.style.display = 'block';
                tooltip.style.left = e.clientX + 'px';
                tooltip.style.top = e.clientY + 'px';
                tooltip.innerHTML = data.doorId === "profile" ? "🖼️ <b>Royal Portrait</b>" : `🚪 Chamber ${data.doorId}: <b>${data.title}</b>`;
            }
            document.body.style.cursor = 'pointer';
            return;
        }
    }

    hoveredObject = null;
    if (tooltip) tooltip.style.display = 'none';
    document.body.style.cursor = 'default';
});

function getPointerPos(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    let clientX = event.clientX;
    let clientY = event.clientY;

    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }

    return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1
    };
}

function triggerDoorOpenSequence(obj, data) {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();

    gsap.to(camera.position, { duration: 1.5, x: data.camPos[0], y: data.camPos[1], z: data.camPos[2], ease: "power2.inOut" });
    gsap.to(controls.target, { duration: 1.5, x: data.camTarget[0], y: data.camTarget[1], z: data.camTarget[2], ease: "power2.inOut" });

    if (typeof activeOpenDoor !== 'undefined' && activeOpenDoor && activeOpenDoor !== data.pivot) {
        gsap.to(activeOpenDoor.rotation, { duration: 0.6, y: 0 });
    }

    if (data.pivot) {
        activeOpenDoor = data.pivot;
        if (typeof AudioEngine !== 'undefined') AudioEngine.playDoorOpen();
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
            <a href="${p.cvUrl}" target="_blank" class="btn-action"><i class="fa-solid fa-scroll"></i> Download CV</a>
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
                <div style="display: flex; gap: 24px; flex-wrap: wrap;">
                    <div style="flex: 2; min-width: 280px;">
                        <h3 style="color: var(--gold-primary); font-size: 1rem; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px dashed rgba(212, 175, 55, 0.3); padding-bottom: 6px;">TECHNICAL SKILLS</h3>
                        <div class="grid-layout" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
                            ${(info.skills || []).map(s => `
                                <div class="info-card">
                                    <h4>${s.name}</h4>
                                    <p style="color:var(--gold-primary); font-weight:700;">Proficiency: ${s.level}%</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <h3 style="color: var(--gold-primary); font-size: 1rem; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px dashed rgba(212, 175, 55, 0.3); padding-bottom: 6px;">LANGUAGES</h3>
                        <div class="grid-layout" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
                            ${(info.languages || []).map(l => `
                                <div class="info-card">
                                    <h4>${l.name}</h4>
                                    <p style="color:var(--gold-primary); font-weight:700;">Proficiency: ${l.level}%</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else if (doorId === "104") {
            modalBody.innerHTML = `
                <div class="awards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                    ${(info.awards || []).map((a) => {
                        const imgList = a.images || (a.image ? [a.image] : []);
                        const hasMultiple = imgList.length > 1;
                        return `
                            <div class="award-card" style="border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 8px; padding: 16px; background: rgba(255, 255, 255, 0.02); display: flex; flex-direction: column; gap: 12px;">
                                <div>
                                    <h4 style="color: #f2e3c6; font-size: 1.05rem; letter-spacing: 0.5px; margin-bottom: 6px; text-transform: uppercase;">${a.title}</h4>
                                    <p style="color: var(--gold-primary, #d4af37); font-size: 0.85rem; opacity: 0.9;">${a.subtitle}</p>
                                </div>
                                <div class="carousel-container" style="position: relative; width: 100%; height: 180px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.2);">
                                    ${hasMultiple ? `<button class="prev-btn" onclick="slideCarousel(this, -1)" style="display: none; position: absolute; left: 8px; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.7); color: var(--gold-primary, #d4af37); border: 1px solid rgba(212, 175, 55, 0.5); border-radius: 50%; width: 28px; height: 28px; cursor: pointer; align-items: center; justify-content: center; font-size: 14px;">❮</button>` : ''}
                                    <div class="carousel-track" onscroll="handleCarouselScroll(this)" style="display: flex; width: 100%; height: 100%; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none;">
                                        ${imgList.map(imgSrc => `
                                            <div style="flex: 0 0 100%; width: 100%; height: 100%; scroll-snap-align: start; background: #000;">
                                                <img src="${imgSrc}" alt="${a.title}" style="width: 100%; height: 100%; object-fit: cover;">
                                            </div>
                                        `).join('')}
                                    </div>
                                    ${hasMultiple ? `<button class="next-btn" onclick="slideCarousel(this, 1)" style="display: flex; position: absolute; right: 8px; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.7); color: var(--gold-primary, #d4af37); border: 1px solid rgba(212, 175, 55, 0.5); border-radius: 50%; width: 28px; height: 28px; cursor: pointer; align-items: center; justify-content: center; font-size: 14px;">❯</button>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else if (doorId === "106") {
            modalBody.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 15px; font-family: 'Plus Jakarta Sans', sans-serif;">
                    <p style="color: #a0a0a0; font-size: 0.9rem; margin: 0;">Ask anything about Hasibul's skills, experience, or contact details!</p>
                    <div style="display: flex; gap: 10px; width: 100%;">
                        <input type="text" id="aiInput" placeholder="e.g. What are his main skills?" style="flex: 1; padding: 12px 16px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 8px; color: #fff; font-size: 0.9rem; outline: none; transition: 0.3s;"/>
                        <button id="aiAskBtn" type="button" style="padding: 12px 24px; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; font-size: 0.9rem; white-space: nowrap; transition: 0.3s;"><i class="fa-solid fa-paper-plane" style="margin-right: 5px;"></i> Ask AI</button>
                    </div>
                    <div id="aiResult" style="background: rgba(15, 14, 12, 0.8); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px; padding: 16px; min-height: 90px; color: #e1e1e6; font-size: 0.92rem; line-height: 1.6;">
                        <span style="color: #777; font-style: italic;">Response will appear here...</span>
                    </div>
                </div>
            `;
        } else if (doorId === "105"){
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.location)}`;
            modalBody.innerHTML = `
                <div style="display: flex; gap: 20px; flex-wrap: wrap; align-items: stretch;">
                    <div style="flex: 1; min-width: 280px; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 8px; padding: 20px; background: rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; justify-content: space-between; gap: 20px;">
                        <div style="display: flex; flex-direction: column; gap: 16px; color: #f2e3c6; font-size: 0.95rem;">
                            <div style="display: flex; align-items: flex-start; gap: 12px;">
                                <i class="fa-regular fa-envelope" style="color: #d4af37; font-size: 1.1rem; margin-top: 3px;"></i>
                                <div style="display: flex; flex-direction: column; gap: 2px;">
                                    <strong style="color: #ffffff; font-size: 0.9rem;">Email:</strong>
                                    <span style="color: #d4d4d4; word-break: break-all;">${info.email}</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <i class="fa-solid fa-phone" style="color: #d4af37; font-size: 1rem;"></i>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <strong style="color: #ffffff; font-size: 0.9rem;">Phone:</strong>
                                    <span style="color: #d4d4d4;">${info.phone}</span>
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <i class="fa-solid fa-location-dot" style="color: #d4af37; font-size: 1.1rem;"></i>
                                    <strong style="color: #ffffff; font-size: 0.9rem;">Location:</strong>
                                </div>
                                <a href="${mapUrl}" target="_blank" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 6px; color: #f2e3c6; text-decoration: none;">
                                    <span style="font-size: 0.88rem; font-weight: 500; color: #e5e5e5;">${info.location}</span>
                                    <span style="color: #d4af37; font-size: 0.85rem; font-weight: bold;">Map <i class="fa-solid fa-arrow-up-right-from-square"></i></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    modal.classList.add('active');
}

function closeModal() {
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    modal.classList.remove('active');
    if (typeof activeOpenDoor !== 'undefined' && activeOpenDoor) {
        gsap.to(activeOpenDoor.rotation, { duration: 0.8, y: 0 });
        activeOpenDoor = null;
    }
}

/* AI INTEGRATION SYSTEM */
document.addEventListener("click", function (e) {
    if (e.target && (e.target.id === "aiAskBtn" || e.target.closest("#aiAskBtn"))) {
        callGeminiAI();
    }
});

document.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && document.activeElement && document.activeElement.id === "aiInput") {
        callGeminiAI();
    }
});

async function callGeminiAI() {
    const input = document.getElementById("aiInput");
    const resultBox = document.getElementById("aiResult");

    if (!input || !resultBox) return;

    const userQuery = input.value.trim();
    if (!userQuery) return;

    resultBox.innerHTML = "✨ Usama is thinking...";

    const promptContext = `
You are an AI portfolio assistant for Hasibul Hasan Usama.

Portfolio Details:
Name: Hasibul Hasan Usama
Profession: Software Engineer & 3D Web Developer

Key Skills:
JavaScript, Three.js, C, CSS, Java, Node.js, HTML, C++

Key Languages:
English, Bangla, Arabic, Hindi

Contact:
Email: hasibulhasanusama@gmail.com
Phone: +8801708302032

LinkedIn: https://linkedin.com/in/hasibul-hasan-usama-1435653b7/
Facebook: https://facebook.com/hasibulhasanosama/
WhatsApp: https://wa.me/8801708302032/
GitHub: https://github.com/hasibulhasanusama
Discord: https://discord.com/users/hasibulhasanusama_65967/

Visitor's Question:
"${userQuery}"

LANGUAGE RULES:
1. By default, always answer in English.
2. If the visitor asks "Bangla te deo", "বাংলায় দাও", "বাংলায় বলো", "Bangla", or clearly requests Bangla, answer completely in Bangla.
3. If the visitor asks "English e deo", "ইংরেজিতে দাও", "English", or clearly requests English, answer completely in English.
4. Never mix Bangla and English in the same answer unless the visitor specifically asks for mixed language.
5. Keep the answer professional, natural, and concise.
6. Answer in 2-3 sentences.
7. Only provide information related to this portfolio.
`;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userQuery: promptContext
            })
        });

        const data = await response.json();

        if (!response.ok) {
            resultBox.innerHTML = `<span style="color:#ff6b6b;">API Error: ${data.error || "Something went wrong."}</span>`;
            return;
        }

        if (data.reply) {
            resultBox.innerHTML = data.reply.replace(/\n/g, "<br>");
        } else {
            resultBox.innerHTML = "Sorry, couldn't get a response.";
        }

    } catch (error) {
        console.error("AI Error:", error);
        resultBox.innerHTML = `<span style="color:#ff6b6b;">Error connecting to AI service.</span>`;
    }
}

/* MASTER RENDER LOOP */
function animate() {
    requestAnimationFrame(animate);

    // ১. কীবোর্ড ইনপুট প্রসেস (Smooth Inertia Movement)
    handleKeyboardMovement();

    // ২. রুমের বাউন্ডারি লিমিট (দেওয়াল পার হওয়া আটকাবে)
// ৩. রুমের বাউন্ডারি লিমিট (সীমানা বাড়িয়ে দেওয়া হলো যাতে সহজে ঘুরে যেতে পারে)
    camera.position.x = Math.max(-35, Math.min(35, camera.position.x));
    camera.position.z = Math.max(-35, Math.min(35, camera.position.z));
    camera.position.y = Math.max(0.5, Math.min(12, camera.position.y));

    // ৩. রেন্ডারার ও অরবিট কন্ট্রোল আপডেট (Smooth Drag / Zoom Damping Update)
    if (typeof controls !== 'undefined' && controls) {
        controls.update();
    }
    renderer.render(scene, camera);
}

// অ্যানিমেশন চালুকরণ
animate();