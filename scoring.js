/**
 * scoring.js — Moteur de diagnostic et de calcul de prix
 * Decathlon Seconde Vie — EEMI × Decathlon — Bloc A4
 * Auteur livrable : Ahonon Laye DIFEWE
 *
 * CONTIENT :
 *   - Données métier : TYPES, BRANDS_BY_CAT, BRANDS_BY_TYPE
 *   - Critères de diagnostic : CDIAG, CDIAG_BY_CAT (16 catégories), VDIAG
 *   - Tables de conversion : SMAP, SLBL, VLBL, VMAP
 *   - Moteur de scoring : calcScore(), calcPrice()
 *   - Helpers : getCS(), decision(), mkCode()
 *
 * USAGE : charger AVANT app.js
 *   <script src="scoring.js"></script>
 *   <script src="app.js"></script>
 */

var TYPES = [
  {id:'vtt',   icon:'🚵',label:'VTT',           sub:'Tout-terrain',     pop:true,  base:200},
  {id:'route', icon:'🚴',label:'Route / Gravel', sub:'Longue distance',  pop:false, base:280},
  {id:'ville', icon:'🚲',label:'Vélo de ville',  sub:'Quotidien, urbain',pop:false, base:160},
  {id:'vae',   icon:'⚡',label:'VAE Électrique', sub:'Assistance élect.',pop:false, base:450},
  {id:'enfant',icon:'🧒',label:'Vélo enfant',    sub:"Jusqu'à 14 ans",  pop:false, base:80},
  {id:'bmx',   icon:'🤸',label:'BMX / Freestyle',sub:'Acrobaties',      pop:false, base:120}
];

var BRANDS_BY_CAT = {
  velo: ["B'Twin / Rockrider","Van Rysel","Trek","Specialized","Giant","Canyon","Scott","Cube","Orbea","Cannondale","Autre"],
  fitness: ["Domyos","Technogym","Life Fitness","Bowflex","NordicTrack","Kettler","Cardiostrong","Autre"],
  camping: ["Quechua","Forclaz","The North Face","Salomon","Marmot","Jack Wolfskin","Autre"],
  hiver: ["Wed'ze","Salomon","Rossignol","Head","Atomic","Völkl","Fischer","Autre"],
  trott: ["Oxelo","Segway","Xiaomi","Ninebot","Pure Electric","Micro","Autre"],
  eau: ["Olaian","Tribord","Aqua Lung","Jobe","Aquaplanet","Autre"],
  raquettes: ["Artengo","Wilson","Babolat","Head","Tecnifibre","Prince","Bullpadel","Autre"],
  running: ["Kalenji","Kiprun","Nike","Adidas","Asics","Brooks","Saucony","Hoka","Autre"],
  golf: ["Inesis","Callaway","TaylorMade","Titleist","Ping","Cobra","Wilson","Autre"],
  peche: ["Caperlan","Shimano","Daiwa","Penn","Abu Garcia","Rapala","Autre"],
  equi: ["Fouganza","HKM","Cavalleria Toscana","Horze","Busse","Eskadron","Autre"],
  combat: ["Outshock","Adidas","Venum","Fairtex","RDX","Hayabusa","Autre"],
  chasse: ["Solognac","Beretta","Browning","Blaser","Swarovski","Steiner","Autre"],
  escalade: ["Simond","Black Diamond","Petzl","La Sportiva","Scarpa","Mammut","Autre"],
  petanque: ["Obut","La Franc\u00e7aise P\u00e9tanque","MS Petanque","Autre"],
  vetements: ["Domyos","Nike","Adidas","Puma","Under Armour","Columbia","Autre"],
};
var BRANDS_BY_TYPE = {
  vtt:    ["B'Twin Rockrider","Trek","Specialized","Giant","Canyon","Scott","Cube","Commencal","YT Industries","Autre"],
  route:  ["B'Twin Triban","Trek","Specialized","Giant","Canyon","Scott","Bianchi","Pinarello","Look","Autre"],
  ville:  ["B'Twin Elops","Trek","Specialized","Giant","Lapierre","Moustache","Vélosophy","Autre"],
  vae:    ["B'Twin Riverside","Trek","Specialized","Giant","Moustache","O2Feel","Decathlon","Autre"],
  enfant: ["B'Twin Kids","Woom","Frog Bikes","Trek","Giant","Puky","Decathlon","Autre"],
  bmx:    ["Mongoose","Haro","GT","Sunday","We The People","Decathlon","Kink","Autre"]
};

// Diagnostics par catégorie (ce que le client doit évaluer)
var CDIAG_BY_CAT = {
  // Vélo (existant)
  velo: [
    {id:'cadre',label:'Cadre & Fourche',icon:'🔧',color:'var(--blue)',
     hint:'Inspectez le cadre et la fourche. En cas de doute, le vendeur vérifiera.',
     crit:[{id:'c1',label:'État général du cadre',desc:'Fissures, déformations, soudures'},
           {id:'c2',label:'Rayures ou impacts visibles',desc:'Aspect visuel du cadre'},
           {id:'c3',label:'Fourche',desc:'Jeu et alignement directionnel'}]},
    {id:'trans',label:'Freins & Transmission',icon:'⚙️',color:'var(--orange)',
     hint:'Ces éléments influencent la sécurité et le prix de reprise.',
     crit:[{id:'t1',label:'Les freins fonctionnent-ils correctement ?',desc:'Testez doucement : bruit ou arrêt faible = À vérifier'},
           {id:'t2',label:'La chaîne et les vitesses fonctionnent-elles ?',desc:'Faites tourner les pédales. Si la chaîne saute, cochez À vérifier'},
           {id:'t3',label:'Dérailleur arrière',desc:'Alignement, câbles'}]},
    {id:'roues',label:'Roues & Pneus',icon:'🔵',color:'var(--green-dk)',
     hint:"Vérifiez l'usure des pneus et l'état des jantes.",
     crit:[{id:'r1',label:'Pneus avant / arrière',desc:'Usure, crevaisons, état général'},
           {id:'r2',label:'Jantes',desc:'Voile et fissures de jante'},
           {id:'r3',label:'Rayons',desc:'Cassés ou déformés'}]}
  ],
  // Fitness / musculation
  fitness: [
    {id:'struc',label:'Structure & Châssis',icon:'🏗️',color:'var(--blue)',
     hint:"Inspectez la structure principale de l'appareil.",
     crit:[{id:'f1',label:'Cadre / châssis',desc:'Fissures, déformations, peinture écaillée'},
           {id:'f2',label:'Soudures et visserie',desc:'Rien de desserré ou cassé ?'},
           {id:'f3',label:'Stabilité',desc:"L'appareil est-il stable sans bouger ?"}]},
    {id:'mecanisme',label:'Mécanisme & Électronique',icon:'⚙️',color:'var(--orange)',
     hint:'Ces éléments déterminent si la machine fonctionne.',
     crit:[{id:'f4',label:'Fonctionnement général',desc:"L'appareil démarre et fonctionne ?"},
           {id:'f5',label:'Résistance / tension',desc:'La résistance est-elle réglable ?'},
           {id:'f6',label:'Écran / console',desc:"L'écran s'allume et affiche les données ?"}]},
    {id:'confort',label:'Confort & Revêtements',icon:'🪑',color:'var(--green-dk)',
     hint:'Vérifiez les pièces en contact avec le corps.',
     crit:[{id:'f7',label:'Selle / siège',desc:'Déchirures, mousse dégradée'},
           {id:'f8',label:'Poignées / guidon',desc:'Grip usé, jeu excessif'},
           {id:'f9',label:'Sangles / supports pieds',desc:'Usure, déchirures'}]}
  ],
  // Camping / randonnée
  camping: [
    {id:'tente',label:'Tente & Shelter',icon:'⛺',color:'var(--blue)',
     hint:"Vérifiez l'imperméabilité et l'intégrité de la tente.",
     crit:[{id:'cp1',label:'Tissu principal',desc:'Déchirures, trous, coutures décollées'},
           {id:'cp2',label:'Imperméabilité',desc:'Le revêtement imperméable est-il intact ?'},
           {id:'cp3',label:'Arceaux / piquets',desc:'Tordus, cassés, manquants ?'}]},
    {id:'materiel',label:'Matériel & Équipement',icon:'🎒',color:'var(--orange)',
     hint:'Évaluez les sacs, chaussures et accessoires.',
     crit:[{id:'cp4',label:'Fermetures éclair',desc:'Fonctionnent-elles sans accrocher ?'},
           {id:'cp5',label:'Sangles et bretelles',desc:'Usure, déchirures, boucles cassées'},
           {id:'cp6',label:'Semelles / sol',desc:'Délaminage, usure excessive ?'}]}
  ],
  // Sports d'hiver
  hiver: [
    {id:'glisse',label:'Planches & Fixations',icon:'🎿',color:'var(--blue)',
     hint:"Inspectez l'état des skis, snowboard ou fixations.",
     crit:[{id:'h1',label:'Carre des skis / planche',desc:'Rouille, ébréchures importantes'},
           {id:'h2',label:'Semelle',desc:'Griffes profondes, délaminage'},
           {id:'h3',label:'Fixations',desc:'Fonctionnement, réglage DIN'}]},
    {id:'chaussures',label:'Chaussures de glisse',icon:'👟',color:'var(--orange)',
     hint:'Vérifiez les chaussures de ski ou de snow.',
     crit:[{id:'h4',label:'Coque extérieure',desc:'Fissures, déformations'},
           {id:'h5',label:'Chausson intérieur',desc:'Usure, odeur, décollement'},
           {id:'h6',label:'Boucles de fermeture',desc:'Fonctionnement et état'}]}
  ],
  // Trottinette / roller / skateboard
  trott: [
    {id:'struc2',label:'Structure & Roues',icon:'🛴',color:'var(--blue)',
     hint:'Inspectez le guidon, le plateau et les roues.',
     crit:[{id:'tr1',label:'Plateau / deck',desc:'Fissures, fissurations, délaminage'},
           {id:'tr2',label:'Guidon / poignées',desc:'Jeu excessif, grip usé'},
           {id:'tr3',label:'Roues et roulements',desc:'Usure, jeu, bruit anormal'}]},
    {id:'freinage2',label:'Freinage & Sécurité',icon:'🛑',color:'var(--orange)',
     hint:'La sécurité prime.',
     crit:[{id:'tr4',label:'Frein',desc:'Fonctionne correctement ?'},
           {id:'tr5',label:'Pliage / verrou',desc:'Le système de pliage se verrouille bien ?'},
           {id:'tr6',label:'Visserie générale',desc:'Rien de desserré ?'}]}
  ],
  // Sports d'eau
  eau: [
    {id:'flottaison',label:'Flottaison & Coque',icon:'🏄',color:'var(--blue)',
     hint:'Inspectez la coque et les matériaux.',
     crit:[{id:'e1',label:'Coque / body board',desc:'Fissures, impact, délaminage'},
           {id:'e2',label:'Étanchéité',desc:'Pas de fuite ou perforation ?'},
           {id:'e3',label:'Leash / fixation',desc:'Etat du câble de sécurité'}]},
    {id:'accessoires_eau',label:'Accessoires & Combinaison',icon:'🤿',color:'var(--orange)',
     hint:'Vérifiez les équipements de protection.',
     crit:[{id:'e4',label:'Combinaison',desc:'Déchirures, usure aux coutures'},
           {id:'e5',label:'Palmes / masque',desc:'Joints, verre, courroies'},
           {id:'e6',label:'Gilet / aide à la flottaison',desc:'Fermetures et intégrité'}]}
  ],
  // Sports de raquettes
  raquettes: [
    {id:'raquette',label:'Raquette',icon:'🎾',color:'var(--blue)',
     hint:'Inspectez le cadre et le cordage.',
     crit:[{id:'rq1',label:'Cadre de la raquette',desc:'Fissures, éclats, déformation'},
           {id:'rq2',label:'Cordage',desc:'Coupé, très détendu ou effiloché ?'},
           {id:'rq3',label:'Grip / surgrip',desc:'Usure, glissant, décollé ?'}]},
    {id:'accessoires_raq',label:'Sac & Accessoires',icon:'🎒',color:'var(--orange)',
     hint:'Évaluez les accessoires.',
     crit:[{id:'rq4',label:'Sac de transport',desc:'Fermetures, déchirures'},
           {id:'rq5',label:'Balles / volants',desc:'Lot complet et en bon état ?'}]}
  ],
  // Running
  running: [
    {id:'chaussures_run',label:'Chaussures de running',icon:'👟',color:'var(--blue)',
     hint:'Inspectez les chaussures et équipements.',
     crit:[{id:'rn1',label:'Semelle extérieure',desc:'Usure visible, délaminage'},
           {id:'rn2',label:'Amorti / semelle intérieure',desc:'Compressé, déformé'},
           {id:'rn3',label:'Tige / dessus',desc:'Déchirures, coutures décollées'}]},
    {id:'equip_run',label:'Équipements & Accessoires',icon:'⌚',color:'var(--orange)',
     hint:'GPS, montres, vêtements running.',
     crit:[{id:'rn4',label:'Montre GPS / cardiaque',desc:'Écran, batterie, fonctionnement'},
           {id:'rn5',label:'Vêtements techniques',desc:'Coutures, élasticité, couleurs'},
           {id:'rn6',label:'Sac à dos / hydratation',desc:'Poche eau, fermetures'}]}
  ],
  // Golf
  golf: [
    {id:'clubs',label:'Clubs de golf',icon:'⛳',color:'var(--blue)',
     hint:'Inspectez les clubs et le sac.',
     crit:[{id:'g1',label:'État des têtes de club',desc:'Rayures, dents, rouille'},
           {id:'g2',label:'Manches / shafts',desc:'Fissures, jeu à la tête'},
           {id:'g3',label:'Grip',desc:'Usure, durcissement, décollement'}]},
    {id:'sac_golf',label:'Sac & Chariot',icon:'🎒',color:'var(--orange)',
     hint:'Sac et accessoires de transport.',
     crit:[{id:'g4',label:'Sac de golf',desc:'Fermetures, pieds, sangles'},
           {id:'g5',label:'Chariot',desc:'Roues, pliage, structure'}]}
  ],
  // Pêche
  peche: [
    {id:'canne',label:'Canne à pêche',icon:'🎣',color:'var(--blue)',
     hint:'Inspectez la canne et le moulinet.',
     crit:[{id:'p1',label:'Brins de la canne',desc:'Fissures, anneau endommagé'},
           {id:'p2',label:'Moulinet',desc:'Fonctionnement, fuite, manivelle'},
           {id:'p3',label:'Fil / nylon',desc:'Emmêlé, abîmé, quantité suffisante'}]},
    {id:'accessoires_peche',label:'Accessoires',icon:'🪣',color:'var(--orange)',
     hint:'Boîtes, vestes et équipements.',
     crit:[{id:'p4',label:'Veste / waders',desc:'Déchirures, coutures, imperméabilité'},
           {id:'p5',label:'Boîtes à leurres',desc:'Fermetures, contenu'}]}
  ],
  // Équitation
  equi: [
    {id:'selle',label:'Selle & Harnachement',icon:'🐴',color:'var(--blue)',
     hint:'Inspectez la selle et les équipements.',
     crit:[{id:'eq1',label:'Cuir de la selle',desc:'Craquelures, déchirures, coutures'},
           {id:'eq2',label:'Arçon / structure',desc:'Pas de déformation ou craquement'},
           {id:'eq3',label:'Sangles et étrivières',desc:'Usure, fissures du cuir'}]},
    {id:'protection_equi',label:'Protections & Vêtements',icon:'⛑️',color:'var(--orange)',
     hint:'Casque et protections.',
     crit:[{id:'eq4',label:'Casque',desc:'Chocs visibles ? Date de fabrication ?'},
           {id:'eq5',label:'Jambières / cravaches',desc:'État général'}]}
  ],
  // Sports de combat
  combat: [
    {id:'gants',label:'Gants & Protections',icon:'🥊',color:'var(--blue)',
     hint:'Inspectez les équipements de frappe et protection.',
     crit:[{id:'cb1',label:'Gants de boxe',desc:'Mousse tassée, cuir déchiré, velcro usé'},
           {id:'cb2',label:'Protège-dents / casque',desc:'Déformations, hygiène'},
           {id:'cb3',label:'Plastron / protège-tibia',desc:'Usure, fixation'}]},
    {id:'tenue_combat',label:'Tenue & Sac',icon:'👕',color:'var(--orange)',
     hint:'Kimono, short et sac de frappe.',
     crit:[{id:'cb4',label:'Kimono / short de combat',desc:'Coutures, taches tenaces'},
           {id:'cb5',label:'Sac de frappe',desc:'Coutures, sangles de fixation'}]}
  ],
  // Chasse
  chasse: [
    {id:'optique',label:'Optique & Accessoires',icon:'🔭',color:'var(--blue)',
     hint:'Inspectez les accessoires de chasse.',
     crit:[{id:'ch1',label:'Jumelles / lunette',desc:'Optique, réglage, revêtement'},
           {id:'ch2',label:'Vêtements de chasse',desc:'Coutures, imperméabilité, camouflage'},
           {id:'ch3',label:'Sac / gibecière',desc:'Fermetures, usure'}]},
    {id:'securite_chasse',label:'Sécurité & État',icon:'⚠️',color:'var(--orange)',
     hint:'Vérifications de sécurité essentielles.',
     crit:[{id:'ch4',label:'Gilet orange de sécurité',desc:'Visible, propre, intact'},
           {id:'ch5',label:'Couteau / outil multifonction',desc:'Lame, manche, étui'}]}
  ],
  // Escalade
  escalade: [
    {id:'corde',label:'Corde & Baudrier',icon:'🧗',color:'var(--blue)',
     hint:'IMPORTANT : la sécurité prime en escalade.',
     crit:[{id:'es1',label:'Corde',desc:'Gaines endommagées, brûlures, âge > 10 ans'},
           {id:'es2',label:'Baudrier',desc:'Coutures, sangle usée, boucle fonctionnelle'},
           {id:'es3',label:'Mousquetons / descendeur',desc:'Jeu, fermeture, corrosion'}]},
    {id:'chaussons',label:'Chaussons & Casque',icon:'🪖',color:'var(--orange)',
     hint:'Inspectez les équipements de protection.',
     crit:[{id:'es4',label:'Chaussons',desc:'Gomme usée, décollement semelle'},
           {id:'es5',label:'Casque',desc:'Chocs, fissures, mousses intactes'}]}
  ],
  // Pétanque
  petanque: [
    {id:'boules',label:'Boules & Cochonnet',icon:'🎳',color:'var(--blue)',
     hint:'Inspectez les boules et accessoires.',
     crit:[{id:'pt1',label:'État des boules',desc:'Rayures profondes, déformation, rouille'},
           {id:'pt2',label:'Poids / taille réglementaire',desc:'Conformes à la réglementation FFPJP'},
           {id:'pt3',label:'Cochonnet',desc:'Fissuré, trop petit, couleur visible'}]},
    {id:'access_petanque',label:'Accessoires',icon:'🎒',color:'var(--orange)',
     hint:'Mallette et accessoires.',
     crit:[{id:'pt4',label:'Mallette de transport',desc:'Fermetures, état général'},
           {id:'pt5',label:'Mètre / aimant',desc:'Fonctionnement'}]}
  ],
  // Vêtements
  vetements: [
    {id:'habit',label:'État des vêtements',icon:'👕',color:'var(--blue)',
     hint:'Inspectez chaque pièce soigneusement.',
     crit:[{id:'v1',label:'Tissu principal',desc:'Pillings, déchirures, décoloration'},
           {id:'v2',label:'Coutures',desc:'Décousues, effilochées'},
           {id:'v3',label:'Fermetures & Boutons',desc:'Zips fonctionnels, boutons manquants'}]},
    {id:'proprete',label:'Propreté & Hygiène',icon:'🧼',color:'var(--green-dk)',
     hint:'Les vêtements doivent être propres.',
     crit:[{id:'v4',label:'Propreté générale',desc:'Lavé, sans odeur'},
           {id:'v5',label:'Taches',desc:'Indelébiles, visibles ?'}]}
  ],
};
// Catégories qui utilisent CDIAG (vélo) vs CDIAG_BY_CAT
var CDIAG = [
  {id:'cadre', label:'Cadre & Fourche', icon:'🔧', color:'var(--blue)',
   hint:"Inspectez les zones indiquées. En cas de doute, le vendeur vérifiera.",
   crit:[
     {id:'c1',label:'État général du cadre',        desc:'Vérifiez fissures et déformations'},
     {id:'c2',label:'Rayures ou impacts visibles',   desc:'Aspect visuel du cadre'},
     {id:'c3',label:'Fourche',                       desc:'Jeu et alignement directionnel'}
   ]},
  {id:'trans', label:'Freins & Transmission', icon:'⚙️', color:'var(--orange)',
   hint:"Vérifiez les éléments qui influencent la sécurité et le prix de reprise.",
   crit:[
     {id:'t1',label:'Les freins fonctionnent-ils correctement ?',  desc:"Testez doucement les freins, bruit ou arrêt faible = À vérifier"},
     {id:'t2',label:'La chaîne et les vitesses fonctionnent-elles ?',desc:"Faites tourner les pédales. Si la chaîne saute, cochez À vérifier"},
     {id:'t3',label:'Dérailleur arrière',                           desc:'Alignement, câbles'}
   ]},
  {id:'roues', label:'Roues & Pneus', icon:'🔵', color:'var(--green-dk)',
   hint:"Vérifiez l'usure des pneus et l'état des jantes.",
   crit:[
     {id:'r1',label:'Pneus avant / arrière',desc:'Usure, crevaisons, état général'},
     {id:'r2',label:'Jantes',              desc:'Voile et fissures de jante'},
     {id:'r3',label:'Rayons',              desc:'Cassés ou déformés'}
   ]}
];
var VDIAG = [
  {id:'sec',  label:'Sécurité',    step:'Étape 1 sur 3', desc:'Vérifier les informations de sécurité',
   crit:[{id:'s1',label:'Cadre',  desc:'Fissures et déformations'},{id:'s2',label:'Fourche',desc:"Jeu et alignement directionnel"},{id:'s3',label:'Freins',desc:"Puissance d'arrêt & usure plaquettes"}]},
  {id:'etat', label:'État général',step:'Étape 2 sur 3', desc:"Vérifier l'état des composants",
   crit:[{id:'s4',label:'Transmission',desc:'Chaîne, dérailleur, câbles'},{id:'s5',label:'Chaînes',desc:'Élongation et usure'},{id:'s6',label:'Vitesses',desc:'Passage et réglage'},{id:'s7',label:'Batterie/Chargeur',desc:'VAE uniquement'},{id:'s8',label:'Propreté',desc:'Aspect général de nettoyage'},{id:'s9',label:'Rayures',desc:'Aspect visuel du cadre'}]},
  {id:'roues',label:'Roues',       step:'Étape 3 sur 3', desc:'Voile et fissures de jante',
   crit:[{id:'s10',label:'Jantes',desc:'Voile et fissures de jante'},{id:'s11',label:'Pneus',desc:'Usure et crevaisons'},{id:'s12',label:'Rayons',desc:'Cassés ou déformés'}]}
];
var SMAP={good:3,warn:2,bad:0,na:1};
var SLBL={good:'Bon',warn:'Acceptable',bad:'Mauvais',na:'Je ne sais pas'};
var VLBL={c:'Conforme',r:'À réparer',bl:'Bloquant',ni:'NI'};
var VMAP={c:3,r:2,bl:0,ni:1};

function calcScore(sc){var t=0,c=0;Object.values(sc).forEach(function(v){if(v!==undefined){t+=v;c++;}});return c>0?Math.round((t/(c*3))*100):0;}
function calcPrice(score,meta){
  // Bases estimées par catégorie (prix neuf moyen si non renseigné)
  var BASE_BY_CAT={
    velo:500, fitness:400, camping:200, hiver:350, trott:300,
    eau:250, raquettes:150, running:120, golf:500, peche:200,
    equi:300, combat:150, chasse:250, escalade:300, petanque:100, vetements:80
  };
  var tp=TYPES.find(function(x){return x.id===meta.type;})||TYPES[0];
  var annee=parseInt(meta.year)||2021;
  var age=Math.max(0,2026-annee);
  var af;
  if(age===0) af=0.55;
  else if(age===1) af=0.50;
  else if(age===2) af=0.44;
  else if(age===3) af=0.38;
  else if(age<=5) af=0.30;
  else if(age<=8) af=0.24;
  else af=0.18;
  var sf=0.4+(score/100)*0.6;
  // Prix neuf : utiliser le prix saisi, sinon base par catégorie, sinon base par type
  var baseNeuf=meta.cat&&BASE_BY_CAT[meta.cat]?BASE_BY_CAT[meta.cat]:tp.base*2.5;
  var prixNeuf=meta.price&&parseFloat(meta.price)>0?parseFloat(meta.price):baseNeuf;
  var p=prixNeuf*af*sf;
  return Math.max(5,Math.round(p/5)*5);
}
function getCS(){var m={};Object.entries(S.scores).forEach(function(e){m[e[0]]=SMAP[e[1]]||0;});return m;}
function decision(s){
  if(s>=65)return{label:'Reprise acceptée',       bg:'var(--green)', c:'#fff', txt:'var(--green-dk)'};
  if(s>=40)return{label:'Reprise conditionnelle',  bg:'var(--orange)',c:'#fff', txt:'var(--orange)'};
  return       {label:'Reprise non possible',      bg:'var(--red)',   c:'#fff', txt:'var(--red)'};
}
function mkCode(){return '#SVD-2026-'+Math.random().toString(36).substring(2,6).toUpperCase();}