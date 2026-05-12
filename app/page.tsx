import { Sora, Manrope } from 'next/font/google'
import Aurora from '@/app/components/Aurora'

const sora = Sora({ subsets: ['latin'], weight: ['500', '600', '700'] })
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600'] })

const tabloCards = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `Student ${index + 1}`,
}))

export default function Home() {
  return (
    <main className={`relative isolate min-h-screen overflow-hidden bg-[#05070b] text-slate-100 ${manrope.className}`}>
      <div className="pointer-events-none absolute inset-0 -z-30">
        <Aurora
          colorStops={['#0e1b36', '#183764', '#26589a']}
          blend={0.68}
          amplitude={0.9}
          speed={0.4}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_0%,rgba(37,86,153,0.32)_0%,rgba(5,7,11,0.92)_55%,rgba(5,7,11,1)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_28%,rgba(32,85,155,0.18)_56%,rgba(255,255,255,0)_75%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="mb-7 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.32em] text-[#8db4e8]">Digitalna pozvanka</p>
          <h1 className={`${sora.className} text-4xl leading-tight text-white sm:text-5xl`}>Nase triedne tablo</h1>
        </div>

        <div className="h-[76vh] min-h-[560px] w-full overflow-hidden rounded-3xl border border-[#2b5ea7]/60 bg-[linear-gradient(125deg,#07101f_5%,#0b1c33_46%,#091728_100%)] shadow-[0_32px_90px_rgba(2,6,15,0.9)]">
          <div className="grid h-full grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5 lg:p-7">
            {tabloCards.map((card) => (
              <div
                key={card.id}
                className="group flex flex-col rounded-2xl border border-[#2b5ea7]/35 bg-[#081427] p-3 transition hover:border-[#4e8ddf]"
              >
                <div className="mb-3 flex-1 rounded-xl bg-[radial-gradient(circle_at_35%_20%,#3d70b8_0%,#102441_48%,#091324_100%)]" />
                <p className={`${sora.className} text-sm text-[#d6e5fa]`}>{card.name}</p>
                <p className="mt-0.5 text-[11px] text-[#7b93b7]">4.B · 2026</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
