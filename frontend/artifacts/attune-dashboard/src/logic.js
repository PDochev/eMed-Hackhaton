class Component extends DCLogic {
  state = { view:'worklist', pid:'40291883', tab:'overview', filter:'all', expanded:null, q:'', toastShow:false, toastMsg:'', domainOff:{}, domainW:{}, imgSel:0, taskDone:{}, taskFilter:'all', joint:null, anFocus:'radai', cdsState:{}, cdsFilter:'all', alertPid:'40291883', patientRules:{}, cohortRules:[], ruleDraft:{metric:'RADAI-5',op:'rises above',val:'1.0',win:'14 days',scope:'patient'}, billBoost:{}, billCharged:{}, modal:null, modalNote:null, bloodSel:{}, noteDraft:'', addedTasks:[], addedNotes:{}, offCaseload:{} };

  // ===== Attune caseload — eMed at-home programmes (PCOS + GLP-1) =====
  // psi = the six concordance axes. raw 0-2 = drift severity vs personal baseline; z = robust z-score (signed).
  P = [
  {id:'40291883',mrn:'PCOS-0142',name:'Sam K.',age:29,sex:'F',prog:'PCOS',day:34,clin:'Attune AI · PCOS ConditionPack v3',tx:'Metformin 500mg BD + lifestyle',status:'Amber · brief ready',pri:'amb',adh:'91%',streak:'31 / 34 days',lr:'Today, 07:12',na:'Review brief',concDays:4,
    psi:{cyc:{raw:1,z:2.1},glu:{raw:1,z:1.8},mood:{raw:1,z:-1.6},sleep:{raw:0,z:-0.8},wt:{raw:0,z:0.5},skin:{raw:1,z:1.2}},
    issues:[
      {t:'Cycle irregularity  z +2.1',d:'42-day gap logged vs 31-day personal baseline.',tn:'amb'},
      {t:'Post-meal glucose  z +1.8',d:'CGM 2-h peaks 9.1 mmol/L vs 7.2 baseline.',tn:'amb'},
      {t:'Mood · voice affect  z −1.6',d:'Flatter prosody, slower speech across check-ins.',tn:'amb'},
      {t:'Skin (vision)  z +1.2',d:'Jawline acne count rising in daily photos.',tn:'n'}],
    actions:[
      {t:'Approve AI-drafted plan',d:'Metformin timing + evening walk nudge.',tn:'amb'},
      {t:'Request confirmatory labs',d:'Free androgen index, fasting glucose, LH/FSH.',tn:'n'},
      {t:'Consider pelvic ultrasound',d:'If Rotterdam 3rd criterion needed.',tn:'n'}],
    subs:[
      {t:'Voice check-in · Today 07:12',d:'"Period still hasn\u2019t come, feeling kind of flat and my skin\u2019s worse this week."',tn:'amb',kind:'voice',signal:'Cycle · Mood · Skin',full:'"Morning. Um, so the period still hasn\u2019t come — it\u2019s been like six weeks now. I\u2019m feeling kind of flat, not really myself. And my skin\u2019s worse this week, breaking out along my jaw again. I did take the metformin though."'},
      {t:'Photo submission · Yesterday',d:'Jawline + cheek. Vision score: acne 3/4, hirsutism 1/4.',tn:'n',kind:'photo',signal:'Skin',full:'Two front-facing photos in good light. Vision model scored inflammatory acne 3/4 (up from 2/4 seven days ago) and hirsutism 1/4 (stable).'},
      {t:'Voice check-in · Day 32',d:'"Skipped metformin twice this week, it upsets my stomach."',tn:'amb',kind:'voice',signal:'Adherence',full:'"I\u2019ll be honest, I skipped the metformin twice this week — it really upsets my stomach if I don\u2019t eat first. Otherwise okay I guess."'},
      {t:'CGM sync · Day 34',d:'Post-lunch excursion 9.4 mmol/L, 2-h return delayed.',tn:'amb',kind:'device',signal:'Glucose',full:'Continuous glucose monitor synced. Post-lunch excursion peaked at 9.4 mmol/L with delayed 2-hour return to baseline; fasting glucose normal at 5.3 mmol/L.'}],
    customAlerts:[
      {t:'Concordance: \u22652 axes drift together, 3+ days',d:'Fires Amber brief for clinician review.',tn:'amb',scope:'all'},
      {t:'Cycle gap > 38 days',d:'PCOS pack signal \u2192 Cycle axis.',tn:'amb',scope:'all'},
      {t:'Crisis language / flat affect detected',d:'Stops coaching \u2192 warm handoff (Red).',tn:'red',scope:'all'}],
    hist:[{dt:'Today',ev:'Amber brief drafted',dl:'3 axes concordant for 4 days.'},{dt:'Day 30',ev:'AI coaching · nutrition',dl:'Autonomous, within baseline.'},{dt:'Day 14',ev:'Baseline established',dl:'Cycle, CGM, voice, wearable.'},{dt:'Day 1',ev:'Enrolled · PCOS pack',dl:'Suspected PCOS, referred by GP.'}],
    meds:[{t:'Metformin 500mg BD',d:'2 doses missed (GI upset)',tn:'amb'},{t:'Vitamin D 1000 IU',d:'Daily',tn:'b'},{t:'Combined OCP',d:'Declined — trying to conceive',tn:'n'}],
    notes:[{t:'Day 34 · Attune brief',d:'2 of 3 Rotterdam criteria present; androgen labs pending.'},{t:'Day 1 · GP referral',d:'Irregular cycles 8 months, weight gain, acne.'}],
    labs:[{dt:'Day 14',glu:5.3,hba1c:39,lh:12.4,fsh:5.1,fai:7.8,shbg:28,test:2.1},{dt:'Day 1',glu:5.5,hba1c:40,lh:11.8,fsh:5.0,fai:7.2,shbg:30,test:1.9}],
    sNotes:[{t:'2 of 3 Rotterdam criteria',d:'Oligo-ovulation + biochemical hyperandrogenism.',tn:'amb'},{t:'Glucose trending up',d:'HbA1c 39, post-meal excursions.',tn:'amb'},{t:'Ovarian morphology unknown',d:'Ultrasound not yet done.',tn:'n'}],
    gaps:[{t:'Free androgen index repeat',d:'Confirm hyperandrogenism.',tn:'amb'},{t:'Pelvic ultrasound',d:'Optional 3rd criterion.',tn:'n'}],
    cycleS:[29,30,31,33,38,42],gluS:[7.0,7.1,7.2,7.6,8.4,9.1],moodS:[7.2,7.0,6.8,6.1,5.4,4.9],wtS:[74.2,74.5,74.6,74.9,75.1,75.4],
    rS:[29,30,31,33,38,42],cS:[7.0,7.1,7.2,7.6,8.4,9.1]},

  {id:'34389201',mrn:'GLP1-0088',name:'Dana R.',age:44,sex:'F',prog:'GLP-1',day:96,clin:'On-call clinician (handoff)',tx:'Semaglutide 1.0mg weekly',status:'Red · handoff logged',pri:'red',adh:'68%',streak:'2 / 7 days',lr:'Today, 06:48',na:'Crisis review',concDays:2,
    psi:{cyc:{raw:0,z:0.2},glu:{raw:1,z:1.3},mood:{raw:2,z:-2.8},sleep:{raw:2,z:-2.2},wt:{raw:1,z:-1.4},skin:{raw:0,z:0.1}},
    issues:[
      {t:'Crisis language detected',d:'Hopelessness phrasing in 06:48 check-in.',tn:'red'},
      {t:'Mood · voice affect  z −2.8',d:'Sharp drop in prosody + energy over 48h.',tn:'red'},
      {t:'Sleep collapse  z −2.2',d:'3.1h avg, fragmented (wearable).',tn:'amb'}],
    actions:[
      {t:'Warm handoff initiated',d:'On-call clinician paged 06:49.',tn:'red'},
      {t:'Coaching paused',d:'Engine de-escalated, no autonomous replies.',tn:'red'},
      {t:'Safety check call',d:'Confirm welfare within SLA.',tn:'amb'}],
    subs:[
      {t:'Voice check-in · Today 06:48',d:'"I don\u2019t see the point in any of this anymore."',tn:'red',kind:'voice',signal:'Crisis · Mood',full:'"I don\u2019t see the point in any of this anymore. The injections, the tracking, none of it is working and I\u2019m so tired. I just want it to stop." \u2014 Crisis classifier fired; coaching halted, warm handoff triggered.'},
      {t:'Wearable · Today',d:'Sleep 3.1h, resting HR elevated 12 bpm.',tn:'amb',kind:'device',signal:'Sleep · HRV',full:'Wearable synced: total sleep 3.1h with heavy fragmentation, resting heart rate elevated 12 bpm above baseline, HRV suppressed.'},
      {t:'Voice check-in · Yesterday',d:'"Nausea\u2019s bad, haven\u2019t really eaten, skipped my dose."',tn:'amb',kind:'voice',signal:'Adherence · Mood',full:'"The nausea\u2019s really bad this week. I haven\u2019t really eaten and I skipped my dose because of it. Feeling pretty low."'}],
    customAlerts:[{t:'Crisis language / flat affect',d:'Red \u2014 currently triggered.',tn:'red',scope:'all'},{t:'Coaching auto-pause on Red',d:'Engine stops, logs handoff.',tn:'red',scope:'all'}],
    hist:[{dt:'Today 06:49',ev:'Warm handoff logged',dl:'On-call clinician paged; coaching paused.'},{dt:'Today 06:48',ev:'Red tier · crisis classifier',dl:'Hopelessness language + affect crash.'},{dt:'Day 90',ev:'Amber brief · nausea',dl:'GI tolerance, dose held once.'},{dt:'Day 1',ev:'Enrolled · GLP-1 pack',dl:'Weight management programme.'}],
    meds:[{t:'Semaglutide 1.0mg weekly',d:'1 dose skipped (nausea)',tn:'amb'},{t:'Antiemetic PRN',d:'As needed',tn:'n'}],
    notes:[{t:'Today · Handoff note',d:'Crisis language; on-call clinician engaged, welfare check in progress.'}],
    labs:[{dt:'Day 84',glu:5.1,hba1c:37,lh:6.2,fsh:5.8,fai:2.1,shbg:52,test:1.1}],
    sNotes:[{t:'Acute safety concern',d:'Crisis pathway active.',tn:'red'},{t:'GI intolerance',d:'Nausea affecting intake + dosing.',tn:'amb'}],
    gaps:[{t:'Mental-health screen',d:'PHQ-9 on safety call.',tn:'red'}],
    cycleS:[28,28,29,28,29,29],gluS:[5.4,5.3,5.2,5.2,5.1,5.1],moodS:[6.4,6.2,5.8,5.1,3.8,2.6],wtS:[98.4,96.1,94.0,92.2,90.8,90.1],
    rS:[6.4,6.2,5.8,5.1,3.8,2.6],cS:[5.4,5.3,5.2,5.2,5.1,5.1]},

  {id:'77830412',mrn:'PCOS-0119',name:'Priya N.',age:33,sex:'F',prog:'PCOS',day:61,clin:'Attune AI · PCOS ConditionPack v3',tx:'Inositol + lifestyle',status:'Green · AI coaching',pri:'grn',adh:'97%',streak:'59 / 61 days',lr:'Today, 08:04',na:'On track',concDays:0,
    psi:{cyc:{raw:0,z:-0.4},glu:{raw:0,z:0.3},mood:{raw:0,z:0.6},sleep:{raw:0,z:0.2},wt:{raw:0,z:-0.5},skin:{raw:0,z:-0.3}},
    issues:[{t:'Within personal baseline',d:'No concordant drift. AI coaching autonomously.',tn:'grn'}],
    actions:[{t:'No clinician action',d:'Engine handling nutrition + cycle nudges.',tn:'n'}],
    subs:[{t:'Voice check-in · Today 08:04',d:'"Feeling good, cycle came right on time this month."',tn:'grn',kind:'voice',signal:'Cycle · Mood',full:'"Feeling good today. My cycle came right on time this month which is a relief, and I\u2019ve been sleeping well."'},{t:'CGM sync · Today',d:'Post-meal excursions within baseline.',tn:'grn',kind:'device',signal:'Glucose',full:'CGM stable; post-meal excursions within personal baseline band all week.'}],
    customAlerts:[],
    hist:[{dt:'Day 61',ev:'AI coaching · stable',dl:'Cycle regularised.'},{dt:'Day 1',ev:'Enrolled · PCOS pack',dl:'Cycle regularity goal.'}],
    meds:[{t:'Myo-inositol 2g BD',d:'Daily',tn:'b'}],
    notes:[{t:'Day 61 · Attune',d:'Cycle regular 3 months, no clinician input needed.'}],
    labs:[{dt:'Day 30',glu:5.0,hba1c:34,lh:7.1,fsh:5.6,fai:3.2,shbg:48,test:1.4}],
    sNotes:[{t:'Metabolic markers normal',d:'HbA1c 34.',tn:'grn'}],gaps:[],
    cycleS:[40,36,33,31,30,30],gluS:[6.4,6.2,6.0,5.9,5.8,5.7],moodS:[6.5,6.8,7.2,7.6,7.9,8.1],wtS:[69.1,68.6,68.2,67.9,67.7,67.5],
    rS:[40,36,33,31,30,30],cS:[6.4,6.2,6.0,5.9,5.8,5.7]},

  {id:'34389202',mrn:'GLP1-0071',name:'Marcus T.',age:51,sex:'M',prog:'GLP-1',day:120,clin:'Attune AI · GLP-1 ConditionPack v2',tx:'Tirzepatide 5mg weekly',status:'Green · AI coaching',pri:'grn',adh:'99%',streak:'118 / 120 days',lr:'Yesterday',na:'On track',concDays:0,
    psi:{cyc:{raw:0,z:0},glu:{raw:0,z:-0.6},mood:{raw:0,z:0.4},sleep:{raw:0,z:0.3},wt:{raw:0,z:-0.9},skin:{raw:0,z:0}},
    issues:[{t:'Within personal baseline',d:'Steady weight loss, good tolerance.',tn:'grn'}],
    actions:[{t:'No clinician action',d:'Engine coaching autonomously.',tn:'n'}],
    subs:[{t:'Voice check-in · Yesterday',d:'"Down another kilo, energy\u2019s great, no side effects."',tn:'grn',kind:'voice',signal:'Weight · Mood',full:'"Down another kilo this week, energy\u2019s great and no side effects to speak of. Really happy with how it\u2019s going."'}],
    customAlerts:[],
    hist:[{dt:'Day 120',ev:'AI coaching · stable',dl:'11kg total loss.'},{dt:'Day 1',ev:'Enrolled · GLP-1 pack',dl:'Weight management.'}],
    meds:[{t:'Tirzepatide 5mg weekly',d:'Well tolerated',tn:'b'}],
    notes:[{t:'Day 120 · Attune',d:'Excellent progress, autonomous.'}],
    labs:[{dt:'Day 90',glu:5.2,hba1c:36,lh:0,fsh:0,fai:0,shbg:0,test:0}],
    sNotes:[{t:'Metabolic improving',d:'HbA1c down to 36.',tn:'grn'}],gaps:[],
    cycleS:[0,0,0,0,0,0],gluS:[6.8,6.4,6.1,5.8,5.5,5.2],moodS:[6.9,7.2,7.5,7.7,7.9,8.0],wtS:[101,98.5,96.2,94.0,92.1,90.3],
    rS:[6.8,6.4,6.1,5.8,5.5,5.2],cS:[6.8,6.4,6.1,5.8,5.5,5.2]},

  {id:'88120033',mrn:'PCOS-0157',name:'Aisha B.',age:26,sex:'F',prog:'PCOS',day:22,clin:'Attune AI · PCOS ConditionPack v3',tx:'Lifestyle only',status:'Green · AI coaching',pri:'grn',adh:'95%',streak:'21 / 22 days',lr:'Today, 07:40',na:'On track',concDays:0,
    psi:{cyc:{raw:0,z:0.5},glu:{raw:0,z:0.2},mood:{raw:0,z:0.3},sleep:{raw:0,z:-0.4},wt:{raw:0,z:0.1},skin:{raw:0,z:0.4}},
    issues:[{t:'Within baseline (early)',d:'Baseline still forming — coaching, not scoring.',tn:'grn'}],
    actions:[{t:'No clinician action',d:'Baseline period, day 22 of 30.',tn:'n'}],
    subs:[{t:'Voice check-in · Today 07:40',d:'"Doing okay, still figuring out the routine."',tn:'grn',kind:'voice',signal:'Mood',full:'"Doing okay today. Still figuring out the routine but the daily check-ins are actually kind of nice."'}],
    customAlerts:[],
    hist:[{dt:'Day 22',ev:'Baseline forming',dl:'Scoring suppressed < 30 days.'},{dt:'Day 1',ev:'Enrolled · PCOS pack',dl:'New diagnosis.'}],
    meds:[{t:'None',d:'Lifestyle-first',tn:'n'}],
    notes:[{t:'Day 1 · Attune',d:'Recently diagnosed PCOS, lifestyle programme.'}],
    labs:[{dt:'Day 1',glu:5.4,hba1c:38,lh:10.2,fsh:5.4,fai:5.6,shbg:34,test:1.7}],
    sNotes:[{t:'Baseline pending',d:'< 30 days enrolled.',tn:'n'}],gaps:[],
    cycleS:[35,34,33,0,0,0],gluS:[6.0,5.9,5.8,0,0,0],moodS:[6.8,7.0,7.1,0,0,0],wtS:[71,70.8,70.6,0,0,0],
    rS:[35,34,33,33,33,33],cS:[6.0,5.9,5.8,5.8,5.8,5.8]},

  {id:'91450067',mrn:'GLP1-0102',name:'Leah S.',age:38,sex:'F',prog:'GLP-1',day:75,clin:'Attune AI · GLP-1 ConditionPack v2',tx:'Semaglutide 0.5mg weekly',status:'Green · AI coaching',pri:'grn',adh:'93%',streak:'70 / 75 days',lr:'Today, 08:20',na:'On track',concDays:0,
    psi:{cyc:{raw:0,z:-0.3},glu:{raw:0,z:0.4},mood:{raw:0,z:0.5},sleep:{raw:0,z:0.2},wt:{raw:0,z:-0.7},skin:{raw:0,z:0}},
    issues:[{t:'Within personal baseline',d:'Steady progress, good mood.',tn:'grn'}],
    actions:[{t:'No clinician action',d:'Engine coaching autonomously.',tn:'n'}],
    subs:[{t:'Voice check-in · Today 08:20',d:'"Clothes fitting better, feeling motivated."',tn:'grn',kind:'voice',signal:'Weight · Mood',full:'"Clothes are fitting better and I\u2019m feeling really motivated this week. Sticking to the walks."'}],
    customAlerts:[],
    hist:[{dt:'Day 75',ev:'AI coaching · stable',dl:'On track.'},{dt:'Day 1',ev:'Enrolled · GLP-1 pack',dl:'Weight management.'}],
    meds:[{t:'Semaglutide 0.5mg weekly',d:'Titrating',tn:'b'}],
    notes:[{t:'Day 75 · Attune',d:'Good response, autonomous.'}],
    labs:[{dt:'Day 60',glu:5.3,hba1c:38,lh:0,fsh:0,fai:0,shbg:0,test:0}],
    sNotes:[{t:'Metabolic stable',d:'HbA1c 38.',tn:'grn'}],gaps:[],
    cycleS:[30,30,29,30,30,29],gluS:[6.1,6.0,5.9,5.7,5.5,5.3],moodS:[6.6,6.9,7.1,7.3,7.5,7.6],wtS:[88,86.8,85.9,85.0,84.2,83.5],
    rS:[6.1,6.0,5.9,5.7,5.5,5.3],cS:[6.1,6.0,5.9,5.7,5.5,5.3]},

  {id:'62780199',mrn:'PCOS-0133',name:'Chloe M.',age:31,sex:'F',prog:'PCOS',day:88,clin:'Attune AI · PCOS ConditionPack v3',tx:'Metformin 500mg OD + lifestyle',status:'Green · AI coaching',pri:'grn',adh:'96%',streak:'85 / 88 days',lr:'Yesterday',na:'On track',concDays:0,
    psi:{cyc:{raw:0,z:0.3},glu:{raw:0,z:-0.5},mood:{raw:0,z:0.4},sleep:{raw:0,z:0.6},wt:{raw:0,z:-0.4},skin:{raw:0,z:-0.6}},
    issues:[{t:'Within personal baseline',d:'Cycle regular, skin clearing.',tn:'grn'}],
    actions:[{t:'No clinician action',d:'Engine coaching autonomously.',tn:'n'}],
    subs:[{t:'Voice check-in · Yesterday',d:'"Skin\u2019s the clearest it\u2019s been in ages."',tn:'grn',kind:'voice',signal:'Skin · Mood',full:'"My skin\u2019s the clearest it\u2019s been in ages and my cycle\u2019s been regular. Feeling really positive."'}],
    customAlerts:[],
    hist:[{dt:'Day 88',ev:'AI coaching · stable',dl:'Skin + cycle improved.'},{dt:'Day 1',ev:'Enrolled · PCOS pack',dl:'Acne + irregular cycles.'}],
    meds:[{t:'Metformin 500mg OD',d:'Well tolerated',tn:'b'}],
    notes:[{t:'Day 88 · Attune',d:'Good response, autonomous.'}],
    labs:[{dt:'Day 60',glu:5.1,hba1c:35,lh:8.4,fsh:5.7,fai:4.1,shbg:44,test:1.5}],
    sNotes:[{t:'Improving',d:'FAI down to 4.1.',tn:'grn'}],gaps:[],
    cycleS:[38,35,33,31,30,30],gluS:[6.2,6.0,5.8,5.6,5.4,5.2],moodS:[6.4,6.8,7.1,7.4,7.7,7.9],wtS:[76,75.4,74.9,74.5,74.1,73.8],
    rS:[38,35,33,31,30,30],cS:[6.2,6.0,5.8,5.6,5.4,5.2]},

  {id:'43560088',mrn:'GLP1-0064',name:'Ben C.',age:47,sex:'M',prog:'GLP-1',day:140,clin:'Attune AI · GLP-1 ConditionPack v2',tx:'Tirzepatide 7.5mg weekly',status:'Green · AI coaching',pri:'grn',adh:'98%',streak:'137 / 140 days',lr:'Today, 07:55',na:'On track',concDays:0,
    psi:{cyc:{raw:0,z:0},glu:{raw:0,z:-0.7},mood:{raw:0,z:0.3},sleep:{raw:0,z:0.4},wt:{raw:0,z:-1.0},skin:{raw:0,z:0}},
    issues:[{t:'Within personal baseline',d:'Sustained loss, plateau discussion pending.',tn:'grn'}],
    actions:[{t:'No clinician action',d:'Engine coaching autonomously.',tn:'n'}],
    subs:[{t:'Voice check-in · Today 07:55',d:'"Weight\u2019s plateaued a bit but feeling strong."',tn:'grn',kind:'voice',signal:'Weight',full:'"Weight\u2019s plateaued a little this fortnight but I feel strong and the gym\u2019s going well. Not worried."'}],
    customAlerts:[],
    hist:[{dt:'Day 140',ev:'AI coaching · stable',dl:'16kg total loss.'},{dt:'Day 1',ev:'Enrolled · GLP-1 pack',dl:'Weight management.'}],
    meds:[{t:'Tirzepatide 7.5mg weekly',d:'Well tolerated',tn:'b'}],
    notes:[{t:'Day 140 · Attune',d:'Excellent, autonomous.'}],
    labs:[{dt:'Day 120',glu:5.0,hba1c:35,lh:0,fsh:0,fai:0,shbg:0,test:0}],
    sNotes:[{t:'Metabolic excellent',d:'HbA1c 35.',tn:'grn'}],gaps:[],
    cycleS:[0,0,0,0,0,0],gluS:[6.5,6.1,5.8,5.4,5.1,5.0],moodS:[6.8,7.1,7.4,7.6,7.8,7.9],wtS:[112,108,104.5,101.2,98.6,96.4],
    rS:[6.5,6.1,5.8,5.4,5.1,5.0],cS:[6.5,6.1,5.8,5.4,5.1,5.0]},

  {id:'55980321',mrn:'PCOS-0148',name:'Grace O.',age:35,sex:'F',prog:'PCOS',day:52,clin:'Attune AI · PCOS ConditionPack v3',tx:'Metformin 850mg BD + lifestyle',status:'Green · AI coaching',pri:'grn',adh:'94%',streak:'49 / 52 days',lr:'Yesterday',na:'On track',concDays:0,
    psi:{cyc:{raw:0,z:-0.2},glu:{raw:0,z:0.5},mood:{raw:0,z:0.4},sleep:{raw:0,z:0.1},wt:{raw:0,z:-0.3},skin:{raw:0,z:0.2}},
    issues:[{t:'Within personal baseline',d:'Stable, no concordant drift.',tn:'grn'}],
    actions:[{t:'No clinician action',d:'Engine coaching autonomously.',tn:'n'}],
    subs:[{t:'Voice check-in · Yesterday',d:'"Bit tired but nothing unusual, cycle on track."',tn:'grn',kind:'voice',signal:'Mood · Cycle',full:'"A bit tired this week but nothing unusual for me. Cycle\u2019s on track and I\u2019ve been keeping up with the walks."'}],
    customAlerts:[],
    hist:[{dt:'Day 52',ev:'AI coaching · stable',dl:'On track.'},{dt:'Day 1',ev:'Enrolled · PCOS pack',dl:'Metabolic + cycle goals.'}],
    meds:[{t:'Metformin 850mg BD',d:'Well tolerated',tn:'b'}],
    notes:[{t:'Day 52 · Attune',d:'Stable, autonomous.'}],
    labs:[{dt:'Day 30',glu:5.2,hba1c:37,lh:9.1,fsh:5.5,fai:4.8,shbg:40,test:1.6}],
    sNotes:[{t:'Stable',d:'Within range.',tn:'grn'}],gaps:[],
    cycleS:[34,33,32,31,31,30],gluS:[6.0,5.9,5.8,5.7,5.6,5.5],moodS:[6.9,7.0,7.1,7.2,7.3,7.4],wtS:[80,79.5,79.1,78.8,78.5,78.2],
    rS:[34,33,32,31,31,30],cS:[6.0,5.9,5.8,5.7,5.6,5.5]}
  ];

  // Six concordance axes — Attune fuses these against each patient's own baseline.
  domainDefs = [
    {key:'cyc',name:'Cycle regularity',src:'Menstrual logging',type:'Active / Logged',weight:1.5},
    {key:'glu',name:'Post-meal glucose',src:'CGM · wearable',type:'Passive / Objective',weight:1.5},
    {key:'mood',name:'Mood · voice affect',src:'Daily voice check-in',type:'Passive / Voice AI',weight:1},
    {key:'sleep',name:'Sleep & HRV',src:'Wearable',type:'Passive / Objective',weight:1},
    {key:'wt',name:'Weight',src:'Connected scale',type:'Passive / Objective',weight:1},
    {key:'skin',name:'Skin changes',src:'Patient photo · vision-scored',type:'Active / Vision AI',weight:1}
  ];

  // PCOS ConditionPack: signal -> axis mapping + escalation thresholds
  rules = [
    {t:'\u22652 axes concordant for \u2265 3 days',d:'PCOS pack \u00b7 fires Amber brief',tn:'amb'},
    {t:'Crisis language or flat affect (voice)',d:'PCOS pack \u00b7 Red \u2014 stop coaching, warm handoff',tn:'red'},
    {t:'Cycle gap > 38 days',d:'Signal: cycle log \u2192 Cycle axis',tn:'amb'},
    {t:'Post-meal glucose z > +1.5',d:'Signal: CGM \u2192 Glucose axis',tn:'amb'},
    {t:'Voice affect z < \u22121.5',d:'Signal: voice check-in \u2192 Mood axis',tn:'amb'},
    {t:'Acne / hirsutism vision score rising',d:'Signal: photo \u2192 Skin axis',tn:'n'},
    {t:'Adherence < 80% (7-day streak)',d:'Signal: check-in + med log \u2192 nudge',tn:'amb'}
  ];

  admin = [
    {title:'Care team',desc:'Clinicians reviewing Attune briefs.',rows:[{l:'Dr. E. Petherson',r:'Lead clinician'},{l:'Dr. Rafael Ortiz',r:'Endocrinology'},{l:'On-call rota',r:'Crisis handoff'},{l:'Sana Malik',r:'Clinical pharmacist'}]},
    {title:'Attune engine',desc:'Longitudinal memory + concordance model.',rows:[{l:'Model',r:'Attune v3.1'},{l:'Baseline window',r:'30-day rolling'},{l:'Concordance',r:'\u22652 axes'},{l:'Voice AI',r:'Affect + transcript'}]},
    {title:'Voice agent',desc:'Delivers approved replies to patients.',rows:[{l:'Status',r:'Active'},{l:'Daily check-in',r:'07:00 local'},{l:'Reply delivery',r:'On clinician approve'},{l:'Crisis handoff',r:'< 2 min SLA'}]},
    {title:'ConditionPacks',desc:'Swap the pack, retarget the engine.',rows:[{l:'PCOS',r:'v3 \u00b7 active'},{l:'GLP-1 weight mgmt',r:'v2 \u00b7 active'},{l:'Menopause',r:'beta'},{l:'Heart failure',r:'roadmap'}]},
    {title:'Integrations',desc:'Wearables and data sources.',rows:[{l:'Apple Health / CGM',r:'Connected'},{l:'Connected scale',r:'Connected'},{l:'FHIR (EHR)',r:'Bi-directional'},{l:'Last sync',r:'2 min ago'}]},
    {title:'Data & compliance',desc:'Privacy and security.',rows:[{l:'Encryption',r:'AES-256'},{l:'Residency',r:'GCP Europe'},{l:'Consent',r:'Valid'},{l:'Voice retention',r:'Transcript + score'}]}
  ];

  TASKS = [
    {id:'t3',pid:'40291883',pt:'Sam K.',type:'review',title:'Review Amber brief \u2014 approve or edit plan',detail:'3 axes concordant 4 days; AI-drafted plan awaiting your approval.',due:'Today',pri:'amb'},
    {id:'t5',pid:'34389201',pt:'Dana R.',type:'message',title:'Crisis handoff \u2014 confirm welfare check',detail:'Warm handoff logged 06:49; safety call in progress.',due:'Today',pri:'red'},
    {id:'t7',pid:'40291883',pt:'Sam K.',type:'bloods',title:'Confirmatory androgen labs (if approving)',detail:'Free androgen index, fasting glucose, LH/FSH.',due:'This week',pri:'n'},
    {id:'t9',pid:'88120033',pt:'Aisha B.',type:'review',title:'Baseline completing at day 30',detail:'Scoring begins once 30-day baseline is set.',due:'This week',pri:'n'}
  ];

  TYPEMAP={review:{l:'Brief',c:'#0052A3',bg:'rgba(0,102,204,.10)'},bloods:{l:'Labs',c:'#B0382F',bg:'rgba(194,69,61,.10)'},result:{l:'Result',c:'#B0790F',bg:'rgba(232,154,43,.16)'},message:{l:'Handoff',c:'#2E5E8C',bg:'rgba(46,94,140,.10)'}};

  PTASKS = {
    '40291883':[{title:'Approved cycle-tracking coaching plan',by:'Dr. Petherson',date:'Day 20',type:'review'},{title:'Reviewed CGM baseline',by:'Dr. Ortiz',date:'Day 14',type:'result'}],
    '34389201':[{title:'Reviewed nausea brief, dose held',by:'Dr. Petherson',date:'Day 90',type:'review'}],
    '77830412':[{title:'Approved inositol coaching plan',by:'Dr. Petherson',date:'Day 10',type:'review'}]
  };

  RTM={};

  EXTRA = {
    '40291883':{
      comorbidities:['Insulin resistance (HOMA-IR 2.9)','Overweight (BMI 28)','Acne vulgaris'],
      allergies:'No known drug allergies.',
      vaccinations:'Up to date. Trying to conceive — teratogenic drugs avoided.',
      therapy:[
        {drug:'Lifestyle programme',period:'Day 1 to present',detail:'Attune AI coaching: nutrition, movement, cycle tracking. Autonomous within baseline.',status:'current'},
        {drug:'Metformin 500mg BD',period:'Day 8 to present',detail:'Started for insulin resistance. GI tolerance issues; 2 doses missed this week.',status:'current'}
      ]
    },
    '34389201':{
      comorbidities:['Obesity (BMI 34)','Low mood (monitoring)'],
      allergies:'No known drug allergies.',
      vaccinations:'Up to date.',
      therapy:[
        {drug:'Semaglutide 1.0mg weekly',period:'Day 1 to present',detail:'GLP-1 for weight management. GI intolerance; 1 dose skipped.',status:'current'},
        {drug:'Coaching paused',period:'Today',detail:'Engine de-escalated on Red tier; warm handoff to on-call clinician.',status:'stopped'}
      ]
    },
    '77830412':{comorbidities:['PCOS'],allergies:'No known drug allergies.',vaccinations:'Up to date.',therapy:[{drug:'Myo-inositol 2g BD + lifestyle',period:'Day 1 to present',detail:'AI coaching; cycle regularised.',status:'current'}]},
    '34389202':{comorbidities:['Obesity','Type 2 diabetes (remission)'],allergies:'No known drug allergies.',vaccinations:'Up to date.',therapy:[{drug:'Tirzepatide 5mg weekly + lifestyle',period:'Day 1 to present',detail:'Excellent response, 11kg loss.',status:'current'}]},
    '88120033':{comorbidities:['PCOS (new diagnosis)'],allergies:'No known drug allergies.',vaccinations:'Up to date.',therapy:[{drug:'Lifestyle programme',period:'Day 1 to present',detail:'Baseline still forming (day 22).',status:'current'}]},
    '91450067':{comorbidities:['Overweight'],allergies:'No known drug allergies.',vaccinations:'Up to date.',therapy:[{drug:'Semaglutide 0.5mg weekly',period:'Day 1 to present',detail:'Titrating, good response.',status:'current'}]},
    '62780199':{comorbidities:['PCOS','Acne'],allergies:'No known drug allergies.',vaccinations:'Up to date.',therapy:[{drug:'Metformin 500mg OD + lifestyle',period:'Day 1 to present',detail:'Skin + cycle improved.',status:'current'}]},
    '43560088':{comorbidities:['Obesity','Hypertension'],allergies:'No known drug allergies.',vaccinations:'Up to date.',therapy:[{drug:'Tirzepatide 7.5mg weekly',period:'Day 1 to present',detail:'16kg loss, sustained.',status:'current'}]},
    '55980321':{comorbidities:['PCOS','Insulin resistance'],allergies:'No known drug allergies.',vaccinations:'Up to date.',therapy:[{drug:'Metformin 850mg BD + lifestyle',period:'Day 1 to present',detail:'Stable, autonomous.',status:'current'}]}
  };

  monthLabels(n){const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];const now=new Date();const out=[];for(let i=n-1;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);out.push(m[d.getMonth()]);}return out;}
  niceMax(v){if(v<=10)return 10;if(v<=20)return 20;if(v<=30)return 30;if(v<=50)return 50;if(v<=100)return 100;return Math.ceil(v/50)*50;}

  trendChart(vals,o){
    const E=React.createElement;
    const w=460,h=200,padL=34,padR=16,padT=18,padB=30;
    const cw=w-padL-padR,ch=h-padT-padB;
    const rng=(o.yMax-o.yMin)||1;
    const Y=v=>padT+ch-((v-o.yMin)/rng)*ch;
    const step=vals.length>1?cw/(vals.length-1):0;
    const X=i=>padL+step*i;
    const kids=[];
    if(o.band){kids.push(E('rect',{key:'band',x:padL,y:Y(o.band[1]),width:cw,height:Math.max(0,Y(o.band[0])-Y(o.band[1])),fill:o.bandColor||'rgba(0,102,204,.13)'}));
      kids.push(E('text',{key:'bandt',x:padL+5,y:Y(o.band[1])+12,fontSize:8.5,fontWeight:700,fill:'#5E9E78',letterSpacing:'.3'},'TARGET'));}
    const ticks=[o.yMin,(o.yMin+o.yMax)/2,o.yMax];
    ticks.forEach((t,i)=>{kids.push(E('line',{key:'gl'+i,x1:padL,y1:Y(t),x2:w-padR,y2:Y(t),stroke:'#EDF2F9',strokeWidth:1}));
      kids.push(E('text',{key:'gt'+i,x:padL-7,y:Y(t)+3,textAnchor:'end',fontSize:9,fontWeight:600,fill:'#A8AFA8'},o.decimals?t.toFixed(1):Math.round(t)));});
    const lab=o.labels||[];
    lab.forEach((lb,i)=>{if(i===0||i===lab.length-1||i===Math.floor((lab.length-1)/2)){kids.push(E('text',{key:'xl'+i,x:X(i),y:h-9,textAnchor:i===0?'start':(i===lab.length-1?'end':'middle'),fontSize:9,fontWeight:600,fill:'#A8AFA8'},lb));}});
    const line=vals.map((v,i)=>(i?'L':'M')+X(i)+' '+Y(v)).join(' ');
    const area=line+' L '+X(vals.length-1)+' '+(padT+ch)+' L '+padL+' '+(padT+ch)+' Z';
    kids.push(E('path',{key:'area',d:area,fill:o.color,fillOpacity:.06}));
    kids.push(E('path',{key:'line',d:line,fill:'none',stroke:o.color,strokeWidth:2.4,strokeLinejoin:'round',strokeLinecap:'round'}));
    vals.forEach((v,i)=>{const lastOne=i===vals.length-1;kids.push(E('circle',{key:'pt'+i,cx:X(i),cy:Y(v),r:lastOne?4.5:3,fill:lastOne?o.color:'#fff',stroke:o.color,strokeWidth:2}));});
    const lv=vals[vals.length-1];
    kids.push(E('text',{key:'lv',x:X(vals.length-1)-6,y:Y(lv)-11,textAnchor:'end',fontSize:12,fontWeight:800,fill:o.color},o.decimals?lv.toFixed(1):lv));
    return E('svg',{viewBox:'0 0 '+w+' '+h,style:{width:'100%',height:'auto',display:'block'}},kids);
  }

  // ---- helpers ----
  TONE = {red:['#B0382F','rgba(194,69,61,.11)'],amb:['#B0790F','rgba(232,154,43,.16)'],grn:['#357A52','rgba(0,102,204,.14)'],b:['#0052A3','rgba(0,102,204,.10)'],teal:['#0052A3','rgba(0,102,204,.10)'],n:['#76807A','rgba(20,30,28,.06)']};
  toneLabel(tn){return {red:'Urgent',amb:'Monitor',grn:'Normal',b:'Active',n:'Info'}[tn]||'Info';}
  badge(label,tn){const [c,b]=this.TONE[tn]||this.TONE.n;return React.createElement('span',{style:{display:'inline-block',fontSize:'10.5px',fontWeight:700,padding:'4px 11px',borderRadius:'999px',color:c,background:b,whiteSpace:'nowrap',letterSpacing:'.2px'}},label);}
  tag(tn){return this.badge(this.toneLabel(tn),tn);}
  delta(v,suffix,invert){
    if(!v){return React.createElement('span',{style:{fontSize:'11px',color:'#9CA39C',fontWeight:700}},'steady');}
    const up=v>0; const bad=invert?!up:up; const col=bad?'#B0382F':'#357A52';
    const num=Math.abs(v)%1?v.toFixed(1):''+v;
    return React.createElement('span',{style:{fontSize:'11px',color:col,fontWeight:700,whiteSpace:'nowrap'}},(up?'▲ +':'▼ ')+num+(suffix||''));
  }
  seeded(n){let s=n%2147483647;if(s<=0)s+=2147483646;return()=>(s=s*16807%2147483647)/2147483647;}
  meterColor(m){return m<46?'#C2453D':m<62?'#E89A2B':'#52B1A4';}

  genDaily(p){
    const rnd=this.seeded(parseInt(p.mrn.slice(-5))||7);
    const base=p.pri==='red'?52:p.pri==='amb'?64:78;
    const days=[]; let flares=0,checks=0,actSum=0,sleepSum=0;
    for(let i=0;i<14;i++){
      const drift=p.pri==='red'?-(13-i)*0.0+ (i-7)*-0.9 : p.pri==='grn'? (i-7)*0.25 : 0;
      let meter=Math.round(base+drift+(rnd()*16-8));
      meter=Math.max(28,Math.min(92,meter));
      const checkIn=rnd()>(p.pri==='red'?0.28:0.1);
      const flare=p.pri==='red'?(i>=9&&rnd()>0.45):p.pri==='amb'?rnd()>0.92:false;
      const activity=Math.max(0,Math.min(3,Math.round((meter-30)/20+(rnd()*1.2-0.6))));
      const sleep=+(5.4+(meter/100)*2.6+(rnd()-0.5)).toFixed(1);
      if(flare)flares++; if(checkIn)checks++; actSum+=activity; sleepSum+=sleep;
      days.push({meter,checkIn,flare,activity,sleep,day:i});
    }
    return {days,flares,checks,actAvg:actSum/14,sleepAvg:sleepSum/14};
  }

  DRUGCLASS = {Adalimumab:'TNF inhibitor · biologic',Etanercept:'TNF inhibitor · biologic',Secukinumab:'IL-17A inhibitor · biologic',Belimumab:'BLyS inhibitor · biologic',Rituximab:'Anti-CD20 · B-cell biologic',Abatacept:'T-cell co-stim · biologic',Baricitinib:'JAK 1/2 inhibitor · tsDMARD',Tofacitinib:'JAK inhibitor · tsDMARD',Methotrexate:'csDMARD · anchor',MTX:'csDMARD · anchor',Hydroxychloroquine:'csDMARD',HCQ:'csDMARD',Prednisone:'Corticosteroid',Naproxen:'NSAID'};
  FINGERS = ['Thumb','Index','Middle','Ring','Little'];

  DRUGCLASS = {Metformin:'Insulin-sensitiser',Semaglutide:'GLP-1 receptor agonist',Tirzepatide:'GIP/GLP-1 agonist','Myo-inositol':'Insulin-sensitiser',Inositol:'Insulin-sensitiser','Vitamin':'Supplement','Combined':'Combined oral contraceptive',Antiemetic:'Anti-nausea',None:'Lifestyle only'};
  AXES = [['cyc','Cycle'],['glu','Glucose'],['mood','Mood'],['sleep','Sleep'],['wt','Weight'],['skin','Skin']];

  buildDetail(p,dy){
    const labs6=['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Now'];
    const isPCOS=p.prog==='PCOS';
    const nz=a=>a.filter(x=>x||x===0).filter(x=>x!==0);
    const gluV=p.gluS.filter(x=>x);
    const moodV=p.moodS.filter(x=>x);
    const wtV=p.wtS.filter(x=>x);
    const cycV=p.cycleS.filter(x=>x);
    const gluTrend=this.trendChart(gluV,{color:'#C48A1A',yMin:4,yMax:this.niceMax(Math.max.apply(null,gluV)),band:[4,7.8],bandColor:'rgba(0,102,204,.13)',labels:labs6.slice(-gluV.length),decimals:true});
    const cycleTrend=cycV.length?this.trendChart(cycV,{color:'#8E5BC4',yMin:20,yMax:50,band:[24,35],bandColor:'rgba(0,102,204,.13)',labels:labs6.slice(-cycV.length),decimals:false}):null;
    const moodTrend=this.trendChart(moodV,{color:'#0066CC',yMin:0,yMax:10,band:[6,10],bandColor:'rgba(0,102,204,.10)',labels:labs6.slice(-moodV.length),decimals:true});
    const wtTrend=this.trendChart(wtV,{color:'#2E5E8C',yMin:Math.floor(Math.min.apply(null,wtV)-2),yMax:Math.ceil(Math.max.apply(null,wtV)+2),labels:labs6.slice(-wtV.length),decimals:true});
    const nAxes=this.domainDefs.filter(d=>(p.psi[d.key]&&p.psi[d.key].raw>=1)).length;
    const lastCyc=cycV.length?cycV[cycV.length-1]:null, baseCyc=cycV.length?cycV[0]:null;
    const lastGlu=gluV[gluV.length-1];
    const anTiles=[
      {k:'Concordant axes',v:nAxes+' / 6',sub:'moving together',col:nAxes>=2?'#C2453D':nAxes===1?'#C9821C':'#357A52'},
      isPCOS?{k:'Cycle length',v:lastCyc+' d',sub:'baseline '+baseCyc+' d',col:lastCyc>38?'#C2453D':lastCyc>35?'#C9821C':'#357A52'}:{k:'Weight',v:wtV[wtV.length-1]+' kg',sub:(wtV[wtV.length-1]-wtV[0]).toFixed(1)+' kg since day 1',col:'#357A52'},
      {k:'Post-meal glucose',v:lastGlu,sub:'mmol/L · 2-h peak',col:lastGlu>=8.5?'#C2453D':lastGlu>=7.8?'#C9821C':'#357A52'},
      {k:'Check-in streak',v:p.streak.split(' ')[0],sub:'voice check-ins',col:'#0066CC'}
    ];
    const meds=(p.meds||[]).map(m=>{const first=(m.t.split(' ')[0]||'').replace(/[^A-Za-z-]/g,'');return {name:m.t,cls:this.DRUGCLASS[first]||'Therapy',note:m.d,tn:m.tn,tagEl:this.tag(m.tn)};});
    const monitoring=[
      {test:'Daily voice check-in',detail:'Affect + transcript, extracted signals',freq:'Daily 07:00',status:'Active',tn:'grn'},
      {test:'CGM + connected scale',detail:'Post-meal glucose, weight, sleep, HRV',freq:'Continuous',status:'Syncing',tn:'grn'},
      {test:'Photo submission',detail:'Vision-scored acne / hirsutism',freq:'Weekly',status:isPCOS?'On schedule':'Not required',tn:isPCOS?'grn':'n'}
    ];
    monitoring.forEach(mo=>{mo.statusEl=this.badge(mo.status,mo.tn);});
    return {gluTrend,cycleTrend,moodTrend,wtTrend,anTiles,meds,monitoring,isPCOS,nAxes};
  }

  calcPSI(p){
    let total=0,max=0;
    this.domainDefs.forEach(d=>{
      if(this.state.domainOff[d.key])return;
      const w=this.wOf(d);
      const raw=d.binary?(p.psi.flare?2:0):(p.psi[d.key]?p.psi[d.key].raw:0);
      total+=raw*w; max+=2*w;
    });
    return {total:Math.round(total*10)/10,max:Math.round(max*10)/10};
  }
  tierOf(total,max){const pct=max>0?total/max:0;return pct>.7?'cr':pct>.51?'hi':pct>.26?'md':'lo';}
  tierLabel(t){return {lo:'Within baseline',md:'Concordant',hi:'High drift',cr:'Crisis'}[t];}
  tierColor(t){return {lo:'#357A52',md:'#C9821C',hi:'#C2453D',cr:'#C2453D'}[t];}
  tierTone(t){return (t==='cr'||t==='hi')?'red':t==='md'?'amb':'grn';}

  // ---- clinical decision support engine (deterministic, guideline-linked) ----
  // ---- Attune brief engine: what needs a clinician (deterministic) ----
  cds(p){
    const recs=[];
    const fn=p.name.split(' ')[0];
    const add=(id,sev,cat,title,rationale,evidence,action)=>recs.push({id:p.id+'-'+id,sev,cat,title,rationale,evidence,action,pid:p.id,pName:p.name,pDx:p.prog+' \u00b7 day '+p.day});
    if(p.pri==='red'){
      add('crisis','red','safety','Crisis pathway active \u2014 coaching paused','Voice check-in triggered the crisis classifier (hopelessness language, affect z '+p.psi.mood.z.toFixed(1)+'). The engine de-escalated, stopped coaching, and logged a warm handoff to the on-call clinician.','Attune safety policy','Confirm the welfare check and document the outcome');
      return recs;
    }
    if(p.pri==='amb'){
      if(p.prog==='PCOS'){
        add('brief','amb','t2t','Amber brief ready \u2014 '+p.concDays+' days concordant','Cycle (z '+p.psi.cyc.z.toFixed(1)+'), post-meal glucose (z '+p.psi.glu.z.toFixed(1)+') and voice affect (z '+p.psi.mood.z.toFixed(1)+') are drifting together against '+fn+'\u2019s own baseline.','Attune concordance','Approve, edit, or request labs on the drafted plan');
        add('labs','info','mon','Confirmatory androgen labs available','2 of 3 Rotterdam criteria are present. A free androgen index with LH/FSH would confirm biochemical hyperandrogenism.','Rotterdam 2003','Request labs from the brief');
      } else {
        add('brief','amb','t2t','Amber brief ready \u2014 tolerance drift','GI tolerance and mood axes are drifting together. Review the drafted dose-hold plan before it is delivered.','Attune concordance','Approve or edit the drafted plan');
      }
    }
    const adh=parseInt(p.adh)||100;
    if(adh<80) add('adh','amb','mon','Adherence below target','Logged adherence '+p.adh+' with a broken check-in streak. The voice agent can escalate a supportive nudge on your approval.','Attune adherence','Approve an adherence nudge');
    return recs;
  }

  lineChart(vals,color,h){
    const w=300,pad=8,cw=w-pad*2,ch=(h||72)-pad*2;
    const mn=Math.min(...vals),mx=Math.max(...vals),rng=(mx-mn)||1;
    const step=vals.length>1?cw/(vals.length-1):0;
    const pts=vals.map((v,i)=>[pad+step*i,pad+ch-((v-mn)/rng)*ch]);
    const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
    const area=line+' L '+(pad+cw)+' '+(pad+ch)+' L '+pad+' '+(pad+ch)+' Z';
    const last=pts[pts.length-1];const E=React.createElement;
    return E('svg',{viewBox:'0 0 '+w+' '+(h||72),preserveAspectRatio:'none',style:{width:'100%',height:(h||72)+'px',display:'block'}},
      E('path',{d:area,fill:color,fillOpacity:0.07}),
      E('path',{d:line,fill:'none',stroke:color,strokeWidth:2,strokeLinejoin:'round',strokeLinecap:'round',vectorEffect:'non-scaling-stroke'}),
      E('circle',{cx:last[0],cy:last[1],r:2.6,fill:'#fff',stroke:color,strokeWidth:2})
    );
  }
  spark(vals,color){
    const w=70,h=26,pad=3,cw=w-pad*2,ch=h-pad*2;
    const mn=Math.min(...vals),mx=Math.max(...vals),rng=(mx-mn)||1;
    const step=cw/(vals.length-1);
    const pts=vals.map((v,i)=>[pad+step*i,pad+ch-((v-mn)/rng)*ch]);
    const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
    const last=pts[pts.length-1];const E=React.createElement;
    return E('svg',{viewBox:'0 0 '+w+' '+h,preserveAspectRatio:'none',style:{width:'100%',height:'24px',display:'block',overflow:'visible'}},
      E('path',{d:line,fill:'none',stroke:color,strokeWidth:1.6,strokeLinejoin:'round',strokeLinecap:'round',vectorEffect:'non-scaling-stroke'}),
      E('circle',{cx:last[0],cy:last[1],r:1.6,fill:color,vectorEffect:'non-scaling-stroke'})
    );
  }

  seroTable(p){
    const E=React.createElement;
    const th=(t)=>E('th',{style:{padding:'10px 14px',textAlign:'left',fontSize:'9.5px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'#A0A89F',background:'#FBFAF7',borderBottom:'1px solid #EDF2F9',whiteSpace:'nowrap'}},t);
    const lc=(t,v)=>{if(t==='crp')return v>=50?'#C2453D':v>=20?'#C9821C':'#5C645E';if(t==='hb')return v<11?'#C2453D':v<12?'#C9821C':'#5C645E';if(t==='alt'||t==='ast')return v>=50?'#C2453D':v>=40?'#C9821C':'#5C645E';return '#5C645E';};
    const fR=v=>typeof v==='string'?v:(v>=14?v+' IU/mL':'<14 IU/mL');
    const fC=v=>typeof v==='string'?v+' U/mL':(v>=7?v+' U/mL':'<7 U/mL');
    const td=(v,col,bold)=>E('td',{style:{padding:'11px 14px',fontSize:'12px',fontWeight:bold?700:500,color:col||'#5C645E',borderBottom:'1px solid #F1EFE8',whiteSpace:'nowrap'}},v);
    const dash=v=>(v===0||v===undefined||v===null)?'—':v;
    const head=E('thead',null,E('tr',null,['Date','Fasting glucose','HbA1c','LH','FSH','Free androgen index','SHBG','Testosterone'].map((t,i)=>th(t))));
    const body=E('tbody',null,(p.labs||[]).map((s,i)=>E('tr',{key:i},
      td(s.dt,'#0D2B3E',true),td(dash(s.glu)+(s.glu?' mmol/L':''),s.glu>=5.6?'#C9821C':'#5C645E',true),td(dash(s.hba1c)+(s.hba1c?' mmol/mol':''),s.hba1c>=42?'#C9821C':'#5C645E'),td(dash(s.lh)),td(dash(s.fsh)),td(dash(s.fai),s.fai>=5?'#C9821C':'#5C645E'),td(dash(s.shbg)),td(dash(s.test)+(s.test?' nmol/L':''),s.test>=2?'#C9821C':'#5C645E')
    )));
    return E('table',{style:{width:'100%',borderCollapse:'collapse',minWidth:'720px'}},head,body);
  }

  // ---- actions ----
  go(v){this.setState({view:v});window.scrollTo({top:0});}
  open(id,tab){this.setState({view:'patient',pid:id,tab:tab||'overview',imgSel:0});window.scrollTo({top:0});}
  tabForType(type){return {result:'serology',bloods:'serology',message:'overview',review:'overview'}[type]||'overview';}
  curPatient(){return this.P.find(x=>x.id===this.state.pid)||this.P[0];}
  openModal(kind){this.setState({modal:kind,bloodSel:{},noteDraft:''});}
  closeModal(){this.setState({modal:null,modalNote:null});}
  viewNote(n){this.setState({modalNote:n});}
  toggleBlood(k){const b={...this.state.bloodSel};b[k]=!b[k];this.setState({bloodSel:b});}
  placeBloodOrder(){const sel=Object.keys(this.state.bloodSel).filter(k=>this.state.bloodSel[k]);if(!sel.length){this.toast('Select at least one test to order');return;}const p=this.curPatient();const d=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short'});const task={id:'bl-'+Date.now(),pid:p.id,pt:p.name,type:'result',title:'Review new bloods: '+sel.join(', '),detail:'Ordered '+d+' · '+sel.length+' test'+(sel.length>1?'s':'')+', results outstanding.',due:'This week',pri:'amb'};this.setState({addedTasks:[task,...this.state.addedTasks],modal:null,bloodSel:{}});this.toast(sel.length+' test'+(sel.length>1?'s':'')+' ordered — result task created');}
  addNote(){const t=(this.state.noteDraft||'').trim();if(!t){this.toast('Write a note before saving');return;}const p=this.curPatient();const an={...this.state.addedNotes};const arr=(an[p.id]||[]).slice();const d=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short'});arr.unshift({t:d+' · Dr. Petherson',d:t.length>70?t.slice(0,70)+'…':t,full:t,added:true});an[p.id]=arr;this.setState({addedNotes:an,noteDraft:'',modal:null});this.toast('Clinic note saved');}
  discharge(){const oc={...this.state.offCaseload};oc[this.state.pid]=true;this.setState({offCaseload:oc,view:'worklist',modal:null});this.toast('Patient discharged from caseload');window.scrollTo({top:0});}
  addToCaseload(id){const oc={...this.state.offCaseload};delete oc[id];this.setState({offCaseload:oc});this.toast('Patient added to your caseload');}
  toggleTask(id){const d={...this.state.taskDone};d[id]=!d[id];this.setState({taskDone:d});this.toast(d[id]?'Task completed':'Task reopened');}
  toast(m){this.setState({toastShow:true,toastMsg:m});clearTimeout(this._t);this._t=setTimeout(()=>this.setState({toastShow:false}),2200);}
  cdsAct(id,kind,action){const d={...this.state.cdsState};d[id]=kind;this.setState({cdsState:d});this.toast(kind==='accepted'?('Added to your tasks: '+action):'Recommendation dismissed and logged to the audit trail');}
  wOf(d){const v=this.state.domainW[d.key];return (v===undefined||v===null)?d.weight:v;}
  setW(key,delta){const w={...this.state.domainW};const def=this.domainDefs.find(x=>x.key===key);const cur=(w[key]===undefined||w[key]===null)?def.weight:w[key];let nv=Math.round((cur+delta)*2)/2;nv=Math.max(0,Math.min(3,nv));w[key]=nv;this.setState({domainW:w});}
  setDraft(k,v){const d={...this.state.ruleDraft};d[k]=v;this.setState({ruleDraft:d});}
  addRule(){const st=this.state;const d=st.ruleDraft;const verbWin=/increases/.test(d.op)?(' in '+d.win):'';const title=d.metric+' '+d.op+' '+d.val+verbWin;
    if(d.scope==='cohort'){const arr=st.cohortRules.slice();arr.push({t:title,d:'All patients · '+d.win+' window',tn:'amb',custom:true});this.setState({cohortRules:arr});this.toast('Custom rule added across the cohort');}
    else{const pid=st.alertPid;const pr={...st.patientRules};const arr=(pr[pid]||[]).slice();arr.push({t:title,d:'Patient-specific · '+d.win+' window',tn:'amb',scope:'patient',custom:true});pr[pid]=arr;this.setState({patientRules:pr});this.toast('Custom rule added for this patient');}}
  doBoost(name){const b={...this.state.billBoost};b[name]=true;this.setState({billBoost:b});this.toast('Review time logged — additional RTM code now billable');}
  doCharge(name){const c={...this.state.billCharged};c[name]=true;this.setState({billCharged:c});this.toast('Encounter charged and queued for submission');}

  navStyle(active){return 'display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;border:none;cursor:pointer;width:100%;text-align:left;font-size:13px;font-weight:600;transition:.15s;'+(active?'background:rgba(196,245,232,.13);color:#B3D9FF':'background:transparent;color:rgba(255,255,255,.62)');}
  kpiStyle(active){return 'text-align:left;background:#fff;border:1.5px solid '+(active?'#0066CC':'#ECE7DD')+';border-radius:16px;padding:18px 20px;cursor:pointer;transition:.18s;box-shadow:'+(active?'0 0 0 4px rgba(0,102,204,.09),0 1px 2px rgba(13,43,62,.04)':'0 1px 2px rgba(13,43,62,.04),0 6px 18px rgba(13,43,62,.04)')+';';}
  filtStyle(active){return 'font-size:12px;font-weight:700;padding:8px 17px;border-radius:999px;border:1.5px solid '+(active?'#0D2B3E':'#E4DFD4')+';background:'+(active?'#0D2B3E':'#fff')+';color:'+(active?'#fff':'#6B746E')+';cursor:pointer;letter-spacing:.2px;transition:.15s;';}
  tabStyle(active){return 'padding:14px 16px;font-size:12.5px;font-weight:'+(active?'800':'600')+';color:'+(active?'#0D2B3E':'#979C90')+';cursor:pointer;border:none;background:transparent;border-bottom:2.5px solid '+(active?'#0066CC':'transparent')+';white-space:nowrap;';}

  progChip(prog){return 'display:inline-block;font-size:10px;font-weight:800;letter-spacing:.4px;padding:3px 9px;border-radius:6px;white-space:nowrap;'+(prog==='PCOS'?'color:#8E5BC4;background:rgba(142,91,196,.12)':'color:#2E5E8C;background:rgba(46,94,140,.10)');}

  renderVals(){
    const st=this.state;
    const accent='#0066CC';
    const titles={worklist:'Patient worklist',patient:'Patient record',alerts:'ConditionPack configuration',admin:'Administration',tasks:'Review queue'};

    // counts (on-caseload only)
    const onCase=this.P.filter(p=>!st.offCaseload[p.id]);
    const cU=onCase.filter(p=>p.pri==='red').length, cR=onCase.filter(p=>p.pri==='amb').length, cS=onCase.filter(p=>p.pri==='grn').length;
    const offCaseList=this.P.filter(p=>st.offCaseload[p.id]).map(p=>({id:p.id,name:p.name,sub:'MRN '+p.mrn+' · '+p.dx,onAdd:()=>this.addToCaseload(p.id)}));

    const navStyles={
      navStyleWorklist:this.navStyle(st.view==='worklist'),navStyleTasks:this.navStyle(st.view==='tasks'),navStylePatient:this.navStyle(st.view==='patient'),
      navStyleBilling:this.navStyle(st.view==='billing'),navStyleAlerts:this.navStyle(st.view==='alerts'),navStyleAdmin:this.navStyle(st.view==='admin'),navStyleCds:this.navStyle(st.view==='cds'),
      goWorklist:()=>this.go('worklist'),goTasks:()=>this.go('tasks'),goPatient:()=>this.go('patient'),goBilling:()=>this.go('billing'),goAlerts:()=>this.go('alerts'),goAdmin:()=>this.go('admin'),goCds:()=>this.go('cds')
    };

    // ----- clinical decision support view-models -----
    const catMeta={safety:{l:'Safety',c:'#B0382F',bg:'rgba(194,69,61,.10)'},t2t:{l:'Brief',c:'#2E5E8C',bg:'rgba(46,94,140,.10)'},mon:{l:'Adherence',c:'#B0790F',bg:'rgba(232,154,43,.16)'}};
    const sevCol={red:'#C2453D',amb:'#E89A2B',info:'#7FB1A6'};
    const sevRank={red:0,amb:1,info:2};
    const acceptStyle='font-size:11.5px;font-weight:700;color:#0052A3;background:rgba(0,102,204,.10);border:none;border-radius:999px;padding:7px 15px;cursor:pointer;white-space:nowrap';
    const dismissStyle='width:30px;height:30px;border-radius:50%;border:1px solid #E4DFD4;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#A7ACA3;transition:.15s';
    const evStyle='font-size:10px;font-weight:700;letter-spacing:.3px;color:#5C645E;background:#F2F0E9;border:1px solid #E4DFD4;border-radius:6px;padding:3px 8px;white-space:nowrap';
    const baseVM=(r,showPatient)=>{
      const stt=st.cdsState[r.id];const resolved=!!stt;const cm=catMeta[r.cat];
      return {
        id:r.id,title:r.title,rationale:r.rationale,evidence:r.evidence,
        catL:cm.l,catStyle:'font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;padding:4px 9px;border-radius:7px;white-space:nowrap;color:'+cm.c+';background:'+cm.bg,
        stripe:sevCol[r.sev],evStyle,acceptStyle,dismissStyle,
        pName:r.pName,pDx:r.pDx,showPatient:!!showPatient,onOpen:()=>this.open(r.pid),
        resolved,actionable:!resolved,
        statusEl:resolved?this.badge(stt==='accepted'?'Actioned':'Dismissed',stt==='accepted'?'grn':'n'):null,
        rowStyle:'display:grid;grid-template-columns:4px 116px 1fr auto;gap:15px;align-items:stretch;padding:16px 20px 16px 14px;border-bottom:1px solid #F2EEE5;transition:.15s;'+(resolved?'opacity:.5':''),
        onAccept:()=>this.cdsAct(r.id,'accepted',r.action),onDismiss:()=>this.cdsAct(r.id,'dismissed')
      };
    };
    const cdsVM=r=>baseVM(r,true);
    const cdsVMrec=r=>{const v=baseVM(r,false);v.rowStyle='display:grid;grid-template-columns:4px 116px 1fr auto;gap:14px;align-items:stretch;padding:15px 2px;border-bottom:1px solid #EDF2F9;'+(v.resolved?'opacity:.5':'');return v;};
    const allRecs=[];this.P.forEach(pp=>this.cds(pp).forEach(r=>allRecs.push(r)));
    const cdsActiveAll=allRecs.filter(r=>!st.cdsState[r.id]);
    const cdsSuggestions=cdsActiveAll.slice().sort((a,b)=>sevRank[a.sev]-sevRank[b.sev]).map(cdsVM);
    const cdsSuggestSub=cdsActiveAll.length+' AI-drafted brief'+(cdsActiveAll.length===1?'':'s')+' awaiting review across your caseload. Approve to add the action to your queue and deliver the reply via the Attune voice agent, or dismiss with an audited reason.';
    // accepted recommendations flow into the single task queue
    const dueForSev={red:'Today',amb:'This week',info:'This week'};
    const acceptedCdsTasks=allRecs.filter(r=>st.cdsState[r.id]==='accepted').map(r=>({id:'cds-'+r.id,pid:r.pid,pt:r.pName,type:(r.cat==='t2t')?'review':(/order|fbc|igg|screen|panel|bloods|haematinics|repeat crp|infection/i.test(r.action)?'bloods':'review'),title:r.action,detail:r.rationale,due:dueForSev[r.sev]||'This week',pri:(r.sev==='red'?'red':(r.sev==='info'?'n':'amb')),fromCds:true}));
    const allTasks=this.TASKS.concat(st.addedTasks).concat(acceptedCdsTasks);

    // ----- worklist rows -----
    const prRank={red:0,amb:1,grn:2};
    let list=this.P.slice().filter(p=>!st.offCaseload[p.id]).sort((a,b)=>prRank[a.pri]-prRank[b.pri]);
    if(st.filter!=='all')list=list.filter(p=>p.pri===st.filter);
    if(st.q){const q=st.q.toLowerCase();list=list.filter(p=>(p.name+' '+p.mrn).toLowerCase().includes(q));}
    const stripeOf={red:'#C2453D',amb:'#E89A2B',grn:'#52B1A4'};
    const statusTone={'Red · handoff logged':'red','Amber · brief ready':'amb','Green · AI coaching':'grn'};

    const rows=list.map(p=>{
      const ps=this.calcPSI(p);const tier=this.tierOf(ps.total,ps.max);const tcol=this.tierColor(tier);
      const dy=this.genDaily(p);
      const why=p.issues.slice(0,3);
      const psiMini=this.domainDefs.filter(d=>!st.domainOff[d.key]).map(d=>{
        const w=this.wOf(d);
        const raw=d.binary?(p.psi.flare?2:0):(p.psi[d.key]?p.psi[d.key].raw:0);
        const wv=raw*w;const mx=2*w;
        return {name:d.name.split(' ')[0],pct:mx?Math.round(wv/mx*100):0,color:raw>=2?'#C2453D':raw>=1?'#E89A2B':'#9CCBBF',val:wv.toFixed(1)};
      });
      const expanded=st.expanded===p.id;
      return {
        id:p.id,name:p.name,sub:p.mrn+' · '+p.age+p.sex+' · '+p.prog+' · day '+p.day,statusEl:this.badge(p.status,statusTone[p.status]||'n'),
        progLabel:p.prog,progStyle:this.progChip(p.prog),dayLabel:'Day '+p.day,adh:p.adh,streak:p.streak,adhColor:parseInt(p.adh)<80?'#C2453D':parseInt(p.adh)<90?'#C9821C':'#357A52',
        psiPct:ps.max?Math.round(ps.total/ps.max*100):0,psiColor:tcol,psiNum:ps.total+' / '+ps.max,psiTier:this.tierLabel(tier),
        spark:this.spark(dy.days.map(d=>d.meter),this.meterColor(dy.days[dy.days.length-1].meter)),
        stripe:stripeOf[p.pri],wrapStyle:'background:'+(expanded?'#FCFBF8':'#fff'),
        actLabel:p.pri==='red'?'Review':p.pri==='amb'?'Review':'Open',
        actStyle:'font-size:11.5px;font-weight:700;padding:7px 15px;border-radius:999px;border:none;cursor:pointer;white-space:nowrap;'+(p.pri==='red'?'background:#C2453D;color:#fff':p.pri==='amb'?'background:#0D2B3E;color:#fff':'background:#F2F0E9;color:#46544F'),
        chevron:expanded?'rotate(180deg)':'rotate(0deg)',expanded,why,psiMini,
        onOpen:()=>this.open(p.id),
        onAct:(e)=>{e.stopPropagation();this.open(p.id);},
        onToggle:(e)=>{e.stopPropagation();this.setState({expanded:expanded?null:p.id});}
      };
    });
    rows.forEach(r=>r.why=r.why.map(w=>({t:w.t,d:w.d,dot:w.tn==='red'?'#C2453D':w.tn==='amb'?'#E89A2B':'#9CCBBF'})));

    const kpi=(label,value,meta,dot,key)=>({label,value,meta,dot,onClick:()=>this.setState({filter:key,expanded:null}),style:this.kpiStyle(st.filter===key)});
    const kpis=[
      kpi('Red',cU,'Crisis · handoff','#C2453D','red'),
      kpi('Amber',cR,'Brief awaiting review','#E89A2B','amb'),
      kpi('Green',cS,'AI coaching autonomously','#52B1A4','grn'),
      kpi('All patients',onCase.length,'At-home caseload','#0D2B3E','all')
    ];
    const filters=[['all','All ('+onCase.length+')'],['red','Red ('+cU+')'],['amb','Amber ('+cR+')'],['grn','Green ('+cS+')']].map(([k,l])=>({label:l,onClick:()=>this.setState({filter:k,expanded:null}),style:this.filtStyle(st.filter===k)}));

    // ----- current patient -----
    const p=this.P.find(x=>x.id===st.pid)||this.P[0];
    const ps=this.calcPSI(p);const tier=this.tierOf(ps.total,ps.max);const tcol=this.tierColor(tier);
    const dy=this.genDaily(p);
    const drivers={cyc:'Cycle log',glu:'CGM 2-h peaks',mood:'Voice affect',sleep:'Wearable HRV',wt:'Connected scale',skin:'Photo vision score'};
    const psiDomains=this.domainDefs.filter(d=>!st.domainOff[d.key]).map(d=>{
      const w=this.wOf(d);
      if(d.binary){const f=p.psi.flare;const wv=f?2*w:0;const mx=2*w;return {name:d.name,driver:f?'Flare reported':'No flare reported',pct:mx?Math.round(wv/mx*100):0,color:f?'#C2453D':'#9CCBBF',val:wv.toFixed(1),z:f?'2.0':'0.0'};}
      const dd=p.psi[d.key]||{raw:0,z:0};const wv=dd.raw*w;const mx=2*w;const col=dd.raw>=2?'#C2453D':dd.raw>=1?'#E89A2B':'#9CCBBF';
      return {name:d.name,driver:drivers[d.key],pct:mx?Math.round(wv/mx*100):0,color:col,val:wv.toFixed(1),z:dd.z.toFixed(1)};
    });
    const trendTxt=(()=>{const a=dy.days.slice(0,3).reduce((s,d)=>s+d.meter,0)/3,b=dy.days.slice(-3).reduce((s,d)=>s+d.meter,0)/3;const diff=Math.round(b-a);return diff<=-6?'declining':diff>=6?'improving':'broadly stable';})();
    const dailyDays=dy.days.map((d,i)=>({
      barH:Math.round(d.meter*0.9),barColor:this.meterColor(d.meter),flare:d.flare,dotColor:d.checkIn?'#0066CC':'#E1DED6',
      lbl:i===0?'-14d':i===13?'now':(i%3===0?'-'+(14-i)+'d':''),
      title:'Day -'+(14-i)+': wellbeing '+d.meter+'%, '+(d.checkIn?'voice check-in logged':'no check-in')+(d.flare?', concern flagged':'')+', sleep '+d.sleep+'h'
    }));
    const dailySummary='Voice-derived wellbeing '+trendTxt+' · '+dy.checks+'/14 check-ins · '+dy.flares+' concern day'+(dy.flares===1?'':'s')+' · avg sleep '+dy.sleepAvg.toFixed(1)+'h';

    const withTag=arr=>(arr||[]).map(i=>({...i,tagEl:this.tag(i.tn),scopeLbl:i.scope==='all'?'All patients':i.scope==='patient'?'This patient only':''}));

    // realistic clinical detail for history + imaging
    const ex=this.EXTRA[p.id]||{};
    const statusDot={current:'#0066CC',past:'#B3BAB1',stopped:'#C2453D'};
    const statusBg={current:'rgba(0,102,204,.10)',past:'rgba(20,30,28,.06)',stopped:'rgba(194,69,61,.10)'};
    const statusCol={current:'#0052A3',past:'#76807A',stopped:'#B0382F'};
    const therapy=(ex.therapy||[]).map(t=>({drug:t.drug,period:t.period,detail:t.detail,dot:statusDot[t.status]||'#B3BAB1',statusLbl:t.status==='current'?'Current':t.status==='stopped'?'Stopped':'Previous',statusStyle:'font-size:9.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;padding:3px 9px;border-radius:999px;white-space:nowrap;color:'+(statusCol[t.status]||'#76807A')+';background:'+(statusBg[t.status]||'rgba(20,30,28,.06)')}));
    const problems=[{name:p.prog+' programme',meta:'Enrolled day 1 · currently day '+p.day,dotColor:'#0066CC'}].concat((ex.comorbidities||[]).map(c=>({name:c,meta:'Context',dotColor:'#B3BAB1'})));
    const imaging=ex.img||[];
    const isel=Math.min(st.imgSel||0,Math.max(0,imaging.length-1));
    const imagingList=imaging.map((im,i)=>({title:im.modality,sub:im.region,dt:im.dt,onClick:()=>this.setState({imgSel:i}),style:'width:100%;text-align:left;cursor:pointer;border:1px solid '+(i===isel?'#0066CC':'#EDF2F9')+';background:'+(i===isel?'rgba(0,102,204,.06)':'#fff')+';border-radius:11px;padding:12px 14px;transition:.15s'}));
    const imgR=imaging[isel]||null;

    const initials=p.name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();
    const avatarBg=p.pri==='red'?'#C2453D':p.pri==='amb'?'#C9821C':'#0066CC';
    const nextReview=p.pri==='red'?'Now · crisis':p.pri==='amb'?'Today · brief ready':'Autonomous · AI coaching';
    const facts=[{k:'Programme',v:p.prog+' · day '+p.day},{k:'Plan',v:p.tx},{k:'Managed by',v:p.clin},{k:'Check-in streak',v:p.streak},{k:'Adherence',v:p.adh}];
    const ctInit=n=>{const parts=n.replace(/^(Dr\.?|NP|Mr\.?|Ms\.?)\s+/,'').split(' ');return ((parts[0]||' ')[0]+(parts[parts.length-1]||' ')[0]).toUpperCase();};
    const careTeam=[{n:p.clin,role:'Managing',init:'AI'},{n:'Dr. E. Petherson',role:'Lead clinician',init:'EP'},{n:'Sana Malik',role:'Clinical pharmacist',init:'SM'}];
    const detail=this.buildDetail(p,dy);
    // ----- hero axis tiles -----
    const lastNZ=a=>{const f=(a||[]).filter(x=>x);return f.length?f[f.length-1]:null;};
    const firstNZ=a=>{const f=(a||[]).filter(x=>x);return f.length?f[0]:null;};
    const zcol=z=>Math.abs(z)>=2?'#C2453D':Math.abs(z)>=1.5?'#C9821C':'#357A52';
    const isPCOS=p.prog==='PCOS';
    const cycNow=lastNZ(p.cycleS),cycBase=firstNZ(p.cycleS),gluNow=lastNZ(p.gluS),wtNow=lastNZ(p.wtS),wtBase=firstNZ(p.wtS);
    const hero1=isPCOS
      ? {label:'Cycle length',value:cycNow,unit:'days',z:p.psi.cyc.z,zcol:zcol(p.psi.cyc.z),note:'baseline '+cycBase+' days',target:'baseline 24–35 days'}
      : {label:'Weight',value:wtNow,unit:'kg',z:p.psi.wt.z,zcol:zcol(p.psi.wt.z),note:(wtNow-wtBase).toFixed(1)+' kg since day 1',target:'trending down'};
    const hero2={label:'Post-meal glucose',value:gluNow,unit:'mmol/L',z:p.psi.glu.z,zcol:zcol(p.psi.glu.z),note:'2-h peak · baseline '+firstNZ(p.gluS),target:'baseline < 7.8 mmol/L'};
    // ----- AI clinician brief -----
    const fn=p.name.split(' ')[0];
    const brief=(()=>{
      if(p.pri==='grn') return {show:false};
      if(p.pri==='red') return {show:true,isRed:true,isAmber:false,
        headline:'Crisis pathway — coaching paused, warm handoff logged',
        sub:'The engine detected crisis language and a sharp affect drop, de-escalated, and stopped autonomous coaching.',
        handoff:{time:p.lr,to:'Dr. Priya Shah (on-call)',logged:'Today 06:49',note:'De-escalation script delivered to patient. Autonomous replies suspended. Welfare call in progress; PHQ-9 to follow.'}};
      // amber brief
      const crit = isPCOS
        ? [{k:'Oligo/anovulation',met:true,d:'Cycle gap 42 d vs 31 d baseline (z +2.1)'},{k:'Hyperandrogenism',met:true,d:'Rising acne on vision score; FAI pending'},{k:'Polycystic ovaries on ultrasound',met:false,d:'Not yet performed — optional 3rd criterion'}]
        : [{k:'GI tolerance',met:true,d:'Nausea reported, 1 dose skipped'},{k:'Mood drift',met:true,d:'Voice affect z −1.4'},{k:'Metabolic response',met:false,d:'On track'}];
      const metCount=crit.filter(c=>c.met).length;
      const planBullets = isPCOS
        ? ['Take the metformin with your evening meal to settle the stomach upset — we’ll keep the dose the same for now.','Add a short 15-minute walk after lunch; your glucose is peaking a little after meals.','Keep logging your cycle and a daily photo so we can watch your skin and cycle together.']
        : ['Hold this week’s dose while the nausea settles, then resume at the same level.','Small, frequent meals and fluids; log how you feel each morning.','We’ll check in daily — tell me if things don’t improve in 48 hours.'];
      return {show:true,isRed:false,isAmber:true,prog:p.prog,
        headline:isPCOS?('Rotterdam criteria: '+metCount+' of 3 present'):('Tolerance review: '+metCount+' of 3 flags'),
        sub:isPCOS?('AI reads 2 of 3 Rotterdam criteria as met from '+fn+'’s home data. Ovarian morphology is the only missing criterion.'):('Nausea and mood are drifting together. A short dose-hold is drafted.'),
        crit:crit.map(c=>({k:c.k,d:c.d,dot:c.met?'#0066CC':'#CFC9BD',mark:c.met?'✓':'–'})),planBullets};
    })();
    const adhNum=parseInt(p.adh)||0;
    const adhNote=adhNum<80?'Below the 80% target. Missed doses are logged in the app. Flag to the pharmacist for adherence support.':adhNum<92?'Broadly adherent, with occasional missed doses logged in the app.':'Excellent adherence, with no missed doses logged in the app.';
    const pRecs=this.cds(p);
    // patient task record — live open tasks for this patient + completed history
    const recChip=type=>{const tm=this.TYPEMAP[type]||this.TYPEMAP.review;return 'font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;padding:3px 9px;border-radius:6px;white-space:nowrap;color:'+tm.c+';background:'+tm.bg;};
    const recName=type=>(this.TYPEMAP[type]||this.TYPEMAP.review).l;
    const allTasksForP=this.TASKS.concat(st.addedTasks).concat(acceptedCdsTasks).filter(t=>t.pid===p.id);
    const priMetaP={red:{l:'P1',c:'#fff',bg:'#C2453D'},amb:{l:'P2',c:'#7A4B05',bg:'rgba(232,154,43,.22)'},n:{l:'P3',c:'#46544F',bg:'rgba(20,30,28,.07)'}};
    const priRankP={red:0,amb:1,n:2},dueOrderP={Overdue:0,Today:1,Tomorrow:2,'This week':3},dueTnP={Overdue:'red',Today:'red',Tomorrow:'amb','This week':'n'};
    const priPillP=pri=>{const pm=priMetaP[pri]||priMetaP.n;return React.createElement('span',{style:{display:'inline-block',verticalAlign:'middle',marginRight:'7px',fontSize:'9px',fontWeight:800,letterSpacing:'.5px',textTransform:'uppercase',padding:'3px 8px',borderRadius:'6px',whiteSpace:'nowrap',color:pm.c,background:pm.bg}},pm.l);};
    const checkOpen='width:22px;height:22px;border-radius:50%;border:2px solid #CFC9BD;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0';
    const checkDone='width:22px;height:22px;border-radius:50%;border:2px solid #0066CC;background:#0066CC;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0';
    const checkDoneStatic=checkDone.replace('cursor:pointer','cursor:default');
    const todoTasks=allTasksForP.filter(t=>!st.taskDone[t.id]).sort((a,b)=>(priRankP[a.pri]-priRankP[b.pri])||((dueOrderP[a.due]??9)-(dueOrderP[b.due]??9))).map(t=>({title:t.title,typeL:recName(t.type),typeStyle:recChip(t.type),priEl:priPillP(t.pri),dueEl:this.badge(t.due,dueTnP[t.due]||'n'),onToggle:()=>this.toggleTask(t.id),checkStyle:checkOpen}));
    const doneLive=allTasksForP.filter(t=>st.taskDone[t.id]).map(t=>({title:t.title,typeL:recName(t.type),typeStyle:recChip(t.type),meta:'Completed just now',onToggle:()=>this.toggleTask(t.id),checkStyle:checkDone}));
    const doneHist=(this.PTASKS[p.id]||[]).map(e=>({title:e.title,typeL:recName(e.type),typeStyle:recChip(e.type),meta:'Completed '+e.date+' · '+e.by,onToggle:()=>{},checkStyle:checkDoneStatic}));
    const doneTasks=doneLive.concat(doneHist);
    // clickable notes / submissions (open full text in a modal)
    const allergyTxt=ex.allergies||'No known drug allergies.';
    const hasAllergy=!/^no known/i.test(allergyTxt);
    const allergyShort=allergyTxt.replace(/\.?\s*No known food allergies\.?$/i,'').replace(/\.$/,'');
    const kindMeta={voice:{l:'Voice',c:'#0052A3',bg:'rgba(0,102,204,.10)'},photo:{l:'Photo',c:'#8E5BC4',bg:'rgba(142,91,196,.12)'},device:{l:'Wearable',c:'#2E5E8C',bg:'rgba(46,94,140,.10)'}};
    const subsClick=(p.subs||[]).map(i=>{const km=kindMeta[i.kind]||kindMeta.voice;return {t:i.t,d:i.d,signal:i.signal||'',kindL:km.l,kindStyle:'font-size:9px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;padding:3px 8px;border-radius:6px;white-space:nowrap;color:'+km.c+';background:'+km.bg,sigStyle:'font-size:9.5px;font-weight:700;color:#6B746E;background:#F2F0E9;border:1px solid #E4DFD4;border-radius:6px;padding:2px 8px;white-space:nowrap',tagEl:this.tag(i.tn),onClick:()=>this.viewNote({title:i.t,meta:(i.kind==='photo'?'Photo submission · vision-scored':i.kind==='device'?'Wearable / device sync':'Daily voice check-in')+(i.signal?' · signal: '+i.signal:''),body:i.full||i.d,tn:i.tn})};});
    const addedN=(st.addedNotes[p.id]||[]);
    const notesClick=addedN.concat(p.notes||[]).map(i=>({t:i.t,d:i.d,added:!!i.added,onClick:()=>this.viewNote({title:i.t,meta:i.added?'Clinic note (added by you)':'Consultation note',body:i.full||i.d,tn:'n'})}));
    // blood-test ordering panel
    const BLOOD_TESTS=['Fasting glucose','HbA1c','OGTT','LH','FSH','Free androgen index','SHBG','Total testosterone','Prolactin','TFTs','Lipid profile','Vitamin D'];
    const bloodPanels=BLOOD_TESTS.map(name=>{const on=!!st.bloodSel[name];return {name,on,onToggle:()=>this.toggleBlood(name),style:'display:flex;align-items:center;gap:9px;padding:11px 13px;border-radius:11px;border:1.5px solid '+(on?'#0066CC':'#E4DFD4')+';background:'+(on?'rgba(0,102,204,.07)':'#fff')+';cursor:pointer;transition:.14s;text-align:left',boxStyle:'width:18px;height:18px;border-radius:5px;border:2px solid '+(on?'#0066CC':'#CFC9BD')+';background:'+(on?'#0066CC':'transparent')+';display:flex;align-items:center;justify-content:center;flex-shrink:0'};});
    const bloodSelCount=Object.keys(st.bloodSel).filter(k=>st.bloodSel[k]).length;
    const patient={
      todoTasks,doneTasks,todoCount:todoTasks.length,doneCount:doneTasks.length,todoEmpty:todoTasks.length===0,
      allergyTxt,hasAllergy,noAllergy:!hasAllergy,allergyShort,onAddNote:()=>this.openModal('note'),
      cds:pRecs.map(cdsVMrec),hasCds:pRecs.length>0,
      name:p.name,demo:p.age+' · '+(p.sex==='F'?'Female':'Male')+' · '+p.prog+' programme · '+p.mrn,tx:p.tx,adh:p.adh,lr:p.lr,clin:p.clin,
      initials,avatarBg,facts,careTeam,nextReview,detail,adhNote,
      hero1,hero2,brief,prog:p.prog,day:p.day,streak:p.streak,concDays:p.concDays||0,
      onApproveBrief:()=>this.toast('Plan approved — delivering to '+fn+' via the Attune voice agent'),
      onEditBrief:()=>this.toast('Opening the drafted plan for editing'),
      onRequestLabs:()=>this.toast('Labs requested — task added to your review queue'),
      onConfirmWelfare:()=>this.toast('Welfare check confirmed and logged to the audit trail'),
      statusEl:this.badge(p.status,statusTone[p.status]||'n'),
      psi:{total:ps.total,max:ps.max,pct:ps.max?Math.round(ps.total/ps.max*100):0,tierColor:tcol,tierEl:this.badge(this.tierLabel(tier),this.tierTone(tier)),domains:psiDomains,nAxes:detail.nAxes,note:detail.nAxes+" of 6 axes drifting together against "+p.name.split(' ')[0]+"'s own 30-day rolling baseline. Concordance rises with the number of axes moving and how far each sits from baseline. Axis weights are set in the ConditionPack."},
      daily:{days:dailyDays,summary:dailySummary},
      issues:withTag(p.issues),actions:withTag(p.actions),subs:subsClick,customAlerts:withTag((p.customAlerts||[]).concat(st.patientRules[p.id]||[])),
      dxHist:p.dxHist,hist:p.hist,meds:withTag(p.meds),notes:notesClick,
      seroTable:this.seroTable(p),sNotes:withTag(p.sNotes),gaps:withTag(p.gaps),
      problems,allergies:ex.allergies||'No known drug allergies.',vaccinations:ex.vaccinations||'No record on file.',therapy,
      imagingHas:imaging.length>0,imagingNone:imaging.length===0,imagingList,
      imgReport:imgR?{modality:imgR.modality,region:imgR.region,dt:imgR.dt,technique:imgR.technique,findings:imgR.findings,impression:imgR.impression,comparison:imgR.comparison,reporter:imgR.reporter}:null
    };

    const tabExports={};[['overview','Overview'],['analytics','Analytics'],['meds','Medications'],['proms','PROMs & journal'],['serology','Labs'],['imaging','Imaging'],['history','History']].forEach(([k])=>{tabExports['ts_'+k]=this.tabStyle(st.tab===k);tabExports['go_'+k]=()=>this.setState({tab:k});});

    // alerts page domains — adjustable weights
    const stepBtn=en=>'width:24px;height:24px;border-radius:50%;border:none;background:'+(en?'#fff':'#F1EEE7')+';color:'+(en?'#0052A3':'#CFC9BD')+';font-size:16px;font-weight:800;line-height:1;cursor:'+(en?'pointer':'default')+';display:flex;align-items:center;justify-content:center;box-shadow:'+(en?'0 1px 2px rgba(14,38,35,.12)':'none')+';flex-shrink:0';
    const domains=this.domainDefs.map(d=>{
      const on=!st.domainOff[d.key];const w=this.wOf(d);
      return {name:d.name,src:d.src,type:d.type,weightLbl:w+'×',weightDim:on?'1':'.4',
        onToggle:()=>{const off={...st.domainOff};off[d.key]=on;this.setState({domainOff:off});this.toast(on?d.name+' disabled':d.name+' enabled');},
        onDec:()=>this.setW(d.key,-0.5),onInc:()=>this.setW(d.key,0.5),
        decStyle:stepBtn(on&&w>0),incStyle:stepBtn(on&&w<3),
        toggleStyle:'width:40px;height:22px;border-radius:999px;background:'+(on?'#0066CC':'#D9D5CD')+';position:relative;cursor:pointer;transition:.18s;flex-shrink:0',
        knobStyle:'width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:2px;left:'+(on?'20px':'2px')+';transition:.18s;box-shadow:0 1px 3px rgba(0,0,0,.18)'};
    });
    const psiTotalWeight=this.domainDefs.filter(d=>!st.domainOff[d.key]).reduce((s,d)=>s+this.wOf(d),0);

    const rules=this.rules.concat(st.cohortRules).map(r=>({t:r.t,d:r.d,custom:!!r.custom,tagEl:this.badge(r.custom?'Custom':this.toneLabel(r.tn==='red'?'red':r.tn),r.custom?'b':r.tn)}));

    // custom rule builder (patient or cohort scope)
    const rScope=st.ruleDraft.scope||'patient';
    const segStyle=active=>'flex:1;font-size:11.5px;font-weight:700;padding:8px 0;border-radius:8px;border:none;cursor:pointer;transition:.15s;'+(active?'background:#0D2B3E;color:#fff':'background:transparent;color:#6B746E');
    const alertPatients=this.P.map(x=>({id:x.id,name:x.name}));
    const ap=this.P.find(x=>x.id===st.alertPid)||this.P[0];
    const apRules=((ap.customAlerts||[]).filter(r=>r.scope==='patient')).concat(st.patientRules[ap.id]||[]).map(r=>({t:r.t,d:r.d,tagEl:this.tag(r.tn)}));
    const ruleSelStyle='height:38px;border-radius:9px;border:1px solid #E2DDD2;background:#fff;padding:0 10px;font-size:12.5px;font-weight:600;color:#2A3A36;cursor:pointer;outline:none;width:100%';
    const ruleInpStyle='height:38px;border-radius:9px;border:1px solid #E2DDD2;background:#fff;padding:0 12px;font-size:12.5px;font-weight:700;color:#2A3A36;outline:none;width:100%;text-align:center';

    const adminV=this.admin;

    const today=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
    const openTasks=allTasks.filter(t=>!st.taskDone[t.id]).length;
    const navBadge=(n,col)=> n>0 ? 'display:inline-flex;align-items:center;justify-content:center;min-width:19px;height:19px;padding:0 6px;border-radius:999px;font-size:10px;font-weight:800;background:'+col+';color:#071829' : 'display:none';
    const crumbs={worklist:'Attune · At-home programmes',tasks:'Attune · Review queue',patient:p.name+' · '+p.prog+' programme',alerts:'Configuration · ConditionPack',admin:'Configuration',cds:'Attune'};
    // ----- tasks -----
    const dueOrder={Overdue:0,Today:1,Tomorrow:2,'This week':3};
    const isOpenT=t=>!st.taskDone[t.id];
    const inTF=t=>{const f=st.taskFilter;if(f==='done')return !!st.taskDone[t.id];if(!isOpenT(t))return false;if(f==='all')return true;if(f==='upcoming')return t.due==='Tomorrow'||t.due==='This week';return t.due===f;};
    const priRank={red:0,amb:1,n:2};
    const tList=allTasks.filter(inTF).sort((a,b)=>(priRank[a.pri]-priRank[b.pri])||((dueOrder[a.due]??9)-(dueOrder[b.due]??9)));
    const typeMap=this.TYPEMAP;
    const dueTnMap={Overdue:'red',Today:'red',Tomorrow:'amb','This week':'n'};
    const priMeta={red:{l:'P1 · High',c:'#fff',bg:'#C2453D'},amb:{l:'P2 · Medium',c:'#7A4B05',bg:'rgba(232,154,43,.22)'},n:{l:'P3 · Routine',c:'#46544F',bg:'rgba(20,30,28,.07)'}};
    const taskRows=tList.map(t=>{const done=!!st.taskDone[t.id];const tm=typeMap[t.type];const pm=priMeta[t.pri]||priMeta.n;return {id:t.id,pt:t.pt,title:t.title,detail:t.detail,fromCds:!!t.fromCds,typeL:tm.l,typeStyle:'font-size:9.5px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;padding:4px 10px;border-radius:7px;white-space:nowrap;color:'+tm.c+';background:'+tm.bg,priL:pm.l,priStyle:'font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;padding:3px 9px;border-radius:6px;white-space:nowrap;color:'+pm.c+';background:'+pm.bg,stripe:t.pri==='red'?'#C2453D':t.pri==='amb'?'#E89A2B':'#9CCBBF',dueEl:this.badge(t.due,dueTnMap[t.due]||'n'),done,rowStyle:'display:grid;grid-template-columns:28px 5px 84px 1fr auto;gap:14px;align-items:center;padding:15px 22px 15px 16px;border-bottom:1px solid #F2EEE5;transition:.15s;'+(done?'opacity:.55':''),titleStyle:'font-size:13.5px;font-weight:700;color:#0D2B3E;'+(done?'text-decoration:line-through':''),checkStyle:'width:24px;height:24px;border-radius:50%;border:2px solid '+(done?'#0066CC':'#CFC9BD')+';background:'+(done?'#0066CC':'transparent')+';cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0',onToggle:()=>this.toggleTask(t.id),onOpen:()=>this.open(t.pid,this.tabForType(t.type))};});
    const cAll=allTasks.filter(isOpenT).length,cOver=allTasks.filter(t=>isOpenT(t)&&t.due==='Overdue').length,cToday=allTasks.filter(t=>isOpenT(t)&&t.due==='Today').length,cUp=allTasks.filter(t=>isOpenT(t)&&(t.due==='Tomorrow'||t.due==='This week')).length,cDoneT=allTasks.filter(t=>st.taskDone[t.id]).length;
    const taskFilters=[['all','All',cAll],['Overdue','Overdue',cOver],['Today','Today',cToday],['upcoming','Upcoming',cUp],['done','Done',cDoneT]].map(([k,l,n])=>({label:l+' ('+n+')',onClick:()=>this.setState({taskFilter:k}),style:this.filtStyle(st.taskFilter===k)}));
    const tasksSub=cAll+' open · '+cOver+' overdue · '+cToday+' due today · ordered by priority, then due date';

    return {
      title:titles[st.view],
      ...navStyles,
      crumb:crumbs[st.view],
      sbUrgent:cU,sbReview:cR,sbStable:cS,sbTasks:openTasks,
      navBadgeUrgent:navBadge(cU,'#F2A39C'),navBadgeTasks:navBadge(openTasks,'#B3D9FF'),
      isWorklist:st.view==='worklist',isTasks:st.view==='tasks',isPatient:st.view==='patient',isAlerts:st.view==='alerts',isAdmin:st.view==='admin',
      cdsSuggestions,cdsSuggestSub,hasCdsSuggest:cdsActiveAll.length>0,
      wlSub:cU+' red · '+cR+' amber · '+cS+' green · sorted by tier, then concordance',today,
      kpis,filters,rows,
      taskRows,taskFilters,tasksSub,tasksEmpty:taskRows.length===0,
      q:st.q,onSearch:(e)=>this.setState({q:e.target.value,expanded:null}),
      goBack:()=>this.go('worklist'),
      onBloods:()=>this.openModal('bloods'),onMessage:()=>this.toast('Message drafted to patient'),onAck:()=>this.toast('Alert acknowledged'),onImaging:()=>this.toast('Imaging request initiated'),
      p:patient,...tabExports,
      tabOverview:st.tab==='overview',tabAnalytics:st.tab==='analytics',tabMeds:st.tab==='meds',tabProms:st.tab==='proms',tabHistory:st.tab==='history',tabSerology:st.tab==='serology',tabImaging:st.tab==='imaging',
      showApp:this.props.showApp!==false,
      domains,rules,admin:adminV,psiTotalWeight:psiTotalWeight.toFixed(1),
      packLabel:this.state.pack||'PCOS',onPackPcos:()=>this.setState({pack:'PCOS'}),onPackGlp:()=>this.setState({pack:'GLP-1'}),
      packIsPcos:(this.state.pack||'PCOS')==='PCOS',packIsGlp:(this.state.pack||'PCOS')==='GLP-1',
      alertPatients,alertPid:st.alertPid,apName:ap.name,apRules,apRulesEmpty:apRules.length===0,
      ruleDraft:st.ruleDraft,ruleSelStyle,ruleInpStyle,
      ruleMetricOpts:['RADAI-5','CRP (mg/L)','PSI score (%)','Adherence (%)','Fatigue (0-10)','HRV deviation (%)','Activity (% baseline)'],
      ruleOpOpts:['rises above','falls below','increases by'],
      ruleWinOpts:['7 days','14 days','30 days'],
      onPickPatient:e=>this.setState({alertPid:e.target.value}),
      onDraftMetric:e=>this.setDraft('metric',e.target.value),onDraftOp:e=>this.setDraft('op',e.target.value),
      onDraftVal:e=>this.setDraft('val',e.target.value),onDraftWin:e=>this.setDraft('win',e.target.value),
      onAddRule:()=>this.addRule(),
      ruleScope:rScope,scopeIsCohort:rScope==='cohort',scopeIsPatient:rScope!=='cohort',
      segPatientStyle:segStyle(rScope!=='cohort'),segCohortStyle:segStyle(rScope==='cohort'),
      onScopePatient:()=>this.setDraft('scope','patient'),onScopeCohort:()=>this.setDraft('scope','cohort'),
      addBtnLabel:rScope==='cohort'?'Add rule for all patients':'Add rule for '+ap.name,
      modal:st.modal,modalOpen:!!st.modal||!!st.modalNote,onCloseModal:()=>this.closeModal(),
      modalIsBloods:st.modal==='bloods',modalIsAddPt:st.modal==='addpatient',modalIsDischarge:st.modal==='discharge',modalIsNote:st.modal==='note',
      noop:(e)=>{e.stopPropagation();},
      bloodPanels:bloodPanels,bloodSelCount:bloodSelCount,onPlaceOrder:()=>this.placeBloodOrder(),
      noteDraft:st.noteDraft,onNoteInput:e=>this.setState({noteDraft:e.target.value}),onSaveNote:()=>this.addNote(),
      modalNote:st.modalNote,modalNoteOpen:!!st.modalNote,
      offCaseList,offCaseEmpty:offCaseList.length===0,onOpenAdd:()=>this.openModal('addpatient'),
      onOpenDischarge:()=>this.openModal('discharge'),onDischarge:()=>this.discharge(),
      toastShow:st.toastShow,toastMsg:st.toastMsg
    };
  }
}