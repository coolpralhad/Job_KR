import Anthropic from "@anthropic-ai/sdk"

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

const MODEL = "claude-sonnet-4-6"

const AI_DISABLED_ERROR = "AI features require ANTHROPIC_API_KEY to be configured."

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JobExplanation {
  summary: string
  clearlyRequired: string[]
  preferred: string[]
  notSpecified: string[]
  koreanTextNotes: string | null
}

export interface MatchResult {
  overall: "Strong match" | "Good match" | "Potential match" | "Limited match"
  dimensions: {
    name: string
    rating: "Strong" | "Good" | "Review" | "Gap"
    reason: string
  }[]
  strengths: string[]
  gaps: string[]
  toReview: string[]
}

export interface SearchCriteria {
  keyword?: string
  location?: string
  experienceYears?: string
  english?: string
  korean?: string
  jobType?: string
  industry?: string
  salary_min?: number
  inferred: string[]  // which fields were inferred (not stated)
}

export interface JobDraft {
  title: string
  description: string
  requirements: { required: string[]; preferred: string[] }
  benefits: string[]
  korean_level: string
  english_required: string
  international_applicants: string
  sponsorship: string
  experience_years: string
  skills: string[]
}

// ─── Rate limiting (simple in-memory, resets per serverless instance) ─────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(userId: string, maxPerHour = 20): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 3600_000 })
    return true
  }
  if (entry.count >= maxPerHour) return false
  entry.count++
  return true
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function explainJob(
  jobDescription: string,
  requirements: { required: string[]; preferred: string[] } | null,
  candidateLanguage: "en" | "ko" | "ne" = "en"
): Promise<JobExplanation> {
  const reqText = requirements
    ? `Required: ${requirements.required.join(", ")}\nPreferred: ${requirements.preferred.join(", ")}`
    : ""

  const client = getClient()
  if (!client) throw new Error(AI_DISABLED_ERROR)

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are JOB-KR, a job portal assistant helping international workers understand Korean job postings.

Analyze this job posting and return a JSON object with these exact keys:
- summary: 2-3 sentences plain English explanation
- clearlyRequired: array of bullet points for clearly required qualifications
- preferred: array of bullet points for preferred/nice-to-have qualifications
- notSpecified: array of bullet points for important info NOT mentioned (sponsorship, relocation, etc.)
- koreanTextNotes: null, or a brief note if there's Korean text that needs explaining

CRITICAL RULES:
- Never add requirements the employer did not state
- If sponsorship is not mentioned, list it in notSpecified
- If visa is not mentioned, list it in notSpecified
- Only summarize what is explicitly in the posting

Job description:
${jobDescription}

${reqText}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : "{}"
  try {
    return JSON.parse(text) as JobExplanation
  } catch {
    return {
      summary: "Unable to generate explanation at this time.",
      clearlyRequired: [],
      preferred: [],
      notSpecified: [],
      koreanTextNotes: null,
    }
  }
}

export async function scoreMatch(
  job: {
    title: string
    description: string
    requirements: { required: string[]; preferred: string[] } | null
    visa_types: string[] | null
    city: string | null
    korean_level: string | null
    english_required: string | null
    sponsorship: string | null
    experience_years: string | null
  },
  candidate: {
    career_goals: string[] | null
    visa_type: string | null
    location: string | null
    skills: string[] | null
    experience_years: number | null
    current_title: string | null
    languages: Record<string, string>[] | null
    topik_level: string | null
  },
  userId: string
): Promise<MatchResult> {
  const client = getClient()
  if (!client) throw new Error(AI_DISABLED_ERROR)

  if (!checkRateLimit(userId)) {
    return {
      overall: "Potential match",
      dimensions: [],
      strengths: [],
      gaps: [],
      toReview: ["Rate limit reached. Try again later."],
    }
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are JOB-KR match engine. Analyze the compatibility between this job and candidate.

Return a JSON object with these exact keys:
- overall: one of "Strong match" | "Good match" | "Potential match" | "Limited match"
- dimensions: array of {name, rating, reason} where rating is "Strong"|"Good"|"Review"|"Gap"
  Dimensions to assess: Career fit, Skills fit, Experience fit, Language fit, Location fit, Work status
- strengths: array of bullet points (what the candidate has that the job needs)
- gaps: array of bullet points (what is missing or below requirement)
- toReview: array of bullet points (things the candidate should check with employer)

CRITICAL RULES:
- If sponsorship is not mentioned in the job, always add to toReview: "Employer has not stated sponsorship information"
- Never guess visa eligibility — only flag it as something to review
- Base ratings only on information provided

JOB:
Title: ${job.title}
Description: ${job.description}
Required: ${job.requirements?.required.join(", ") ?? "Not specified"}
Preferred: ${job.requirements?.preferred.join(", ") ?? "Not specified"}
Location: ${job.city ?? "Not specified"}
Visa types: ${job.visa_types?.join(", ") ?? "Not specified"}
Korean level: ${job.korean_level ?? "Not specified"}
English: ${job.english_required ?? "Not specified"}
Sponsorship: ${job.sponsorship ?? "Not specified"}
Experience: ${job.experience_years ?? "Not specified"}

CANDIDATE:
Career goals: ${candidate.career_goals?.join(", ") ?? "Not specified"}
Current visa: ${candidate.visa_type ?? "Not specified"}
Location: ${candidate.location ?? "Not specified"}
Skills: ${candidate.skills?.join(", ") ?? "Not specified"}
Experience years: ${candidate.experience_years ?? "Not specified"}
Current title: ${candidate.current_title ?? "Not specified"}
TOPIK level: ${candidate.topik_level ?? "None"}
Languages: ${JSON.stringify(candidate.languages ?? [])}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : "{}"
  try {
    return JSON.parse(text) as MatchResult
  } catch {
    return { overall: "Potential match", dimensions: [], strengths: [], gaps: [], toReview: [] }
  }
}

export async function parseJobSearch(
  naturalLanguageQuery: string,
  userId: string
): Promise<SearchCriteria> {
  const client = getClient()
  if (!client) throw new Error(AI_DISABLED_ERROR)

  if (!checkRateLimit(userId)) {
    return { keyword: naturalLanguageQuery, inferred: [] }
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are a job search parser for a Korean job portal. Parse this natural language job search query into structured criteria.

Return a JSON object with these optional keys (only include if mentioned or strongly implied):
- keyword: job title or field
- location: city in Korea
- experienceYears: e.g. "2" or "3-5"
- english: "Required" | "Preferred" | "Not required"
- korean: "None required" | "Basic" | "Intermediate" | "Advanced"
- jobType: "Full-time" | "Part-time" | "Contract"
- industry: industry category
- salary_min: minimum salary in KRW (number only)
- inferred: array of field names that were inferred (not explicitly stated by the user)

CRITICAL RULES:
- NEVER add salary, visa eligibility, or sponsorship unless explicitly stated
- NEVER infer these: salary, visa, sponsorship
- Only add a field to "inferred" if you guessed it rather than user stated it clearly

Query: "${naturalLanguageQuery}"

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : "{}"
  try {
    return JSON.parse(text) as SearchCriteria
  } catch {
    return { keyword: naturalLanguageQuery, inferred: [] }
  }
}

export async function structureJobFromText(
  employerInput: string,
  userId: string
): Promise<JobDraft> {
  const client = getClient()
  if (!client) throw new Error(AI_DISABLED_ERROR)

  if (!checkRateLimit(userId)) {
    return {
      title: "",
      description: employerInput,
      requirements: { required: [], preferred: [] },
      benefits: [],
      korean_level: "Not specified",
      english_required: "Not specified",
      international_applicants: "Not specified",
      sponsorship: "Not specified",
      experience_years: "Not specified",
      skills: [],
    }
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are a job posting assistant for a Korean job portal. Help structure this employer's description into a proper job listing.

Return a JSON object with these exact keys:
- title: suggested job title
- description: professional job description (2-3 paragraphs)
- requirements: { required: string[], preferred: string[] }
- benefits: array of benefits mentioned
- korean_level: Korean proficiency needed ("Not required" | "Basic" | "Intermediate" | "Advanced" | "Native" | "Not specified")
- english_required: ("Required" | "Preferred" | "Not required" | "Not specified")
- international_applicants: ("Welcome" | "Not applicable" | "Not specified")
- sponsorship: ("Provided" | "Not provided" | "Case by case" | "Not specified")
- experience_years: e.g. "2-5" or "Not specified"
- skills: array of relevant skills

CRITICAL RULES:
- Only include information the employer provided
- Use "Not specified" for anything not mentioned
- Never invent visa or sponsorship details

Employer's description:
${employerInput}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : "{}"
  try {
    return JSON.parse(text) as JobDraft
  } catch {
    return {
      title: "",
      description: employerInput,
      requirements: { required: [], preferred: [] },
      benefits: [],
      korean_level: "Not specified",
      english_required: "Not specified",
      international_applicants: "Not specified",
      sponsorship: "Not specified",
      experience_years: "Not specified",
      skills: [],
    }
  }
}

export async function suggestContactMessage(
  jobTitle: string,
  companyName: string,
  candidateName: string,
  userId: string
): Promise<string> {
  const client = getClient()
  if (!client) throw new Error(AI_DISABLED_ERROR)

  if (!checkRateLimit(userId)) return ""

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Write a brief, professional outreach message from an employer to a job candidate. Keep it under 100 words.

Context:
- Job: ${jobTitle}
- Company: ${companyName}
- Candidate name: ${candidateName}

The message should: express interest, mention the role, invite them to discuss further.
Return ONLY the message text, no labels or explanation.`,
      },
    ],
  })

  return message.content[0].type === "text" ? message.content[0].text : ""
}
