import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles, Shield, Users, ArrowRight, Search, Briefcase } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

const featureIcons = [
  <Sparkles className="h-6 w-6" />,
  <Shield className="h-6 w-6" />,
  <Search className="h-6 w-6" />,
]

export default function EmployersPage() {
  const { t } = useLang()

  const features = [
    { icon: featureIcons[0], title: t.employers.why.features[0].title, desc: t.employers.why.features[0].desc },
    { icon: featureIcons[1], title: t.employers.why.features[1].title, desc: t.employers.why.features[1].desc },
    { icon: featureIcons[2], title: t.employers.why.features[2].title, desc: t.employers.why.features[2].desc },
  ]

  const steps = [
    { n: t.employers.howItWorks.steps[0].num, title: t.employers.howItWorks.steps[0].title, desc: t.employers.howItWorks.steps[0].desc },
    { n: t.employers.howItWorks.steps[1].num, title: t.employers.howItWorks.steps[1].title, desc: t.employers.howItWorks.steps[1].desc },
    { n: t.employers.howItWorks.steps[2].num, title: t.employers.howItWorks.steps[2].title, desc: t.employers.howItWorks.steps[2].desc },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 py-20 text-white">
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Briefcase className="h-4 w-4" /> {t.employers.badge}
          </div>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            {t.employers.title}
          </h1>
          <p className="mt-5 text-lg text-blue-100">
            {t.employers.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth/register?role=employer">
              <Button size="lg" className="h-12 bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold">
                {t.employers.startHiring} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="h-12 border-white/40 text-white hover:bg-white/10">
                {t.employers.signIn}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">{t.employers.why.title}</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-200 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">{f.icon}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">{t.employers.howItWorks.title}</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-xl font-extrabold text-white">{s.n}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{t.employers.pricing.title}</h2>
          <p className="mb-8 text-gray-500">{t.employers.pricing.subtitle}</p>
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-8">
            <p className="text-4xl font-extrabold text-blue-700">{t.employers.pricing.price}</p>
            <p className="mt-1 text-gray-500">{t.employers.pricing.period}</p>
            <div className="mt-6 space-y-3 text-left">
              {t.employers.pricing.features.map((item: string) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />{item}
                </div>
              ))}
            </div>
            <Link href="/auth/register?role=employer" className="block mt-8">
              <Button size="lg" className="w-full bg-blue-700 hover:bg-blue-800 text-white">{t.employers.pricing.btn}</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">{t.employers.pricing.note}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 py-14 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold">{t.employers.bottomCta.title}</h2>
          <p className="mt-3 text-blue-200">{t.employers.bottomCta.subtitle}</p>
          <Link href="/auth/register?role=employer" className="mt-6 inline-block">
            <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold">
              {t.employers.bottomCta.btn} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
