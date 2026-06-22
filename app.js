/**
 * app.js — Application Seconde Vie (UI, pages, navigation)
 * Decathlon Seconde Vie — EEMI x Decathlon — Bloc A4
 * Auteur : Ahonon Laye DIFEWE
 * Requiert scoring.js charge en premier
 */

/**
 * scoring.js — Moteur de diagnostic et de calcul de prix
 * Decathlon Seconde Vie — EEMI x Decathlon — Bloc A4
 * Charger ce fichier AVANT app.js
 */

var DIAG_SVG = {
  cadre: '<div style="background:var(--blue-lt);border:2px dashed #C3C9F8;border-radius:16px;padding:16px;margin-bottom:16px">' +
    '<svg viewBox="0 0 320 180" style="width:100%;height:auto" fill="none">' +
      '<circle cx="85" cy="130" r="45" stroke="#3643BA" stroke-width="3" fill="rgba(54,67,186,0.08)"/>' +
      '<circle cx="235" cy="130" r="45" stroke="#3643BA" stroke-width="3" fill="rgba(54,67,186,0.08)"/>' +
      '<line x1="160" y1="130" x2="85" y2="130" stroke="#3643BA" stroke-width="3"/>' +
      '<line x1="160" y1="130" x2="190" y2="65" stroke="#3643BA" stroke-width="3"/>' +
      '<line x1="85" y1="130" x2="190" y2="65" stroke="#3643BA" stroke-width="3"/>' +
      '<line x1="190" y1="65" x2="235" y2="130" stroke="#3643BA" stroke-width="3"/>' +
      '<line x1="210" y1="40" x2="235" y2="130" stroke="#3643BA" stroke-width="2.5"/>' +
      '<line x1="196" y1="42" x2="225" y2="42" stroke="#3643BA" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="210" y1="30" x2="210" y2="55" stroke="#3643BA" stroke-width="2.5"/>' +
      '<line x1="170" y1="40" x2="200" y2="40" stroke="#3643BA" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="190" y1="65" x2="185" y2="40" stroke="#3643BA" stroke-width="2.5"/>' +
      '<circle cx="160" cy="130" r="14" stroke="#3643BA" stroke-width="2.5" fill="rgba(54,67,186,0.1)"/>' +
      // Point 1 : cadre triangle
      '<circle cx="130" cy="100" r="14" fill="#3643BA"/>' +
      '<text x="130" y="105" text-anchor="middle" fill="white" font-size="13" font-weight="bold">1</text>' +
      // Point 2 : jonction fourche bas
      '<circle cx="215" cy="95" r="14" fill="#3643BA"/>' +
      '<text x="215" y="100" text-anchor="middle" fill="white" font-size="13" font-weight="bold">2</text>' +
      // Point 3 : haut du cadre
      '<circle cx="188" cy="52" r="14" fill="#3643BA"/>' +
      '<text x="188" y="57" text-anchor="middle" fill="white" font-size="13" font-weight="bold">3</text>' +
    '</svg>' +
    '<div style="display:flex;gap:16px;justify-content:center;margin-top:8px">' +
      '<span style="font-size:11px;font-weight:700;color:#3643BA">① Triangle du cadre</span>' +
      '<span style="font-size:11px;font-weight:700;color:#3643BA">② Fourche</span>' +
      '<span style="font-size:11px;font-weight:700;color:#3643BA">③ Selle / Guidon</span>' +
    '</div></div>',
  trans: '<div style="background:#FFF8F2;border:2px dashed #F5A623;border-radius:16px;padding:16px;margin-bottom:16px">' +
    '<svg viewBox="0 0 320 160" style="width:100%;height:auto" fill="none">' +
      '<circle cx="80" cy="110" r="40" stroke="#E87722" stroke-width="2.5" fill="rgba(232,119,34,0.08)"/>' +
      '<circle cx="240" cy="110" r="40" stroke="#E87722" stroke-width="2.5" fill="rgba(232,119,34,0.08)"/>' +
      '<circle cx="155" cy="110" r="18" stroke="#E87722" stroke-width="2.5" fill="rgba(232,119,34,0.12)"/>' +
      '<line x1="155" y1="110" x2="80" y2="110" stroke="#E87722" stroke-width="2"/>' +
      '<line x1="155" y1="110" x2="240" y2="110" stroke="#E87722" stroke-width="1.5" stroke-dasharray="6,4"/>' +
      // Point 1 : pédalier
      '<circle cx="155" cy="80" r="14" fill="#E87722"/>' +
      '<text x="155" y="85" text-anchor="middle" fill="white" font-size="13" font-weight="bold">1</text>' +
      // Point 2 : dérailleur
      '<circle cx="260" cy="85" r="14" fill="#E87722"/>' +
      '<text x="260" y="90" text-anchor="middle" fill="white" font-size="13" font-weight="bold">2</text>' +
      // Point 3 : cassette arrière
      '<circle cx="240" cy="50" r="14" fill="#E87722"/>' +
      '<text x="240" y="55" text-anchor="middle" fill="white" font-size="13" font-weight="bold">3</text>' +
    '</svg>' +
    '<div style="display:flex;gap:16px;justify-content:center;margin-top:8px">' +
      '<span style="font-size:11px;font-weight:700;color:#E87722">① Pédalier / Chaîne</span>' +
      '<span style="font-size:11px;font-weight:700;color:#E87722">② Dérailleur arrière</span>' +
      '<span style="font-size:11px;font-weight:700;color:#E87722">③ Cassette / Vitesses</span>' +
    '</div></div>',
  roues: '<div style="background:#F0FBF6;border:2px dashed #02BE8A;border-radius:16px;padding:16px;margin-bottom:16px">' +
    '<svg viewBox="0 0 320 160" style="width:100%;height:auto" fill="none">' +
      '<circle cx="80" cy="80" r="62" stroke="#02BE8A" stroke-width="3" fill="rgba(2,190,138,0.08)"/>' +
      '<circle cx="80" cy="80" r="8" fill="#02BE8A" opacity="0.4"/>' +
      '<circle cx="240" cy="80" r="62" stroke="#02BE8A" stroke-width="3" fill="rgba(2,190,138,0.08)"/>' +
      '<circle cx="240" cy="80" r="8" fill="#02BE8A" opacity="0.4"/>' +
      // Rayons
      '<line x1="80" y1="18" x2="80" y2="80" stroke="#02BE8A" stroke-width="1.5" opacity="0.5"/>' +
      '<line x1="80" y1="142" x2="80" y2="80" stroke="#02BE8A" stroke-width="1.5" opacity="0.5"/>' +
      '<line x1="18" y1="80" x2="80" y2="80" stroke="#02BE8A" stroke-width="1.5" opacity="0.5"/>' +
      '<line x1="142" y1="80" x2="80" y2="80" stroke="#02BE8A" stroke-width="1.5" opacity="0.5"/>' +
      // Points
      '<circle cx="80" cy="25" r="14" fill="#02BE8A"/>' +
      '<text x="80" y="30" text-anchor="middle" fill="white" font-size="13" font-weight="bold">1</text>' +
      '<circle cx="240" cy="25" r="14" fill="#02BE8A"/>' +
      '<text x="240" y="30" text-anchor="middle" fill="white" font-size="13" font-weight="bold">2</text>' +
      '<circle cx="160" cy="35" r="14" fill="#02BE8A"/>' +
      '<text x="160" y="40" text-anchor="middle" fill="white" font-size="13" font-weight="bold">3</text>' +
    '</svg>' +
    '<div style="display:flex;gap:16px;justify-content:center;margin-top:8px">' +
      '<span style="font-size:11px;font-weight:700;color:#006F43">① Pneu avant</span>' +
      '<span style="font-size:11px;font-weight:700;color:#006F43">② Pneu arrière</span>' +
      '<span style="font-size:11px;font-weight:700;color:#006F43">③ Rayons / Jantes</span>' +
    '</div></div>',
};


// Schémas SVG supplémentaires par catégorie (section ID)
var DIAG_SVG_EXT = {
  // Trottinette
  struc2: '<div style="background:#F0F4FF;border:2px dashed #C3C9F8;border-radius:16px;padding:16px;margin-bottom:16px">'+
    '<svg viewBox="0 0 320 160" style="width:100%;height:auto" fill="none">'+
      // Roue arrière
      '<circle cx="60" cy="120" r="30" stroke="#3643BA" stroke-width="2.5" fill="rgba(54,67,186,.08)"/>'+
      // Roue avant
      '<circle cx="260" cy="120" r="30" stroke="#3643BA" stroke-width="2.5" fill="rgba(54,67,186,.08)"/>'+
      // Plateau (deck)
      '<rect x="50" y="105" width="220" height="15" rx="4" stroke="#3643BA" stroke-width="2.5" fill="rgba(54,67,186,.1)"/>'+
      // Guidon
      '<line x1="200" y1="120" x2="200" y2="40" stroke="#3643BA" stroke-width="3"/>'+
      '<line x1="175" y1="38" x2="225" y2="38" stroke="#3643BA" stroke-width="3" stroke-linecap="round"/>'+
      // Frein
      '<rect x="218" y="60" width="18" height="8" rx="3" stroke="#3643BA" stroke-width="2" fill="rgba(54,67,186,.1)"/>'+
      // Points numérotés
      '<circle cx="155" cy="98" r="13" fill="#3643BA"/>'+
      '<text x="155" y="103" text-anchor="middle" fill="white" font-size="13" font-weight="bold">1</text>'+
      '<circle cx="200" cy="70" r="13" fill="#3643BA"/>'+
      '<text x="200" y="75" text-anchor="middle" fill="white" font-size="13" font-weight="bold">2</text>'+
      '<circle cx="60" cy="85" r="13" fill="#3643BA"/>'+
      '<text x="60" y="90" text-anchor="middle" fill="white" font-size="13" font-weight="bold">3</text>'+
    '</svg>'+
    '<div style="display:flex;gap:16px;justify-content:center;margin-top:8px">'+
      '<span style="font-size:11px;font-weight:700;color:#3643BA">① Plateau</span>'+
      '<span style="font-size:11px;font-weight:700;color:#3643BA">② Guidon</span>'+
      '<span style="font-size:11px;font-weight:700;color:#3643BA">③ Roues</span>'+
    '</div></div>',
  // Ski / snowboard
  glisse: '<div style="background:#EEF2FF;border:2px dashed #C3C9F8;border-radius:16px;padding:16px;margin-bottom:16px">'+
    '<svg viewBox="0 0 320 160" style="width:100%;height:auto" fill="none">'+
      // Ski gauche
      '<ellipse cx="80" cy="100" rx="65" ry="12" stroke="#3643BA" stroke-width="2.5" fill="rgba(54,67,186,.1)" transform="rotate(-10 80 100)"/>'+
      // Ski droit
      '<ellipse cx="220" cy="100" rx="65" ry="12" stroke="#3643BA" stroke-width="2.5" fill="rgba(54,67,186,.1)" transform="rotate(-10 220 100)"/>'+
      // Fixation ski gauche
      '<rect x="50" y="88" width="35" height="14" rx="4" stroke="#E87722" stroke-width="2" fill="rgba(232,119,34,.15)"/>'+
      // Fixation ski droit
      '<rect x="190" y="88" width="35" height="14" rx="4" stroke="#E87722" stroke-width="2" fill="rgba(232,119,34,.15)"/>'+
      // Carres (représentées)
      '<line x1="18" y1="110" x2="142" y2="92" stroke="#3643BA" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5"/>'+
      '<line x1="158" y1="110" x2="282" y2="92" stroke="#3643BA" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5"/>'+
      // Points
      '<circle cx="80" cy="70" r="13" fill="#3643BA"/>'+
      '<text x="80" y="75" text-anchor="middle" fill="white" font-size="13" font-weight="bold">1</text>'+
      '<circle cx="67" cy="95" r="13" fill="#E87722"/>'+
      '<text x="67" y="100" text-anchor="middle" fill="white" font-size="13" font-weight="bold">2</text>'+
      '<circle cx="155" cy="130" r="13" fill="#02BE8A"/>'+
      '<text x="155" y="135" text-anchor="middle" fill="white" font-size="13" font-weight="bold">3</text>'+
    '</svg>'+
    '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:8px">'+
      '<span style="font-size:11px;font-weight:700;color:#3643BA">① Planche / ski</span>'+
      '<span style="font-size:11px;font-weight:700;color:#E87722">② Fixations</span>'+
      '<span style="font-size:11px;font-weight:700;color:#02BE8A">③ Carres / semelle</span>'+
    '</div></div>',
  // Raquette de tennis
  raquette: '<div style="background:#F0FBF6;border:2px dashed #02BE8A;border-radius:16px;padding:16px;margin-bottom:16px">'+
    '<svg viewBox="0 0 320 180" style="width:100%;height:auto" fill="none">'+
      // Cadre ovale
      '<ellipse cx="160" cy="80" rx="60" ry="72" stroke="#02BE8A" stroke-width="3" fill="rgba(2,190,138,.06)"/>'+
      // Cordage vertical
      '<line x1="130" y1="12" x2="130" y2="148" stroke="#02BE8A" stroke-width="1" opacity="0.4"/>'+
      '<line x1="148" y1="10" x2="148" y2="150" stroke="#02BE8A" stroke-width="1" opacity="0.4"/>'+
      '<line x1="166" y1="9" x2="166" y2="151" stroke="#02BE8A" stroke-width="1" opacity="0.4"/>'+
      '<line x1="184" y1="10" x2="184" y2="150" stroke="#02BE8A" stroke-width="1" opacity="0.4"/>'+
      // Cordage horizontal
      '<line x1="104" y1="50" x2="216" y2="50" stroke="#02BE8A" stroke-width="1" opacity="0.4"/>'+
      '<line x1="100" y1="70" x2="220" y2="70" stroke="#02BE8A" stroke-width="1" opacity="0.4"/>'+
      '<line x1="100" y1="90" x2="220" y2="90" stroke="#02BE8A" stroke-width="1" opacity="0.4"/>'+
      '<line x1="104" y1="110" x2="216" y2="110" stroke="#02BE8A" stroke-width="1" opacity="0.4"/>'+
      // Manche
      '<rect x="148" y="148" width="24" height="28" rx="6" stroke="#3643BA" stroke-width="2.5" fill="rgba(54,67,186,.1)"/>'+
      '<rect x="144" y="168" width="32" height="8" rx="4" stroke="#3643BA" stroke-width="2" fill="rgba(54,67,186,.08)"/>'+
      // Points
      '<circle cx="80" cy="75" r="13" fill="#02BE8A"/>'+
      '<text x="80" y="80" text-anchor="middle" fill="white" font-size="13" font-weight="bold">1</text>'+
      '<circle cx="245" cy="75" r="13" fill="#3643BA"/>'+
      '<text x="245" y="80" text-anchor="middle" fill="white" font-size="13" font-weight="bold">2</text>'+
      '<circle cx="160" cy="165" r="13" fill="#E87722"/>'+
      '<text x="160" y="170" text-anchor="middle" fill="white" font-size="13" font-weight="bold">3</text>'+
    '</svg>'+
    '<div style="display:flex;gap:12px;justify-content:center;margin-top:8px">'+
      '<span style="font-size:11px;font-weight:700;color:#02BE8A">① Cadre</span>'+
      '<span style="font-size:11px;font-weight:700;color:#3643BA">② Cordage</span>'+
      '<span style="font-size:11px;font-weight:700;color:#E87722">③ Grip / manche</span>'+
    '</div></div>',
  // Boules pétanque
  boules: '<div style="background:#F5F4FF;border:2px dashed #C3C9F8;border-radius:16px;padding:16px;margin-bottom:16px">'+
    '<svg viewBox="0 0 320 160" style="width:100%;height:auto" fill="none">'+
      '<circle cx="80" cy="90" r="45" stroke="#3643BA" stroke-width="2.5" fill="rgba(54,67,186,.08)"/>'+
      '<circle cx="80" cy="90" r="30" stroke="#3643BA" stroke-width="1" opacity="0.3"/>'+
      '<circle cx="190" cy="90" r="45" stroke="#3643BA" stroke-width="2.5" fill="rgba(54,67,186,.08)"/>'+
      '<circle cx="280" cy="105" r="18" stroke="#E87722" stroke-width="2.5" fill="rgba(232,119,34,.15)"/>'+
      // Rayures de boule (décoratif)
      '<path d="M48 65 Q80 55 112 65" stroke="#3643BA" stroke-width="1.5" opacity="0.4" fill="none"/>'+
      '<path d="M45 90 Q80 80 115 90" stroke="#3643BA" stroke-width="1.5" opacity="0.4" fill="none"/>'+
      // Points
      '<circle cx="80" cy="38" r="13" fill="#3643BA"/>'+
      '<text x="80" y="43" text-anchor="middle" fill="white" font-size="13" font-weight="bold">1</text>'+
      '<circle cx="190" cy="38" r="13" fill="#3643BA"/>'+
      '<text x="190" y="43" text-anchor="middle" fill="white" font-size="13" font-weight="bold">2</text>'+
      '<circle cx="280" cy="78" r="13" fill="#E87722"/>'+
      '<text x="280" y="83" text-anchor="middle" fill="white" font-size="13" font-weight="bold">3</text>'+
    '</svg>'+
    '<div style="display:flex;gap:12px;justify-content:center;margin-top:8px">'+
      '<span style="font-size:11px;font-weight:700;color:#3643BA">① Boule 1</span>'+
      '<span style="font-size:11px;font-weight:700;color:#3643BA">② Boule 2</span>'+
      '<span style="font-size:11px;font-weight:700;color:#E87722">③ Cochonnet</span>'+
    '</div></div>',
};

function pD(){
  var diagSet=(S.meta.cat&&CDIAG_BY_CAT[S.meta.cat])||CDIAG;var sec=diagSet[S.step];
  var pct=60+((S.step+1)/CDIAG.length)*38;
  var crits=sec.crit.map(function(c){
    var v=S.scores[c.id];
    return '<div class="card sh mb8">'+
      '<div style="font-weight:700;font-size:14px;margin-bottom:3px">'+c.label+'</div>'+
      '<div style="font-size:12px;color:var(--gray);margin-bottom:10px;line-height:1.45">'+c.desc+'</div>'+
      '<div class="chips">'+
        chp(c.id,'good','Bon état',v)+chp(c.id,'warn','À vérifier',v)+chp(c.id,'bad','Mauvais état',v)+chp(c.id,'na','Je ne sais pas',v)+
      '</div>'+
    '</div>';
  }).join('');
  var photoOk=S.photos[sec.id];
  return hdr(svgBack(),'','Diagnostic vélo','Étape '+(S.step+4)+' sur 5',pct)+
  '<div class="p16">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">'+
      '<span style="font-size:20px">'+sec.icon+'</span>'+
      '<div style="font-size:16px;font-weight:700;color:'+sec.color+'">'+sec.label+'</div>'+
    '</div>'+
    '<div style="font-size:12px;color:var(--gray);margin-bottom:14px;line-height:1.5">'+sec.hint+'</div>'+
    ((S.meta.cat==='velo'||!S.meta.cat)?(['velo','trott'].includes(S.meta.cat)||!S.meta.cat?DIAG_SVG[sec.id]||'':DIAG_SVG_EXT[sec.id]||''):'')+
    '<div class="card mb12" style="border:2px dashed var(--border);background:var(--bg);text-align:center;padding:22px;cursor:pointer" onclick="addPhoto(\''+sec.id+'\')">'+
      (photoOk?'<div style="color:var(--green-dk);font-weight:700;font-size:14px">✅ Photo ajoutée</div>':
        '<div style="font-size:26px;margin-bottom:6px">📷</div><div style="font-size:13px;color:var(--gray);font-weight:500">Prenez une photo du '+sec.label.toLowerCase()+'</div><div style="font-size:11px;color:var(--gray);margin-top:2px">Optionnel · aide à confirmer l\'état</div>')+
    '</div>'+
    crits+
    '<div class="info mb16">'+svgInfo()+'<span>Ces éléments seront vérifiés par le vendeur en magasin et peuvent ajuster l\'offre de reprise.</span></div>'+
    '<button class="btn bb" onclick="diagNext()">'+(S.step<CDIAG.length-1?'Suivant →':'Voir mon estimation →')+'</button>'+
  '</div>';
}
function chp(id,key,lbl,v){var km={good:'cg',warn:'cw',bad:'cb',na:'cn'};return '<button class="chip'+(v===key?' '+km[key]:'')+'" onclick="setScore(\''+id+'\',\''+key+'\')">'+lbl+'</button>';}

function pR(){
  var mapped=getCS();var score=calcScore(mapped);var price=calcPrice(score,S.meta);var offreBrute=Math.max(5,Math.round(price*0.9/5)*5);
  var annee=parseInt(S.meta.year)||2021;
  var anneeCalc=Math.max(0,2026-annee);
  var afCalc=anneeCalc===0?0.55:anneeCalc===1?0.50:anneeCalc===2?0.44:anneeCalc===3?0.38:anneeCalc<=5?0.30:anneeCalc<=8?0.24:0.18;
  var prixNeuf=S.meta.price&&parseFloat(S.meta.price)>0?parseFloat(S.meta.price):((TYPES.find(function(x){return x.id===S.meta.type;})||TYPES[0]).base*2.5);
  var sc=S.scores;

  // === TARIFS DE RÉPARATION PAR TYPE (prix atelier Decathlon 2026) ===
  var COUT = (function(){
    var t = S.meta.type || 'ville';
    // Fourchettes réelles : vae > vtt route > ville > enfant > bmx
    var tables = {
      vae:    {c1b:120,c1w:45,c2:20,c3b:150,c3w:60,t1b:65,t1w:30,t2b:80,t2w:35,t3b:45,t3w:20,r1b:55,r1w:20,r2b:90,r2w:40,r3b:30,net:15},
      vtt:    {c1b:80, c1w:30,c2:12,c3b:90, c3w:40,t1b:45,t1w:20,t2b:55,t2w:25,t3b:30,t3w:15,r1b:35,r1w:12,r2b:60,r2w:25,r3b:20,net:10},
      route:  {c1b:90, c1w:35,c2:12,c3b:100,c3w:45,t1b:50,t1w:22,t2b:60,t2w:28,t3b:35,t3w:18,r1b:40,r1w:14,r2b:65,r2w:28,r3b:22,net:10},
      ville:  {c1b:55, c1w:20,c2:10,c3b:65, c3w:28,t1b:35,t1w:15,t2b:40,t2w:18,t3b:25,t3w:12,r1b:28,r1w:10,r2b:45,r2w:18,r3b:15,net:10},
      enfant: {c1b:30, c1w:12,c2:6, c3b:35, c3w:15,t1b:20,t1w:8, t2b:22,t2w:10,t3b:15,t3w:7, r1b:15,r1w:6, r2b:25,r2w:10,r3b:10,net:8},
      bmx:    {c1b:40, c1w:15,c2:8, c3b:0,  c3w:0, t1b:25,t1w:10,t2b:30,t2w:12,t3b:20,t3w:8, r1b:20,r1w:8, r2b:35,r2w:14,r3b:12,net:8},
    };
    return tables[t] || tables.ville;
  }());
  var repairs=[];
  // REFUS IMMEDIAT si freins ou cadre bloquants
  var raisonRefus=sc.t1==='bad'?'freins':sc.c1==='bad'?'cadre':null;
  if(raisonRefus){
    S.finalPrice=0;S.reprisRefusee=true;
    var msgR=raisonRefus==='freins'
      ?'Les freins sont en mauvais \u00e9tat. Decathlon ne peut pas revendre un v\u00e9lo avec un syst\u00e8me de freinage d\u00e9faillant.'
      :'Le cadre pr\u00e9sente une anomalie structurelle. Decathlon ne peut pas revendre un v\u00e9lo dont la structure n\'est pas fiable.';
    return '<div style="background:#D70321;min-height:100vh;padding:40px 20px;color:#fff;text-align:center">'+
      '<div style="font-size:56px;margin-bottom:16px">\uD83D\uDEAB</div>'+
      '<div style="font-size:26px;font-weight:900;margin-bottom:12px">Reprise impossible</div>'+
      '<div style="font-size:15px;opacity:.85;line-height:1.6;margin-bottom:28px">'+msgR+'</div>'+
      '<div style="background:rgba(255,255,255,.15);border-radius:14px;padding:18px;margin-bottom:28px">'+
        '<div style="font-weight:700;margin-bottom:8px">Que faire ?</div>'+
        '<div style="font-size:13px;opacity:.85;line-height:1.7">'+
          (raisonRefus==='freins'
            ?'\u2022 Faire r\u00e9parer les freins chez un atelier v\u00e9lo<br>\u2022 Revenir avec le v\u00e9lo r\u00e9par\u00e9<br>\u2022 Le vendre sur LeBonCoin en mentionnant l\'\u00e9tat'
            :'\u2022 Faire inspecter le cadre par un technicien<br>\u2022 Si r\u00e9parable, revenir apr\u00e8s r\u00e9paration<br>\u2022 Sinon le vendre en pi\u00e8ces d\u00e9tach\u00e9es')+
        '</div>'+
      '</div>'+
      '<button class="btn" style="background:#fff;color:#D70321;font-weight:800" onclick="resetClient()">Retour \u00e0 l\'accueil</button>'+
    '</div>';
  }
  if(sc.c1==='bad'||sc.c1==='warn')
    repairs.push({l:'Cadre \u00e0 inspecter',
      desc:'Une anomalie a \u00e9t\u00e9 d\u00e9tect\u00e9e sur le cadre. Le technicien v\u00e9rifiera les fissures et d\u00e9formations.',
      impact:'Diagnostic atelier obligatoire',i:sc.c1==='bad'?-COUT.c1b:-COUT.c1w,prio:sc.c1==='bad'?'urgent':'important'});
  if(sc.c2==='bad')
    repairs.push({l:'Rayures importantes',
      desc:'Des rayures significatives ont \u00e9t\u00e9 d\u00e9clar\u00e9es. Elles impactent la valeur de revente.',
      impact:'Impact visuel',i:-COUT.c2,prio:'standard'});
  if(sc.c3==='bad'||sc.c3==='warn')
    repairs.push({l:'Fourche \u00e0 v\u00e9rifier',
      desc:'La fourche pr\u00e9sente un probl\u00e8me d\u2019alignement ou de jeu. Contr\u00f4le atelier n\u00e9cessaire.',
      impact:'Pi\u00e8ces + main-d\u2019oeuvre',i:sc.c3==='bad'?-COUT.c3b:-COUT.c3w,prio:sc.c3==='bad'?'urgent':'important'});
  if(sc.t1==='bad'||sc.t1==='warn')
    repairs.push({l:'Freins \u00e0 remplacer',
      desc:'Les freins pr\u00e9sentent une usure importante. Decathlon remplacera les plaquettes avant la remise en vente.',
      impact:'Pi\u00e8ces + main-d\u2019oeuvre atelier',i:sc.t1==='bad'?-COUT.t1b:-COUT.t1w,prio:sc.t1==='bad'?'urgent':'important'});
  if(sc.t2==='bad'||sc.t2==='warn')
    repairs.push({l:'Transmission \u00e0 r\u00e9viser',
      desc:'La cha\u00eene ou les vitesses n\u00e9cessitent une intervention. Notre atelier v\u00e9rifiera l\u2019\u00e9longation.',
      impact:'Pi\u00e8ces + main-d\u2019oeuvre atelier',i:sc.t2==='bad'?-COUT.t2b:-COUT.t2w,prio:sc.t2==='bad'?'urgent':'important'});
  if(sc.t3==='bad'||sc.t3==='warn')
    repairs.push({l:'D\u00e9railleur \u00e0 r\u00e9gler',
      desc:'Le d\u00e9railleur est mal align\u00e9 ou les c\u00e2bles sont us\u00e9s.',
      impact:'Main-d\u2019oeuvre atelier',i:sc.t3==='bad'?-COUT.t3b:-COUT.t3w,prio:sc.t3==='bad'?'important':'standard'});
  if(sc.r1==='bad'||sc.r1==='warn')
    repairs.push({l:'Pneus \u00e0 remplacer',
      desc:'Un ou les deux pneus pr\u00e9sentent une usure importante.',
      impact:'Pi\u00e8ces + main-d\u2019oeuvre',i:sc.r1==='bad'?-COUT.r1b:-COUT.r1w,prio:sc.r1==='bad'?'urgent':'important'});
  if(sc.r2==='bad'||sc.r2==='warn')
    repairs.push({l:'Jantes \u00e0 v\u00e9rifier',
      desc:'Les jantes pr\u00e9sentent un voile ou des fissures. Contr\u00f4le technique n\u00e9cessaire.',
      impact:'Pi\u00e8ces + main-d\u2019oeuvre',i:sc.r2==='bad'?-COUT.r2b:-COUT.r2w,prio:sc.r2==='bad'?'urgent':'important'});
  if(sc.r3==='bad')
    repairs.push({l:'Rayons \u00e0 remplacer',
      desc:'Des rayons sont cass\u00e9s ou d\u00e9form\u00e9s.',
      impact:'Pi\u00e8ces + main-d\u2019oeuvre',i:-COUT.r3b,prio:'important'});  // Nettoyage toujours inclus
  repairs.push({l:'Nettoyage & pr\u00e9paration',
    desc:'Chaque \u00e9quipement Seconde Vie est nettoy\u00e9, d\u00e9graiss\u00e9 et contr\u00f4l\u00e9 avant d\'\u00eatre remis en vente.',
    impact:'Service inclus dans le processus qualit\u00e9',i:-10,prio:'standard'});
  // Si aucune réparation sauf nettoyage, message positif
  if(repairs.length===1)
    repairs.unshift({l:'\u00c9tat g\u00e9n\u00e9ral satisfaisant',
      desc:'Aucune anomalie majeure d\u00e9tect\u00e9e lors de votre auto-diagnostic. Le technicien confirmera cet \u00e9tat en magasin.',
      impact:'Pas de d\u00e9duction suppl\u00e9mentaire pr\u00e9vue',i:0,prio:'standard'});
  var deductions=repairs.reduce(function(a,r){return a+r.i;},0);
  // Si les coûts de réparation dépassent la valeur estimée → REFUS
  var adj;
  if(Math.abs(deductions) >= offreBrute) {
    adj = 0;
    S.finalPrice = 0;
    S.reprisRefusee = true;
  } else {
    adj = Math.max(5, Math.round((offreBrute+deductions)/5)*5);
    S.finalPrice = adj;
    S.reprisRefusee = false;
  }
  var prioBg={urgent:'var(--red-lt)',important:'var(--orange-lt)',standard:'var(--bg)'};
  var prioColor={urgent:'var(--red)',important:'var(--orange)',standard:'var(--gray)'};
  var prioIco={urgent:'\u26a0',important:'\ud83d\udd27',standard:'\u2705'};
  var rh=repairs.map(function(r){
    return '<div style="background:'+prioBg[r.prio]+';border-radius:12px;padding:14px;margin-bottom:10px">'+
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">'+
        '<div style="display:flex;align-items:center;gap:7px">'+
          '<span style="font-size:16px">'+prioIco[r.prio]+'</span>'+
          '<div style="font-weight:700;font-size:14px;color:'+prioColor[r.prio]+'">'+r.l+'</div>'+
        '</div>'+
        '<span style="color:var(--red);font-weight:800;font-size:15px;white-space:nowrap;flex-shrink:0">'+r.i+' \u20ac</span>'+
      '</div>'+
      '<div style="font-size:12px;color:var(--text);line-height:1.55;margin-bottom:5px">'+r.desc+'</div>'+
      '<div style="font-size:11px;color:var(--gray);font-weight:500">'+r.impact+'</div>'+
    '</div>';
  }).join('');
  return hdr(svgBack(),'','Bilan des r\u00e9parations','R\u00e9capitulatif avant estimation finale','85')+
  '<div class="p16">'+
    '<div class="info mb14">'+svgInfo()+'<span>Ces r\u00e9parations sont r\u00e9alis\u00e9es par nos techniciens <strong>avant la remise en vente</strong>. Leur co\u00fbt est d\u00e9duit de votre offre.</span></div>'+
    rh+
    '<div class="card sh mb16">'+
      '<div style="font-size:14px;font-weight:700;margin-bottom:12px">R\u00e9capitulatif financier</div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)">'+
        '<div>'+
          '<div style="font-size:13px;color:var(--gray)">Valeur estim\u00e9e du v\u00e9lo</div>'+
          '<div style="font-size:11px;color:var(--gray);margin-top:1px">Bas\u00e9e sur l\'age, le kilom\u00e9trage et votre d\u00e9claration</div>'+
        '</div>'+
        '<span style="font-weight:700;font-size:15px">'+offreBrute+' \u20ac</span>'+
      '</div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)">'+
        '<div>'+
          '<div style="font-size:13px;color:var(--red)">Co\u00fbt des r\u00e9parations n\u00e9cessaires</div>'+
          '<div style="font-size:11px;color:var(--gray);margin-top:1px">Pi\u00e8ces + main-d\'oeuvre atelier Decathlon</div>'+
        '</div>'+
        '<span style="font-weight:700;font-size:15px;color:var(--red)">'+deductions+' \u20ac</span>'+
      '</div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;background:var(--blue-lt);border-radius:10px;padding:14px;margin-top:10px">'+
        '<div>'+
          '<div style="font-size:15px;font-weight:700;color:var(--blue-dk)">Votre offre de reprise</div>'+
          '<div style="font-size:11px;color:var(--gray);margin-top:2px">Confirm\u00e9e apr\u00e8s diagnostic en magasin</div>'+
        '</div>'+
        '<span style="font-size:28px;font-weight:900;color:var(--blue)">'+adj+' \u20ac</span>'+
      '</div>'+
    '</div>'+
    '<div class="card mb16" style="background:var(--bg);border:none">'+
      '<div style="font-size:13px;font-weight:700;margin-bottom:10px">Comment sera vers\u00e9e votre offre ?</div>'+
      '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:10px">'+
        '<span style="font-size:18px">'+'\ud83d\udcb3'+'</span>'+
        '<div style="font-size:12px;line-height:1.6">'+
          '<strong style="color:var(--blue)">Bon d\'achat Decathlon</strong><br>'+
          'Montant total + <strong>15 % de bonus</strong> offert'+
        '</div>'+
      '</div>'+
      '<div style="display:flex;align-items:flex-start;gap:8px">'+
        '<span style="font-size:18px">'+'\ud83c\udfe6'+'</span>'+
        '<div style="font-size:12px;line-height:1.6">'+
          '<strong style="color:var(--gray)">Virement bancaire</strong><br>'+
          'Montant exact, vers\u00e9 sous 5 jours ouvrés'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<button class="btn bb mb8" onclick="go(\'result\')">Voir mon estimation finale \u2192</button>'+
    '<button class="btn bk" onclick="go(\'diag\')">\u2190 Revoir mon diagnostic</button>'+
  '</div>';
}function pRes(){
  var mapped=getCS();var score=calcScore(mapped);var price=calcPrice(score,S.meta);
  var offreBrute=Math.max(5,Math.round(price*0.9/5)*5);
  var adj=S.finalPrice||offreBrute;
  // Cas de refus : coûts de réparation supérieurs à la valeur
  if(S.reprisRefusee) {
    return '<div style="background:#D70321;min-height:100vh;padding:40px 20px;color:#fff;text-align:center">'+
      '<div style="font-size:64px;margin-bottom:16px">🚫</div>'+
      '<div style="font-size:28px;font-weight:900;margin-bottom:12px">Reprise impossible</div>'+
      '<div style="font-size:16px;opacity:.85;line-height:1.6;margin-bottom:32px">Les coûts de réparation nécessaires dépassent la valeur estimée de votre équipement.<br><br>Decathlon Seconde Vie ne peut pas faire une offre de reprise dans ces conditions.</div>'+
      '<div style="background:rgba(255,255,255,.15);border-radius:16px;padding:20px;margin-bottom:32px">'+
        '<div style="font-weight:700;margin-bottom:8px">Que faire de votre équipement ?</div>'+
        '<div style="font-size:14px;opacity:.85;line-height:1.7">• Le vendre directement sur <strong>LeBonCoin</strong> ou <strong>Vinted</strong><br>• Le déposer en <strong>recyclerie</strong><br>• Le faire réparer avant de revenir</div>'+
      '</div>'+
      '<button class="btn" style="background:#fff;color:#D70321;font-weight:800" onclick="resetClient()">Retour \u00e0 l\'accueil</button>'+
    '</div>';
  }
  var _annee=parseInt(S.meta.year)||2021;
  var _age=Math.max(0,2026-_annee);
  var _af=_age===0?0.55:_age===1?0.50:_age===2?0.44:_age===3?0.38:_age<=5?0.30:_age<=8?0.24:0.18;
  var _BASE_BY_CAT={velo:500,fitness:400,camping:200,hiver:350,trott:300,eau:250,raquettes:150,running:120,golf:500,peche:200,equi:300,combat:150,chasse:250,escalade:300,petanque:100,vetements:80};var _baseNeuf=S.meta.cat&&_BASE_BY_CAT[S.meta.cat]?_BASE_BY_CAT[S.meta.cat]:((TYPES.find(function(x){return x.id===S.meta.type;})||TYPES[0]).base*2.5);var _prixNeuf=S.meta.price&&parseFloat(S.meta.price)>0?parseFloat(S.meta.price):_baseNeuf;
  var d=decision(score);
  if(!S.code){S.code=mkCode();}
  var tp=TYPES.find(function(x){return x.id===S.meta.type;})||TYPES[0];
  window.DOS[S.code]={code:S.code,meta:Object.assign({},S.meta),scores:Object.assign({},S.scores),score:score,price:adj,type:tp.label};
  if(score<40){
    var badC=Object.entries(S.scores).filter(function(e){return e[1]==='bad';});
    var labels={c1:'Cadre fissuré',c2:'Rayures importantes',c3:'Fourche endommagée',t1:'Freins dangereux',t2:'Transmission hors service',t3:'Dérailleur cassé',r1:'Pneus hors service',r2:'Jantes fissurées',r3:'Rayons cassés'};
    return '<div style="background:var(--red-lt);min-height:100svh;padding:52px 20px 100px">'+
      '<div style="text-align:center;margin-bottom:24px">'+
        '<div style="width:80px;height:80px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">'+
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>'+
        '<div style="font-size:13px;color:var(--red);font-weight:700;letter-spacing:.02em">REPRISE NON POSSIBLE</div>'+
        '<div style="font-size:42px;font-weight:900;color:var(--red);margin:6px 0;letter-spacing:-.02em">'+score+'/100</div>'+
      '</div>'+
      '<div class="card mb12"><div style="font-weight:700;margin-bottom:12px">Points bloquants identifiés</div>'+
        (badC.length>0?badC.map(function(e){return '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px"><div style="width:7px;height:7px;border-radius:50%;background:var(--red);flex-shrink:0;margin-top:5px"></div><div style="font-weight:600;font-size:14px">'+(labels[e[0]]||e[0])+'</div></div>';}).join(''):'<div style="font-size:13px;color:var(--gray)">État général insuffisant pour la reprise.</div>')+
      '</div>'+
      '<div class="card mb16 warn-box"><div style="font-weight:700;color:var(--orange);margin-bottom:6px">Alternatives disponibles</div><div style="font-size:13px;line-height:1.55">Service réparation Decathlon dès 29 € · Dépose possible immédiatement en magasin.</div></div>'+
      '<button class="btn bb" onclick="resetClient()">Commencer un nouveau diagnostic</button>'+
    '</div>';
  }
  var bars=CDIAG.map(function(sec){
    var vals=sec.crit.map(function(c){return SMAP[S.scores[c.id]]||1;});
    var avg=vals.reduce(function(a,b){return a+b;},0)/(vals.length*3);
    var pt=Math.round(avg*10);
    var bc=avg>0.65?'var(--green)':avg>0.4?'var(--orange)':'var(--red)';
    return '<div class="br-row"><div style="width:110px;font-size:13px;font-weight:600;flex-shrink:0;color:var(--text)">'+sec.label+'</div>'+
      '<div class="bar"><div class="bf" style="width:'+(avg*100)+'%;background:'+bc+'"></div></div>'+
      '<div style="width:36px;text-align:right;font-size:13px;font-weight:700;color:var(--text)">'+pt+'/10</div></div>';
  }).join('');
  var accepted=score>=65;
  return '<div style="background:'+(accepted?'var(--green)':'var(--orange)')+';padding:52px 20px 24px;text-align:center;color:#fff">'+
    '<div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:38px;font-weight:900;letter-spacing:-.02em">'+score+'</div>'+
    '<div style="font-size:18px;font-weight:800;letter-spacing:-.01em">'+(accepted?'✓ Reprise acceptée':'⚠ Reprise conditionnelle')+'</div>'+
    '<div style="font-size:40px;font-weight:900;margin:8px 0;letter-spacing:-.02em">'+adj+' €</div>'+
    '<div style="background:rgba(255,255,255,.2);border-radius:12px;padding:12px 16px;margin-bottom:16px;border:1.5px solid rgba(255,255,255,.35)">'+
      '<div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px">⚠ Estimation provisoire</div>'+
      '<div style="font-size:12px;color:rgba(255,255,255,.85);line-height:1.5">Ce prix sera confirmé ou ajusté lors du diagnostic en magasin par notre technicien. Il peut évoluer selon l\'état réel du vélo.</div>'+
    '</div>'+
    '<button class="btn" style="background:#fff;color:'+(accepted?'var(--green-dk)':'var(--orange)')+';font-weight:700" onclick="go(\'rdv\')">Prendre rendez-vous →</button>'+
  '</div>'+
  '<div class="p16">'+
    '<div style="font-size:15px;font-weight:700;margin-bottom:12px">Détail du diagnostic</div>'+
    '<div class="card sh mb12">'+bars+
      '<div style="font-size:12px;color:var(--gray);line-height:1.6;margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">'+
        'Votre vélo est éligible à la reprise Seconde Vie. Estimation initiale : <strong>'+price+' €</strong>. Cette estimation peut évoluer après le diagnostic physique en magasin.'+
      '</div>'+
    '</div>'+
    '<div class="card sh mb12">'+
      '<div style="font-size:15px;font-weight:700;margin-bottom:12px">💡 Comprendre votre estimation</div>'+
      '<div style="font-size:12px;color:var(--gray);margin-bottom:12px;line-height:1.5">Voici comment nous avons calculé ce prix. Vous pouvez vérifier chaque étape.</div>'+
      '<div style="border-left:3px solid var(--blue);padding:8px 12px;background:var(--blue-lt);border-radius:0 8px 8px 0;margin-bottom:8px">'+
        '<div style="font-size:11px;font-weight:700;color:var(--blue);margin-bottom:2px">① Valeur de marché</div>'+
        '<div style="font-size:12px;color:var(--gray)">Prix neuf estimé utilisé : <strong>'+Math.round(_prixNeuf)+' €</strong>. Vérifiable sur decathlon.fr ou Google Shopping.</div>'+
      '</div>'+
      '<div style="border-left:3px solid var(--orange);padding:8px 12px;background:var(--orange-lt);border-radius:0 8px 8px 0;margin-bottom:8px">'+
        '<div style="font-size:11px;font-weight:700;color:var(--orange);margin-bottom:2px">② Décote selon l\'âge ('+_age+' an(s))</div>'+
        '<div style="font-size:12px;color:var(--gray)">Coefficient appliqué : <strong>'+Math.round(_af*100)+'%</strong> de la valeur neuf — standard marché occasion sportif.</div>'+
      '</div>'+
      '<div style="border-left:3px solid var(--green-dk);padding:8px 12px;background:var(--green-lt);border-radius:0 8px 8px 0;margin-bottom:10px">'+
        '<div style="font-size:11px;font-weight:700;color:var(--green-dk);margin-bottom:2px">③ Score d\'état : '+score+'/100</div>'+
        '<div style="font-size:12px;color:var(--gray)">Basé sur votre auto-diagnostic. Le technicien vérifiera et peut ajuster à la hausse ou à la baisse.</div>'+
      '</div>'+
      '<div style="background:var(--bg);border-radius:10px;padding:12px">'+
        '<div style="font-size:12px;font-weight:700;margin-bottom:5px">🔍 Vos droits</div>'+
        '<div style="font-size:12px;color:var(--gray);line-height:1.6">• Vous pouvez <strong>refuser l\'offre</strong> si elle vous semble injuste.<br>• Demandez une <strong>explication pour chaque déduction</strong> appliquée.<br>• Comparez sur <strong>Back Market, Vinted, LeBonCoin</strong> pour avoir un point de référence.</div>'+
      '</div>'+
    '</div>'+
    '<div class="card sh mb12" style="text-align:center">'+
      '<div style="font-size:13px;font-weight:700;margin-bottom:12px">📱 Votre QR code de diagnostic</div>'+
      '<div id="qrbox" style="display:flex;justify-content:center;margin-bottom:12px"></div>'+
      '<div style="font-size:14px;font-weight:800;color:var(--blue);letter-spacing:2px">'+S.code+'</div>'+
      '<div style="font-size:11px;color:var(--gray);margin-top:5px">Présentez ce code au vendeur en magasin</div>'+
    '</div>'+
    '<button class="btn bk" onclick="resetClient()">Annuler le diagnostic</button>'+
  '</div>';
}

function pRdv(){
  var mapped=getCS();var score=calcScore(mapped);var adj=Math.max(0,Math.round(calcPrice(score,S.meta)*0.9/5)*5);
  var tp=TYPES.find(function(x){return x.id===S.meta.type;})||TYPES[0];
  var days=[14,15,16,17,18,19,20,21,22,23,24,25,26,27];
  var slots=['9h00','10h30','14h00','15h30','17h00'];
  return hdr(svgBack(),'result','Prendre rendez-vous','','')+
  '<div class="p16">'+
    '<div class="card sh mb16" style="display:flex;justify-content:space-between;align-items:center">'+
      '<div>'+
        '<div style="font-size:13px;color:var(--gray)">'+tp.icon+' '+H(S.meta.brand)+' '+H(S.meta.model)+'</div>'+
        '<div style="font-weight:700;font-size:14px;margin-top:3px">'+adj+' € · Score '+score+'/100</div>'+
      '</div>'+
      '<div style="background:var(--green-lt);color:var(--green-dk);font-size:11px;font-weight:700;padding:5px 12px;border-radius:var(--r-pill)">✓ Accepté</div>'+
    '</div>'+
    '<div style="font-size:15px;font-weight:700;margin-bottom:8px">Choisir un magasin</div>'+
    '<div style="font-size:15px;font-weight:700;margin-bottom:8px">Choisir un magasin</div>'+
    ['Decathlon Paris Nation|2,3 km · 12 Av. du Trône, 75012 Paris','Decathlon Paris Rivoli|4,1 km · 2 Rue des Innocents, 75001 Paris','Decathlon Rosny-sous-Bois|8,7 km · Ctr Commercial Domus, 93110','Decathlon Saint-Denis|11,2 km · 40 Av. Wilson, 93200 Saint-Denis','Decathlon Vélizy 2|14,5 km · Av. de l\'Europe, 78140 Vélizy'].map(function(m,i){var p=m.split('|');return '<div class="card sh mb8" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;border:2px solid '+(S.rdvMag===i?'var(--blue)'  :'var(--border)')+'" onclick="S.rdvMag='+i+';render()">'+'<div><div style="font-weight:600;font-size:14px">📍 '+p[0]+'</div><div style="font-size:12px;color:var(--gray);margin-top:3px">'+p[1]+'</div></div>'+'<div style="color:var(--blue);font-size:16px">'+( S.rdvMag===i ?'✓':'' )+'</div></div>';}).join('')+
    '<div style="font-size:15px;font-weight:700;margin-bottom:10px">Choisir une date</div>'+
    '<div class="card sh mb16">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'+
        '<button style="width:32px;height:32px;background:var(--c010);border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center">'+ic('<polyline points="15 18 9 12 15 6"/>')+'</button>'+
        '<span style="font-weight:700;color:var(--blue);font-size:15px">Juin 2026</span>'+
        '<button style="width:32px;height:32px;background:var(--c010);border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center">'+ic('<polyline points="9 18 15 12 9 6"/>')+'</button>'+
      '</div>'+
      '<div class="cal">'+
        ['L','M','M','J','V','S','D'].map(function(d){return '<div style="font-size:11px;font-weight:600;color:var(--gray);padding-bottom:4px">'+d+'</div>';}).join('')+
        days.map(function(d){return '<div class="cd'+(d===S.rdvDay?' sel':'')+'" onclick="pickDay('+d+')">'+d+'</div>';}).join('')+
      '</div>'+
    '</div>'+
    '<div style="font-size:15px;font-weight:700;margin-bottom:10px">Créneaux disponibles</div>'+
    '<div class="slots mb20">'+slots.map(function(sl){return '<div class="slot'+(sl===S.rdvSlot?' sel':'')+'" onclick="pickSlot(\''+sl+'\')">'+sl+'</div>';}).join('')+'</div>'+
    '<button class="btn bb" onclick="go(\'confirmed\')">✓ Confirmer le rendez-vous</button>'+
  '</div>';
}

function pConf(){
  var mapped=getCS();var adj=S.finalPrice||Math.max(5,Math.round(calcPrice(calcScore(mapped),S.meta)*0.9/5)*5);
  return '<div style="background:var(--blue);padding:52px 20px 28px;text-align:center;color:#fff">'+
    '<div style="width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">'+svgCheck()+'</div>'+
    '<div style="font-size:24px;font-weight:800;letter-spacing:-.01em">Rendez-vous confirmé !</div>'+
    '<div style="font-size:13px;opacity:.82;margin-top:5px">Un email de confirmation vous a été envoyé.</div>'+
  '</div>'+
  '<div class="p16">'+
    '<div class="card sh mb12"><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:13px">'+
      dr('Date','Jeudi '+S.rdvDay+' juin 2026')+dr('Heure',S.rdvSlot)+dr('Magasin','Decathlon Paris Nation')+dr('Estimation',adj+' € (provisoire)')+
    '</div></div>'+
    '<div class="card sh mb12" style="text-align:center">'+
      '<div style="font-size:13px;font-weight:700;margin-bottom:12px">📱 Votre QR code de diagnostic</div>'+
      '<div id="qrbox" style="display:flex;justify-content:center;margin-bottom:12px"></div>'+
      '<div style="font-size:14px;font-weight:800;color:var(--blue);letter-spacing:2px">'+(S.code||'#SVD')+'</div>'+
      '<div style="font-size:11px;color:var(--blue);font-weight:600;margin-top:3px">Numéro de dossier</div>'+
    '</div>'+
    '<div class="card mb16" style="background:var(--bg)">'+'<div style="font-weight:700;margin-bottom:10px">À apporter le jour J</div>'+
      (function(){
        var _cat=S.meta.cat||'velo';
        var _apMap={
          velo:['🚲 Votre vélo propre','🪪 Pièce d\'identité','📄 Facture d\'achat si dispo','🔑 Accessoires inclus dans la vente'],
          fitness:['🏋️ L\'appareil complet','🪪 Pièce d\'identité','📄 Facture si disponible','🔌 Câbles et accessoires d\'origine'],
          camping:['⛺ Équipement propre complet','🪪 Pièce d\'identité','📄 Facture si disponible','🔩 Tous les accessoires'],
          hiver:['🎿 Skis / board + fixations','🪪 Pièce d\'identité','📄 Facture si disponible','👟 Chaussures de glisse'],
          trott:['🛴 Trottinette + chargeur si applicable','🪪 Pièce d\'identité','📄 Facture si disponible'],
          eau:['🏄 Équipement sec et propre','🪪 Pièce d\'identité','📄 Facture si disponible'],
          raquettes:['🎾 Raquettes en housse','🪪 Pièce d\'identité','📄 Facture si disponible'],
          running:['👟 Chaussures propres + équipements','🪪 Pièce d\'identité','📄 Facture si disponible'],
          golf:['⛳ Sac de golf + clubs + chariot','🪪 Pièce d\'identité','📄 Facture si disponible'],
          peche:['🎣 Cannes, moulinets + boîte à leurres','🪪 Pièce d\'identité','📄 Facture si disponible'],
          equi:['🐴 Selle + harnachement propres','🪪 Pièce d\'identité','📄 Facture si disponible'],
          combat:['🥊 Gants + protections propres','🪪 Pièce d\'identité','📄 Facture si disponible'],
          chasse:['🎯 Optiques + accessoires de chasse','🪪 Pièce d\'identité','📄 Facture si disponible'],
          escalade:['🧗 Corde + baudrier + EPI','🪪 Pièce d\'identité','📄 Facture si dispo (date fab. obligatoire)'],
          petanque:['🎳 Boules en mallette + cochonnet','🪪 Pièce d\'identité','📄 Facture si disponible'],
          vetements:['👕 Vêtements propres et lavés','🪪 Pièce d\'identité','📄 Facture si disponible'],
        };
        var items=_apMap[_cat]||_apMap.velo;
        return items.map(function(x){return '<div style="display:flex;align-items:center;gap:9px;margin-bottom:7px"><span style="font-size:14px;font-weight:500">'+x+'</span></div>';}).join('');
      }())+
      '<div style="text-align:center;font-size:12px;color:var(--gray);margin-bottom:14px;line-height:1.5">📧 Email envoyé à votre adresse. Vérifiez vos spams si vous ne le recevez pas sous 5 min.</div>'+
    '<button class="btn bb mb8">📅 Ajouter au calendrier</button>'+
    '<button class="btn bk" onclick="resetClient()">Retour à l\'accueil</button>'+
  '</div>';
}
function dr(l,v){return '<div><div style="color:var(--gray);font-size:11px;font-weight:600;margin-bottom:3px;letter-spacing:.01em">'+l.toUpperCase()+'</div><div style="font-weight:600;font-size:13px">'+v+'</div></div>';}

// ===== PAGES VENDEUR =====
function pSH(){
  if(!S.seller)S.seller={name:'Degnon M.'};
  return '<div class="hblue">'+
    '<div style="display:flex;justify-content:space-between;align-items:center">'+
      '<div style="display:flex;align-items:center;gap:8px">'+
        '<span class="badge badge-vendor">VENDEUR</span>'+
        '<div style="background:rgba(255,255,255,.15);border-radius:8px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;padding:4px"></div>'+
        '<span style="font-size:20px;font-weight:900;letter-spacing:-.02em">Seconde Vie</span>'+
      '</div>'+
      '<div style="display:flex;align-items:center;gap:5px;background:rgba(255,255,255,.15);border-radius:var(--r-pill);padding:5px 12px 5px 6px">'+svgPerson()+'<span style="font-size:13px;font-weight:600">'+S.seller.name+'</span></div>'+
    '</div>'+
    '<div style="font-size:13px;opacity:.82;margin-top:8px;line-height:1.5">Procédez au diagnostic pour obtenir une estimation optimale.</div>'+
  '</div>'+
  '<div class="p16">'+
    '<div style="font-size:15px;font-weight:700;margin-bottom:12px">Commencer une reprise</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">'+
      scrd('seller_scan','📋','Depuis une estimation client','var(--blue-lt)','var(--blue)')+
      scrd('new_diag_type','🆕','Nouveau diagnostic','var(--orange-lt)','var(--orange)')+
    '</div>'+
    '<div style="font-size:15px;font-weight:700;margin-bottom:10px">Gérer mon stock</div>'+
    skRow('À mettre en vente',28,'var(--blue)')+skRow('En attente de réparation',6,'var(--orange)')+
    skRow('En vente',107,'var(--green-dk)')+skRow('Stock dormant',12,'var(--gray)')+
    '<div style="font-size:15px;font-weight:700;margin:16px 0 10px">Performance</div>'+
    skRow('Performance économique','›','var(--blue)')+skRow('Produits à envoyer','›','var(--blue)')+
    '<button class="btn bk" style="margin-top:16px" onclick="sellerLogout()">🔓 Se déconnecter</button>'+'<div style="text-align:center;font-size:13px;color:var(--gray);margin-top:10px">La déconnexion vous ramènera à la page de choix d\'espace (client ou vendeur).</div>'+
  '</div>';
}
function scrd(p,icon,label,bg,color){
  return '<div class="card sh" style="text-align:center;cursor:pointer;padding:22px 12px;background:'+bg+';border:none;transition:transform .15s" onclick="go(\''+p+'\')" onmousedown="this.style.transform=\'scale(.97)\'" onmouseup="this.style.transform=\'\'">'+
    '<div style="font-size:38px;margin-bottom:10px">'+icon+'</div>'+
    '<div style="font-weight:700;font-size:13px;color:'+color+';line-height:1.3">'+label+'</div>'+
  '</div>';
}
function skRow(label,val,color){
  return '<div class="card sh mb8" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:14px 16px">'+
    '<div style="display:flex;align-items:center;gap:10px">'+
      '<div style="width:9px;height:9px;border-radius:50%;background:'+color+';flex-shrink:0"></div>'+
      '<span style="font-weight:600;font-size:14px">'+label+'</span>'+
    '</div>'+
    '<span style="color:var(--gray);font-weight:600;font-size:14px">'+val+'</span>'+
  '</div>';
}

function pSS(){
  var recents=Object.values(window.DOS).map(function(d){
    return '<div class="card sh mb8" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="loadDossier(\''+d.code+'\')">'+
      '<div style="display:flex;align-items:center;gap:12px">'+
        '<div style="width:34px;height:34px;background:var(--blue-lt);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0">🕐</div>'+
        '<div><div style="font-weight:600;font-size:14px">'+d.type+' · '+d.code+'</div><div style="font-size:12px;color:var(--gray);margin-top:2px">Score '+d.score+'/100 · '+d.price+' €</div></div>'+
      '</div>'+
      ic('<polyline points="9 18 15 12 9 6"/>')+
    '</div>';
  }).join('');
  return hdr(svgBack(),'seller_home','Retrouver un dossier','','')+
  '<div class="p16">'+
    '<div class="card sh mb12" style="background:#111;border-radius:var(--r-card);padding:24px;text-align:center;cursor:pointer" onclick="startScan()">'+
      '<div style="width:180px;height:180px;margin:0 auto;position:relative;border-radius:14px;overflow:hidden;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center">'+
        '<div style="position:absolute;top:14px;left:14px;width:28px;height:28px;border-top:3px solid var(--c300);border-left:3px solid var(--c300);border-radius:4px 0 0 0"></div>'+
        '<div style="position:absolute;top:14px;right:14px;width:28px;height:28px;border-top:3px solid var(--c300);border-right:3px solid var(--c300);border-radius:0 4px 0 0"></div>'+
        '<div style="position:absolute;bottom:14px;left:14px;width:28px;height:28px;border-bottom:3px solid var(--c300);border-left:3px solid var(--c300);border-radius:0 0 0 4px"></div>'+
        '<div style="position:absolute;bottom:14px;right:14px;width:28px;height:28px;border-bottom:3px solid var(--c300);border-right:3px solid var(--c300);border-radius:0 0 4px 0"></div>'+
        '<div style="color:rgba(255,255,255,.4);font-size:13px;font-weight:500">Appuyer pour scanner</div>'+
      '</div>'+
      '<div style="color:#aaa;font-size:13px;margin-top:12px">Scannez le QR code du client.</div>'+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">'+
      '<div style="flex:1;height:1px;background:var(--border)"></div>'+
      '<span style="font-size:13px;color:var(--gray);font-weight:500">ou</span>'+
      '<div style="flex:1;height:1px;background:var(--border)"></div>'+
    '</div>'+
    '<div class="card sh mb12">'+
      '<div style="display:flex;align-items:center;border:1.5px solid var(--border);border-radius:var(--r-input);overflow:hidden;background:#fff;margin-bottom:10px">'+
        '<div style="padding:0 13px;color:var(--gray)">'+ic('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>')+'</div>'+
        '<input id="scode" class="inp" placeholder="Email ou numéro de dossier…" style="border:none;border-radius:0;flex:1;padding-left:0" oninput="this.value=this.value.toUpperCase()">'+
      '</div>'+
      '<button class="btn bb" onclick="searchDos()">Rechercher</button>'+
    '</div>'+
    '<div id="sres"></div>'+
    (Object.keys(window.DOS).length>0?'<div style="font-size:15px;font-weight:700;margin-bottom:10px">Recherches récentes</div>'+recents:'')+
  '</div>';
}

function pSD(){
  var d=window.DOS[S.sellerCode];
  if(!d)return '<div style="padding:40px;text-align:center;color:var(--gray)">Dossier introuvable.<br><br><button class="btn bb" onclick="go(\'seller_scan\')">Retour</button></div>';
  var tp=TYPES.find(function(x){return x.id===d.meta.type;})||TYPES[0];
  return hdr(svgBack(),'seller_scan','Dossier client','','')+
  '<div class="p16">'+
    '<div class="card sh mb12">'+
      '<div style="font-size:18px;font-weight:800;letter-spacing:-.01em">'+d.type+'</div>'+
      '<div style="font-size:12px;color:var(--blue);font-weight:700;margin-top:3px;letter-spacing:.5px">'+d.code+'</div>'+
      '<div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px">'+
        dr('Type',d.type)+dr('Marque',d.meta.brand||"B'Twin")+
        dr('Modèle',d.meta.model||'Rockrider')+dr('Année',d.meta.year||'2021')+
        dr('Score client',d.score+'/100')+'<div><div style="color:var(--gray);font-size:11px;font-weight:600;margin-bottom:3px;letter-spacing:.01em">ESTIMATION</div><div style="font-weight:800;font-size:20px;color:var(--blue)">'+d.price+' €</div></div>'+
      '</div>'+
    '</div>'+
    (function(){
      var sc=d.scores||{};
      var lblMap={c1:'Cadre',c2:'Rayures',c3:'Fourche',t1:'Freinage',t2:'Vitesses & chaîne',t3:'Dérailleur',r1:'Pneus',r2:'Jantes',r3:'Rayons'};
      var problemes=Object.entries(sc).filter(function(e){return e[1]==='bad'||e[1]==='warn';}).map(function(e){return lblMap[e[0]]||e[0];});
      if(problemes.length===0) return '';
      return '<div class="card mb16 warn-box">'+
        '<div style="font-weight:700;color:var(--orange);margin-bottom:5px;display:flex;align-items:center;gap:6px">'+
        ic('<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>') +
        'Points à vérifier en priorité</div>'+
        '<div style="font-size:13px;line-height:1.5">'+problemes.join(' · ')+' — état déclaré à vérifier en magasin.</div>'+
      '</div>';
    }())+
    (d.status==='done'?
      '<div style="background:var(--green-dk);color:#fff;border-radius:14px;padding:14px 20px;margin-bottom:16px;display:flex;align-items:center;gap:12px">'+
        '<span style="font-size:24px">✅</span>'+
        '<div>'+
          '<div style="font-weight:700;font-size:15px">Dossier traité — Reprise confirmée</div>'+
          '<div style="font-size:13px;opacity:.85">Validé par '+( d.sellerName||'le vendeur')+'</div>'+
        '</div>'+
      '</div>':
      d.status==='refused'?
      '<div style="background:var(--red);color:#fff;border-radius:14px;padding:14px 20px;margin-bottom:16px;display:flex;align-items:center;gap:12px">'+
        '<span style="font-size:24px">❌</span>'+
        '<div>'+
          '<div style="font-weight:700;font-size:15px">Dossier traité — Reprise refusée</div>'+
          '<div style="font-size:13px;opacity:.85">Le vélo ne correspond pas aux critères Seconde Vie</div>'+
        '</div>'+
      '</div>':'')+
    ((!d.status)?'<button class="btn bb mb8" onclick="S.sstep=0;S.sscores={};go(\'seller_diag\')">Diagnostic guidé →</button>'+
    '<button class="btn bo" onclick="S.sstep=0;S.sscores={};go(\'seller_diag\')">Mode expert</button>':'')+
  '</div>';
}



function sch(id,key,lbl,v){var km={c:'scc',r:'scr',bl:'scb',ni:'scn'};return '<button class="sc'+(v===key?' '+km[key]:'')+'" onclick="setSScore(\''+id+'\',\''+key+'\')">'+lbl+'</button>';}
function pSDiag(){
  var d=window.DOS[S.sellerCode]||{price:87,score:72,scores:{}};
  var sec=VDIAG[S.sstep];var pct=((S.sstep+1)/VDIAG.length)*100;
  var isGuide=!S.expertMode;
  var crits=sec.crit.map(function(c){
    var sv=S.sscores[c.id];
    var clientKey={s1:'c1',s2:'c3',s3:'t1',s4:'t2',s5:'t2',s6:'t3',s9:'c2',s10:'r2',s11:'r1',s12:'r3'}[c.id];
    var clientVal=clientKey?d.scores[clientKey]:null;
    var clientLabel=clientVal?SLBL[clientVal]:null;
    // En mode guidé : description complète + aide visuelle + contexte client
    // En mode expert : compact, juste le nom + chips
    return '<div class="card sh mb8">'+
      '<div style="font-weight:700;font-size:14px;margin-bottom:'+(isGuide?'4':'2')+'px">'+c.label+'</div>'+
      (isGuide?'<div style="font-size:12px;color:var(--gray);margin-bottom:10px;line-height:1.5;background:var(--bg);border-radius:8px;padding:8px 10px">'+
        '<strong>Comment vérifier :</strong> '+c.desc+'</div>':'<div style="font-size:12px;color:var(--gray);margin-bottom:8px">'+c.desc+'</div>')+
      (clientLabel&&isGuide?'<div style="background:var(--blue-lt);border-radius:8px;padding:7px 12px;font-size:12px;color:var(--blue);margin-bottom:10px;font-weight:500;border-left:3px solid var(--blue)">'+
        '👤 Client a déclaré : <strong>'+clientLabel+'</strong> — À vérifier physiquement</div>':
       clientLabel?'<div style="font-size:11px;color:var(--blue);margin-bottom:8px;font-weight:600">Client : '+clientLabel+'</div>':'')+
      '<div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:7px">Votre évaluation :</div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap">'+sch(c.id,'c','Conforme',sv)+sch(c.id,'r','À réparer',sv)+sch(c.id,'bl','Bloquant',sv)+sch(c.id,'ni','NI',sv)+'</div>'+
      (sv==='r'||sv==='bl'?
        '<div style="margin-top:10px">'+
          (isGuide?'<div style="font-size:11px;font-weight:600;color:var(--orange);margin-bottom:6px">⚠ Documentez l\'anomalie (obligatoire pour justifier la déduction) :</div>':'')+
          '<input class="inp" style="font-size:13px;padding:10px 14px;margin-bottom:8px" placeholder="Décrivez le problème précisément...">'+
          '<button style="width:100%;background:'+(sv==='bl'?'var(--red-lt)':'var(--orange-lt)')+';border:1.5px dashed '+(sv==='bl'?'var(--red)':'var(--orange)')+';border-radius:12px;padding:12px;font-size:13px;cursor:pointer;font-family:var(--font);font-weight:600;color:'+(sv==='bl'?'var(--red)':'var(--orange)')+';display:flex;align-items:center;justify-content:center;gap:8px" onclick="addPhoto(\''+c.id+'\')" id="photo-btn-'+c.id+'">'+
            (S.photos[c.id]?'<span style="color:var(--green-dk)">✅ Photo ajoutée</span>':
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>'+
              (isGuide?' Ajouter une photo (recommandé)':' Photo'))+
          '</button>'+
        '</div>':'')+
    '</div>';
  }).join('');
  return hdr(svgBack(),'sellerDiagBack()','Diagnostic · '+sec.label,sec.step+' — '+sec.desc,pct)+
  '<div class="p16">'+
    (isGuide?'<div class="info mb12" style="border-left-color:var(--blue)">'+svgInfo()+
      '<span><strong>Mode guidé</strong> — Suivez les instructions pour chaque point. Les champs surlignés en bleu indiquent ce que le client a déclaré.</span></div>':
      '<div class="info mb12" style="background:var(--orange-lt);border-left-color:var(--orange)">'+svgInfo()+
      '<span style="color:var(--orange)"><strong>Mode expert</strong> — Interface rapide. Renseignez uniquement les anomalies.</span></div>')+
    crits+
    '<button class="btn bb" onclick="sellerDiagNext()">'+(S.sstep<VDIAG.length-1?'Étape suivante →':'Voir l\'estimation →')+'</button>'+
  '</div>';
}
function pSRes(){
  var d=window.DOS[S.sellerCode]||{price:87,score:72};
  var blocked=Object.values(S.sscores).filter(function(v){return v==='bl';}).length;
  var toFix=Object.values(S.sscores).filter(function(v){return v==='r';}).length;
  // REFUS si cadre (s1) ou freins (s3) bloquants selon diagnostic vendeur
  var raisonVendeur=S.sscores.s1==='bl'?'cadre':S.sscores.s3==='bl'?'freins':null;
  if(raisonVendeur){
    return '<div style="background:#D70321;min-height:100vh;padding:40px 20px;color:#fff;text-align:center">'+
      '<div style="font-size:56px;margin-bottom:16px">\uD83D\uDEAB</div>'+
      '<div style="font-size:26px;font-weight:900;margin-bottom:12px">Reprise refus\u00e9e</div>'+
      '<div style="font-size:15px;opacity:.85;line-height:1.6;margin-bottom:24px">'+
        (raisonVendeur==='cadre'
          ?'Le diagnostic technicien confirme une anomalie structurelle sur le cadre. Ce v\u00e9lo ne peut pas \u00eatre remis en vente.'
          :'Le diagnostic technicien confirme que les freins sont dans un \u00e9tat bloquant. Ce v\u00e9lo ne peut pas \u00eatre remis en vente en l\'\u00e9tat.')+
      '</div>'+
      '<div style="background:rgba(255,255,255,.15);border-radius:14px;padding:16px;margin-bottom:24px;font-size:14px;opacity:.85;line-height:1.7">'+
        '\u2022 Informer le client du motif de refus<br>'+
        '\u2022 Proposer la r\u00e9paration en atelier Decathlon<br>'+
        '\u2022 Ou orienter vers le bac de recyclage en magasin'+
      '</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+
        '<button class="btn br2" onclick="go(\'seller_dos\')">\u2190 Retour dossier</button>'+
        '<button class="btn" style="background:#fff;color:#D70321;font-weight:800" onclick="go(\'seller_home\')">Tableau de bord</button>'+
      '</div>'+
    '</div>';
  }
  var adj=Math.max(0,d.price-blocked*30-toFix*15);var ecart=d.price-adj;
  var rows=VDIAG.map(function(sec){return sec.crit.map(function(c){
    var sv=S.sscores[c.id];var svL=sv?VLBL[sv]:'—';
    var svBg=sv==='c'?'var(--green)':sv==='r'?'var(--orange)':sv==='bl'?'var(--red)':'var(--bg)';
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">'+
      '<span style="font-size:13px;font-weight:600">'+c.label+'</span>'+
      '<div style="display:flex;align-items:center;gap:4px">'+
        '<span style="font-size:10px;color:var(--gray);font-weight:500">Client</span>'+
        '<span style="font-size:11px;font-weight:600;background:var(--bg);color:var(--gray);padding:3px 9px;border-radius:var(--r-pill)">—</span>'+
        '<span style="font-size:10px;color:var(--gray);font-weight:500">Vendeur</span>'+
        '<span style="font-size:11px;font-weight:700;background:'+svBg+';color:'+(sv?'#fff':'var(--gray)')+';padding:3px 9px;border-radius:var(--r-pill)">'+svL+'</span>'+
      '</div>'+
    '</div>';
  }).join('');}).join('');
  return hdr(svgBack(),'seller_diag','Résultat diagnostic',S.seller?S.seller.name:'','')+
  '<div class="p16">'+
    '<div class="card sh mb12">'+
      '<div style="font-size:13px;color:var(--gray)">Dossier · '+(S.sellerCode||'#SVD-DEMO')+'</div>'+
      '<div style="font-size:14px;margin-top:5px">Estimation en ligne : <strong style="color:var(--blue);font-size:16px">'+d.price+' €</strong></div>'+
    '</div>'+
    '<div class="card sh mb12">'+rows+'</div>'+
    (ecart>0?'<div class="card mb12 warn-box"><div style="font-weight:700;color:var(--orange);margin-bottom:5px;display:flex;align-items:center;gap:6px">'+ic('<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>') + 'Écart de '+ecart+' €</div><div style="font-size:12px;line-height:1.5">Expliquez les différences au client. La transparence renforce la confiance.</div></div>':'')+ 
    '<div style="font-size:15px;font-weight:700;margin-bottom:5px">Offre ajustée</div>'+
    '<div style="font-size:36px;font-weight:900;color:var(--blue);margin-bottom:6px;letter-spacing:-.02em">'+adj+' €<span style="font-size:14px;color:var(--gray);font-weight:400;margin-left:8px">initial : '+d.price+' €</span></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px">'+
      '<button class="btn br2" onclick="sellerRefuse()">✕ Refuser</button>'+
      '<button class="btn bg" onclick="sellerAccept()">✓ Confirmer la reprise</button>'+
    '</div>'+
  '</div>';
}

function pNDT(){
  var cards=TYPES.map(function(t){
    return '<div class="tc'+(S.newDiagMeta.type===t.id?' sel':'')+'" onclick="pickNewType(\''+t.id+'\')">'+
      '<div style="font-size:30px;margin:2px 0 4px">'+t.icon+'</div>'+
      '<div style="font-weight:700;font-size:13px">'+t.label+'</div>'+
      '<div style="font-size:11px;color:var(--gray);margin-top:3px;line-height:1.3">'+t.sub+'</div>'+
    '</div>';
  }).join('');
  return hdr(svgBack(),'seller_home','Nouveau diagnostic','Étape 1 sur 3','33')+
  '<div class="p16">'+
    '<div style="font-size:17px;font-weight:700;margin-bottom:4px">Quel type de vélo ?</div>'+
    '<div style="font-size:13px;color:var(--gray);margin-bottom:14px">Sélectionnez la catégorie la plus proche.</div>'+
    '<div class="tgrid mb16">'+cards+'</div>'+
    (S.newDiagMeta.type?'<button class="btn bb" onclick="go(\'new_diag_info\')">Continuer →</button>':'<button class="btn bk" disabled>Sélectionnez un type</button>')+
  '</div>';
}

function pNDI(){
  return hdr(svgBack(),'new_diag_type','Informations vélo','Étape 2 sur 3','66')+
  '<div class="p16">'+
    '<div class="card sh mb12"><label class="lbl">Marque</label><input class="inp" placeholder="ex: B\'Twin, Trek…" value="'+H(S.newDiagMeta.brand)+'" oninput="S.newDiagMeta.brand=this.value"></div>'+
    '<div class="card sh mb12"><label class="lbl">Modèle</label><input class="inp" placeholder="ex: Rockrider ST 520" value="'+H(S.newDiagMeta.model)+'" oninput="S.newDiagMeta.model=this.value"></div>'+
    '<div class="card sh mb12"><label class="lbl">Année</label><input class="inp" type="number" placeholder="2021" value="'+H(S.newDiagMeta.year)+'" oninput="S.newDiagMeta.year=this.value" min="2000" max="2026"></div>'+
    '<div class="card sh mb16"><label class="lbl">Prix neuf estimé (€)</label><input class="inp" type="number" placeholder="349" value="'+H(S.newDiagMeta.price)+'" oninput="S.newDiagMeta.price=this.value"></div>'+
    '<button class="btn bb" onclick="S.sstep=0;S.sscores={};go(\'new_diag_diag\')">Lancer le diagnostic →</button>'+
  '</div>';
}

function pNDD(){
  var sec=VDIAG[S.sstep];var pct=((S.sstep+1)/VDIAG.length)*100;
  var crits=sec.crit.map(function(c){
    var sv=S.sscores[c.id];
    return '<div class="card sh mb8">'+
      '<div style="font-weight:700;font-size:14px;margin-bottom:3px">'+c.label+'</div>'+
      '<div style="font-size:12px;color:var(--gray);margin-bottom:10px;line-height:1.45">'+c.desc+'</div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap">'+sch(c.id,'c','Conforme',sv)+sch(c.id,'r','À réparer',sv)+sch(c.id,'bl','Bloquant',sv)+sch(c.id,'ni','NI',sv)+'</div>'+
    '</div>';
  }).join('');
  return hdr(svgBack(),'','Diagnostic · '+sec.label,'Nouveau diagnostic — '+sec.step,pct)+
  '<div class="p16">'+crits+
    '<button class="btn bb" onclick="sellerNewDiagNext()">'+(S.sstep<VDIAG.length-1?'Étape suivante →':'Terminer →')+'</button>'+
  '</div>';
}


// ===== PAGE CATALOGUE =====
function pCatalogue(){
  var velos=[
    {emoji:'🚵',nom:"B'Twin Rockrider ST 520",type:'VTT',annee:'2021',km:'1 500',score:84,grade:'Très bon',gradeBg:'var(--green-lt)',gradeColor:'var(--green-dk)',prix:89,reps:['Câbles transmission remplacés','Réglage vitesses','Nettoyage complet']},
    {emoji:'🚴',nom:"Van Rysel RCR AF",type:'Route',annee:'2022',km:'3 200',score:91,grade:'Excellent',gradeBg:'var(--green-lt)',gradeColor:'var(--green-dk)',prix:245,reps:['Plaquettes frein avant remplacées','Vérification direction','Nettoyage']},
    {emoji:'🚲',nom:"B'Twin Elops Speed 500",type:'Ville',annee:'2023',km:'800',score:77,grade:'Bon état',gradeBg:'#FFF8F2',gradeColor:'var(--orange)',prix:135,reps:['Nettoyage complet','Réglage frein arrière']},
    {emoji:'⚡',nom:"B'Twin Riverside 500E",type:'VAE',annee:'2022',km:'2 100',score:80,grade:'Très bon',gradeBg:'var(--green-lt)',gradeColor:'var(--green-dk)',prix:420,reps:['Batterie vérifiée 87% santé','Moteur OK','Mise à jour firmware']},
    {emoji:'🏔️',nom:"Rockrider XC 100",type:'VTT',annee:'2020',km:'4 500',score:65,grade:'Bon état',gradeBg:'#FFF8F2',gradeColor:'var(--orange)',prix:75,reps:['Transmission complète remplacée','Plaquettes frein remplacées','Fourche révisée']},
    {emoji:'🚴',nom:"Van Rysel Edr AF",type:'Gravel',annee:'2023',km:'1 800',score:88,grade:'Excellent',gradeBg:'var(--green-lt)',gradeColor:'var(--green-dk)',prix:310,reps:['Câbles remplacés','Nettoyage complet']}
  ];
  var cards=velos.map(function(v,i){
    return '<div class="card sh mb12" style="cursor:pointer" onclick="goDetail('+i+')">'+
      '<div style="display:flex;gap:14px;align-items:flex-start">'+
        '<div style="font-size:42px;flex-shrink:0;margin-top:2px">'+v.emoji+'</div>'+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-weight:700;font-size:14px;line-height:1.3">'+v.nom+'</div>'+
          '<div style="font-size:12px;color:var(--gray);margin-top:3px">'+v.type+' · '+v.annee+' · ~'+v.km+' km</div>'+
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">'+
            '<span style="font-size:11px;font-weight:700;background:'+v.gradeBg+';color:'+v.gradeColor+';padding:4px 11px;border-radius:var(--r-pill)">'+v.score+'/100 · '+v.grade+'</span>'+
            '<span style="font-size:20px;font-weight:900;color:var(--blue)">'+v.prix+' €</span>'+
          '</div>'+
          '<div style="margin-top:8px;font-size:12px;color:var(--gray)">✅ Remis en état · Garanti 6 mois</div>'+
        '</div>'+
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" stroke-width="2" style="flex-shrink:0;margin-top:4px"><polyline points="9 18 15 12 9 6"/></svg>'+
      '</div>'+
    '</div>';
  }).join('');
  window._catalogVelos=velos;
  return '<div class="hwhite">'+
    '<div style="width:36px"></div>'+
    '<div style="flex:1;text-align:center"><div class="htitle">Catalogue Seconde Vie</div></div>'+
    '<div style="width:36px"></div>'+
  '</div>'+
  '<div class="p16">'+
    '<div style="font-size:17px;font-weight:700;margin-bottom:4px">Vélos reconditionnés</div>'+
    '<div style="font-size:13px;color:var(--gray);margin-bottom:14px;line-height:1.5">Chaque vélo est diagnostiqué sur <strong>9 axes</strong>, remis en état par nos techniciens et garanti 6 mois.</div>'+
    '<div style="display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px">'+
      '<div style="background:var(--blue);color:#fff;font-size:12px;font-weight:600;padding:7px 14px;border-radius:var(--r-pill);white-space:nowrap;cursor:pointer">Tous</div>'+
      '<div style="background:var(--white);border:1.5px solid var(--border);font-size:12px;font-weight:600;padding:7px 14px;border-radius:var(--r-pill);white-space:nowrap;cursor:pointer">VTT</div>'+
      '<div style="background:var(--white);border:1.5px solid var(--border);font-size:12px;font-weight:600;padding:7px 14px;border-radius:var(--r-pill);white-space:nowrap;cursor:pointer">Route</div>'+
      '<div style="background:var(--white);border:1.5px solid var(--border);font-size:12px;font-weight:600;padding:7px 14px;border-radius:var(--r-pill);white-space:nowrap;cursor:pointer">VAE</div>'+
      '<div style="background:var(--white);border:1.5px solid var(--border);font-size:12px;font-weight:600;padding:7px 14px;border-radius:var(--r-pill);white-space:nowrap;cursor:pointer">Ville</div>'+
    '</div>'+
    cards+
    '<div class="card" style="background:var(--blue-lt);border:none;text-align:center;padding:18px">'+
      '<div style="font-size:20px;margin-bottom:6px">🔒</div>'+
      '<div style="font-weight:700;font-size:14px;color:var(--blue-dk)">Garantie Decathlon 6 mois</div>'+
      '<div style="font-size:12px;color:var(--gray);margin-top:4px">Retour possible sous 30 jours</div>'+
    '</div>'+
  '</div>';
}
window.goDetail=function(i){S._veloDetail=i;go('detail');};

// ===== PAGE DÉTAIL CATALOGUE =====
function pDetail(){
  var velos=window._catalogVelos||[];
  var v=velos[S._veloDetail||0];
  if(!v)return hdr(svgBack(),'catalogue','Détail','','')+'<div class="p16">Vélo introuvable.</div>';
  var repsHtml=v.reps.map(function(r){return '<div style="display:flex;align-items:center;gap:9px;margin-bottom:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px">'+r+'</span></div>';}).join('');
  var barColor=v.score>=75?'var(--green)':v.score>=55?'var(--orange)':'var(--red)';
  return hdr(svgBack(),'catalogue','Détail du vélo',v.type+' · '+v.annee,'')+
  '<div style="background:var(--blue);padding:32px 20px;text-align:center">'+
    '<div style="font-size:72px;margin-bottom:8px">'+v.emoji+'</div>'+
    '<div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-.01em">'+v.nom+'</div>'+
    '<div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:4px">'+v.type+' · '+v.annee+' · ~'+v.km+' km</div>'+
    '<div style="font-size:36px;font-weight:900;color:#fff;margin-top:8px">'+v.prix+' €</div>'+
    '<span style="font-size:12px;font-weight:700;background:rgba(255,255,255,.2);color:#fff;padding:5px 14px;border-radius:var(--r-pill)">'+v.score+'/100 · '+v.grade+'</span>'+
  '</div>'+
  '<div class="p16">'+
    '<div class="card sh mb12">'+
      '<div style="font-size:15px;font-weight:700;margin-bottom:12px">Score de diagnostic</div>'+
      '<div class="br-row"><div style="width:110px;font-size:13px;font-weight:600">Score global</div><div class="bar"><div class="bf" style="width:'+v.score+'%;background:'+barColor+'"></div></div><div style="width:40px;text-align:right;font-size:13px;font-weight:700">'+v.score+'/100</div></div>'+
      '<div style="font-size:12px;color:var(--gray);margin-top:8px;padding-top:8px;border-top:1px solid var(--border);line-height:1.5">Diagnostiqué sur 9 axes par un technicien Decathlon certifié.</div>'+
    '</div>'+
    '<div class="card sh mb12">'+
      '<div style="font-size:15px;font-weight:700;margin-bottom:10px">Remises en état effectuées</div>'+
      repsHtml+
    '</div>'+
    '<div class="info mb16">'+svgInfo()+'<span>Ce vélo est couvert par la <strong>Garantie Decathlon 6 mois</strong>. Retour possible sous 30 jours si non conforme.</span></div>'+
    '<button class="btn bb mb8">Réserver ce vélo</button>'+
    '<button class="btn bk" onclick="go(\'catalogue\')">Retour au catalogue</button>'+
  '</div>';
}

// ===== PAGE COMPTE =====
function pCompte(){
  var isVendeur=!!(S.seller);
  var nom=isVendeur?S.seller.name:(S.client?S.client.name:'Client');
  var magasins=[
    {nom:'Decathlon Paris Nation',adr:'12 Av. du Trône, 75012 Paris',km:'2,3',horaires:'Lun-Sam 9h–20h · Dim 10h–19h'},
    {nom:'Decathlon Paris Rivoli',adr:'2 Rue des Innocents, 75001 Paris',km:'4,1',horaires:'Lun-Sam 9h30–20h'},
    {nom:'Decathlon Rosny-sous-Bois',adr:'Ctr Commercial Domus, 93110',km:'8,7',horaires:'Lun-Sam 9h–20h · Dim 9h–19h'},
    {nom:'Decathlon Saint-Denis',adr:'40 Av. du Président Wilson, 93200',km:'11,2',horaires:'Lun-Sam 9h–20h'}
  ];
  var magHtml=magasins.map(function(m){
    return '<div class="card sh mb8" style="cursor:pointer">'+
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">'+
        '<div style="flex:1">'+
          '<div style="font-weight:700;font-size:14px">📍 '+m.nom+'</div>'+
          '<div style="font-size:12px;color:var(--gray);margin-top:3px">'+m.adr+'</div>'+
          '<div style="font-size:12px;color:var(--gray);margin-top:1px">'+m.horaires+'</div>'+
          '<div style="font-size:12px;color:var(--blue);font-weight:600;margin-top:4px">'+m.km+' km · Seconde Vie disponible</div>'+
        '</div>'+
        '<span style="font-size:11px;font-weight:700;background:var(--green-lt);color:var(--green-dk);padding:3px 9px;border-radius:var(--r-pill);white-space:nowrap;flex-shrink:0">Ouvert</span>'+
      '</div>'+
    '</div>';
  }).join('');
  var reprises=S.code?'<div class="card sh mb8">'+
    '<div style="font-size:11px;font-weight:600;color:var(--gray);letter-spacing:.02em;margin-bottom:4px">DOSSIER EN COURS</div>'+
    '<div style="font-weight:700;font-size:15px">'+(S.meta.model||'Votre vélo')+'</div>'+
    '<div style="font-size:12px;color:var(--blue);font-weight:700;margin-top:2px">'+S.code+'</div>'+
    '<div style="display:flex;align-items:center;gap:6px;margin-top:8px"><span style="background:var(--green-lt);color:var(--green-dk);font-size:11px;font-weight:700;padding:3px 10px;border-radius:var(--r-pill)">RDV confirmé</span><span style="font-size:12px;color:var(--gray)">'+S.rdvDay+' juin · '+S.rdvSlot+'</span></div>'+
  '</div>':'<div style="font-size:13px;color:var(--gray);padding:12px 0;text-align:center">Aucun dossier en cours.<br><span style="color:var(--blue);font-weight:600;cursor:pointer" onclick="go(\'home\')">Commencer une estimation →</span></div>';
  return '<div class="hblue" style="padding-bottom:24px">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'+
      '<span class="badge '+(isVendeur?'badge-vendor':'badge-client')+'">'+(isVendeur?'VENDEUR':'CLIENT')+'</span>'+
      '<button class="btn" style="background:rgba(255,255,255,.18);border:none;color:#fff;padding:7px 16px;font-size:12px;font-weight:700;width:auto" onclick="go(isVendeur?\'seller_home\':\'home\')"← Accueil</button>'+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:14px">'+
      '<div style="width:56px;height:56px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">👤</div>'+
      '<div>'+
        '<div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.01em">'+nom+'</div>'+
        '<div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:2px">Espace '+(isVendeur?'Vendeur':'Client')+'</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
  '<div class="p16">'+
    '<div style="font-size:15px;font-weight:700;margin-bottom:10px">Mes reprises</div>'+
    reprises+
    '<div style="font-size:15px;font-weight:700;margin:16px 0 10px">Points de vente Seconde Vie</div>'+
    '<div style="font-size:13px;color:var(--gray);margin-bottom:12px;line-height:1.45">4 magasins Decathlon en Île-de-France avec le service Seconde Vie vélo.</div>'+
    magHtml+
    '<div style="text-align:center;font-size:12px;color:var(--gray);margin-top:12px">Envie de changer d\'espace ?</div>'+
    '<button class="btn bk" style="margin-top:8px" onclick="go(\'login\')">🔓 Se déconnecter</button>'+
  '</div>';
}

// ===== PAGE DÉTAIL dans render() =====

// ===== HDR HELPER =====
function hdr(backIcon,backPage,title,sub,prog){
  var backFn=backPage?(backPage.indexOf('(')<0?"go('"+backPage+"')":backPage):'diagBack()';
  return '<div class="hwhite">'+
    '<button class="hback" onclick="'+backFn+'">'+backIcon+'</button>'+
    '<div style="flex:1">'+
      '<div class="htitle">'+title+'</div>'+
      (sub?'<div class="hsub">'+sub+'</div>':'')+
      (prog?'<div class="prog"><div class="pf" style="width:'+prog+'%"></div></div>':'')+
    '</div>'+
  '</div>';
}

// ===== AUTH =====
function doLogin(){
  var el=document.getElementById('ln');
  var name=(el?el.value.trim():'');
  if(!name){el.style.borderColor='#FF5252';el.placeholder='Entrez votre prénom pour continuer';return;}
  S.client={name:name};go('home');
}
function doSellerLogin(){
  var el=document.getElementById('sln');
  var name=(el?el.value.trim():'');
  if(!name){el.style.borderColor='#FF5252';el.placeholder='Entrez votre prénom pour continuer';return;}
  S.seller={name:name};go('seller_home');
}

// ===== PHOTO =====
var _pStream=null, _pTarget=null;
function startPhoto(targetId,label){
  _pTarget=targetId;
  var lbl=document.getElementById('photo-label');if(lbl)lbl.textContent=label||'Photo';
  var ov=document.getElementById('photo-ov');if(ov){ov.style.display='flex';ov.style.flexDirection='column';}
  var v=document.getElementById('pv');
  if(!v){S.photos[targetId]='sim';render();return;}
  navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}})
    .then(function(s){_pStream=s;v.srcObject=s;v.play();})
    .catch(function(){stopPhoto();S.photos[targetId]='sim';render();});
}
function capturePhoto(){
  var v=document.getElementById('pv'),c=document.getElementById('pc');
  if(v&&c&&v.videoWidth>0){c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);S.photos[_pTarget]=c.toDataURL('image/jpeg',.7);}
  else{S.photos[_pTarget]='sim';}
  stopPhoto();render();
}
function stopPhoto(){
  if(_pStream)_pStream.getTracks().forEach(function(t){t.stop();});_pStream=null;
  var ov=document.getElementById('photo-ov');if(ov)ov.style.display='none';
}

// ===== GLOBAL FUNCTIONS =====
window.go=go;
function pickType(id){S.meta.type=id;render();}window.pickType=pickType;
function pickNewType(id){S.newDiagMeta.type=id;render();}window.pickNewType=pickNewType;
function pickBrand(b){S.meta.brand=b;render();}window.pickBrand=pickBrand;
function pickDay(d){S.rdvDay=d;render();}window.pickDay=pickDay;
function pickSlot(sl){S.rdvSlot=sl;render();}window.pickSlot=pickSlot;
function addPhoto(id){
  // Essai caméra native d'abord, fallback sur simulateur
  var inp=document.createElement('input');
  inp.type='file';inp.accept='image/*';
  try{inp.capture='environment';}catch(e){}
  inp.style.display='none';
  inp.onchange=function(){
    if(inp.files&&inp.files[0]){
      var r=new FileReader();
      r.onload=function(e){S.photos[id]=e.target.result;render();};
      r.readAsDataURL(inp.files[0]);
    } else {
      // Simulateur : photo prise (demo)
      S.photos[id]='sim';render();
    }
    try{document.body.removeChild(inp);}catch(e){}
  };
  document.body.appendChild(inp);
  // Tenter de cliquer
  try{
    inp.click();
    // Si pas de réponse après 500ms, simuler
    setTimeout(function(){
      if(!S.photos[id]){S.photos[id]='sim';render();}
    },800);
  } catch(e){
    S.photos[id]='sim';render();
  }
}window.addPhoto=addPhoto;
function setScore(id,v){S.scores[id]=v;render();}window.setScore=setScore;
function setSScore(id,v){S.sscores[id]=v;render();}window.setSScore=setSScore;
function diagBack(){if(S.step>0){S.step--;render();}else{go('step_info');}}window.diagBack=diagBack;
function sellerDiagBack(){
  if(S.sstep>0){S.sstep--;render();}
  else{go('seller_dos');}
}
window.sellerDiagBack=sellerDiagBack;
function diagNext(){var _ds=(S.meta.cat&&CDIAG_BY_CAT[S.meta.cat])||CDIAG;if(S.step<_ds.length-1){S.step++;render();}else{go('repairs');}}window.diagNext=diagNext;
function sellerDiagBack(){if(S.sstep>0){S.sstep--;render();}else{go('seller_dos');}}window.sellerDiagBack=sellerDiagBack;
function sellerDiagNext(){if(S.sstep<VDIAG.length-1){S.sstep++;render();}else{go('seller_result');}}window.sellerDiagNext=sellerDiagNext;
function sellerNewDiagNext(){if(S.sstep<VDIAG.length-1){S.sstep++;render();}else{go('seller_home');}}window.sellerNewDiagNext=sellerNewDiagNext;
function resetClient(){S.meta={type:'',brand:'',model:'',year:'2021',price:'',km:1500,cat:''};S.scores={};S.photos={};S.step=0;S.code=null;go('home');}window.resetClient=resetClient;
window.doLogin=doLogin;window.doSellerLogin=doSellerLogin;
window.startPhoto=startPhoto;window.capturePhoto=capturePhoto;window.stopPhoto=stopPhoto;
function sellerAccept(){
  if(window.DOS[S.sellerCode]){
    window.DOS[S.sellerCode].status='done';
    window.DOS[S.sellerCode].statusLabel='Reprise confirmée';
    window.DOS[S.sellerCode].statusColor='var(--green-dk)';
    window.DOS[S.sellerCode].sellerName=S.seller?S.seller.name:'';
  }
  go('seller_home');
}
window.sellerAccept=sellerAccept;

function sellerRefuse(){
  if(window.DOS[S.sellerCode]){
    window.DOS[S.sellerCode].status='refused';
    window.DOS[S.sellerCode].statusLabel='Reprise refusée';
    window.DOS[S.sellerCode].statusColor='var(--red)';
  }
  go('seller_home');
}
window.sellerRefuse=sellerRefuse;

function sellerLogout(){S.seller=null;S.client=null;go('login');}window.sellerLogout=sellerLogout;
function loadDossier(code){S.sellerCode=code;S.sscores={};S.sstep=0;go('seller_dos');}window.loadDossier=loadDossier;
function searchDos(){
  var code=document.getElementById('scode').value.trim();
  var el=document.getElementById('sres');
  if(!code){el.innerHTML='';return;}
  var d=window.DOS[code];
  if(d){el.innerHTML='<div class="card mb12" style="border:2px solid var(--green);background:var(--green-lt)"><div style="font-weight:700;color:var(--green-dk);margin-bottom:6px">✅ Dossier trouvé !</div><div style="font-size:13px;margin-bottom:10px">'+d.type+' · Score : '+d.score+'/100 · '+d.price+' €</div><button class="btn bg" onclick="loadDossier(\''+code+'\')">Ouvrir ce dossier →</button></div>';}
  else{el.innerHTML='<div class="card mb12" style="background:var(--red-lt);border:1px solid var(--red);border-radius:var(--r-card)"><div style="color:var(--red);font-weight:700;padding:14px">❌ Aucun dossier trouvé.<br><span style="font-size:12px;font-weight:400">Vérifiez le code sur le téléphone du client.</span></div></div>';}
}
window.searchDos=searchDos;
function startScan(){
  document.getElementById('scan-ov').style.display='flex';
  var v=document.getElementById('sv');
  navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}})
    .then(function(stream){
      window._ss=stream;v.srcObject=stream;v.play();
      window._si=setInterval(function(){
        if(v.readyState!==v.HAVE_ENOUGH_DATA)return;
        var c=document.getElementById('sc'),ctx=c.getContext('2d');
        c.width=v.videoWidth;c.height=v.videoHeight;ctx.drawImage(v,0,0);
        if(typeof jsQR==='undefined')return;
        var img=ctx.getImageData(0,0,c.width,c.height);
        var qr=jsQR(img.data,img.width,img.height);
        if(qr){window.stopScan();window.loadDossier(qr.data.toUpperCase().trim());}
      },300);
    }).catch(function(){document.getElementById('ss').textContent='❌ Caméra non accessible. Utilisez le code manuel.';});
}
window.startScan=startScan;
function stopScan(){
  if(window._ss)window._ss.getTracks().forEach(function(t){t.stop();});window._ss=null;
  if(window._si)clearInterval(window._si);window._si=null;
  document.getElementById('scan-ov').style.display='none';
}
window.stopScan=stopScan;

// ===== INIT =====
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('nav-home').addEventListener('click',function(){go('home');});
  document.getElementById('nav-cat').addEventListener('click',function(){go('catalogue');});
  document.getElementById('nav-sv').addEventListener('click',function(){go(S.seller&&!S.client?'seller_home':'home');});
  document.getElementById('nav-acc').addEventListener('click',function(){go('compte');});
  document.getElementById('stop-scan-btn').addEventListener('click',function(){window.stopScan();});
  render();
});