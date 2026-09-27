"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

type FAQItem = { q: string; a: string }
type FAQCategory = { title: string; items: FAQItem[] }

/* ── Korean ─────────────────────────────────────────────────────────────────── */
const faqKo: FAQCategory[] = [
  {
    title: "서비스 소개",
    items: [
      {
        q: "JOB-KR은 어떤 서비스인가요?",
        a: "JOB-KR은 한국에서 일하고자 하는 외국인 구직자와 국내 기업을 연결하는 채용 플랫폼입니다. E-7, E-9, H-2, F-4 등 비자 유형에 맞는 채용공고를 필터링할 수 있으며, 영어·한국어·네팔어 등 다국어를 지원합니다.",
      },
      {
        q: "이용 요금이 있나요?",
        a: "구직자는 완전히 무료로 이용할 수 있습니다. 회원가입, 채용공고 검색, 지원서 제출, 합격 알림까지 모든 서비스가 무료입니다. 기업 회원의 경우 채용공고 게시 플랜을 별도로 제공합니다.",
      },
      {
        q: "어느 나라 출신 구직자가 이용할 수 있나요?",
        a: "국적 제한 없이 누구나 이용 가능합니다. 특히 네팔, 베트남, 필리핀, 인도네시아, 태국 등 아시아권 구직자들이 많이 이용하고 있으며, 각자의 비자 유형에 맞는 채용공고를 찾을 수 있습니다.",
      },
    ],
  },
  {
    title: "구직자 — 지원하기",
    items: [
      {
        q: "지원서를 제출하려면 어떻게 해야 하나요?",
        a: "원하는 채용공고 페이지에서 '지금 지원하기' 버튼을 클릭하세요. 개인정보, 비자 정보, 학력·경력 사항을 입력하고 이력서와 필요 서류를 업로드하면 지원이 완료됩니다. 단계별 지원 양식이 안내해 드립니다.",
      },
      {
        q: "지원 현황은 어디서 확인하나요?",
        a: "'내 지원 현황' 페이지에서 지원한 모든 채용공고의 상태(검토 중, 면접 예정, 합격, 불합격)를 실시간으로 확인할 수 있습니다.",
      },
      {
        q: "이력서 없이도 지원할 수 있나요?",
        a: "이력서(PDF 또는 Word)를 업로드하면 더 유리하지만, 포털 내 지원 양식만으로도 지원이 가능합니다. 기업에 따라 요구 서류가 다를 수 있으니 채용공고 상세 페이지를 반드시 확인하세요.",
      },
      {
        q: "지원 후 연락이 얼마나 걸리나요?",
        a: "기업마다 다르지만 보통 1~2주 내에 1차 검토 결과를 통보합니다. JOB-KR은 합격·불합격 여부가 결정되면 이메일로 즉시 알려드립니다.",
      },
    ],
  },
  {
    title: "비자 & 자격 요건",
    items: [
      {
        q: "어떤 비자를 가진 사람이 지원할 수 있나요?",
        a: "E-7(특정활동), E-9(비전문취업), H-2(방문취업), F-4(재외동포), F-6(결혼이민) 등 다양한 비자 소지자가 지원 가능합니다. 각 채용공고에는 허용 비자 유형이 명시되어 있으므로, 비자 필터를 이용해 본인에게 해당하는 공고만 골라볼 수 있습니다.",
      },
      {
        q: "비자가 없어도 지원할 수 있나요?",
        a: "비자 스폰서십을 제공하는 기업에 한해 비자 미소지자도 지원이 가능합니다. 채용공고에 '비자 스폰서십 제공' 표시가 있는 공고를 찾아보세요. 단, 최종 채용 및 비자 발급은 해당 기업과 출입국관리소 심사 결과에 따라 결정됩니다.",
      },
      {
        q: "TOPIK 점수가 없으면 지원이 불가능한가요?",
        a: "TOPIK이 필요하지 않은 채용공고도 많습니다. 검색 필터에서 'TOPIK 불필요'를 선택하면 관련 공고만 볼 수 있습니다. 한국어 능력이 있다면 TOPIK 점수를 입력해 더 많은 기회를 얻을 수 있습니다.",
      },
    ],
  },
  {
    title: "기업 — 채용공고 게시",
    items: [
      {
        q: "채용공고는 어떻게 등록하나요?",
        a: "기업 계정으로 가입 후 '채용공고 게시' 버튼을 클릭하세요. 직무 정보, 요구 비자, 급여, 근무 조건 등을 입력하면 즉시 구직자들에게 노출됩니다.",
      },
      {
        q: "'인증된 기업' 배지는 어떻게 받나요?",
        a: "사업자등록증 및 고용 관련 서류를 제출하면 JOB-KR 검토 후 인증 배지를 부여합니다. 인증된 기업 공고는 구직자에게 신뢰도 높은 채용공고로 노출됩니다.",
      },
      {
        q: "외국인 채용 시 비자 지원은 어디서 받나요?",
        a: "JOB-KR은 채용 중개 서비스를 제공하며, 비자 발급 절차에 대한 기본 안내는 비자 가이드 페이지에서 확인하실 수 있습니다. 자세한 법무·행정 지원은 전문 행정사 또는 출입국관리소에 문의하시기 바랍니다.",
      },
    ],
  },
  {
    title: "계정 & 개인정보",
    items: [
      {
        q: "계정은 어떻게 만드나요?",
        a: "홈페이지 상단의 '무료 가입' 버튼을 클릭하고 이메일 주소, 이름, 비밀번호를 입력하면 됩니다. 구글 계정으로 간편 로그인도 지원합니다.",
      },
      {
        q: "개인정보는 안전하게 보호되나요?",
        a: "네. 모든 개인정보는 암호화되어 저장되며, 채용 목적 이외에는 사용되지 않습니다. 개인정보는 지원한 기업 담당자에게만 공개되며 제3자에게 무단 제공되지 않습니다. 자세한 내용은 개인정보처리방침을 확인하세요.",
      },
      {
        q: "알림 설정은 어떻게 변경하나요?",
        a: "'설정' 메뉴에서 이메일 알림과 채용 알림 수신 여부를 원하는 대로 변경할 수 있습니다. 관심 직종·지역·비자를 설정해 두면 새 공고가 등록될 때 자동으로 알림을 받을 수 있습니다.",
      },
    ],
  },
]

/* ── English ────────────────────────────────────────────────────────────────── */
const faqEn: FAQCategory[] = [
  {
    title: "About JOB-KR",
    items: [
      {
        q: "What is JOB-KR?",
        a: "JOB-KR is a job portal that connects international job seekers with Korean employers. Filter listings by visa type (E-7, E-9, H-2, F-4, and more) and navigate the entire process in English, Korean, or Nepali.",
      },
      {
        q: "Is it free to use?",
        a: "Completely free for job seekers — registration, job search, applying, and hire notifications all cost nothing. Employers have separate paid plans for posting listings.",
      },
      {
        q: "Which nationalities can use JOB-KR?",
        a: "Anyone can register regardless of nationality. JOB-KR is especially popular with job seekers from Nepal, Vietnam, the Philippines, Indonesia, and Thailand. Each listing clearly states which visa types are accepted.",
      },
    ],
  },
  {
    title: "Job Seekers — Applying",
    items: [
      {
        q: "How do I apply for a job?",
        a: "Open the listing you want and click 'Apply Now'. A step-by-step form guides you through personal details, visa status, education, work experience, and document uploads. Your application reaches the employer instantly.",
      },
      {
        q: "Where can I track my applications?",
        a: "Go to 'My Applications' to see the real-time status of every application — Under Review, Interview Scheduled, Hired, or Not Selected.",
      },
      {
        q: "Can I apply without a resume?",
        a: "Yes. The in-portal form is sufficient on its own, though uploading a resume (PDF or Word) strengthens your profile. Always check the listing for any required documents.",
      },
      {
        q: "How long does it take to hear back?",
        a: "Most employers respond within 1–2 weeks. JOB-KR emails you as soon as the employer updates your application status.",
      },
    ],
  },
  {
    title: "Visa & Eligibility",
    items: [
      {
        q: "Which visa holders can apply?",
        a: "E-7 (Specific Activities), E-9 (Non-professional Employment), H-2 (Working Visit), F-4 (Overseas Korean), F-6 (Marriage Immigrant), and more. Every listing shows accepted visa types, and the visa filter shows only jobs you're eligible for.",
      },
      {
        q: "Can I apply if I don't have a Korean work visa yet?",
        a: "Some employers offer visa sponsorship. Look for the 'Visa Sponsorship Available' badge on listings. Final hiring and visa approval are subject to the employer's decision and immigration authority review.",
      },
      {
        q: "Is TOPIK required for all jobs?",
        a: "No — many listings have no Korean language requirement. Use the 'No TOPIK required' filter to find them. If you have a TOPIK score, adding it unlocks more opportunities.",
      },
    ],
  },
  {
    title: "Employers — Posting Jobs",
    items: [
      {
        q: "How do I post a job listing?",
        a: "Create an employer account and click 'Post a Job'. Fill in role details, required visa types, salary range, and working conditions. Your listing goes live immediately and reaches thousands of international candidates.",
      },
      {
        q: "How do I get the 'Verified Employer' badge?",
        a: "Submit your business registration certificate and employment documents. After JOB-KR reviews them, your account receives the badge — which significantly boosts candidate trust and application rates.",
      },
      {
        q: "Can JOB-KR help with the visa sponsorship process?",
        a: "JOB-KR handles recruitment matching. For visa procedures, visit our Visa Guide page for a general overview. For legal and administrative support, consult a licensed immigration attorney or your local immigration office.",
      },
    ],
  },
  {
    title: "Account & Privacy",
    items: [
      {
        q: "How do I create an account?",
        a: "Click 'Register Free' at the top of any page. Enter your email, name, and password — or sign in quickly with your Google account.",
      },
      {
        q: "Is my personal information safe?",
        a: "Yes. All personal data is encrypted at rest. Your information is shared only with employers you have directly applied to and is never sold or passed to third parties. See our Privacy Policy for full details.",
      },
      {
        q: "How do I manage job alert notifications?",
        a: "In Settings, choose which alerts to receive by email. Set your preferred job type, location, and visa category — and you'll be notified the moment a matching job is posted.",
      },
    ],
  },
]

/* ── Nepali ─────────────────────────────────────────────────────────────────── */
const faqNe: FAQCategory[] = [
  {
    title: "JOB-KR बारे",
    items: [
      {
        q: "JOB-KR के हो?",
        a: "JOB-KR एक जागिर पोर्टल हो जसले अन्तर्राष्ट्रिय जागिर खोज्नेहरूलाई कोरियाली नियोक्ताहरूसँग जोड्छ। E-7, E-9, H-2, F-4 लगायत भिसा प्रकारअनुसार जागिर खोज्न सकिन्छ। अंग्रेजी, कोरियन र नेपाली भाषामा उपलब्ध छ।",
      },
      {
        q: "के यो निःशुल्क छ?",
        a: "जागिर खोज्नेहरूका लागि पूर्णतः निःशुल्क छ। दर्ता, जागिर खोज्नु, आवेदन दिनु र सूचना प्राप्त गर्नु — सबै निःशुल्क। नियोक्ताहरूका लागि पेड प्लान उपलब्ध छ।",
      },
      {
        q: "कुन राष्ट्रियताका व्यक्तिले प्रयोग गर्न सक्छन्?",
        a: "जुनसुकै राष्ट्रियताका व्यक्तिले दर्ता गर्न सक्छन्। नेपाल, भियतनाम, फिलिपिन्स, इन्डोनेसिया र थाइल्यान्डका उम्मेदवारहरू विशेष गरी धेरै प्रयोग गर्छन्।",
      },
    ],
  },
  {
    title: "जागिर खोज्नेहरू — आवेदन",
    items: [
      {
        q: "आवेदन कसरी दिने?",
        a: "मनपरेको जागिर पेजमा गएर 'अहिले नै आवेदन दिनुहोस्' क्लिक गर्नुहोस्। व्यक्तिगत विवरण, भिसा जानकारी, शिक्षा, अनुभव र कागजात अपलोड गर्दै चरण-दर-चरण फारम भर्नुहोस्।",
      },
      {
        q: "आवेदनको स्थिति कहाँ हेर्ने?",
        a: "'मेरो आवेदन' पेजमा सबै आवेदनको अवस्था — समीक्षामा, अन्तर्वार्ता तय, छनोट, छनोट नभएको — वास्तविक समयमा हेर्न सकिन्छ।",
      },
      {
        q: "CV बिना आवेदन दिन सकिन्छ?",
        a: "हो, पोर्टलको आवेदन फारम नै पर्याप्त छ। तर CV (PDF वा Word) अपलोड गर्दा आवेदन बलियो हुन्छ। जागिर विज्ञापनमा उल्लेख भएका कागजात जाँच्नुहोस्।",
      },
      {
        q: "जवाफ आउन कति समय लाग्छ?",
        a: "अधिकांश नियोक्ताले १–२ हप्तामा जवाफ दिन्छन्। नियोक्ताले स्थिति अपडेट गरेपछि JOB-KR ले तुरुन्त इमेल पठाउँछ।",
      },
    ],
  },
  {
    title: "भिसा र योग्यता",
    items: [
      {
        q: "कुन भिसा भएकाले आवेदन दिन सक्छन्?",
        a: "E-7 (विशेष क्रियाकलाप), E-9 (गैर-पेशेवर रोजगार), H-2 (कार्य भ्रमण), F-4 (प्रवासी कोरियन), F-6 (विवाह आप्रवासी) लगायत अन्य। प्रत्येक जागिर विज्ञापनमा स्वीकार्य भिसा उल्लेख छ।",
      },
      {
        q: "भिसा नभई आवेदन दिन सकिन्छ?",
        a: "केही नियोक्ताले भिसा स्पोन्सरशिप दिन्छन्। 'भिसा स्पोन्सरशिप उपलब्ध' ब्याज भएका जागिर खोज्नुहोस्। अन्तिम निर्णय नियोक्ता र आप्रवासन कार्यालयले गर्छ।",
      },
      {
        q: "TOPIK नभएपनि आवेदन दिन सकिन्छ?",
        a: "हो। धेरै जागिरमा TOPIK आवश्यक छैन। 'TOPIK आवश्यक छैन' फिल्टर प्रयोग गर्नुहोस्। TOPIK अंक भएमा थप अवसरहरू उपलब्ध हुन्छन्।",
      },
    ],
  },
  {
    title: "नियोक्ता — जागिर पोस्ट गर्ने",
    items: [
      {
        q: "जागिर विज्ञापन कसरी पोस्ट गर्ने?",
        a: "नियोक्ता खाता बनाएर 'जागिर पोस्ट गर्नुहोस्' क्लिक गर्नुहोस्। पद, भिसा, तलब र काम सम्बन्धी जानकारी भर्नुहोस्। तुरुन्त हजारौं उम्मेदवारलाई देखिन्छ।",
      },
      {
        q: "'प्रमाणित नियोक्ता' ब्याज कसरी पाउने?",
        a: "व्यवसाय दर्ता प्रमाण र रोजगार सम्बन्धी कागजात पेश गर्नुहोस्। JOB-KR ले समीक्षा गरेपछि प्रमाणित ब्याज दिन्छ।",
      },
      {
        q: "भिसा प्रक्रियामा JOB-KR सहयोग गर्छ?",
        a: "JOB-KR भर्ती मिलान सेवा प्रदान गर्छ। भिसा प्रक्रियाको सामान्य जानकारी भिसा गाइड पेजमा छ। विस्तृत कानुनी सहायताका लागि आप्रवासन विशेषज्ञसँग सल्लाह गर्नुहोस्।",
      },
    ],
  },
  {
    title: "खाता र गोपनीयता",
    items: [
      {
        q: "खाता कसरी बनाउने?",
        a: "पेजको माथि 'निःशुल्क दर्ता' क्लिक गर्नुहोस् र इमेल, नाम र पासवर्ड राख्नुहोस्। Google खाताबाट पनि छिटो साइन इन गर्न सकिन्छ।",
      },
      {
        q: "मेरो जानकारी सुरक्षित छ?",
        a: "हो। सबै व्यक्तिगत जानकारी इन्क्रिप्ट गरेर भण्डारण गरिन्छ। तपाईंले आवेदन दिएका नियोक्तालाई मात्र जानकारी पठाइन्छ। तेस्रो पक्षलाई कहिल्यै बेचिँदैन।",
      },
      {
        q: "जागिर सूचना कसरी सेट गर्ने?",
        a: "'सेटिङ'मा गएर मनपरेको जागिर प्रकार, स्थान र भिसा छान्नुहोस्। त्यस्तो नयाँ जागिर पोस्ट हुनासाथ इमेल सूचना प्राप्त गर्नुहुनेछ।",
      },
    ],
  },
]

/* ── Accordion ──────────────────────────────────────────────────────────────── */
function AccordionItem({ item, open, onToggle }: { item: FAQItem; open: boolean; onToggle: () => void }) {
  return (
    <div className={`border-b border-gray-100 last:border-0 transition-colors ${open ? "bg-blue-50/40" : ""}`}>
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`text-sm font-semibold leading-relaxed ${open ? "text-blue-700" : "text-gray-800"}`}>
          {item.q}
        </span>
        <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-blue-600" : "text-gray-400"}`} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm leading-relaxed text-gray-600">{item.a}</p>
        </div>
      )}
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function FAQPage() {
  const { lang } = useLang()
  const faq = lang === "ko" ? faqKo : lang === "ne" ? faqNe : faqEn

  const heading = lang === "ko" ? "자주 묻는 질문" : lang === "ne" ? "बारम्बार सोधिने प्रश्नहरू" : "Frequently Asked Questions"
  const sub = lang === "ko"
    ? "JOB-KR 채용 플랫폼에 대해 궁금한 점을 확인하세요."
    : lang === "ne"
    ? "JOB-KR जागिर पोर्टलका बारेमा सामान्य प्रश्नहरू।"
    : "Everything you need to know about finding work in Korea."

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setOpenMap(m => ({ ...m, [key]: !m[key] }))

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-600">FAQ</p>
          <h1 className="text-3xl font-extrabold text-gray-900">{heading}</h1>
          <p className="mt-2 text-gray-500">{sub}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-5">
          {faq.map((cat) => (
            <div key={cat.title} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">{cat.title}</h2>
              </div>
              {cat.items.map((item, idx) => {
                const key = `${cat.title}-${idx}`
                return (
                  <AccordionItem
                    key={key}
                    item={item}
                    open={!!openMap[key]}
                    onToggle={() => toggle(key)}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Contact footer */}
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5 text-center">
          <p className="text-sm font-semibold text-blue-800">
            {lang === "ko" ? "더 궁금한 점이 있으신가요?" : lang === "ne" ? "थप प्रश्न छ?" : "Still have questions?"}
          </p>
          <p className="mt-1 text-sm text-blue-600">
            {lang === "ko" ? "고객센터: " : lang === "ne" ? "ग्राहक सेवा: " : "Contact us: "}
            <a href="mailto:changhyeok@naver.com" className="font-medium underline underline-offset-2">changhyeok@naver.com</a>
            {" · "}
            <a href="tel:070-7012-2881" className="font-medium underline underline-offset-2">070-7012-2881</a>
          </p>
        </div>
      </div>
    </div>
  )
}
