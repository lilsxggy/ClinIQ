export const RANKS = [
  {n:'Aspirant',min:0,max:300},
  {n:'Intern',min:300,max:900},
  {n:'House Surgeon',min:900,max:2000},
  {n:'Medical Graduate',min:2000,max:4000},
  {n:'Registrar',min:4000,max:7000},
  {n:'Senior Registrar',min:7000,max:11000},
  {n:'Medical Officer',min:11000,max:16000},
  {n:'Sr. Medical Officer',min:16000,max:22000},
  {n:'Specialist',min:22000,max:30000},
  {n:'Senior Specialist',min:30000,max:40000},
  {n:'Consultant',min:40000,max:52000},
  {n:'Sr. Consultant',min:52000,max:67000},
  {n:'Assoc. Professor',min:67000,max:85000},
  {n:'Professor',min:85000,max:110000},
  {n:'DM / MCh Scholar',min:110000,max:999999}
]

export const SUBJECTS = [
  'Medicine','Surgery','Paediatrics','Obs & Gynae','Pathology',
  'Pharmacology','Microbiology','Anatomy','Physiology','Biochemistry',
  'Ophthalmology','ENT','Forensic Med.','PSM','Psychiatry',
  'Radiology','Orthopaedics','Dermatology','Anaesthesia'
]

export const PRECLINICAL = ['Anatomy','Physiology','Biochemistry']
export const CLINICAL = ['Medicine','Surgery','Obs & Gynae','Paediatrics','Orthopaedics','ENT','Ophthalmology','Psychiatry','Dermatology','Radiology','Anaesthesia']

export function rankIdx(xp) {
  for (let i = RANKS.length - 1; i >= 0; i--) if (xp >= RANKS[i].min) return i
  return 0
}

export function xpFor(subject, correct) {
  if (!correct) return 0
  if (PRECLINICAL.includes(subject)) return 10
  if (CLINICAL.includes(subject)) return 25
  return 15
}

export const FALLBACK_QUESTIONS = [
  {id:'f1',q:"A 45-year-old male presents with chest pain radiating to the left arm, diaphoresis, and dyspnoea for 2 hours. ECG shows ST elevation in leads II, III, and aVF. What is the most likely diagnosis?",o:["Anterior STEMI","Inferior STEMI","Unstable angina","Pulmonary embolism"],a:1,e:"ST elevation in leads II, III, and aVF indicates inferior STEMI, involving the right coronary artery territory.",s:"Medicine",t:"Cardiology",d:2,pyq:"NEET PG 2022"},
  {id:'f2',q:"Which nerve is most commonly injured in a fracture of the surgical neck of the humerus?",o:["Radial nerve","Axillary nerve","Musculocutaneous nerve","Median nerve"],a:1,e:"The axillary nerve winds around the surgical neck of the humerus causing deltoid paralysis when injured.",s:"Anatomy",t:"Upper limb",d:1,pyq:"NEET PG 2021"},
  {id:'f3',q:"A patient presents with jaundice, right upper quadrant pain, and fever with chills. What is this clinical triad called?",o:["Murphy's triad","Charcot's triad","Reynold's pentad","Beck's triad"],a:1,e:"Charcot's triad is pathognomonic for ascending cholangitis due to biliary obstruction with bacterial infection.",s:"Surgery",t:"Hepatobiliary",d:1,pyq:"NEET PG 2020"},
  {id:'f4',q:"Which drug is first-line treatment in status epilepticus?",o:["Phenytoin","Lorazepam","Phenobarbitone","Valproate"],a:1,e:"Lorazepam IV is first-line for status epilepticus due to rapid onset and longer duration vs diazepam.",s:"Pharmacology",t:"CNS drugs",d:2,pyq:null},
  {id:'f5',q:"BRAF V600E mutation is most commonly associated with which thyroid malignancy?",o:["Follicular carcinoma","Papillary carcinoma","Anaplastic carcinoma","Medullary carcinoma"],a:1,e:"BRAF V600E is found in 40-45% of papillary thyroid carcinomas and activates the MAPK signalling pathway.",s:"Pathology",t:"Endocrine path",d:3,pyq:"NEET PG 2023"},
]
