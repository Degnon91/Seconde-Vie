/**
 * scoring.js — Moteur de diagnostic et de calcul de prix
 * Decathlon Seconde Vie — EEMI x Decathlon — Bloc A4
 * Auteur : Ahonon Laye DIFEWE
 * Charger ce fichier AVANT app.js
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

/**
 * app.js — Application Seconde Vie (UI, navigation, pages)
 * Decathlon Seconde Vie — EEMI × Decathlon — Bloc A4
 * Auteur livrable : Ahonon Laye DIFEWE
 *
 * CONTIENT :
 *   - État de l'application : var S (session client/vendeur)
 *   - Schémas SVG de diagnostic : DIAG_SVG, DIAG_SVG_EXT
 *   - Pages client : pLogin, pH, pT, pVeloType, pB, pI, pD, pR, pRes, pRdv, pConf
 *   - Pages vendeur : pSellerLogin, pSH, pSS, pSD, pSDiag, pSRes
 *   - Pages communes : pCatalogue, pCompte, pDetail
 *   - Navigation : go(), render()
 *   - Fonctions photo/scan, événements
 *
 * DÉPEND DE : scoring.js (doit être chargé en premier)
 */

// ===== TOUT LE CODE LOGIQUE EST CELUI DE VOTRE COLLÈGUE — INCHANGÉ =====
// Seul le CSS/design a été modifié pour appliquer le design system Figma Decathlon.

var S = {
  page:'login', client:null, meta:{type:'',brand:'',model:'',year:'2021',price:'',km:1500},
  scores:{}, sscores:{}, photos:{},
  step:0, sstep:0, code:null, rdvDay:18, rdvSlot:'14h00', rdvMag:0,
  seller:null, sellerCode:null, expertMode:false,
  newDiagMeta:{type:'',brand:'',model:'',year:'2021',price:''}
};
window.DOS = {};

function H(s){return s||'';}
function ic(path){return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'+path+'</svg>';}
function svgBack(){return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="15 18 9 12 15 6"/></svg>';}
function svgPerson(){return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';}
function svgCheck(){return '<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#02BE8A"/><polyline points="6 12 10 16 18 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';}
function svgInfo(){return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';}

function render(){
  var PAGES={login:pLogin,seller_login:pSellerLogin,home:pH,step_type:pT,step_velo_type:pVeloType,step_brand:pB,step_info:pI,diag:pD,repairs:pR,result:pRes,rdv:pRdv,confirmed:pConf,catalogue:pCatalogue,compte:pCompte,detail:pDetail,
             seller_home:pSH,seller_scan:pSS,seller_dos:pSD,seller_diag:pSDiag,seller_result:pSRes,
             new_diag_type:pNDT,new_diag_info:pNDI,new_diag_diag:pNDD};
  var fn=PAGES[S.page]||pH;
  document.getElementById('screen').innerHTML=fn();
  document.getElementById('nav').style.display=(S.page==='confirmed')?'none':'flex';
  if(S.page==='result'||S.page==='confirmed'){
    setTimeout(function(){var el=document.getElementById('qrbox');if(el&&el.innerHTML===''){try{new QRCode(el,{text:S.code||'#SVD',width:130,height:130,colorDark:'#3643BA',colorLight:'#fff'});}catch(e){}}},150);
  }
}
function go(p){S.page=p;render();var s=document.getElementById('screen');if(s)s.scrollTop=0;}

// ===== PAGES CLIENT =====
function pLogin(){
  return '<div style="background:var(--blue);min-height:100svh;display:flex;flex-direction:column;justify-content:center;padding:40px 24px;position:relative;overflow:hidden">'+
    '<div style="position:absolute;right:-60px;top:-60px;width:280px;height:280px;background:radial-gradient(circle,rgba(255,255,255,.1) 0%,transparent 70%);border-radius:50%;pointer-events:none"></div>'+
    '<div style="text-align:center;margin-bottom:36px;position:relative">'+''+
      '<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:4px"><span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-.01em">DECATHLON</span></div>'+
      '<div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-.02em">Seconde Vie</div>'+
      '<div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:5px;font-weight:500">Decathlon · Reprise & Revente</div>'+
    '</div>'+
    '<div style="background:rgba(255,255,255,.12);border-radius:20px;padding:24px;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.2)">'+
      '<div style="color:rgba(255,255,255,.7);font-size:12px;font-weight:600;margin-bottom:6px;letter-spacing:.02em">VOTRE PRÉNOM</div>'+
      '<input id="ln" class="inp" placeholder="ex : Marie, Lucas..." style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.25);color:#fff;margin-bottom:14px;font-weight:500">'+
      '<div style="color:rgba(255,255,255,.7);font-size:12px;font-weight:600;margin-bottom:6px;letter-spacing:.02em">MOT DE PASSE <span style="font-size:10px;opacity:.7">(optionnel pour ce prototype)</span></div>'+
      '<input id="lp" class="inp" type="password" placeholder="••••••" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.25);color:#fff;margin-bottom:20px">'+
      '<button class="btn" style="background:#fff;color:var(--blue);font-weight:800;font-size:15px" onclick="doLogin()">Se connecter</button>'+
      '<div style="font-size:11px;color:rgba(255,255,255,.55);text-align:center;margin-top:10px">⚠ Prototype — les données ne sont pas sauvegardées entre sessions</div>'+
    '</div>'+
    '<div style="text-align:center;margin-top:20px;font-size:13px;color:rgba(255,255,255,.7)">Vous êtes vendeur ? <span style="font-weight:700;cursor:pointer;text-decoration:underline;color:#fff" onclick="go(\'seller_login\')">Connexion vendeur →</span></div>'+
  '</div>';
}

function pSellerLogin(){
  return '<div style="background:var(--blue);min-height:100svh;display:flex;flex-direction:column;justify-content:center;padding:40px 24px;position:relative;overflow:hidden">'+
    '<div style="position:absolute;right:-60px;top:-60px;width:280px;height:280px;background:radial-gradient(circle,rgba(255,255,255,.1) 0%,transparent 70%);border-radius:50%;pointer-events:none"></div>'+
    '<div style="text-align:center;margin-bottom:36px;position:relative">'+''+
      '<div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-.02em">Espace Vendeur</div>'+
      '<div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:5px">Réservé aux collaborateurs Decathlon</div>'+
    '</div>'+
    '<div style="background:rgba(255,255,255,.12);border-radius:20px;padding:24px;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.2)">'+
      '<div style="color:rgba(255,255,255,.7);font-size:12px;font-weight:600;margin-bottom:6px;letter-spacing:.02em">PRÉNOM COLLABORATEUR</div>'+
      '<input id="sln" class="inp" placeholder="ex : Degnon, Sophie..." style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.25);color:#fff;margin-bottom:14px;font-weight:500">'+
      '<div style="color:rgba(255,255,255,.7);font-size:12px;font-weight:600;margin-bottom:6px;letter-spacing:.02em">MOT DE PASSE <span style="font-size:10px;opacity:.7">(optionnel pour ce prototype)</span></div>'+
      '<input id="slp" class="inp" type="password" placeholder="••••••" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.25);color:#fff;margin-bottom:20px">'+
      '<button class="btn" style="background:#fff;color:var(--blue);font-weight:800;font-size:15px" onclick="doSellerLogin()">Se connecter</button>'+
      '<div style="font-size:11px;color:rgba(255,255,255,.55);text-align:center;margin-top:10px">⚠ Prototype — les données ne sont pas sauvegardées entre sessions</div>'+
    '</div>'+
    '<div style="text-align:center;margin-top:20px;font-size:13px;color:rgba(255,255,255,.7);cursor:pointer" onclick="go(\'login\')">← Retour espace client</div>'+
  '</div>';
}

function pH(){
  return '<div class="hblue">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
      '<span class="badge badge-client">CLIENT</span>'+
      '<div style="display:flex;align-items:center;gap:6px">'+
        '<div style="background:rgba(255,255,255,.15);border-radius:8px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;padding:4px"></div>'+
        '<span style="font-size:20px;font-weight:900;letter-spacing:-.02em">Seconde Vie</span>'+
        '<span style="font-size:13px;font-weight:900;color:rgba(255,255,255,.7);margin-left:8px">50 ans</span>'+
      '</div>'+
      '<div style="display:flex;align-items:center;gap:5px;background:rgba(255,255,255,.15);border-radius:var(--r-pill);padding:5px 12px 5px 6px">'+svgPerson()+'<span style="font-size:13px;font-weight:600">'+(S.client&&S.client.name?S.client.name:'Moi')+'</span></div>'+
    '</div>'+
    '<div style="font-size:16px;font-weight:800;margin-top:6px;letter-spacing:-.01em">Estimez votre vélo en 5 minutes.</div>'+
    '<div style="font-size:13px;opacity:.82;margin-top:3px;line-height:1.5">Offre finale confirmée après diagnostic en magasin.</div>'+
  '</div>'+
  '<div class="p16">'+
    '<div style="display:flex;gap:8px;margin-bottom:16px">'+
      stat('12 800+','vélos repris','var(--blue)')+stat('4.6 ★','satisfaction','var(--orange)')+stat('−70 %','vs. le neuf','var(--green-dk)')+
    '</div>'+
    '<div class="card sh mb16">'+
      '<div style="font-size:15px;font-weight:700;margin-bottom:14px">Comment ça marche ?</div>'+
      sr('1','Estimez en ligne','Quelques questions simples.')+
      sr('2','Venez en magasin','Un vendeur vérifie l\'état réel.')+
      sr('3','Recevez une offre finale','Confirmée après diagnostic en magasin.')+
      '<div class="info" style="margin-top:14px">'+svgInfo()+'<span>Ces éléments seront vérifiés par le vendeur en magasin et peuvent ajuster l\'offre de reprise.</span></div>'+
    '</div>'+
    '<button class="btn bb mb12" onclick="go(\'step_type\')">Estimer mon équipement →</button>'+
    '<div style="text-align:center;font-size:13px;color:var(--gray)">Vendeur ? <span style="color:var(--blue);font-weight:700;cursor:pointer" onclick="go(\'login\')">Se déconnecter et changer d\'espace</span></div>'+
  '</div>';
}
function stat(n,l,c){return '<div class="card sh" style="flex:1;text-align:center;padding:13px 8px"><div style="font-size:18px;font-weight:800;color:'+c+'">'+n+'</div><div style="font-size:10px;color:var(--gray);margin-top:3px;font-weight:500">'+l+'</div></div>';}
function sr(n,t,s){return '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px"><div style="width:28px;height:28px;border-radius:50%;background:var(--blue-lt);color:var(--blue);font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+n+'</div><div><div style="font-weight:600;font-size:14px">'+t+'</div><div style="font-size:12px;color:var(--gray);margin-top:2px;line-height:1.45">'+s+'</div></div></div>';}

function pT(){
  // Étape 1 : toutes les catégories d'équipement à vendre
  var CATS=[
    {id:'velo',     ico:'🚲', lbl:'Vélo, cyclisme',                  img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Simple_bicycle_2.jpg/320px-Simple_bicycle_2.jpg'},
    {id:'fitness',  ico:'🏋️', lbl:'Fitness, musculation',            img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Fitness_center_-_Weight_room.jpg/320px-Fitness_center_-_Weight_room.jpg'},
    {id:'camping',  ico:'⛺', lbl:'Camping, randonnée, trekking',    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Tent_at_Timberline.jpg/320px-Tent_at_Timberline.jpg'},
    {id:'hiver',    ico:'⛷️', lbl:"Sports d'hiver",                  img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Skiing_downhill.jpg/320px-Skiing_downhill.jpg'},
    {id:'trott',    ico:'🛴', lbl:'Trottinette, roller, skateboard', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Kick_scooter_-_Razor.jpg/320px-Kick_scooter_-_Razor.jpg'},
    {id:'eau',      ico:'🏄', lbl:"Sports d'eau",                    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Surfing_in_Hawaii.jpg/320px-Surfing_in_Hawaii.jpg'},
    {id:'raquettes',ico:'🎾', lbl:'Sports de raquettes',             img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Tennis_Racket_and_Balls.jpg/320px-Tennis_Racket_and_Balls.jpg'},
    {id:'running',  ico:'👟', lbl:'Running et marche active',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Running_-_front_view.jpg/320px-Running_-_front_view.jpg'},
    {id:'golf',     ico:'⛳', lbl:'Golf',                            img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Golf_bag.jpg/320px-Golf_bag.jpg'},
    {id:'peche',    ico:'🎣', lbl:'Pêche',                          img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Fly_fishing_in_the_Rockies.jpg/320px-Fly_fishing_in_the_Rockies.jpg'},
    {id:'equi',     ico:'🐴', lbl:'Équitation',                     img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Collage_of_Nine_Horses.jpg/320px-Collage_of_Nine_Horses.jpg'},
    {id:'combat',   ico:'🥊', lbl:'Sports de combat',               img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Boxing_match_2012.jpg/320px-Boxing_match_2012.jpg'},
    {id:'chasse',   ico:'🎯', lbl:'Chasse et tir sportif',          img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Hunting_dog.jpg/320px-Hunting_dog.jpg'},
    {id:'escalade', ico:'🧗', lbl:'Escalade',                       img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Rock_climbing_Joshua_Tree.jpg/320px-Rock_climbing_Joshua_Tree.jpg'},
    {id:'petanque', ico:'🎳', lbl:'Pétanque',                       img:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Jeu_de_boules_-_petanque.jpg/320px-Jeu_de_boules_-_petanque.jpg'},
    {id:'vetements',ico:'👕', lbl:'Vêtements de sport',             img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sportswear_collection.jpg/320px-Sportswear_collection.jpg'},
  ];
  var cards=CATS.map(function(c){
    var sel=S.meta.cat===c.id;
    return '<div class="card sh mb8" style="cursor:pointer;border:2px solid '+(sel?'var(--blue)':'var(--border)')+';background:'+(sel?'var(--blue-lt)':'#fff')+';padding:0;overflow:hidden;border-radius:16px" onclick="pickCat(\''+c.id+'\')">'+
      '<div style="display:flex;align-items:center;gap:0">'+
        '<div style="width:90px;height:72px;flex-shrink:0;overflow:hidden;background:var(--bg)">'+
          (c.img ? '<img src="'+c.img+'" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'" />' : '') +
          '<div style="width:100%;height:100%;display:'+(c.img?'none':'flex')+'%;align-items:center;justify-content:center;font-size:30px">'+c.ico+'</div>'+
        '</div>'+
        '<div style="flex:1;padding:0 14px;font-weight:600;font-size:14px;color:'+(sel?'var(--blue)':'var(--text)')+'">'+c.lbl+'</div>'+
        (sel?'<div style="padding-right:14px;color:var(--blue);font-weight:800;font-size:18px">✓</div>':'')+
      '</div>'+
    '</div>';
  }).join('');
  var nextBtn=S.meta.cat?
    (S.meta.cat==='velo'?'<button class="btn bb" onclick="go(\'step_velo_type\')">Continuer → Vélo, cyclisme</button>':
    '<button class="btn bb" onclick="go(\'step_brand\')">Continuer → Voir les marques</button>'):
    '<button class="btn bk" disabled>Sélectionnez une catégorie</button>';
  return hdr(svgBack(),'home',"Que voulez-vous vendre ?",'Étape 1 sur 5','')+
  '<div class="p16" style="padding-bottom:80px">'+
    '<div class="info mb14">'+svgInfo()+'<span>Ces infos nous aident à estimer le juste prix. Elles seront vérifiées en magasin.</span></div>'+
    cards+
  '</div>'+
  '<div style="position:fixed;bottom:68px;left:50%;transform:translateX(-50%);width:100%;max-width:390px;padding:8px 16px 12px;background:#fff;border-top:1px solid var(--border);z-index:50">'+
    nextBtn+
  '</div>';
}
function pickCat(id){S.meta.cat=id;render();}
window.pickCat=pickCat;

function pVeloType(){
  // Étape 2 : type de vélo (depuis catégorie vélo) - carrousel horizontal
  var VTYPES=[
    {id:'vtt',lbl:'VTT',sub:'Tout terrain'},
    {id:'route',lbl:'Route / Gravel',sub:'Longue distance'},
    {id:'tout_chemin',lbl:'Tout chemin',sub:'Polyvalent'},
    {id:'ville',lbl:'Vélo de ville',sub:'Quotidien'},
    {id:'vae',lbl:'VAE Électrique',sub:'Assistance élect.'},
    {id:'enfant',lbl:'Vélo enfant',sub:"Jusqu'à 14 ans"},
    {id:'bmx',lbl:'BMX',sub:'Acrobaties'},
  ];
  var ICONS={vtt:'🚵',route:'🚴',tout_chemin:'🚲',ville:'🏙️',vae:'⚡',enfant:'🧒',bmx:'🤸'};
  var cards=VTYPES.map(function(t){
    var sel=S.meta.type===t.id;
    return '<div style="flex-shrink:0;width:150px;border-radius:16px;border:2px solid '+(sel?'var(--blue)':'var(--border)')+';background:'+(sel?'var(--blue-lt)':'#fff')+';padding:14px 8px;text-align:center;cursor:pointer" onclick="setVeloType(\''+t.id+'\')">'+
      '<div style="font-size:44px;margin-bottom:8px">'+ICONS[t.id]+'</div>'+
      '<div style="font-weight:700;font-size:13px;color:'+(sel?'var(--blue)':'var(--text)')+'">'+t.lbl+'</div>'+
      '<div style="font-size:11px;color:var(--gray);margin-top:2px">'+t.sub+'</div>'+
    '</div>';
  }).join('');
  return hdr(svgBack(),'step_type','Type de vélo','Étape 2 sur 5','40')+
  '<div class="p16" style="padding-bottom:80px">'+
    '<div style="font-size:17px;font-weight:700;margin-bottom:4px">Quel type de vélo ?</div>'+
    '<div style="font-size:13px;color:var(--gray);margin-bottom:14px">Sélectionnez la catégorie la plus proche.</div>'+
    '<div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;margin-bottom:16px;-webkit-overflow-scrolling:touch;scrollbar-width:none">'+cards+'</div>'+
  '</div>'+
  '<div style="position:fixed;bottom:68px;left:50%;transform:translateX(-50%);width:100%;max-width:390px;padding:8px 16px 12px;background:#fff;border-top:1px solid var(--border);z-index:50">'+
    (S.meta.type?'<button class="btn bb" onclick="go(\'step_brand\')">Suivant →</button>':'<button class="btn bk" disabled>Sélectionnez un type</button>')+
  '</div>';
}
function setVeloType(id){S.meta.type=id;render();}
window.setVeloType=setVeloType;


function pB(){
  // Si catégorie non-vélo, utiliser BRANDS_BY_CAT
  var BRANDS;
  if(S.meta.cat && S.meta.cat !== 'velo') {
    BRANDS = BRANDS_BY_CAT[S.meta.cat] || ["Decathlon","Autre"];
  } else {
    BRANDS = BRANDS_BY_TYPE[S.meta.type] || BRANDS_BY_TYPE.vtt;
  }
  var items=BRANDS.map(function(b){
    var safe=b.replace(/'/g,'&#39;');
    return '<div class="rl'+(S.meta.brand===b?' sel':'')+'" onclick="pickBrand(this.dataset.b)" data-b="'+safe+'"><span style="font-weight:600;font-size:14px">'+b+'</span><div class="rd"></div></div>';
  }).join('');
  return hdr(svgBack(),'step_type','Votre vélo','Étape 2 sur 5','40')+
  '<div class="p16">'+
    '<div style="font-size:17px;font-weight:700;margin-bottom:4px">Quelle est la marque ?</div>'+
    '<div style="font-size:13px;color:var(--gray);margin-bottom:14px;line-height:1.45">Sélectionnez la marque la plus proche.</div>'+
    items+
    '<div class="info mb16" style="margin-top:10px">'+svgInfo()+'<span>Ces infos aident à estimer le juste prix. Elles seront vérifiées en magasin.</span></div>'+
    '<button class="btn bb" onclick="go(\'step_info\')"'+(S.meta.brand?'':' style="opacity:.45" disabled')+'>Suivant →</button>'+
  '</div>';
}

function pI(){
  return hdr(svgBack(),'step_brand','Informations','Étape 3 sur 5','60')+
  '<div class="p16">'+
    '<div class="card sh mb12"><label class="lbl">Modèle</label><input class="inp" placeholder="ex: Rockrider ST 520" value="'+H(S.meta.model)+'" oninput="S.meta.model=this.value"></div>'+
    '<div class="card sh mb12"><label class="lbl">Année d\'achat</label><input class="inp" type="number" placeholder="2021" value="'+H(S.meta.year)+'" oninput="S.meta.year=this.value" min="2000" max="2026"></div>'+
    '<div class="card sh mb12"><label class="lbl">Prix à l\'achat (€)</label><input class="inp" type="number" placeholder="ex: 349" value="'+H(S.meta.price)+'" oninput="S.meta.price=this.value"></div>'+
   
    (['velo','trott'].includes(S.meta.cat)||!S.meta.cat?
      '<div class="card sh mb16">'+
        '<label class="lbl">Kilom\u00e9trage approximatif</label>'+
        '<div style="font-size:15px;font-weight:700;color:var(--blue);text-align:center;margin-bottom:6px" id="kmv">~ '+S.meta.km+' km</div>'+
        '<input type="range" min="0" max="10000" step="500" value="'+S.meta.km+'" oninput="S.meta.km=parseInt(this.value);document.getElementById(\'kmv\').textContent=\'~ \'+this.value+\' km\'" style="width:100%;accent-color:var(--blue);margin-bottom:6px">'+
        '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray)"><span>0 km</span><span>+10 000 km</span></div>'+
      '</div>':'')+
    '<button class="btn bb" onclick="S.step=0;go(\'diag\')">>Valider les informations →</button>'+
  '</div>';
}


// Schémas SVG de diagnostic par section

/**
 * app.js — Application Seconde Vie (UI, pages, navigation)
 * Decathlon Seconde Vie — EEMI x Decathlon — Bloc A4
 * Requiert scoring.js chargé en premier
 */

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
 *   [scoring.js doit être chargé en premier]
 *   [puis app.js]
 */