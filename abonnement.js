/* GSC Business Center : Espace Abonnement + Espace Accompagnement
   À charger APRÈS app.js (voir index.html). Ne modifie pas app.js : il le complète. */
(()=>{
const TAR={
 essentiel:{nom:"Essentiel",prix:5000,txt:"Accès complet à l’Espace Abonnement : idées de business, produits testés, cas concrets avec chiffres réels, cours de publicité."},
 croissance:{nom:"Croissance",prix:10000,txt:"Tout l’Essentiel, avec aide à l’analyse de vos KPI, assistance prioritaire et une séance mensuelle de conseil."},
 accompagnement:{nom:"Accompagnement (suivi 2 mois)",prix:35000,txt:"Paiement unique, puis un suivi personnalisé de 2 mois pour démarrer votre e-commerce : parcours en 4 semaines, séances de suivi, bilan final. Inclut l’Espace Abonnement."}};
let ANNUEL_ESSENTIEL=50000;
const CATS={idee:"Idées de business",produit_teste:"Produits testés",cas_concret:"Cas concrets",publicite:"Publicité",nouveaute:"Nouveautés"};
const PLATS={facebook:"Facebook",instagram:"Instagram",whatsapp:"WhatsApp Business",tiktok:"TikTok"};
const SEM=[["Diagnostic et installation","Diagnostic e-commerce"],["Gestion commerciale","Système de gestion structuré"],["Performance et développement","Tableau de bord analysé"],["Évaluation et autonomie","Plan d’action à 30 jours"],["Suivi allégé : mise en pratique","Chiffres mis à jour"],["Suivi allégé : point de suivi 1","Décisions publicitaires prises"],["Suivi allégé : consolidation","Test documenté"],["Point de suivi 2 et clôture","Bilan final et plan pour la suite"]];
const WK=SEM.map((s,i)=>"Semaine "+(i+1)+" · "+s[0]);
const ACC_FORM="Accompagnement : démarrer en 2 mois";
const AUDABO={abonnes:"Abonnés actifs",tous:"Tous les clients"};
const pub=r=>r.publie!==false&&r.publie!=="non";
const SEANCES=["Diagnostic (jour 1)","Gestion commerciale (jour 8)","Performance (jour 15)","Bilan et plan d’action (jour 22)","Point de suivi 1 (jour 36)","Point de suivi 2 (jour 50)","Clôture (jour 60)"];
const DECAL=[0,7,14,21,35,49,59];
const slab=n=>SEANCES[n-1]?" · "+SEANCES[n-1]:"";
const TYPES={fiche:"Fiche",video:"Vidéo",formation:"Formation",fichier:"Fichier",lien:"Lien"};
const AUD2={tous:"Tous",accompagnes:"Accompagnés",abonnes:"Abonnés"};
const AUD={abonnes:"Abonnés actifs",accompagnes:"Accompagnés",tous:"Tous les clients"};
const MENS=["essentiel","croissance"];
const MINE=["abo","acc","gabo","gcon","gacc","goff","classe"];

const sty=document.createElement("style");
sty.textContent=`.xg{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin-bottom:14px}
.xo{background:var(--cd);border:1px solid var(--bd);border-radius:10px;padding:14px}.xo.hot{border:2px solid var(--mg)}
.xo h3{margin:0 0 4px;color:var(--in)}@media(prefers-color-scheme:dark){.xo h3{color:#fff}}
.xpx{font-size:22px;font-weight:700;color:var(--mg)}
.xch{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.xch button{border:1px solid var(--bd);background:var(--cd);color:var(--tx);border-radius:16px;padding:5px 12px;cursor:pointer;font:inherit}
.xch button.on{background:var(--mg);color:#fff;border-color:var(--mg)}
.xt{display:inline-block;background:var(--ac);border-radius:10px;padding:1px 8px;font-size:11px;margin-left:6px}
.xd{background:var(--cd);border:1px solid var(--bd);border-radius:10px;padding:10px 14px;margin-bottom:10px}
.xd summary{cursor:pointer}.xd img{max-width:100%;border-radius:8px;margin:8px 0}
.xr{background:var(--ac);border-left:4px solid var(--mg);padding:6px 10px;margin:8px 0}
.xp{height:10px;background:var(--ac);border-radius:6px;overflow:hidden}.xp i{display:block;height:100%;background:var(--mg)}
.xw{border-left:4px solid var(--pu);padding-left:10px;margin:14px 0 6px}
.xk{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--bd);flex-wrap:wrap}
.xk input[type=checkbox]{width:auto;min-width:0}.xk input[type=text]{flex:1;min-width:140px}
.xs{padding:4px 9px}
#x-print{display:none}
@media print{body>*:not(#x-print){display:none!important}body{background:#fff!important}#x-print{display:block!important;background:#fff;color:#000;padding:16px;font:14px/1.5 Arial,sans-serif}}
.xlock{color:var(--mu)!important;opacity:.55;text-align:center}
.xe input,.xe select,.xe textarea{min-width:0}.xe td{vertical-align:top;padding:5px 4px}`;
document.head.appendChild(sty);

/* ---------- outils ---------- */
const today=()=>new Date().toISOString().slice(0,10);
const addDays=(d,n)=>{const x=new Date(d+"T00:00:00Z");x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const left=d=>Math.round((new Date(d+"T00:00:00Z")-new Date(today()+"T00:00:00Z"))/864e5);
const fd=d=>d?new Date(String(d).slice(0,10)+"T00:00:00Z").toLocaleDateString("fr-FR",{timeZone:"UTC"}):"";
const fdt=d=>d?new Date(d).toLocaleString("fr-FR",{dateStyle:"full",timeStyle:"short"}):"";
const live=a=>!!a&&a.statut=="actif"&&a.expire>=today();
const st=a=>a.statut=="resilie"?"Résilié":a.statut=="suspendu"?"Suspendu":a.expire<today()?"Expiré":"Actif";
const nl=t=>esc(t).replace(/\n/g,"<br>");
const safeUrl=u=>/^https:\/\/[^\s"<>]+$/i.test(u||"")?u:"";
const safeLink=u=>safeUrl(u)||safeFile(u);
const addMonths=(d,n)=>{const x=new Date(d+"T00:00:00Z"),j=x.getUTCDate();x.setUTCDate(1);x.setUTCMonth(x.getUTCMonth()+n);const m=new Date(Date.UTC(x.getUTCFullYear(),x.getUTCMonth()+1,0)).getUTCDate();x.setUTCDate(Math.min(j,m));return x.toISOString().slice(0,10)};
const safeFile=u=>/^[\w\-][\w\-\/.]*\.[a-z0-9]{2,5}$/i.test(u||"")&&!/\.\./.test(u)?u:"";
const safeImg=u=>/^[\w\-\/.]+\.(png|jpe?g|webp|gif)$/i.test(u||"")&&!/\.\./.test(u)?u:"";
const amt=(f,du)=>f=="accompagnement"?TAR[f].prix:du==12?(f=="essentiel"?ANNUEL_ESSENTIEL:TAR[f].prix*12):TAR[f].prix;

/* ---------- état ---------- */
const X={off:[],offOk:false,loaded:false,loading:false,err:"",abos:[],paies:[],cont:[],ap:[],tach:[],seas:[],bil:null,info:"",cat:"tous",plat:"tous",typ:"tous",pf:"",suivi:[],suiviOk:false,ed:null,edDirty:false,cedit:"",cspace:"abo",csaved:"",
 A:{abos:[],paies:[],cl:[],cont:[],tach:[],seas:[],bil:[],suivi:[],sel:""}};
const hasAbo=()=>X.abos.some(live);
const hasAcc=()=>X.abos.some(a=>a.formule=="accompagnement"&&live(a));
const best=()=>X.abos.filter(live).sort((a,b)=>b.expire.localeCompare(a.expire))[0];
const reset=()=>{X.suivi=[];X.suiviOk=false;X.ed=null;X.edDirty=false;X.loaded=false;X.loading=false;X.err="";X.abos=[];X.paies=[];X.cont=[];X.ap=[];X.tach=[];X.seas=[];X.bil=null;X.pf="";X.A={abos:[],paies:[],cl:[],cont:[],tach:[],seas:[],bil:[],suivi:[],sel:""}};

const edFrom=l=>[...l].sort((a,b)=>(!a.formation-!b.formation)||(a.formation||"").localeCompare(b.formation||"","fr")||(a.module||"").localeCompare(b.module||"","fr")||(a.ordre||0)-(b.ordre||0)).map(c=>({id:c.id,formation:c.formation||"",module:c.module||"",ordre:c.ordre||1,type:c.type||"fiche",titre:c.titre||"",lien:c.lien||"",resume:c.resume||"",audience:c.audience||"abonnes",fichier:c.fichier||null,fichier_nom:c.fichier_nom||null,publie:c.publie!==false}));
async function xLoad(){
 X.loading=true;X.err="";X.noMod=false;
 try{
  try{X.off=ok(await sb.from("offres").select("*"))||[];X.offOk=true;X.off.forEach(r=>{if(r.formule=="essentiel_annuel")ANNUEL_ESSENTIEL=r.prix;else if(TAR[r.formule])TAR[r.formule].prix=r.prix})}catch(e){X.offOk=false}
  X.info=(ok(await sb.from("settings").select("v").eq("k","paiement_info").maybeSingle())||{}).v||"";
  if(admin){
   const[ab,pa,cl,co,ta,se,bi]=(await Promise.all([
    sb.from("abonnements").select("*").order("expire",{ascending:false}),
    sb.from("paiements").select("*").order("cree_le",{ascending:false}),
    sb.from("profiles").select("id,email,nom").eq("role","client").order("nom"),
    sb.from("contenus").select("*").order("cree_le",{ascending:false}),
    sb.from("acc_taches").select("*").order("semaine").order("ordre"),
    sb.from("acc_seances").select("*").order("date_heure"),
    sb.from("acc_bilans").select("*")])).map(ok);
   Object.assign(X.A,{abos:ab,paies:pa,cl,cont:co,tach:ta,seas:se,bil:bi});
   try{X.A.suivi=ok(await sb.from("contenus_suivi").select("*"))||[];X.suiviOk=true}catch(e){X.A.suivi=[];X.suiviOk=false}
   if(!X.ed||!X.edDirty)X.ed=edFrom(co);else{const miss=co.filter(c=>!X.ed.some(r=>r.id==c.id));if(miss.length)X.ed.push(...edFrom(miss))}
  }else if(me){
   const[ab,pa,ap,co,ta,se,bi]=(await Promise.all([
    sb.from("abonnements").select("*").eq("user_id",me.id),
    sb.from("paiements").select("*").eq("user_id",me.id).order("cree_le",{ascending:false}),
    sb.rpc("gsc_apercu_contenus"),
    sb.from("contenus").select("*").order("cree_le",{ascending:false}),
    sb.from("acc_taches").select("*").eq("user_id",me.id).order("semaine").order("ordre"),
    sb.from("acc_seances").select("*").eq("user_id",me.id).order("date_heure"),
    sb.from("acc_bilans").select("*").eq("user_id",me.id).maybeSingle()])).map(ok);
   Object.assign(X,{abos:ab||[],paies:pa||[],ap:ap||[],cont:co||[],tach:ta||[],seas:se||[],bil:bi});
   try{X.suivi=(ok(await sb.from("contenus_suivi").select("contenu_id").eq("user_id",me.id))||[]).map(r=>r.contenu_id);X.suiviOk=true}catch(e){X.suivi=[];X.suiviOk=false}
  }
 }catch(e){X.err=/does not exist|schema cache|Could not find/i.test(e.message||"")?"Module non installé : exécutez d’abord le script SQL abonnement_supabase.sql dans Supabase.":(e.message||"Erreur de chargement")}
 X.noMod=/^Module non install/.test(X.err);X.loaded=true;X.loading=false;render();
}
const run=async f=>{const y=scrollY;try{await f();await xLoad()}catch(e){alert(e.message||e)}scrollTo(0,y)};
const rr=()=>{const y=scrollY;render();scrollTo(0,y)};

/* ---------- export / téléchargement des fiches ---------- */
const dlFile=(name,mime,txt,bom)=>{const b=new Blob([bom?"\ufeff"+txt:txt],{type:mime+";charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500)};
const slug=t=>String(t||"fiche").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"fiche";
const ficheMeta=c=>[TYPES[c.type]||c.type,c.categorie&&CATS[c.categorie],c.plateforme&&PLATS[c.plateforme],"Audience : "+(AUD[c.audience]||c.audience),c.formation&&"Formation : "+c.formation,c.module&&"Module : "+c.module].filter(Boolean).join(" · ");
const ficheText=c=>[c.titre,"=".repeat(Math.min(60,c.titre.length)),ficheMeta(c),c.resume&&"DESCRIPTION\n"+c.resume,c.corps&&"CONTENU\n"+c.corps,c.resultat&&"RÉSULTAT OBSERVÉ\n"+c.resultat+"\n(Résultat constaté dans un contexte précis : non garanti.)",c.lien&&"LIEN : "+c.lien,c.fichier_nom&&"FICHIER JOINT : "+c.fichier_nom].filter(Boolean).join("\n\n")+"\n";
const ficheHtml=c=>`<h1 style="color:#29235C">${esc(c.titre)}</h1><p style="color:#6B7280">${esc(ficheMeta(c))}</p>${c.resume?`<h2>Description</h2><p>${nl(c.resume)}</p>`:""}${c.corps?`<h2>Contenu</h2><p>${nl(c.corps)}</p>`:""}${c.resultat?`<h2>Résultat observé</h2><p>${nl(c.resultat)}</p><p><i>Résultat constaté dans un contexte précis : non garanti pour votre activité.</i></p>`:""}${c.lien?`<p>Lien : ${esc(c.lien)}</p>`:""}${c.fichier_nom?`<p>Fichier joint : ${esc(c.fichier_nom)}</p>`:""}<hr><p style="color:#6B7280;font-size:12px">GSC Business Center</p>`;
const ficheWord=c=>`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(c.titre)}</title></head><body style="font-family:Arial,sans-serif">${ficheHtml(c)}</body></html>`;
const fichePrint=c=>{let p=$("#x-print");if(!p){p=document.createElement("div");p.id="x-print";document.body.appendChild(p)}p.innerHTML=ficheHtml(c);const clear=()=>{p.innerHTML="";window.removeEventListener("afterprint",clear)};window.addEventListener("afterprint",clear);window.print()};
const csvAll=l=>{const q=v=>{let t=String(v==null?"":v);if(/^[=+\-@]/.test(t))t="'"+t;return'"'+t.replace(/"/g,'""')+'"'};return[["Formation","Module","N°","Type","Titre","Catégorie","Plateforme","Audience","Publié","Lien","Fichier joint","Description","Contenu détaillé","Résultat observé"],...l.map(c=>[c.formation,c.module,c.ordre,TYPES[c.type]||c.type,c.titre,CATS[c.categorie]||"",PLATS[c.plateforme]||"",AUD[c.audience]||c.audience,c.publie?"Oui":"Non",c.lien,c.fichier_nom,c.resume,c.corps,c.resultat])].map(r=>r.map(q).join(";")).join("\r\n")};

const MIME={pdf:"application/pdf",doc:"application/msword",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",xls:"application/vnd.ms-excel",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",ppt:"application/vnd.ms-powerpoint",pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",mp4:"video/mp4",webm:"video/webm",mov:"video/quicktime",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",txt:"text/plain",csv:"text/csv"};
const ACCEPT=Object.keys(MIME).map(e=>"."+e).join(",");
const ext=n=>(String(n||"").split(".").pop()||"").toLowerCase();
const kind=n=>["mp4","webm","mov"].includes(ext(n))?"video":ext(n)=="pdf"?"pdf":"autre";
const fileUi=c=>{const k=kind(c.fichier_nom||c.fichier),n=esc(c.fichier_nom||"fichier");
 if(k=="video")return`<div id=x-v-${c.id} style="margin:8px 0"><button class="b xs" data-x=play data-id=${c.id}>▶ Lire la vidéo</button> <button class="b xs" data-x=dl data-id=${c.id}>Télécharger</button> <small class=mu>${n}</small></div>`;
 if(k=="pdf")return`<p><button class="b xs" data-x=open data-id=${c.id}>Ouvrir le PDF</button> <button class="b xs" data-x=dl data-id=${c.id}>Télécharger</button> <small class=mu>${n}</small></p>`;
 return`<p><button class="b xs" data-x=dl data-id=${c.id}>Télécharger : ${n}</button></p>`};

/* ---------- composants ---------- */
const cards=l=>l.length?l.map(c=>{const im=safeImg(c.image),li=safeLink(c.lien),ext=!!safeUrl(c.lien);
 return`<details class=xd><summary><b>${esc(c.titre)}</b>${c.type?`<span class=xt>${esc(TYPES[c.type]||c.type)}</span>`:""}${c.categorie?`<span class=xt>${esc(CATS[c.categorie]||c.categorie)}</span>`:""}${c.plateforme?`<span class=xt>${esc(PLATS[c.plateforme]||c.plateforme)}</span>`:""}${admin&&c.audience?`<span class=xt>${esc(AUD[c.audience]||c.audience)}</span>`:(c.gratuit||c.audience=="tous")?`<span class=xt>Gratuit</span>`:""}${c.publie?"":`<span class=xt>Masqué</span>`}</summary>${c.resume?`<p>${nl(c.resume)}</p>`:""}${im?`<img src="${esc(im)}" alt="">`:""}${c.resultat?`<div class=xr><b>Résultat observé :</b> ${nl(c.resultat)}<br><small class=mu>Résultat constaté dans un contexte précis : il n’est pas garanti pour votre activité.</small></div>`:""}${c.corps?`<div>${nl(c.corps)}</div>`:""}${li?`<p><a href="${esc(li)}"${ext?" target=_blank rel=noopener":" download"}>${{video:"Voir la vidéo",formation:"Ouvrir la formation",fichier:"Télécharger le fichier",lien:"Ouvrir le lien"}[c.type]||"Ouvrir la ressource"} ↗</a></p>`:""}${c.fichier?fileUi(c):""}${!admin&&X.suiviOk?`<label class=xk style="border:0"><input type=checkbox data-x=done data-id=${c.id}${X.suivi.includes(c.id)?" checked":""}> Marquer comme terminé</label>`:""}</details>`}).join(""):`<p class=mu>Aucun contenu pour ce filtre.</p>`;

const grouped=l=>{if(!l.length)return cards(l);const F_={};l.forEach(c=>{(F_[c.formation||""]=F_[c.formation||""]||[]).push(c)});
 return Object.keys(F_).sort((a,b)=>a===""?1:b===""?-1:a.localeCompare(b,"fr")).map(k=>{const g=F_[k],d=g.filter(c=>X.suivi.includes(c.id)).length,pc=Math.round(d/g.length*100),m={};g.forEach(c=>{(m[c.module||""]=m[c.module||""]||[]).push(c)});
  return`<div class=cd style="margin-bottom:6px"><h2>${k?esc(k):"Ressources"}</h2>${X.suiviOk&&!admin?`<div class=xp><i style="width:${pc}%"></i></div><p class=mu>${d} / ${g.length} terminé${d>1?"s":""} (${pc} %)</p>`:""}</div>`+Object.keys(m).sort((a,b)=>a===""?-1:b===""?1:a.localeCompare(b,"fr")).map(mk=>(mk?`<div class=xw><b>${esc(mk)}</b></div>`:"")+cards(m[mk].sort((a,b)=>(a.ordre||0)-(b.ordre||0)))).join("")}).join("")};
function paySec(fs){
 const sel=fs.includes(X.pf)?X.pf:"";
 const cs=fs.map(k=>{const t=TAR[k];return`<div class="xo${k=="croissance"?" hot":""}"><h3>${t.nom}</h3><div class=xpx>${F(t.prix)}<small class=mu>${k=="accompagnement"?" · paiement unique":" / mois"}</small></div><p>${esc(t.txt)}</p><button class=b data-x=sel data-id=${k}>Choisir cette formule</button></div>`}).join("");
 const form=sel?`<div class=cd><h2>Paiement : ${TAR[sel].nom}</h2><p>${esc(X.info)||"Contactez GSC Business Center pour connaître le numéro de paiement."}</p><div class=f>${sel=="accompagnement"?"":`<div><label>Durée</label><select id=x-du><option value=1>1 mois : ${F(TAR[sel].prix)}</option>${sel=="essentiel"?`<option value=12>12 mois : ${F(ANNUEL_ESSENTIEL)} (10 000 F d’économie)</option>`:""}</select></div>`}<div><label>Moyen de paiement</label><select id=x-op><option value=wave>Wave</option><option value=orange_money>Orange Money</option><option value=autre>Autre</option></select></div><div><label>Référence de la transaction</label><input id=x-rf maxlength=60></div></div><p><button class=b data-x=pay data-id=${sel}>J’ai effectué le paiement</button> <small class=mu>L’accès est activé dès que l’administrateur a vérifié le paiement.</small></p></div>`:"";
 return`<div class=xg>${cs}</div>${form}`}

const pendBanner=()=>{const p=X.paies.find(p=>p.statut=="en_attente");return p?`<div class=an style="margin:0 0 12px">⏳ Paiement en attente de validation (réf. ${esc(p.reference)}). Votre accès sera activé après vérification.</div>`:""};

/* ---------- vues client ---------- */
function aboView(){
 const b=best();let h=`<div class=cd><h2>Espace Abonnement</h2>${pendBanner()}`;
 if(!b){
  const n=Object.fromEntries(X.ap.map(r=>[r.categorie,r.n])),ls=Object.keys(CATS).filter(k=>n[k]).map(k=>`<li><b>${n[k]}</b> : ${CATS[k].toLowerCase()}`).join("");
  const old=X.abos.filter(a=>a.formule!="accompagnement").sort((a,b)=>b.expire.localeCompare(a.expire))[0],om=old?`<div class=an style="margin:0 0 12px">Votre abonnement ${TAR[old.formule].nom} est ${st(old).toLowerCase()} (échéance : ${fd(old.expire)}). Renouvelez-le ci-dessous pour retrouver l’accès.</div>`:"";
  return h+om+`<p>Chaque mois : des idées de business, des produits testés, des cas concrets de e-commerce avec les chiffres réels, et des cours sur la publicité Facebook, Instagram, WhatsApp Business et TikTok.</p>${ls?`<ul>${ls}</ul>`:""}</div>${X.cont.length?`<div class=cd><h2>Aperçu gratuit</h2>${cards(X.cont)}</div>`:""}${paySec(["essentiel","croissance"])}`}
 const d=left(b.expire);
 h+=`<p>Formule <b>${TAR[b.formule].nom}</b> active jusqu’au <b>${fd(b.expire)}</b> (${d} jour${d>1?"s":""} restant${d>1?"s":""}).</p><p class=mu>Statut : ${st(b)} · Prochaine échéance : ${fd(b.expire)}${b.formule=="accompagnement"?"":" · "+F(TAR[b.formule].prix)+" par mois"}</p>${d<=7?`<p class=no><b>Votre abonnement expire bientôt : pensez à le renouveler.</b></p>`:""}`;
 const chip=(x,id,l,on)=>`<button data-x=${x} data-id=${id} class="${on?"on":""}">${l}</button>`;
 h+=`<div class=xch>${chip("cat","tous","Tout",X.cat=="tous")}${Object.keys(CATS).map(k=>chip("cat",k,CATS[k],X.cat==k)).join("")}</div><div class=xch>${chip("typ","tous","Tous types",X.typ=="tous")}${Object.keys(TYPES).map(k=>chip("typ",k,TYPES[k]+"s",X.typ==k)).join("")}</div><div class=xch>${chip("plat","tous","Toutes plateformes",X.plat=="tous")}${Object.keys(PLATS).map(k=>chip("plat",k,PLATS[k],X.plat==k)).join("")}</div></div>`;
 h+=grouped(X.cont.filter(c=>c.audience!="accompagnes"&&(X.cat=="tous"||c.categorie==X.cat)&&(X.plat=="tous"||c.plateforme==X.plat)&&(X.typ=="tous"||c.type==X.typ)));
 h+=`<details class=xd${X.pf?" open":""}><summary><b>Renouveler ou changer de formule</b></summary>${paySec(["essentiel","croissance"])}</details>`;
 if(X.paies.length)h+=`<div class=cd><h2>Mes paiements</h2><div class=w><table><tr><th>Date<th>Formule<th>Montant<th>Statut</tr>${X.paies.map(p=>`<tr><td>${fd(p.cree_le)}<td>${TAR[p.formule].nom}<td>${F(p.montant)}<td>${{en_attente:"En attente",paye:"Payé",refuse:"Refusé"}[p.statut]}`).join("")}</table></div></div>`;
 return h}

const tot=a=>Math.max(1,Math.round((new Date(a.expire+"T00:00:00Z")-new Date(a.debut+"T00:00:00Z"))/864e5));
const offreCard=a=>{const pa=X.paies.filter(p=>p.formule=="accompagnement"),p=pa.find(p=>p.statut=="paye")||pa.find(p=>p.statut=="en_attente")||pa[0],d=a?left(a.expire):0;
 return`<div class=cd><h2>Mon offre</h2><div class=g>${K("Offre",esc(TAR.accompagnement.nom))}${K("Début",fd(a&&a.debut)||"—")}${K("Fin du suivi",fd(a&&a.expire)||"—")}${K("Jours restants de suivi",live(a)&&d>=0?d:0)}${K("Paiement unique",p?{en_attente:"En attente",paye:"Payé",refuse:"Refusé"}[p.statut]+" · "+F(p.montant):"—")}</div>${a&&a.message?`<div class=xr><b>Message de votre accompagnateur :</b><br>${nl(a.message)}</div>`:""}</div>`};
function accView(){
 const a=X.abos.find(x=>x.formule=="accompagnement"),act=live(a),T=X.tach;
 if(!act&&!T.length)return`<div class=cd><h2>Espace Accompagnement</h2>${pendBanner()}<p>Démarrez votre activité e-commerce avec un conseiller GSC : diagnostic, configuration de la plateforme, prix et marges, commandes et stock, publicité, séances de suivi et bilan final. Vous payez une seule fois et le suivi dure 2 mois.</p><div class=xg>${SEM.slice(0,4).map((s,i)=>`<div class=xo><h3>Semaine ${i+1}</h3><b>${s[0]}</b><p class=mu>Livrable : ${s[1]}</p></div>`).join("")}<div class=xo><h3>Semaines 5 à 8</h3><b>Suivi allégé</b><p class=mu>2 points de suivi, mise en pratique et bilan final de clôture</p></div></div></div>${paySec(["accompagnement"])}`;
 const done=T.filter(t=>t.fait).length,pc=T.length?Math.round(done/T.length*100):0;
 let h=offreCard(a)+`<div class=cd><h2>Mon accompagnement</h2>${pendBanner()}<p>${act?`Jour <b>${Math.min(tot(a),Math.max(1,1-left(a.debut)))}</b> sur ${tot(a)} · fin le <b>${fd(a.expire)}</b>`:`Accompagnement terminé${a?" le "+fd(a.expire):""}.`}</p><div class=xp><i style="width:${pc}%"></i></div><p class=mu>${done} tâche${done>1?"s":""} sur ${T.length} réalisée${done>1?"s":""} (${pc} %)</p></div>`;
 const res=X.cont.filter(c=>c.audience=="accompagnes");
 if(res.length)h+=`<div class=cd><h2>Documents et vidéos de l’accompagnement</h2>${grouped(res)}</div>`;
 h+=`<div class=cd>${SEM.map((s,i)=>{const l=T.filter(t=>t.semaine==i+1);return l.length?`<div class=xw><b>Semaine ${i+1} : ${s[0]}</b><br><small class=mu>Livrable : ${s[1]}</small></div>${l.map(t=>`<div class=xk><input type=checkbox data-x=task data-id=${t.id}${t.fait?" checked":""}${act?"":" disabled"}><span>${esc(t.titre)}</span><input type=text data-x=proof data-id=${t.id} placeholder="Preuve, lien ou note" value="${esc(t.preuve||"")}" maxlength=500${act?"":" disabled"}></div>`).join("")}`:""}).join("")}</div>`;
 if(X.seas.length)h+=`<div class=cd><h2>Mes séances de suivi</h2>${X.seas.map(s=>`<p><b>Séance ${s.numero}</b>${slab(s.numero)} : ${fdt(s.date_heure)} ${s.fait?`<span class=xt>Faite</span>`:safeUrl(s.lien)?`<a href="${esc(s.lien)}" target=_blank rel="noopener noreferrer">Rejoindre ↗</a>`:""}</p>`).join("")}</div>`;
 if(X.bil&&(X.bil.bilan||X.bil.plan_action))h+=`<div class=cd><h2>Bilan final</h2>${X.bil.bilan?`<p>${nl(X.bil.bilan)}</p>`:""}${X.bil.plan_action?`<h2>Plan d’action pour les 30 jours suivants</h2><p>${nl(X.bil.plan_action)}</p>`:""}</div>`;
 if(!act)h+=`<details class=xd${X.pf?" open":""}><summary><b>Refaire un accompagnement</b></summary>${paySec(["accompagnement"])}</details>`;
 return h}

/* ---------- vues administrateur ---------- */
const nm=id=>{const c=X.A.cl.find(c=>c.id==id);return c?`${esc(c.nom||"")}<br><small class=mu>${esc(c.email)}</small>`:"(compte supprimé)"};
const ab_=(x,id,l,extra="")=>`<button class="b xs" data-x=${x} data-id=${id} ${extra}>${l}</button>`;
const opts=o=>Object.keys(o).map(k=>`<option value=${k}>${esc(o[k])}</option>`).join("");

const subOf=u=>X.A.abos.filter(a=>a.user_id==u&&MENS.includes(a.formule)).sort((a,b)=>b.expire.localeCompare(a.expire))[0];
const lastPay=u=>X.A.paies.find(p=>p.user_id==u&&p.statut=="paye"&&MENS.includes(p.formule));
const mprix=(a,p)=>p?Math.round(p.montant/(p.duree_mois||1)):TAR[a.formule].prix;
const late=a=>!!a&&a.statut=="actif"&&a.expire<today();
function gaboView(){
 const A=X.A,pend=A.paies.filter(p=>p.statut=="en_attente"),mois=today().slice(0,7),
 enc=A.paies.filter(p=>p.statut=="paye"&&(p.traite_le||"").slice(0,7)==mois).reduce((s,p)=>s+p.montant,0),
 na=A.abos.filter(a=>a.formule!="accompagnement"&&live(a)).length,nc=A.abos.filter(a=>a.formule=="accompagnement"&&live(a)).length;
 const subs=A.cl.map(c=>({c,a:subOf(c.id),p:lastPay(c.id)})),nact=subs.filter(x=>live(x.a)).length,nlate=subs.filter(x=>late(x.a)).length,rev=subs.filter(x=>live(x.a)).reduce((t,x)=>t+mprix(x.a,x.p),0);
 return`<div class=g>${K("Abonnés actifs",nact)}${K("Revenu mensuel",F(rev))}${K("Paiements en retard",nlate)}${K("Accompagnés actifs",nc)}${K("Paiements à valider",pend.length)}${K("Encaissé ce mois",F(enc))}</div>
 <div class=cd><h2>Clients et abonnements mensuels</h2><div class=w><table><tr><th>Client<th>Statut<th>Offre mensuelle<th>Prix / mois<th>Dernier paiement<th>Prochaine échéance<th>Alerte<th></tr>${subs.map(({c,a,p})=>`<tr><td>${nm(c.id)}<td>${a?({actif:"Actif",suspendu:"Suspendu",resilie:"Résilié"}[a.statut]):"Aucun"}<td>${a?TAR[a.formule].nom:"—"}<td>${a?F(mprix(a,p)):"—"}<td>${p?`${fd(p.traite_le||p.cree_le)} · ${F(p.montant)}`:"—"}<td>${a&&a.statut!="resilie"?fd(a.expire):"—"}<td>${late(a)?`<b class=no>⚠ En retard de ${-left(a.expire)} j</b>`:""}<td>${a?`${ab_("prol",a.id,"+30 jours")} ${ab_("susp",a.id,a.statut=="actif"?"Suspendre":"Réactiver")} ${a.statut!="resilie"?ab_("resil",a.id,"Résilier"):""}`:""}`).join("")||"<tr><td colspan=8 class=mu>Aucun client inscrit."}</table></div><p class=mu>« En retard » : l’échéance est dépassée sans nouveau paiement validé. Le client perd l’accès jusqu’au renouvellement.</p></div>
 <div class=cd><h2>Paiements à valider</h2><div class=w><table><tr><th>Client<th>Formule<th>Montant<th>Moyen<th>Référence<th>Date<th></tr>${pend.map(p=>`<tr><td>${nm(p.user_id)}<td>${TAR[p.formule].nom}${p.duree_mois==12?" (12 mois)":""}<td>${F(p.montant)}<td>${esc(p.operateur)}<td>${esc(p.reference)}<td>${fd(p.cree_le)}<td>${ab_("valid",p.id,"Valider","data-ok=1")} ${ab_("valid",p.id,"Refuser","data-ok=0")}`).join("")||"<tr><td colspan=7 class=mu>Aucun paiement en attente."}</table></div><p class=mu>Validez uniquement après avoir vérifié la réception de l’argent sur Wave ou Orange Money.</p></div>
 <div class=cd><h2>Abonnements</h2><div class=w><table><tr><th>Client<th>Formule<th>Début<th>Expiration<th>Statut<th></tr>${A.abos.map(a=>`<tr><td>${nm(a.user_id)}<td>${TAR[a.formule].nom}<td>${fd(a.debut)}<td>${fd(a.expire)}<td class=${live(a)?"ok":"no"}>${st(a)}<td>${ab_("prol",a.id,"+30 jours")} ${ab_("susp",a.id,a.statut=="actif"?"Suspendre":"Réactiver")}`).join("")||"<tr><td colspan=6 class=mu>Aucun abonnement pour l’instant."}</table></div></div>
 <div class=cd><h2>Activer manuellement</h2><div class=f><div><label>Client</label><select id=x-cl>${A.cl.map(c=>`<option value=${c.id}>${esc(c.nom||c.email)} (${esc(c.email)})`).join("")}</select></div><div><label>Formule</label><select id=x-fm>${opts({essentiel:"Essentiel",croissance:"Croissance",accompagnement:"Accompagnement (suivi 2 mois)"})}</select></div><div><label>Durée (jours) : 30 pour un abonnement, 60 pour l’accompagnement</label><input id=x-jr type=number value=30 min=1 max=400></div></div><p><button class=b data-x=act>Activer / prolonger</button></p></div>
 <div class=cd><h2>Instructions de paiement affichées aux clients</h2><textarea id=x-inf rows=3 placeholder="Ex. : Envoyez le montant par Wave ou Orange Money au numéro … au nom de …, puis indiquez la référence de la transaction.">${esc(X.info)}</textarea><p><button class=b data-x=info>Enregistrer</button></p></div>`}

const OFF=[["essentiel","Abonnement mensuel","Accès à l’Espace Abonnement, renouvelable chaque mois","30 jours"],["croissance","Abonnement mensuel","Essentiel + analyse des KPI, assistance prioritaire, séance mensuelle","30 jours"],["accompagnement","Paiement unique + suivi","Démarrage e-commerce avec suivi personnalisé (inclut l’Espace Abonnement)","2 mois (60 jours)"],["essentiel_annuel","Option annuelle","Essentiel payé pour 12 mois en une fois","365 jours"]];
function goffView(){
 const pr=f=>f=="essentiel_annuel"?ANNUEL_ESSENTIEL:TAR[f].prix;
 if(!X.offOk)return`<div class=cd><h2>Offres</h2><p class=no>Module non installé : exécutez le script SQL offres_supabase.sql dans Supabase (après abonnement_supabase.sql), puis rechargez.</p></div>`;
 return`<div class=cd><h2>Mes offres et leurs prix</h2><div class=w><table><tr><th>Offre<th>Type<th>Contenu<th>Durée d’accès<th>Prix (F CFA)<th></tr>${OFF.map(o=>`<tr><td><b>${esc(o[0]=="essentiel_annuel"?"Essentiel annuel":TAR[o[0]].nom)}</b><td>${o[1]}<td style="white-space:normal;min-width:220px">${o[2]}<td>${o[3]}<td><input id=x-pr-${o[0]} type=number min=100 step=500 value=${pr(o[0])} style="width:110px"><td>${ab_("oprix",o[0],"Enregistrer")}`).join("")}</table></div><p class=mu>Le nouveau prix s’applique aux prochains paiements. Les abonnements déjà payés ne changent pas. Les abonnements restent mensuels ; l’accompagnement est un paiement unique avec 2 mois de suivi.</p></div>`}
function gconView(){
 const A=X.A,L=A.cont,R=X.ed||[],sp=X.cspace=="acc"?"acc":"abo",isAcc=r=>r.audience=="accompagnes";
 const LS=L.filter(c=>sp=="acc"?isAcc(c):!isAcc(c)),nA=L.filter(isAcc).length,nB=L.length-nA,idx=R.map((r,i)=>i).filter(i=>sp=="acc"?isAcc(R[i]):!isAcc(R[i]));
 const sel=(i,f,o,v)=>`<select data-x=ed data-i=${i} data-f=${f}>${Object.keys(o).map(k=>`<option value=${k}${k==v?" selected":""}>${esc(o[k])}</option>`).join("")}</select>`;
 const selq=(i,f,list,v)=>`<select data-x=ed data-i=${i} data-f=${f}>${[...list,...(v&&!list.some(o=>o[0]==v)?[[v,v]]:[])].map(o=>`<option value="${esc(o[0])}"${o[0]==v?" selected":""}>${esc(o[1])}</option>`).join("")}</select>`;
 const ci=(i,f,v,w,ph)=>`<input data-x=ed data-i=${i} data-f=${f} value="${esc(v)}" style="width:${w}px" placeholder="${esc(ph||"")}">`;
 const typ=r=>{const o={video:TYPES.video,fiche:TYPES.fiche,fichier:TYPES.fichier,lien:TYPES.lien};if(!o[r.type])o[r.type]=TYPES[r.type]||r.type;return o};
 const vis01=r=>sel(r.i,"publie",{oui:"Oui",non:"Non"},pub(r.r)?"oui":"non");
 const num=(i,r)=>`<input type=number min=1 data-x=ed data-i=${i} data-f=ordre value="${esc(r.ordre)}" style="width:60px">`;
 const filec=(i,r)=>`<input type=file data-x=ed data-i=${i} data-f=_file accept="${ACCEPT}" style="width:190px"><br><small id=x-fn-${i} class=mu>${esc(r._file?r._file.name:r.fichier_nom||"")}</small>`;
 const acc=u=>({abo:A.abos.some(a=>a.user_id==u&&live(a)),acc:A.abos.some(a=>a.user_id==u&&a.formule=="accompagnement"&&live(a))});
 const vis=(c,x)=>c.publie&&(c.gratuit||c.audience=="tous"||(c.audience=="abonnes"&&x.abo)||(c.audience=="accompagnes"&&x.acc));
 const prog=[];
 A.cl.forEach(c=>{const x=acc(c.id),g={};LS.filter(k=>vis(k,x)).forEach(k=>{(g[k.formation||""]=g[k.formation||""]||[]).push(k.id)});
  Object.keys(g).sort((a,b)=>a===""?1:b===""?-1:a.localeCompare(b,"fr")).forEach(f=>{const d=A.suivi.filter(s=>s.user_id==c.id&&g[f].includes(s.contenu_id)).length;if(d>0||(sp=="acc"?x.acc:x.abo))prog.push({c,f,d,n:g[f].length})})});
 const progCard=`<div class=cd><h2>Progression des clients</h2>${X.suiviOk?`<div class=w><table><tr><th>Client<th>${sp=="acc"?"Parcours":"Formation"}<th>Terminés<th><th>%</tr>${prog.map(p=>{const pc=Math.round(p.d/p.n*100);return`<tr><td>${nm(p.c.id)}<td>${p.f?esc(p.f):"Ressources"}<td>${p.d} / ${p.n}<td style="min-width:180px"><div class=xp><i style="width:${pc}%"></i></div><td>${pc} %`}).join("")||"<tr><td colspan=5 class=mu>Aucune progression pour l’instant."}</table></div>`:`<p class=no>Module non installé : exécutez contenus_modele_supabase.sql dans Supabase.</p>`}</div>`;
 const saved=X.csaved?`<div class=an id=x-saved style="margin:0 0 12px">${esc(X.csaved)}</div>`:"";
 const tabs=saved+`<div class=xch><button data-x=cspace data-id=abo class="${sp=="abo"&&X.cspace!="classe"?"on":""}">Espace Abonnement (${nB})</button><button data-x=cspace data-id=acc class="${sp=="acc"?"on":""}">Espace Accompagnement (${nA})</button><button data-x=cspace data-id=classe class="${X.cspace=="classe"?"on":""}">Salle de classe</button></div>`;
 if(X.cspace=="classe")return tabs+classeView();
 const btns=`<p><button class=b data-x=edadd>+ Ajouter un contenu</button> <button class=b data-x=edsave style="background:var(--mg)">Enregistrer les contenus</button> <small id=x-dirty class=no style="${X.edDirty?"":"display:none"}"> ● Modifications non enregistrées</small> <small class=mu>Un clic enregistre tout : les deux espaces, les fichiers joints et les liens. Fichiers : 50 Mo maximum chacun.</small></p>`;
 if(sp=="acc"){
  const wkn=i=>LS.filter(c=>c.module&&c.module.startsWith("Semaine "+(i+1)+" ")),nvid=LS.filter(c=>c.type=="video"||kind(c.fichier_nom)=="video").length,nwk=WK.filter((w,i)=>wkn(i).length).length;
  return tabs+`<div class=g>${K("Documents et vidéos",LS.length)}${K("Vidéos",nvid)}${K("Fichiers joints",LS.filter(c=>c.fichier).length)}${K("Semaines couvertes",nwk+" / 8")}</div>
 <div class=cd><h2>Espace Accompagnement : documents et vidéos par semaine</h2><p class=mu>Ces contenus sont visibles uniquement par les clients accompagnés, dans leur Espace Accompagnement. Choisissez la semaine, le type, puis joignez un fichier <b>PDF, Word, Excel, PowerPoint ou une vidéo MP4</b> (ou collez un lien YouTube ou Vimeo). « Général » = visible toute la durée de l’accompagnement.</p>
 <div class=w><table><tr><th>Semaine<th>Contenus<th>Vidéos<th>Fichiers</tr>${WK.map((w,i)=>{const l=wkn(i);return`<tr><td>${esc(w)}<td>${l.length}<td>${l.filter(c=>c.type=="video"||kind(c.fichier_nom)=="video").length}<td>${l.filter(c=>c.fichier).length}`}).join("")}</table></div></div>
 <div class=cd><h2>Contenus de l’Espace Accompagnement</h2><div class="w xe"><table><tr><th>Semaine<th>N°<th>Type<th>Titre<th>Fichier (PDF, Word, Excel, PowerPoint, vidéo)<th>Ou lien (https://…)<th>Description<th>Visible<th></tr>${idx.map(i=>{const r=R[i];return`<tr><td>${selq(i,"module",[["","Général (toutes les semaines)"],...WK.map(w=>[w,w])],r.module)}<td>${num(i,r)}<td>${sel(i,"type",typ(r),r.type)}<td>${ci(i,"titre",r.titre,170)}<td style="white-space:normal">${filec(i,r)}<td>${ci(i,"lien",r.lien,170,"https://…")}<td><textarea data-x=ed data-i=${i} data-f=resume rows=2 style="width:230px">${esc(r.resume)}</textarea><td>${vis01({i,r})}<td><button class=x data-x=edel data-i=${i} title="Supprimer">×</button>`}).join("")||"<tr><td colspan=9 class=mu>Aucun contenu : cliquez sur « Ajouter un contenu »."}</table></div>${btns}</div>`+progCard}
 const nf=new Set(LS.map(c=>c.formation).filter(Boolean)).size,nfi=LS.filter(c=>c.type=="fichier"||c.fichier).length,nab=LS.filter(c=>c.audience=="abonnes").length;
 return tabs+`<div class=g>${K("Contenus",LS.length)}${K("Formations",nf)}${K("Fichiers",nfi)}${K("Réservés aux abonnés",nab)}</div>
 <div class=cd><h2>Espace Abonnement : formations, fiches et ressources</h2><p class=mu>Une formation se compose de modules ; chaque module contient des vidéos (fichier MP4 ou lien YouTube/Vimeo), des fiches, des fichiers ou des liens. Les contenus sans formation apparaissent dans « Ressources ». Audience « Tous » = aperçu gratuit ; « Abonnés » = abonnés actifs. Les contenus des semaines d’accompagnement se gèrent dans l’onglet « Espace Accompagnement » ci-dessus.</p>
 <div class="w xe"><table><tr><th>Formation<th>Module<th>N°<th>Type<th>Titre<th>Lien (vidéo, page…)<th>Fichier<th>Description ou texte de la fiche<th>Audience<th>Visible<th></tr>${idx.map(i=>{const r=R[i];return`<tr><td>${ci(i,"formation",r.formation,120)}<td>${ci(i,"module",r.module,120)}<td>${num(i,r)}<td>${sel(i,"type",typ(r),r.type)}<td>${ci(i,"titre",r.titre,150)}<td>${ci(i,"lien",r.lien,170,"https://…")}<td style="white-space:normal">${filec(i,r)}<td><textarea data-x=ed data-i=${i} data-f=resume rows=2 style="width:230px">${esc(r.resume)}</textarea><td>${sel(i,"audience",AUDABO,r.audience)}<td>${vis01({i,r})}<td><button class=x data-x=edel data-i=${i} title="Supprimer">×</button>`}).join("")||"<tr><td colspan=11 class=mu>Aucun contenu : cliquez sur « Ajouter un contenu »."}</table></div>${btns}</div>
 ${progCard}
 ${gconOld()}`}
function gconOld(){
 const E=X.A.cont.find(c=>c.id==X.cedit)||null,v=f=>E&&E[f]!=null?esc(E[f]):"",
 so=(o,cur,blank)=>(blank?`<option value="">Aucune</option>`:"")+Object.keys(o).map(k=>`<option value=${k}${k==cur?" selected":""}>${esc(o[k])}</option>`).join("");
 return`<div class=cd id=x-form><h2>${E?"Modifier la fiche":"Ajouter une fiche"}</h2>${E?`<p class=mu>Vous modifiez : <b>${esc(E.titre)}</b></p>`:""}<div class=f><div><label>Type</label><select id=x-ty>${so(TYPES,E&&E.type)}</select></div><div><label>Audience</label><select id=x-au>${so(AUDABO,E&&E.audience)}</select></div><div><label>Catégorie (optionnel)</label><select id=x-ct>${so(CATS,E&&E.categorie,1)}</select></div><div><label>Plateforme (optionnel)</label><select id=x-cp>${so(PLATS,E&&E.plateforme,1)}</select></div><div><label>Titre</label><input id=x-ti maxlength=150 value="${v("titre")}"></div></div><br><label class=mu>Description</label><textarea id=x-re rows=2>${v("resume")}</textarea><br><br><label class=mu>Contenu détaillé</label><textarea id=x-co rows=5>${v("corps")}</textarea><br><br><label class=mu>Résultat observé, chiffres réels (ventes, marge, ROAS…) : indiquez aussi les échecs</label><textarea id=x-rs rows=2>${v("resultat")}</textarea><div class=f style="margin-top:10px"><div><label>Lien https:// ou fichier du site (ex. fichiers/guide.pdf)</label><input id=x-li value="${v("lien")}"></div><div><label>Formation (optionnel)</label><input id=x-fo maxlength=80 value="${v("formation")}"></div><div><label>Module (optionnel : organise formations et vidéos)</label><input id=x-mo maxlength=80 value="${v("module")}"></div><div><label>Ordre dans le module</label><input id=x-or type=number value=${E?esc(E.ordre||1):1} min=1></div><div><label>Image du site (ex. preuves/cas1.png)</label><input id=x-im value="${v("image")}"></div></div><p>${E?`<button class=b data-x=csave>Enregistrer les modifications</button> <button class=b data-x=ccancel style="background:var(--mu)">Annuler</button>`:`<button class=b data-x=cadd>Publier la fiche</button>`}</p></div>
 <div class=cd><h2>Fiches de l’Espace Abonnement (${X.A.cont.filter(c=>c.audience!="accompagnes").length})</h2><p>${ab_("cexp","tout","Exporter toutes les fiches (CSV pour Excel)")}</p>${X.A.cont.filter(c=>c.audience!="accompagnes").map(c=>`${cards([c])}<p style="margin:-4px 0 12px">${ab_("cedit",c.id,"Modifier")} ${ab_("cpub",c.id,c.publie?"Masquer":"Publier")} ${ab_("cdw",c.id,"Télécharger (Word)")} ${ab_("cdt",c.id,"Texte (.txt)")} ${ab_("cpdf",c.id,"PDF / Imprimer")} ${ab_("cdel",c.id,"Supprimer")}</p>`).join("")||"<p class=mu>Aucune fiche pour l’instant.</p>"}</div>`}

function ovAcc(){const A=X.A;
 return`<div class=cd><h2>Tous les clients : accompagnés ou non</h2><div class=w><table><tr><th>Client<th>Accompagné<th>Offre<th>Début<th>Durée (mois)<th>Fin<th>Paiement unique<th>Montant<th>Message visible par le client<th></tr>${A.cl.map(c=>{const a=A.abos.find(x=>x.user_id==c.id&&x.formule=="accompagnement"),pa=A.paies.filter(x=>x.user_id==c.id&&x.formule=="accompagnement"),p=pa.find(x=>x.statut=="paye")||pa.find(x=>x.statut=="en_attente"),ps=p?{en_attente:"En attente",paye:"Payé"}[p.statut]:"—";
 return a?`<tr><td>${nm(c.id)}<td class=${live(a)?"ok":"no"}>${live(a)?"Oui":"Terminé"}<td>${esc(TAR.accompagnement.nom)}<td>${fd(a.debut)}<td><input id=x-dm-${a.id} type=number min=1 max=12 value=${a.duree_mois||2} style="width:70px"><td>${fd(a.expire)}<td>${ps}<td>${p?F(p.montant):"—"}<td><input id=x-ms-${a.id} maxlength=300 value="${esc(a.message||"")}" style="min-width:220px"><td>${ab_("asave",a.id,"Enregistrer")}`:`<tr><td>${nm(c.id)}<td>Non<td>—<td>—<td>—<td>—<td>${ps}<td>${p?F(p.montant):"—"}<td><td>${ab_("aact",c.id,"Activer")}`}).join("")||"<tr><td colspan=10 class=mu>Aucun client inscrit."}</table></div><p class=mu>Le suivi dure 2 mois par défaut : changez la durée puis enregistrez, la date de fin est recalculée à partir du début. Le message est affiché au client dans son espace.</p></div>`}
function gaccView(){
 const A=X.A,ac=A.abos.filter(a=>a.formule=="accompagnement");
 let h=ovAcc()+`<div class=cd><h2>Clients en accompagnement</h2><div class=w><table><tr><th>Client<th>Début<th>Fin<th>Statut<th>Tâches<th></tr>${ac.map(a=>{const t=A.tach.filter(x=>x.user_id==a.user_id);return`<tr><td>${nm(a.user_id)}<td>${fd(a.debut)}<td>${fd(a.expire)}<td class=${live(a)?"ok":"no"}>${st(a)}<td>${t.filter(x=>x.fait).length} / ${t.length}<td>${ab_("open",a.user_id,"Ouvrir")}`}).join("")||"<tr><td colspan=6 class=mu>Aucun accompagnement : il démarre à la validation d’un paiement."}</table></div></div>`;
 const u=A.sel;if(!u||!ac.some(a=>a.user_id==u))return h;
 const T=A.tach.filter(t=>t.user_id==u),S2=A.seas.filter(s=>s.user_id==u),B=A.bil.find(b=>b.user_id==u)||{};
 h+=`<div class=cd><h2>Suivi : ${nm(u)} ${ab_("close","x","Fermer")}</h2>${SEM.map((s,i)=>{const l=T.filter(t=>t.semaine==i+1);return l.length?`<div class=xw><b>Semaine ${i+1} : ${s[0]}</b></div>${l.map(t=>`<div class=xk><input type=checkbox data-x=atask data-id=${t.id}${t.fait?" checked":""}><span>${esc(t.titre)}</span>${t.preuve?`<small class=mu>Preuve : ${esc(t.preuve)}</small>`:""}</div>`).join("")}`:""}).join("")}</div>
 <div class=cd><h2>Séances</h2>${S2.map(s=>`<p>Séance ${s.numero}${slab(s.numero)} : ${fdt(s.date_heure)} ${s.fait?"✔":""} ${ab_("sfait",s.id,s.fait?"Marquer à faire":"Marquer faite")} ${ab_("sdel",s.id,"Supprimer")}</p>`).join("")}<div class=f><div><label>N°</label><input id=x-sn type=number min=1 max=8 value=${S2.length+1}></div><div><label>Date et heure</label><input id=x-sd type=datetime-local></div><div><label>Lien Meet / Zoom (https://)</label><input id=x-sl></div></div><p><button class=b data-x=aseance>Ajouter la séance</button></p><hr><p class=mu>Parcours type : 7 séances (jours 1, 8, 15, 22, 36, 50 et 60). Indiquez l’heure puis planifiez-les toutes d’un coup ; les numéros déjà utilisés sont ignorés.</p><div class=f><div><label>Heure des séances</label><input id=x-ph type=time value="10:00"></div></div><p><button class=b data-x=aplan>Planifier les séances du parcours</button> <button class="b xs" data-x=areset style="background:var(--mg)">Réinitialiser le parcours de tâches</button></p></div>
 <div class=cd><h2>Bilan final</h2><label class=mu>Bilan</label><textarea id=x-bi rows=4>${esc(B.bilan||"")}</textarea><br><br><label class=mu>Plan d’action pour les 30 jours suivants</label><textarea id=x-pl rows=4>${esc(B.plan_action||"")}</textarea><p><button class=b data-x=abil>Enregistrer le bilan</button></p></div>`;
 return h}

/* ---------- Salle de classe : visio, lives, vocaux, fichiers ---------- */
const CL={salle:"abonnes",msgs:[],sess:[],urls:{},loaded:false,loading:false,err:"",rec:null,busy:false};
const CMIME=Object.assign({},MIME,{mp3:"audio/mpeg",m4a:"audio/mp4",wav:"audio/wav",ogg:"audio/ogg"});
const CACCEPT=Object.keys(CMIME).map(e=>"."+e).join(",");
const inClass=()=>!!me&&((tab=="classe"&&!admin)||(admin&&tab=="gcon"&&X.cspace=="classe"));
const canSalle=s=>admin||(s=="abonnes"?hasAbo():hasAcc());
const fhm=d=>d?new Date(d).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
const mmss=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
const ytId=u=>{const m=String(u||"").match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);return m?m[1]:""};
const vmId=u=>{const m=String(u||"").match(/^https:\/\/(?:www\.)?vimeo\.com\/(?:[^?#]*\/)?(\d{6,})/);return m?m[1]:""};
const sgn=async(path,dl)=>ok(await sb.storage.from("classe").createSignedUrl(path,3600,dl?{download:dl}:undefined)).signedUrl;
async function clUrls(list){const need=list.filter(m=>m.kind=="vocal"&&m.fichier&&!(CL.urls[m.fichier]&&CL.urls[m.fichier].exp>Date.now()));
 if(!need.length)return;
 try{ok(await sb.storage.from("classe").createSignedUrls(need.map(m=>m.fichier),3600)).forEach(x=>{if(x.signedUrl)CL.urls[x.path]={url:x.signedUrl,exp:Date.now()+3300000}})}catch(e){}}
const msgHtml=m=>{const mine=m.user_id==me.id,adm=m.role=="admin";let body="";
 if(m.kind=="texte")body=`<div>${nl(m.texte||"")}</div>`;
 else if(m.kind=="vocal"){const u=CL.urls[m.fichier];body=`🎤 ${mmss(m.duree_s||0)} ${u?`<audio controls preload=none src="${esc(u.url)}" style="vertical-align:middle;max-width:100%"></audio>`:`<small class=mu>chargement…</small>`}`}
 else{const k=kind(m.fichier_nom||m.fichier);body=`📎 <b>${esc(m.fichier_nom||"fichier")}</b> `+(k=="video"?`<span id=x-cv-${m.id}><button class="b xs" data-x=cplay data-m=${m.id}>▶ Lire</button></span> `:k=="pdf"?`<button class="b xs" data-x=copen data-m=${m.id}>Ouvrir</button> `:"")+`<button class="b xs" data-x=cdl data-m=${m.id}>Télécharger</button>`}
 return`<div class=xm data-mid=${m.id} style="align-self:${mine?"flex-end":"flex-start"};background:${adm?"var(--ac)":"var(--cd)"};border:1px solid var(--bd);${adm?"border-left:4px solid var(--mg);":""}border-radius:10px;padding:6px 10px;max-width:92%"><div class=mu><b style="color:var(--tx)">${esc(m.auteur||"Membre")}</b>${adm?` <span class=xt>Accompagnateur</span>`:""} · ${fhm(m.cree_le)}${(mine||admin)?` <button class=x data-x=cmdel data-m=${m.id} title="Supprimer" style="font-size:14px">🗑</button>`:""}</div>${body}</div>`};
const sessCard=s=>{const live=s.statut=="en_cours",yt=ytId(s.lien),vm=vmId(s.lien);
 const emb=live&&s.type=="live"?(yt?`<iframe src="https://www.youtube-nocookie.com/embed/${yt}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy=strict-origin-when-cross-origin style="width:100%;aspect-ratio:16/9;border:0;border-radius:8px;margin:8px 0"></iframe>`:vm?`<iframe src="https://player.vimeo.com/video/${vm}" allow="autoplay; picture-in-picture; fullscreen" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;border-radius:8px;margin:8px 0"></iframe>`:""):"";
 const lab={visio:"Rejoindre la visioconférence",live:"Regarder le live",replay:"Voir le replay"}[s.type]||"Ouvrir";
 return`<div class="xo${live?" hot":""}" style="margin-bottom:10px"><b>${live?"🔴 EN DIRECT · ":""}${esc(s.titre)}</b> <span class=xt>${esc({visio:"Visio",live:"Live",replay:"Replay"}[s.type]||s.type)}</span> <span class=xt>${s.audience=="accompagnes"?"Accompagnés":"Abonnés"}</span><br><span class=mu>${fhm(s.debut)} · ${{programmee:"Programmée",en_cours:"En cours",terminee:"Terminée"}[s.statut]||""}</span>${s.description?`<p>${nl(s.description)}</p>`:""}${emb}${safeUrl(s.lien)?`<p><a class=b href="${esc(s.lien)}" target=_blank rel=noopener style="display:inline-block;text-decoration:none">${lab} ↗</a></p>`:""}${admin?`<p>${s.statut!="en_cours"?ab_("cs_start",s.id,"▶ Démarrer (en direct)"):""} ${s.statut=="en_cours"?ab_("cs_end",s.id,"■ Terminer"):""} ${ab_("cs_del",s.id,"Supprimer")}</p>`:""}</div>`};
const sessList=()=>{const o={en_cours:0,programmee:1,terminee:2},l=[...CL.sess].sort((a,b)=>(o[a.statut]-o[b.statut])||(a.statut=="programmee"?new Date(a.debut)-new Date(b.debut):new Date(b.debut)-new Date(a.debut))).slice(0,12);
 return l.length?l.map(sessCard).join(""):`<p class=mu>Aucun rendez-vous programmé pour l’instant.</p>`};
const sessSig=()=>CL.sess.map(s=>[s.id,s.statut,s.lien,s.debut,s.titre].join("~")).join("|");
const recUi=()=>CL.rec?`<span class=no>● <b id=x-cl-tm>${mmss(Math.round((Date.now()-CL.rec.t0)/1000))}</b></span> <button class=b data-x=crecsend>Envoyer</button> <button class=b data-x=crecno style="background:var(--mu)">Annuler</button>`:`<button class=b data-x=crec title="Enregistrer un message vocal (3 minutes maximum)">🎤 Vocal</button>`;
const recPaint=()=>{const e=$("#x-cl-rec");if(e)e.innerHTML=recUi()};
function clPaint(){const box=$("#x-cl-chat");if(!box)return false;
 const ids=CL.msgs.map(m=>String(m.id));
 box.querySelectorAll("[data-mid]").forEach(e=>{if(!ids.includes(e.dataset.mid))e.remove()});
 const have=new Set([...box.querySelectorAll("[data-mid]")].map(e=>e.dataset.mid)),atBottom=box.scrollHeight-box.scrollTop-box.clientHeight<80,fresh=CL.msgs.filter(m=>!have.has(String(m.id)));
 const em=$("#x-cl-empty");if(em&&CL.msgs.length)em.remove();
 fresh.forEach(m=>box.insertAdjacentHTML("beforeend",msgHtml(m)));
 if(!CL.msgs.length&&!$("#x-cl-empty"))box.innerHTML=`<p class=mu id=x-cl-empty>Aucun message pour l’instant : lancez la discussion.</p>`;
 if(fresh.length&&(atBottom||fresh.some(m=>m.user_id==me.id)))box.scrollTop=box.scrollHeight;
 const ss=$("#x-cl-sess");if(ss&&ss.dataset.sig!=sessSig()){ss.innerHTML=sessList();ss.dataset.sig=sessSig()}
 return true}
async function clFetch(){
 if(!inClass()||!canSalle(CL.salle)){CL.loading=false;return}
 CL.loading=true;
 try{const[m,s]=await Promise.all([sb.from("classe_messages").select("*").eq("salle",CL.salle).order("cree_le",{ascending:false}).limit(100),sb.from("classe_sessions").select("*").order("debut",{ascending:false}).limit(40)]);
  CL.msgs=(ok(m)||[]).reverse();CL.sess=ok(s)||[];CL.err="";await clUrls(CL.msgs)}
 catch(e){CL.err=/does not exist|schema cache|Could not find/i.test(e.message||"")?"Module non installé : exécutez classe_supabase.sql dans Supabase, puis rechargez la page.":(e.message||"Erreur de chargement")}
 const first=!CL.loaded||!!CL.err;CL.loaded=true;CL.loading=false;
 if(first||!clPaint())rr()}
function classeView(){
 if(CL.err)return`<div class=cd><h2>Salle de classe</h2><p class=no>${esc(CL.err)}</p></div>`;
 if(!CL.loaded)return`<div class=cd><h2>Salle de classe</h2><p class=mu>Chargement…</p></div>`;
 const chips=`<div class=xch>${[["abonnes","Salle des abonnés"],["accompagnes","Salle accompagnement"]].filter(x=>canSalle(x[0])).map(x=>`<button data-x=csalle data-id=${x[0]} class="${CL.salle==x[0]?"on":""}">${x[1]}</button>`).join("")}</div>`;
 const form=admin?`<details class=xd><summary><b>Programmer une visioconférence ou un live</b></summary><p class=mu>Créez la réunion sur Google Meet, Zoom ou Jitsi, puis collez son lien ici. Pour un live, collez le lien YouTube ou Vimeo : il s’affichera dans la page au moment où vous cliquez sur « Démarrer ». <a href="https://meet.google.com/new" target=_blank rel=noopener>Créer une réunion Google Meet ↗</a></p><div class=f><div><label>Titre</label><input id=x-st maxlength=150></div><div><label>Type</label><select id=x-sy><option value=visio>Visioconférence</option><option value=live>Live</option><option value=replay>Replay</option></select></div><div><label>Pour qui</label><select id=x-sa><option value=abonnes>Abonnés actifs (et accompagnés)</option><option value=accompagnes>Accompagnés seulement</option></select></div><div><label>Date et heure</label><input id=x-sdt type=datetime-local></div><div><label>Lien https://</label><input id=x-sli></div></div><br><label class=mu>Description (optionnel)</label><textarea id=x-sde rows=2 maxlength=1000></textarea><p><button class=b data-x=cs_add>Programmer</button></p></details>`:"";
 return`<div class=cd><h2>Salle de classe</h2><p class=mu>Visioconférences, lives, messages vocaux et fichiers partagés, réservés aux abonnés actifs et aux accompagnés.</p><div id=x-cl-sess data-sig="${esc(sessSig())}">${sessList()}</div></div>${form}
 <div class=cd><h2>Discussion</h2>${chips}<div id=x-cl-chat style="display:flex;flex-direction:column;gap:8px;max-height:460px;overflow-y:auto;padding:8px;background:var(--bg);border:1px solid var(--bd);border-radius:10px">${CL.msgs.length?CL.msgs.map(msgHtml).join(""):`<p class=mu id=x-cl-empty>Aucun message pour l’instant : lancez la discussion.</p>`}</div>
 <div style="display:flex;gap:8px;align-items:flex-end;margin-top:8px;flex-wrap:wrap"><textarea id=x-cl-txt rows=2 maxlength=2000 placeholder="Écrire un message… (Entrée pour envoyer, Maj + Entrée pour un retour à la ligne)" style="flex:1;min-width:200px"></textarea><label class=b style="cursor:pointer;display:inline-block">📎 Fichier<input id=x-cl-file type=file data-x=cfile accept="${CACCEPT}" style="display:none"></label><span id=x-cl-rec>${recUi()}</span><button class=b data-x=cmsend>Envoyer</button></div>
 <p class=mu>Fichiers et vocaux : 50 Mo maximum. Les messages se mettent à jour automatiquement toutes les 4 secondes.</p></div>`}
const classeLocked=()=>`<div class=cd><h2>🔒 Salle de classe</h2>${pendBanner()}<p>La salle de classe réunit les visioconférences, les lives, les messages vocaux et le partage de fichiers en direct avec votre accompagnateur et les autres membres. Elle est réservée aux abonnés actifs et aux clients accompagnés.</p></div>${paySec(["essentiel","croissance","accompagnement"])}`;
async function clUp(file,name,mime){const path=me.id+"/"+(crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(36).slice(2))+"-"+name.replace(/[^\w.\-]+/g,"_").slice(-60);ok(await sb.storage.from("classe").upload(path,file,{contentType:mime}));return path}
async function clPost(row,path){try{ok(await sb.from("classe_messages").insert(Object.assign({user_id:me.id,salle:CL.salle},row)))}catch(e){if(path)await sb.storage.from("classe").remove([path]).catch(()=>{});throw e}}
async function clSendText(){const t=$("#x-cl-txt");if(!t||CL.busy)return;const txt=t.value.trim();if(!txt)return;CL.busy=true;
 try{await clPost({kind:"texte",texte:txt.slice(0,2000)});t.value=""}catch(e){alert(e.message)}CL.busy=false;await clFetch()}
async function clSendFile(f){if(!f||CL.busy)return;const mime=CMIME[ext(f.name)];
 if(!mime)return alert("Format non accepté. Formats : PDF, Word, Excel, PowerPoint, vidéo (MP4, WebM, MOV), audio, images, TXT, CSV.");
 if(f.size>52428800)return alert("Fichier de plus de 50 Mo (limite du plan gratuit de Supabase). Pour une vidéo plus lourde, partagez un lien YouTube ou Vimeo.");
 CL.busy=true;try{const path=await clUp(f,f.name,mime);await clPost({kind:"fichier",fichier:path,fichier_nom:f.name.slice(0,120)},path)}catch(e){alert(e.message)}CL.busy=false;await clFetch()}
function recCancel(){const r=CL.rec;if(!r)return;r.cancel=true;clearInterval(r.timer);try{if(r.mr.state!="inactive")r.mr.stop()}catch(e){}r.stream.getTracks().forEach(t=>t.stop());CL.rec=null;recPaint()}
async function recStart(){
 if(!navigator.mediaDevices||!window.MediaRecorder)return alert("Votre navigateur ne permet pas l’enregistrement vocal. Utilisez une version récente de Chrome, Edge, Firefox ou Safari.");
 try{const stream=await navigator.mediaDevices.getUserMedia({audio:true}),types=["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/ogg;codecs=opus"],mt=types.find(t=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t))||"",mr=mt?new MediaRecorder(stream,{mimeType:mt}):new MediaRecorder(stream),chunks=[];
  mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  CL.rec={mr,stream,chunks,t0:Date.now(),mt:mr.mimeType||mt||"audio/webm",cancel:false};mr.start();
  CL.rec.timer=setInterval(()=>{const tm=$("#x-cl-tm");if(!CL.rec)return;const s=Math.round((Date.now()-CL.rec.t0)/1000);if(tm)tm.textContent=mmss(s);if(s>=180)recSend()},500);recPaint()}
 catch(e){alert("Microphone inaccessible : autorisez-le dans votre navigateur puis réessayez. ("+(e.message||e.name)+")")}}
function recSend(){const r=CL.rec;if(!r)return;clearInterval(r.timer);const dur=Math.round((Date.now()-r.t0)/1000);
 r.mr.onstop=async()=>{r.stream.getTracks().forEach(t=>t.stop());CL.rec=null;recPaint();if(dur<1||r.cancel)return;
  const base=(r.mt||"audio/webm").split(";")[0],e={"audio/webm":"webm","audio/mp4":"m4a","audio/ogg":"ogg","audio/mpeg":"mp3"}[base]||"webm",blob=new Blob(r.chunks,{type:base});
  CL.busy=true;try{const path=await clUp(blob,"vocal."+e,base);await clPost({kind:"vocal",fichier:path,fichier_nom:"vocal."+e,duree_s:Math.min(dur,600)},path)}catch(er){alert(er.message)}CL.busy=false;await clFetch()};
 try{r.mr.stop()}catch(e){r.mr.onstop()}}
setInterval(()=>{if(document.hidden||!inClass()||!CL.loaded||CL.loading||CL.busy||CL.rec||!canSalle(CL.salle))return;clFetch()},4000);
document.addEventListener("keydown",e=>{if(e.target&&e.target.id=="x-cl-txt"&&e.key=="Enter"&&!e.shiftKey){e.preventDefault();clSendText()}});

/* ---------- réservation des calculs aux abonnés ---------- */
const paid=()=>admin||(X.loaded&&(hasAbo()||X.noMod));
const KPI_LOCK=["Investissement","CA potentiel","Bénéfice potentiel"];
function lock(){
 if(!me||paid()||tab=="prod")return; // onglet Produits : toutes les informations restent visibles pour tous
 const root=$("#app"),main=root&&root.querySelector("main");if(!main)return;
 root.querySelectorAll("td.c").forEach(td=>{td.textContent="🔒";td.classList.add("xlock")});
 root.querySelectorAll("th.c").forEach(th=>th.classList.add("xlock"));
 root.querySelectorAll(".k").forEach(k=>{const sm=k.querySelector("small"),b=k.querySelector("b");if(sm&&b&&KPI_LOCK.includes(sm.textContent.trim())){b.textContent="🔒";b.classList.add("xlock")}});
 root.querySelectorAll(".cd").forEach(c=>{const h=c.querySelector("h2"),t=h?h.textContent.trim():"";
  if(t=="Bénéfice par produit")c.innerHTML="<h2>Bénéfice par produit</h2><p class=mu>🔒 Réservé aux abonnés.</p>";
  if(t=="Alertes")c.querySelectorAll("p").forEach(p=>{if(/Marge nette négative/.test(p.textContent))p.remove()})});
 main.querySelectorAll("p.mu").forEach(p=>{if(/^(Prix de vente =|Repères :)/.test(p.textContent.trim()))p.remove()});
 if(["dash","camp"].includes(tab))main.insertAdjacentHTML("afterbegin",`<div class=an style="margin:0 0 12px">🔒 Les calculs (marges, seuil de rentabilité, indicateurs publicitaires, bénéfices) sont réservés aux abonnés. <button class="b xs" data-tab=abo>Voir les offres</button></div>`)}

/* ---------- branchement sur app.js ---------- */
function prixCard(){
 if(!X.loaded)return"";
 if(!X.offOk)return`<div class=cd><h2>Prix des espaces</h2><p class=no>Module non installé : exécutez installation_complete.sql dans Supabase, puis rechargez la page.</p></div>`;
 const pr=f=>f=="essentiel_annuel"?ANNUEL_ESSENTIEL:TAR[f].prix,row=(f,l,u)=>`<tr><td>${l}<td><input id=x-pr-${f} type=number min=100 step=500 value=${pr(f)} style="width:110px"> F ${u}<td>${ab_("oprix",f,"Enregistrer")}`;
 return`<div class=cd><h2>Prix des espaces</h2><div class=w><table><tr><th>Espace et formule<th>Prix<th></tr><tr><td colspan=3><b>🔒 Espace Abonnement</b> (abonnement mensuel)</tr>${row("essentiel","Essentiel","par mois")}${row("croissance","Croissance","par mois")}${row("essentiel_annuel","Essentiel annuel (option)","pour 12 mois")}<tr><td colspan=3><b>🔒 Espace Accompagnement</b> (paiement unique, suivi de 2 mois)</tr>${row("accompagnement","Accompagnement","paiement unique")}</table></div><p class=mu>Le nouveau prix s’applique aux prochains paiements ; les accès déjà payés ne changent pas.</p></div>`}
const _view=view;
view=function(){
 if(me&&admin&&tab=="admin")return _view()+prixCard();
 if(me&&tab=="ref"&&S){
  if(!X.loaded)return`<div class=cd><p class=mu>Chargement…</p></div>`;
  if(!paid())return`<div class=cd><h2>🔒 Référence KPI</h2>${pendBanner()}<p>La référence des indicateurs (formules et repères pour le CTR, le CPC, le CPM, le CPA, le ROAS et le seuil de rentabilité) est réservée aux abonnés : abonnement mensuel ou accompagnement.</p></div>${paySec(["essentiel","croissance","accompagnement"])}`}
 if(me&&MINE.includes(tab)){
  if(X.err)return`<div class=cd><h2>Information</h2><p class=no>${esc(X.err)}</p></div>`;
  if(!X.loaded)return`<div class=cd><p class=mu>Chargement…</p></div>`;
  if(tab=="abo")return aboView();if(tab=="acc")return accView();
  if(tab=="classe")return hasAbo()?classeView():classeLocked();
  if(admin){if(tab=="goff")return goffView();if(tab=="gabo")return gaboView();if(tab=="gcon")return gconView();if(tab=="gacc")return gaccView()}
 }
 return _view()};

render=function(){
 if(!me){reset();$("#app").innerHTML=authView();return}
 if(!X.loaded&&!X.loading)xLoad();
 if(inClass()&&!CL.loaded&&!CL.loading&&canSalle(CL.salle)){CL.loading=true;clFetch()}
 if(!inClass()&&CL.rec)recCancel();
 const tabs=[...(admin?[["admin","Administration"],["goff","Offres"],["gabo","Abonnements"],["gcon","Contenus"],["gacc","Accompagnés"]]:[]),
  ...(S?[["dash","Tableau de bord"],["obj","Objectif"],["prod","Produits"],["cmd","Commandes"],["camp","Campagnes"],["ref",(paid()?"":"🔒 ")+"Référence KPI"],["abo",(hasAbo()?"":"🔒 ")+"Espace Abonnement"],["acc",(hasAcc()||X.tach.length?"":"🔒 ")+"Espace Accompagnement"],["classe",(hasAbo()?"":"🔒 ")+"Salle de classe"]]:[])];
 if(!tabs.some(t=>t[0]==tab))tab=tabs.length?tabs[0][0]:"dash";
 $("#app").innerHTML=`<header><img src="${LOGO}" alt="GSC Business Center"><div><b>Plateforme de gestion e-commerce</b><small>${S?esc(S.boutique||S.nom):"Bienvenue"}</small></div><span class=r>${admin?"Administrateur":"Espace client"}</span><button class=b id=lo style="background:var(--mg)">Déconnexion</button></header>${ann?`<div class=an>📣 ${esc(ann)}</div>`:""}<nav>${tabs.map(t=>`<button data-tab=${t[0]} class="${t[0]==tab?"on":""}">${t[1]}</button>`).join("")}</nav><main>${view()}<p class=mu id=st>${esc(note)}</p></main>`;lock()};

/* ---------- actions ---------- */
const val=i=>($("#"+i)||{}).value||"";
document.addEventListener("click",async e=>{
 const tb=e.target.closest("[data-tab]");
 if(tb&&MINE.includes(tb.dataset.tab)&&!X.loading){xLoad();return}
 const t=e.target.closest("[data-x]");if(!t||/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName))return;
 const a=t.dataset.x,id=t.dataset.id,A=X.A;
 if(a=="cspace"){X.cspace=id=="acc"?"acc":id=="classe"?"classe":"abo";rr()}
 else if(a=="edadd"){X.ed=X.ed||[];const ac=X.cspace=="acc",l=[...X.ed].reverse().find(r=>ac?r.audience=="accompagnes":r.audience!="accompagnes");
  X.ed.push(ac?{id:null,formation:ACC_FORM,module:l?l.module:"",ordre:l?(+l.ordre||0)+1:1,type:"fichier",titre:"",lien:"",resume:"",audience:"accompagnes",fichier:null,fichier_nom:null,publie:true}:{id:null,formation:l?l.formation:"",module:l?l.module:"",ordre:l?(+l.ordre||0)+1:1,type:"video",titre:"",lien:"",resume:"",audience:"abonnes",fichier:null,fichier_nom:null,publie:true});X.edDirty=true;rr()}
 else if(a=="edel"){const i=+t.dataset.i,r=(X.ed||[])[i];if(!r)return;if(!r.id){if(r.fichier)sb.storage.from("contenus").remove([r.fichier]).catch(()=>{});X.ed.splice(i,1);rr();return}if(!confirm("Supprimer ce contenu ?"))return;run(async()=>{ok(await sb.from("contenus").delete().eq("id",r.id));if(r.fichier)await sb.storage.from("contenus").remove([r.fichier]);X.ed.splice(i,1)})}
 else if(a=="edsave"){const rows=(X.ed||[]).filter(r=>r.titre.trim()||r.id||r._file),bad=[];
  rows.forEach(r=>{const n="« "+(r.titre.trim()||"sans titre")+" » : ";if(!r.titre.trim())bad.push(n+"le titre est obligatoire");if(r.lien.trim()&&!safeLink(r.lien.trim()))bad.push(n+"lien invalide (utilisez https:// ou un fichier du site)");if(r._file&&!MIME[ext(r._file.name)])bad.push(n+"format de fichier non accepté (PDF, Word, Excel, PowerPoint, vidéo MP4/WebM/MOV, images, TXT, CSV)");if(r._file&&r._file.size>52428800)bad.push(n+"fichier de plus de 50 Mo (plan gratuit de Supabase) : utilisez un lien YouTube ou Vimeo")});
  if(bad.length)return alert("Rien n’a été enregistré. À corriger :\n- "+bad.join("\n- "));
  if(!rows.length)return alert("Aucun contenu à enregistrer.");
  const y=scrollY,fails=[];let nf=0;t.disabled=true;
  for(let k=0;k<rows.length;k++){const r=rows[k];t.textContent="Enregistrement… ("+(k+1)+"/"+rows.length+")";
   try{
    if(r._file){const nmf=r._file.name.replace(/[^\w.\-]+/g,"_").slice(-80),path=(crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(36).slice(2))+"-"+nmf;
     ok(await sb.storage.from("contenus").upload(path,r._file,{contentType:MIME[ext(r._file.name)]}));
     r._old=r._old||r.fichier||null;r.fichier=path;r.fichier_nom=r._file.name.slice(0,120);r._file=null;nf++}
    const p={publie:pub(r),formation:r.formation.trim()||(r.audience=="accompagnes"?ACC_FORM:"")||null,module:r.module.trim()||null,ordre:Math.max(1,+r.ordre||1),type:r.type,titre:r.titre.trim().slice(0,150),lien:r.lien.trim()||null,resume:r.resume.trim()||null,audience:r.audience,gratuit:r.audience=="tous",fichier:r.fichier||null,fichier_nom:r.fichier_nom||null};
    if(r.id)ok(await sb.from("contenus").update(p).eq("id",r.id));else{r.id=ok(await sb.from("contenus").insert(p).select("id").single()).id}
    if(r._old){try{await sb.storage.from("contenus").remove([r._old])}catch(e2){}r._old=null}
   }catch(e){fails.push("« "+(r.titre||"sans titre")+" » : "+(e.message||e))}}
  const saved=rows.length-fails.length;
  X.csaved=fails.length?"":"✔ "+saved+" contenu"+(saved>1?"s":"")+" enregistré"+(saved>1?"s":"")+(nf?", dont "+nf+" fichier"+(nf>1?"s":"")+" téléversé"+(nf>1?"s":""):"")+".";
  if(!fails.length){X.edDirty=false;X.ed=null}
  await xLoad();scrollTo(0,y);
  if(fails.length)alert(saved+" contenu(s) enregistré(s), "+fails.length+" en échec. Vos saisies sont conservées : corrigez puis cliquez de nouveau sur « Enregistrer les contenus ».\n- "+fails.join("\n- "))}
 else if(a=="play"){const c=[...X.cont,...X.A.cont].find(c=>c.id==id),box=$("#x-v-"+id);if(!c||!c.fichier||!box)return;
  try{const r=ok(await sb.storage.from("contenus").createSignedUrl(c.fichier,21600));
   box.innerHTML=`<video controls controlsList=nodownload playsinline preload=metadata style="width:100%;max-width:720px;border-radius:8px;background:#000"></video><p class=mu>Si la vidéo ne démarre pas, utilisez « Télécharger ».</p>`;
   const v=box.querySelector("video");v.addEventListener("error",()=>{box.insertAdjacentHTML("beforeend",`<p class=no>Lecture impossible dans la page. <button class="b xs" data-x=dl data-id=${id}>Télécharger la vidéo</button></p>`)},{once:true});v.src=r.signedUrl;const pr=v.play&&v.play();if(pr&&pr.catch)pr.catch(()=>{})}catch(x){alert(x.message)}}
 else if(a=="open"){const c=[...X.cont,...X.A.cont].find(c=>c.id==id);if(!c||!c.fichier)return;const w=window.open("about:blank","_blank");
  try{const r=ok(await sb.storage.from("contenus").createSignedUrl(c.fichier,3600));if(w){w.opener=null;w.location.href=r.signedUrl}else location.assign(r.signedUrl)}catch(x){if(w)w.close();alert(x.message)}}
 else if(a=="dl"){const c=[...X.cont,...X.A.cont].find(c=>c.id==id);if(!c||!c.fichier)return;try{const r=ok(await sb.storage.from("contenus").createSignedUrl(c.fichier,3600,{download:c.fichier_nom||true}));location.assign(r.signedUrl)}catch(x){alert(x.message)}}
 else if(a=="typ"){X.typ=id;rr()}else if(a=="cat"){X.cat=id;rr()}else if(a=="plat"){X.plat=id;rr()}else if(a=="sel"){X.pf=id;rr()}
 else if(a=="pay"){const du=id=="accompagnement"?1:+(val("x-du")||1),rf=val("x-rf").trim();
  if(rf.length<3)return alert("Indiquez la référence de la transaction.");
  t.disabled=true;X.pf="";await run(async()=>ok(await sb.from("paiements").insert({user_id:me.id,formule:id,duree_mois:du,montant:amt(id,du),operateur:val("x-op")||"autre",reference:rf.slice(0,60)})))}
 else if(a=="valid"){const yes=t.dataset.ok=="1";if(yes&&!confirm("Confirmez-vous avoir bien reçu ce paiement ?"))return;run(async()=>ok(await sb.rpc("admin_valider_paiement",{p_id:id,p_ok:yes})))}
 else if(a=="prol"){const x=A.abos.find(x=>x.id==id);if(x)run(async()=>ok(await sb.from("abonnements").update({expire:addDays(x.expire>today()?x.expire:today(),30)}).eq("id",id)))}
 else if(a=="susp"){const x=A.abos.find(x=>x.id==id);if(x)run(async()=>ok(await sb.from("abonnements").update({statut:x.statut=="actif"?"suspendu":"actif"}).eq("id",id)))}
 else if(a=="resil"){if(confirm("Résilier cet abonnement ? Le client perdra l’accès."))run(async()=>ok(await sb.from("abonnements").update({statut:"resilie"}).eq("id",id)))}
 else if(a=="asave"){const x=A.abos.find(x=>x.id==id);if(!x)return;const dm=Math.min(12,Math.max(1,Math.round(+val("x-dm-"+id)||2)));run(async()=>ok(await sb.from("abonnements").update({duree_mois:dm,expire:addMonths(x.debut,dm),message:val("x-ms-"+id).trim().slice(0,300)||null}).eq("id",id)))}
 else if(a=="aact"){const o=X.off.find(r=>r.formule=="accompagnement");run(async()=>ok(await sb.rpc("admin_activer",{p_uid:id,p_formule:"accompagnement",p_jours:o?o.duree_jours:60})))}
 else if(a=="act"){const u=val("x-cl");if(!u)return alert("Choisissez un client.");run(async()=>ok(await sb.rpc("admin_activer",{p_uid:u,p_formule:val("x-fm"),p_jours:Math.min(400,Math.max(1,+val("x-jr")||30))})))}
 else if(a=="oprix"){const v=Math.round(+val("x-pr-"+id));if(!(v>=100&&v<=10000000))return alert("Indiquez un prix valide (100 F minimum).");run(async()=>ok(await sb.from("offres").update({prix:v,maj:new Date().toISOString()}).eq("formule",id)))}
 else if(a=="info"){run(async()=>ok(await sb.from("settings").upsert({k:"paiement_info",v:val("x-inf").slice(0,500)})))}
 else if(a=="cadd"){const r={formation:val("x-fo").trim()||null,type:val("x-ty")||"fiche",audience:val("x-au")||"abonnes",module:val("x-mo").trim()||null,ordre:+val("x-or")||1,categorie:val("x-ct")||null,plateforme:val("x-cp")||null,titre:val("x-ti").trim(),resume:val("x-re").trim()||null,corps:val("x-co").trim()||null,resultat:val("x-rs").trim()||null,lien:val("x-li").trim()||null,image:val("x-im").trim()||null,gratuit:val("x-au")=="tous",publie:true};
  if(!r.titre)return alert("Le titre est obligatoire.");
  if(r.lien&&!safeLink(r.lien))return alert("Le lien doit commencer par https:// ou être un fichier du site (ex. fichiers/guide.pdf).");
  if(r.image&&!safeImg(r.image))return alert("L’image doit être un fichier du site, par exemple preuves/cas1.png");
  run(async()=>ok(await sb.from("contenus").insert(r)))}
 else if(a=="csalle"){CL.salle=id=="accompagnes"?"accompagnes":"abonnes";CL.loaded=false;CL.msgs=[];rr()}
 else if(a=="cmsend")clSendText();
 else if(a=="crec")recStart();else if(a=="crecsend")recSend();else if(a=="crecno")recCancel();
 else if(a=="cmdel"){const m=CL.msgs.find(x=>String(x.id)==t.dataset.m);if(!m||!confirm("Supprimer ce message ?"))return;try{ok(await sb.from("classe_messages").delete().eq("id",m.id));if(m.fichier)await sb.storage.from("classe").remove([m.fichier]).catch(()=>{});CL.msgs=CL.msgs.filter(x=>x!==m);clPaint()}catch(x){alert(x.message)}}
 else if(a=="cdl"||a=="copen"){const m=CL.msgs.find(x=>String(x.id)==t.dataset.m);if(!m||!m.fichier)return;const w=a=="copen"?window.open("about:blank","_blank"):null;
  try{const u=await sgn(m.fichier,a=="cdl"?(m.fichier_nom||true):null);if(w){w.opener=null;w.location.href=u}else location.assign(u)}catch(x){if(w)w.close();alert(x.message)}}
 else if(a=="cplay"){const m=CL.msgs.find(x=>String(x.id)==t.dataset.m),box=m&&$("#x-cv-"+m.id);if(!m||!box)return;
  try{const u=await sgn(m.fichier);box.innerHTML=`<video controls controlsList=nodownload playsinline preload=metadata style="width:100%;max-width:560px;border-radius:8px;background:#000"></video>`;const v=box.querySelector("video");v.addEventListener("error",()=>{box.insertAdjacentHTML("beforeend",`<small class=no> Lecture impossible : utilisez Télécharger.</small>`)},{once:true});v.src=u;const pr=v.play&&v.play();if(pr&&pr.catch)pr.catch(()=>{})}catch(x){alert(x.message)}}
 else if(a=="cs_add"){const tt=val("x-st").trim(),dt=val("x-sdt"),li=val("x-sli").trim();if(!tt)return alert("Le titre est obligatoire.");if(!dt)return alert("Indiquez la date et l’heure.");if(li&&!safeUrl(li))return alert("Le lien doit commencer par https://");
  const row={titre:tt.slice(0,150),type:val("x-sy")||"visio",audience:val("x-sa")||"abonnes",debut:new Date(dt).toISOString(),lien:li||null,description:val("x-sde").trim().slice(0,1000)||null,statut:"programmee"};
  try{ok(await sb.from("classe_sessions").insert(row));await clFetch();rr()}catch(x){alert(x.message)}}
 else if(a=="cs_start"||a=="cs_end"){try{ok(await sb.from("classe_sessions").update({statut:a=="cs_start"?"en_cours":"terminee"}).eq("id",id));await clFetch()}catch(x){alert(x.message)}}
 else if(a=="cs_del"){if(!confirm("Supprimer ce rendez-vous ?"))return;try{ok(await sb.from("classe_sessions").delete().eq("id",id));await clFetch()}catch(x){alert(x.message)}}
 else if(a=="cedit"){if(X.edDirty)return alert("Enregistrez d’abord les modifications du tableau (bouton « Enregistrer les contenus »).");X.cedit=id;rr();const f=$("#x-form");if(f&&f.scrollIntoView)f.scrollIntoView({behavior:"smooth"})}
 else if(a=="ccancel"){X.cedit="";rr()}
 else if(a=="csave"){if(X.edDirty)return alert("Enregistrez d’abord les modifications du tableau (bouton « Enregistrer les contenus »).");
  const r={formation:val("x-fo").trim()||null,type:val("x-ty")||"fiche",audience:val("x-au")||"abonnes",module:val("x-mo").trim()||null,ordre:Math.max(1,+val("x-or")||1),categorie:val("x-ct")||null,plateforme:val("x-cp")||null,titre:val("x-ti").trim(),resume:val("x-re").trim()||null,corps:val("x-co").trim()||null,resultat:val("x-rs").trim()||null,lien:val("x-li").trim()||null,image:val("x-im").trim()||null,gratuit:val("x-au")=="tous"};
  if(!r.titre)return alert("Le titre est obligatoire.");
  if(r.lien&&!safeLink(r.lien))return alert("Le lien doit commencer par https:// ou être un fichier du site (ex. fichiers/guide.pdf).");
  if(r.image&&!safeImg(r.image))return alert("L’image doit être un fichier du site, par exemple preuves/cas1.png");
  const cid=X.cedit;run(async()=>{ok(await sb.from("contenus").update(r).eq("id",cid));X.cedit=""})}
 else if(a=="cdw"||a=="cdt"||a=="cpdf"){const c=A.cont.find(c=>c.id==id);if(!c)return;
  if(a=="cdw")dlFile(slug(c.titre)+".doc","application/msword",ficheWord(c));else if(a=="cdt")dlFile(slug(c.titre)+".txt","text/plain",ficheText(c));else fichePrint(c)}
 else if(a=="cexp"){dlFile("fiches-gsc-"+today()+".csv","text/csv",csvAll(A.cont),true)}
 else if(a=="cpub"){const c=A.cont.find(c=>c.id==id);if(c)run(async()=>ok(await sb.from("contenus").update({publie:!c.publie}).eq("id",id)))}
 else if(a=="cdel"){if(confirm("Supprimer cette fiche ?"))run(async()=>ok(await sb.from("contenus").delete().eq("id",id)))}
 else if(a=="open"){A.sel=id;rr()}else if(a=="close"){A.sel="";rr()}
 else if(a=="aseance"){const d=val("x-sd");if(!d)return alert("Indiquez la date et l’heure.");const l=val("x-sl").trim();if(l&&!safeUrl(l))return alert("Le lien doit commencer par https://");
  run(async()=>ok(await sb.from("acc_seances").insert({user_id:A.sel,numero:+val("x-sn")||1,date_heure:new Date(d).toISOString(),lien:l||null})))}
 else if(a=="aplan"){const ab=A.abos.find(x=>x.user_id==A.sel&&x.formule=="accompagnement");if(!ab)return alert("Aucun accompagnement pour ce client.");
  const hm=/^\d{2}:\d{2}$/.test(val("x-ph"))?val("x-ph"):"10:00",l=val("x-sl").trim();if(l&&!safeUrl(l))return alert("Le lien doit commencer par https://");
  const used=A.seas.filter(x=>x.user_id==A.sel).map(x=>x.numero),rows=DECAL.map((d,i)=>({user_id:A.sel,numero:i+1,date_heure:new Date(addDays(ab.debut,d)+"T"+hm+":00Z").toISOString(),lien:l||null})).filter(r=>!used.includes(r.numero));
  if(!rows.length)return alert("Les 7 séances existent déjà.");run(async()=>ok(await sb.from("acc_seances").insert(rows)))}
 else if(a=="areset"){if(confirm("Réinitialiser le parcours de ce client ? Ses tâches actuelles (et les cases cochées) seront remplacées par le nouveau parcours."))run(async()=>ok(await sb.rpc("admin_reinitialiser_parcours",{p_uid:A.sel})))}
 else if(a=="sfait"){const s=A.seas.find(s=>s.id==id);if(s)run(async()=>ok(await sb.from("acc_seances").update({fait:!s.fait}).eq("id",id)))}
 else if(a=="sdel"){run(async()=>ok(await sb.from("acc_seances").delete().eq("id",id)))}
 else if(a=="abil"){run(async()=>ok(await sb.from("acc_bilans").upsert({user_id:A.sel,bilan:val("x-bi").trim()||null,plan_action:val("x-pl").trim()||null,maj:new Date().toISOString()})))}
});
window.addEventListener("beforeunload",e=>{if(X.edDirty){e.preventDefault();e.returnValue=""}});
document.addEventListener("click",e=>{if(!X.edDirty)return;const tb=e.target.closest("[data-tab]"),lo=e.target.closest("#lo");
 if(((tb&&tb.dataset.tab!="gcon")||lo)&&!confirm("Vous avez des modifications non enregistrées dans l’onglet Contenus. Quitter sans enregistrer ?")){e.stopImmediatePropagation();e.preventDefault()}},true);
const edSet=t=>{const i=+t.dataset.i,f=t.dataset.f;if(!X.ed||!X.ed[i])return;if(f=="_file"){X.ed[i]._file=t.files[0]||null;if(X.ed[i]._file){const k=kind(X.ed[i]._file.name),nt=k=="video"?"video":(["lien","video"].includes(X.ed[i].type)?"fichier":X.ed[i].type),se=document.querySelector(`select[data-x=ed][data-i="${i}"][data-f=type]`);X.ed[i].type=nt;if(se)se.value=nt}const sp=$("#x-fn-"+i);if(sp)sp.textContent=X.ed[i]._file?X.ed[i]._file.name:(X.ed[i].fichier_nom||"")}else X.ed[i][f]=t.value;X.edDirty=true;if(X.csaved){X.csaved="";const sv=$("#x-saved");if(sv)sv.remove()}const dd=$("#x-dirty");if(dd)dd.style.display=""};
document.addEventListener("input",e=>{const t=e.target;if(t.dataset&&t.dataset.x=="ed"&&t.type!="file")edSet(t)});
document.addEventListener("change",async e=>{
 const t=e.target,a=t.dataset&&t.dataset.x;if(!a)return;
 if(a=="task"||a=="proof"){const k=X.tach.find(k=>k.id==t.dataset.id);if(!k)return;
  const fait=a=="task"?t.checked:k.fait,pr=a=="proof"?t.value:(k.preuve||"");
  run(async()=>ok(await sb.rpc("acc_maj_tache",{p_id:k.id,p_fait:fait,p_preuve:pr})))}
 else if(a=="ed")edSet(t);
 else if(a=="cfile"){const f=t.files&&t.files[0];t.value="";clSendFile(f)}
 else if(a=="done"){const id=t.dataset.id;try{if(t.checked){ok(await sb.from("contenus_suivi").upsert({user_id:me.id,contenu_id:id},{ignoreDuplicates:true}));if(!X.suivi.includes(id))X.suivi.push(id)}else{ok(await sb.from("contenus_suivi").delete().eq("user_id",me.id).eq("contenu_id",id));X.suivi=X.suivi.filter(x=>x!=id)}rr()}catch(x){alert(x.message);t.checked=!t.checked}}
 else if(a=="atask"){run(async()=>ok(await sb.from("acc_taches").update({fait:t.checked,fait_le:t.checked?new Date().toISOString():null}).eq("id",t.dataset.id)))}
});

if(me)render();
})();
