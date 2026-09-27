export type VisaType = "E-7" | "E-9" | "H-2" | "F-4" | "F-6" | "D-10"

export type Industry =
  | "Manufacturing"
  | "IT & Software"
  | "Agriculture"
  | "Construction"
  | "Hospitality"
  | "Healthcare"
  | "Education"
  | "Logistics"

export interface Company {
  id: string
  name: string
  logo: string
  location: string
  city: string
  industry: Industry
  verified: boolean
  about: string
  employees: string
  founded: number
  activeJobs: number
  website?: string
}

export interface Job {
  id: string
  title: string
  company: Company
  location: string
  city: string
  salary: { min: number; max: number; currency: "KRW" }
  visaTypes: VisaType[]
  topikLevel: number | null
  industry: Industry
  jobType: "Full-time" | "Part-time" | "Contract" | "Seasonal"
  description: string
  requirements: string[]
  benefits: string[]
  deadline: string
  postedAt: string
  applicants: number
  featured: boolean
}

export const companies: Company[] = [
  {
    id: "c1",
    name: "Samsung Electronics",
    logo: "SE",
    location: "Suwon, Gyeonggi-do",
    city: "Suwon",
    industry: "Manufacturing",
    verified: true,
    about: "Global leader in electronics and semiconductor manufacturing, producing everything from chips to consumer devices.",
    employees: "300,000+",
    founded: 1969,
    activeJobs: 12,
    website: "samsung.com",
  },
  {
    id: "c2",
    name: "CJ Logistics",
    logo: "CJ",
    location: "Seoul",
    city: "Seoul",
    industry: "Logistics",
    verified: true,
    about: "Korea's largest logistics and supply chain company, operating across 40+ countries.",
    employees: "50,000+",
    founded: 1930,
    activeJobs: 8,
    website: "cjlogistics.com",
  },
  {
    id: "c3",
    name: "Hyundai Motor",
    logo: "HM",
    location: "Ulsan",
    city: "Ulsan",
    industry: "Manufacturing",
    verified: true,
    about: "One of the world's largest automotive manufacturers, producing over 4 million vehicles annually.",
    employees: "120,000+",
    founded: 1967,
    activeJobs: 15,
    website: "hyundai.com",
  },
  {
    id: "c4",
    name: "GS Farm",
    logo: "GF",
    location: "Chungnam",
    city: "Chungnam",
    industry: "Agriculture",
    verified: true,
    about: "Agricultural cooperative specialising in organic vegetable production and greenhouse farming.",
    employees: "500+",
    founded: 2002,
    activeJobs: 4,
  },
  {
    id: "c5",
    name: "Kakao Corp",
    logo: "KK",
    location: "Jeju / Seoul",
    city: "Seoul",
    industry: "IT & Software",
    verified: true,
    about: "Korea's leading internet and mobile services company, powering KakaoTalk and a growing ecosystem of apps.",
    employees: "12,000+",
    founded: 1995,
    activeJobs: 6,
    website: "kakao.com",
  },
  {
    id: "c6",
    name: "Lotte Hotels & Resorts",
    logo: "LH",
    location: "Seoul",
    city: "Seoul",
    industry: "Hospitality",
    verified: true,
    about: "Premium hotel and hospitality group with properties across Korea and 20+ countries.",
    employees: "8,000+",
    founded: 1973,
    activeJobs: 9,
    website: "lottehotel.com",
  },
  {
    id: "c7",
    name: "LG Electronics",
    logo: "LG",
    location: "Seoul",
    city: "Seoul",
    industry: "Manufacturing",
    verified: true,
    about: "World-class electronics manufacturer of home appliances, televisions, and commercial displays.",
    employees: "80,000+",
    founded: 1958,
    activeJobs: 7,
    website: "lg.com",
  },
  {
    id: "c8",
    name: "Naver Corp",
    logo: "NV",
    location: "Seongnam",
    city: "Seongnam",
    industry: "IT & Software",
    verified: true,
    about: "Korea's largest search engine and internet platform, operating LINE globally and investing heavily in AI.",
    employees: "5,000+",
    founded: 1999,
    activeJobs: 10,
    website: "navercorp.com",
  },
  {
    id: "c9",
    name: "POSCO Holdings",
    logo: "PS",
    location: "Pohang",
    city: "Pohang",
    industry: "Manufacturing",
    verified: true,
    about: "One of the world's largest steel producers, supplying automotive, shipbuilding, and construction sectors.",
    employees: "60,000+",
    founded: 1968,
    activeJobs: 11,
    website: "posco.com",
  },
  {
    id: "c10",
    name: "Kia Corporation",
    logo: "KA",
    location: "Hwaseong, Gyeonggi-do",
    city: "Hwaseong",
    industry: "Manufacturing",
    verified: true,
    about: "Korea's second-largest automaker, known for design-forward vehicles sold in 190+ countries.",
    employees: "35,000+",
    founded: 1944,
    activeJobs: 9,
    website: "kia.com",
  },
  {
    id: "c11",
    name: "Severance Hospital",
    logo: "SH",
    location: "Seoul",
    city: "Seoul",
    industry: "Healthcare",
    verified: true,
    about: "Leading academic medical centre affiliated with Yonsei University, treating over 2 million patients annually.",
    employees: "10,000+",
    founded: 1885,
    activeJobs: 14,
    website: "severance.or.kr",
  },
  {
    id: "c12",
    name: "Hyundai E&C",
    logo: "HE",
    location: "Seoul",
    city: "Seoul",
    industry: "Construction",
    verified: true,
    about: "Korea's largest construction company, with landmark infrastructure projects spanning 70+ countries.",
    employees: "15,000+",
    founded: 1947,
    activeJobs: 18,
    website: "hdec.co.kr",
  },
  {
    id: "c13",
    name: "OO정공",
    logo: "OJ",
    location: "Daegu, Suseong-gu",
    city: "Daegu",
    industry: "Manufacturing",
    verified: true,
    about: "Precision machining manufacturer based in Daegu specialising in CNC and MCT component fabrication for the automotive and industrial sectors. Technical training provided for skilled operators.",
    employees: "50–100",
    founded: 2005,
    activeJobs: 1,
  },
]

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Manufacturing Line Operator",
    company: companies[0],
    location: "Suwon, Gyeonggi-do",
    city: "Suwon",
    salary: { min: 2500000, max: 3200000, currency: "KRW" },
    visaTypes: ["E-9", "H-2"],
    topikLevel: null,
    industry: "Manufacturing",
    jobType: "Full-time",
    description:
      "Operate and monitor production line equipment at our Suwon semiconductor facility. Work includes quality checks, machine maintenance support, and safety compliance. New hires receive full on-site training.",
    requirements: [
      "E-9 or H-2 visa holder",
      "Physical fitness for standing work (8hr shifts)",
      "Basic Korean communication (preferred)",
      "Previous factory experience (preferred)",
    ],
    benefits: ["Dormitory provided", "Meals included", "Health insurance", "Annual bonus"],
    deadline: "2026-10-31",
    postedAt: "2026-09-10",
    applicants: 47,
    featured: true,
  },
  {
    id: "j2",
    title: "Logistics Warehouse Staff",
    company: companies[1],
    location: "Incheon",
    city: "Incheon",
    salary: { min: 2200000, max: 2800000, currency: "KRW" },
    visaTypes: ["E-9", "H-2", "F-4"],
    topikLevel: 1,
    industry: "Logistics",
    jobType: "Full-time",
    description:
      "Handle incoming and outgoing shipments, organise inventory, and operate forklifts (training provided). Shift-based work at our Incheon logistics hub.",
    requirements: [
      "Valid work visa (E-9, H-2, or F-4)",
      "TOPIK Level 1 or basic Korean",
      "Ability to lift 20kg",
      "Forklift licence (preferred)",
    ],
    benefits: ["Transport allowance", "Overtime pay", "Health insurance", "Forklift training"],
    deadline: "2026-10-15",
    postedAt: "2026-09-12",
    applicants: 33,
    featured: true,
  },
  {
    id: "j3",
    title: "Automotive Assembly Technician",
    company: companies[2],
    location: "Ulsan",
    city: "Ulsan",
    salary: { min: 3000000, max: 4000000, currency: "KRW" },
    visaTypes: ["E-7", "H-2"],
    topikLevel: 2,
    industry: "Manufacturing",
    jobType: "Full-time",
    description:
      "Join our Ulsan assembly plant for vehicle body and chassis assembly. Training provided. Opportunity for long-term employment and skill certification.",
    requirements: [
      "E-7 or H-2 visa",
      "TOPIK Level 2 minimum",
      "Technical or vocational background",
      "Team player",
    ],
    benefits: ["Company housing", "Skill certification", "Health & dental", "Annual leave 15 days"],
    deadline: "2026-11-01",
    postedAt: "2026-09-08",
    applicants: 61,
    featured: true,
  },
  {
    id: "j4",
    title: "Farm Worker – Vegetable Harvest",
    company: companies[3],
    location: "Chungnam",
    city: "Chungnam",
    salary: { min: 1800000, max: 2400000, currency: "KRW" },
    visaTypes: ["E-9", "H-2"],
    topikLevel: null,
    industry: "Agriculture",
    jobType: "Seasonal",
    description:
      "Seasonal vegetable harvesting and greenhouse maintenance. 6-month contract with possibility of renewal. Farm accommodation and meals included.",
    requirements: ["E-9 or H-2 visa", "Physically fit", "Willing to work outdoors"],
    benefits: ["Free accommodation", "3 meals/day", "Return flight support"],
    deadline: "2026-10-01",
    postedAt: "2026-09-15",
    applicants: 19,
    featured: false,
  },
  {
    id: "j5",
    title: "Frontend Developer",
    company: companies[4],
    location: "Seoul / Remote",
    city: "Seoul",
    salary: { min: 4500000, max: 7000000, currency: "KRW" },
    visaTypes: ["E-7", "D-10", "F-4", "F-6"],
    topikLevel: 3,
    industry: "IT & Software",
    jobType: "Full-time",
    description:
      "Build and maintain Kakao's web products using React and TypeScript. Join a collaborative engineering team with modern tooling and agile practices.",
    requirements: [
      "E-7, D-10, F-4 or F-6 visa",
      "TOPIK Level 3+",
      "3+ years React/TypeScript experience",
      "Portfolio required",
    ],
    benefits: ["Remote flexibility", "Stock options", "Learning budget", "Premium health insurance"],
    deadline: "2026-10-20",
    postedAt: "2026-09-14",
    applicants: 28,
    featured: true,
  },
  {
    id: "j6",
    title: "Hotel Housekeeper",
    company: companies[5],
    location: "Seoul",
    city: "Seoul",
    salary: { min: 2100000, max: 2600000, currency: "KRW" },
    visaTypes: ["E-9", "H-2", "F-4", "F-6"],
    topikLevel: 1,
    industry: "Hospitality",
    jobType: "Full-time",
    description:
      "Maintain guest room cleanliness and presentation at Lotte Hotel Seoul. Friendly work environment with staff welfare programmes and career growth opportunities.",
    requirements: [
      "Valid work visa",
      "Basic Korean (TOPIK 1 preferred)",
      "Attention to detail",
      "Previous hotel experience a plus",
    ],
    benefits: ["Staff meals", "Uniform provided", "Training programme", "Career advancement"],
    deadline: "2026-10-25",
    postedAt: "2026-09-11",
    applicants: 42,
    featured: false,
  },
  {
    id: "j7",
    title: "Backend Software Engineer",
    company: companies[7],
    location: "Seongnam",
    city: "Seongnam",
    salary: { min: 5000000, max: 8000000, currency: "KRW" },
    visaTypes: ["E-7", "D-10"],
    topikLevel: 2,
    industry: "IT & Software",
    jobType: "Full-time",
    description:
      "Design and scale backend services powering Naver's search and AI products. Work with Go, Java, and Kubernetes in a world-class engineering culture.",
    requirements: [
      "E-7 or D-10 visa",
      "TOPIK Level 2+ (or English equivalent)",
      "4+ years backend engineering experience",
      "Experience with distributed systems",
    ],
    benefits: ["Stock options", "Unlimited learning budget", "Gym & cafeteria", "Flexible hours"],
    deadline: "2026-11-15",
    postedAt: "2026-09-16",
    applicants: 22,
    featured: true,
  },
  {
    id: "j8",
    title: "Steel Plant Process Operator",
    company: companies[8],
    location: "Pohang, North Gyeongsang",
    city: "Pohang",
    salary: { min: 2800000, max: 3600000, currency: "KRW" },
    visaTypes: ["E-9", "H-2"],
    topikLevel: 1,
    industry: "Manufacturing",
    jobType: "Full-time",
    description:
      "Monitor and operate steelmaking furnaces and rolling mills at POSCO's flagship Pohang plant. Safety-first culture with extensive on-the-job training.",
    requirements: [
      "E-9 or H-2 visa",
      "TOPIK Level 1 (basic communication)",
      "Willingness to work rotating shifts",
      "Industrial or manufacturing background preferred",
    ],
    benefits: ["Company dormitory", "Full meals", "Health & accident insurance", "Annual home visit support"],
    deadline: "2026-10-30",
    postedAt: "2026-09-13",
    applicants: 38,
    featured: false,
  },
  {
    id: "j9",
    title: "Construction Site Worker",
    company: companies[11],
    location: "Incheon",
    city: "Incheon",
    salary: { min: 2400000, max: 3000000, currency: "KRW" },
    visaTypes: ["E-9", "H-2"],
    topikLevel: null,
    industry: "Construction",
    jobType: "Contract",
    description:
      "General civil and structural construction work at an Incheon infrastructure project. Safety training and PPE provided. 12-month contract with renewal potential.",
    requirements: [
      "E-9 or H-2 visa",
      "Physically capable of manual labour",
      "Prior construction experience preferred",
      "Safety certification a plus",
    ],
    benefits: ["Site transport", "Safety gear included", "Overtime pay", "Insurance"],
    deadline: "2026-10-10",
    postedAt: "2026-09-17",
    applicants: 55,
    featured: false,
  },
  {
    id: "j10",
    title: "Clinical Nursing Assistant",
    company: companies[10],
    location: "Seoul",
    city: "Seoul",
    salary: { min: 3200000, max: 4500000, currency: "KRW" },
    visaTypes: ["E-7"],
    topikLevel: 3,
    industry: "Healthcare",
    jobType: "Full-time",
    description:
      "Support registered nurses with patient care, vitals monitoring, and ward administration at Severance Hospital. International applicants with nursing qualifications welcome.",
    requirements: [
      "E-7 visa",
      "TOPIK Level 3 minimum",
      "Nursing qualification (home country recognised)",
      "Korean medical vocabulary preferred",
    ],
    benefits: ["Hospital health plan", "CPD support", "Meals on shift", "Housing subsidy"],
    deadline: "2026-11-30",
    postedAt: "2026-09-09",
    applicants: 16,
    featured: true,
  },
  {
    id: "j11",
    title: "Vehicle Assembly Line Worker",
    company: companies[9],
    location: "Hwaseong, Gyeonggi-do",
    city: "Hwaseong",
    salary: { min: 2700000, max: 3500000, currency: "KRW" },
    visaTypes: ["E-9", "H-2"],
    topikLevel: null,
    industry: "Manufacturing",
    jobType: "Full-time",
    description:
      "Join Kia's Hwaseong assembly line producing EV and ICE vehicles. Structured training programme leads to skill-level pay increases after 6 months.",
    requirements: [
      "E-9 or H-2 visa",
      "Physically fit, comfortable with repetitive tasks",
      "Automotive experience a plus",
    ],
    benefits: ["Factory dormitory", "3 meals/day", "Annual bonus", "Health insurance"],
    deadline: "2026-10-28",
    postedAt: "2026-09-18",
    applicants: 73,
    featured: false,
  },
  {
    id: "j12",
    title: "CNC / MCT Machine Operator",
    company: companies[12],
    location: "Daegu, Suseong-gu, Gyeongbuk",
    city: "Daegu",
    salary: { min: 2800000, max: 4000000, currency: "KRW" },
    visaTypes: ["E-7"],
    topikLevel: null,
    industry: "Manufacturing",
    jobType: "Full-time",
    description:
      "Operate CNC and MCT precision machining equipment at our Daegu facility producing high-tolerance metal components for the automotive and industrial sectors. Working hours are 08:30–17:30 with overtime compensation at hourly rate. Technical skills transfer provided for candidates with shorter experience. Preferred nationality: Mongolia. 10 positions available.",
    requirements: [
      "E-7-1 or E-7-3 visa holder",
      "CNC operators: 2–3 years experience (blueprint reading, material setup, tool calibration, programming, quality measurement, equipment maintenance)",
      "MCT operators: 1–3 years experience (CAD/CAM proficiency, blueprint interpretation, precision machining, dimensional measurement)",
      "Physically fit for standing shift work",
      "Basic Korean communication ability preferred",
    ],
    benefits: [
      "Company dormitory provided",
      "Overtime pay (hourly rate)",
      "Technical training / skills transfer for less experienced candidates",
      "Health insurance",
    ],
    deadline: "2026-11-07",
    postedAt: "2026-09-20",
    applicants: 34,
    featured: true,
  },
  {
    id: "j13",
    title: "Hotel Kitchen Assistant",
    company: companies[5],
    location: "Busan",
    city: "Busan",
    salary: { min: 2200000, max: 2800000, currency: "KRW" },
    visaTypes: ["E-9", "H-2"],
    topikLevel: 1,
    industry: "Hospitality",
    jobType: "Full-time",
    description:
      "Support the culinary team at Lotte Hotel Busan with food preparation, plating, and kitchen hygiene. Training from senior chefs included.",
    requirements: [
      "E-9 or H-2 visa",
      "Basic Korean (TOPIK 1)",
      "Food hygiene certification (preferred)",
    ],
    benefits: ["Staff meals", "Uniform", "Hotel discount", "Chef training"],
    deadline: "2026-10-20",
    postedAt: "2026-09-07",
    applicants: 31,
    featured: false,
  },
  {
    id: "j14",
    title: "Home Appliance QC Inspector",
    company: companies[6],
    location: "Seoul",
    city: "Seoul",
    salary: { min: 2500000, max: 3200000, currency: "KRW" },
    visaTypes: ["E-9", "H-2"],
    topikLevel: null,
    industry: "Manufacturing",
    jobType: "Full-time",
    description:
      "Inspect and test LG home appliances on production lines. Use quality checklists and basic measurement tools. Full training provided for all new hires.",
    requirements: [
      "E-9 or H-2 visa",
      "Good attention to detail",
      "Basic maths and reading ability",
    ],
    benefits: ["Bus commute provided", "Canteen meals", "Health insurance", "Performance bonus"],
    deadline: "2026-11-05",
    postedAt: "2026-09-06",
    applicants: 44,
    featured: false,
  },
  {
    id: "j15",
    title: "Long-Haul Delivery Driver",
    company: companies[1],
    location: "Busan",
    city: "Busan",
    salary: { min: 2500000, max: 3000000, currency: "KRW" },
    visaTypes: ["H-2", "F-4"],
    topikLevel: 2,
    industry: "Logistics",
    jobType: "Full-time",
    description:
      "Drive refrigerated trucks on Busan–Seoul–Incheon routes. Korean driving licence and safe driving record required. Excellent pay with overtime and mileage bonuses.",
    requirements: [
      "H-2 or F-4 visa",
      "Korean driving licence (Class 1)",
      "TOPIK Level 2 (road communication)",
      "2+ years truck driving experience",
    ],
    benefits: ["Mileage bonus", "Meals on route", "Accident insurance", "Fuel card"],
    deadline: "2026-10-18",
    postedAt: "2026-09-05",
    applicants: 27,
    featured: false,
  },
  {
    id: "j16",
    title: "POSCO Cold Rolling Operator",
    company: companies[8],
    location: "Gwangyang, South Jeolla",
    city: "Gwangyang",
    salary: { min: 3000000, max: 3800000, currency: "KRW" },
    visaTypes: ["E-9"],
    topikLevel: 1,
    industry: "Manufacturing",
    jobType: "Full-time",
    description:
      "Operate cold-rolling mill machinery at POSCO Gwangyang steelworks producing high-grade steel coils for automotive and appliance sectors.",
    requirements: [
      "E-9 visa",
      "TOPIK Level 1",
      "Heavy industry experience preferred",
      "Able to work night shift rotation",
    ],
    benefits: ["Company accommodation", "Shift allowance", "Meals", "Annual bonus"],
    deadline: "2026-10-25",
    postedAt: "2026-09-04",
    applicants: 29,
    featured: false,
  },
]

export const industries: Industry[] = [
  "Manufacturing",
  "IT & Software",
  "Agriculture",
  "Construction",
  "Hospitality",
  "Healthcare",
  "Education",
  "Logistics",
]

export const cities = [
  "Seoul", "Busan", "Incheon", "Suwon", "Ulsan", "Daegu",
  "Chungnam", "Gyeonggi-do", "Seongnam", "Pohang", "Hwaseong", "Gwangyang",
]

export const visaOptions: VisaType[] = ["E-7", "E-9", "H-2", "F-4", "F-6", "D-10"]

export const industryColors: Record<Industry, { bg: string; text: string; dot: string }> = {
  "Manufacturing":  { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  "IT & Software":  { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  "Agriculture":    { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  "Construction":   { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "Hospitality":    { bg: "bg-pink-50",   text: "text-pink-700",   dot: "bg-pink-500"   },
  "Healthcare":     { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"    },
  "Education":      { bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500"   },
  "Logistics":      { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500"  },
}

export const visaColors: Record<VisaType, { bg: string; text: string }> = {
  "E-7":  { bg: "bg-blue-100",   text: "text-blue-700"   },
  "E-9":  { bg: "bg-emerald-100",text: "text-emerald-700"},
  "H-2":  { bg: "bg-amber-100",  text: "text-amber-700"  },
  "F-4":  { bg: "bg-purple-100", text: "text-purple-700" },
  "F-6":  { bg: "bg-pink-100",   text: "text-pink-700"   },
  "D-10": { bg: "bg-orange-100", text: "text-orange-700" },
}

export function formatSalary(min: number, max: number): string {
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `₩${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)     return `₩${(n / 1_000).toFixed(0)}K`
    return `₩${n}`
  }
  return `${fmt(min)} – ${fmt(max)}`
}

export function daysAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  return `${diff} days ago`
}
