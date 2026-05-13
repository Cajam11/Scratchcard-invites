import { Sora, Manrope } from "next/font/google";
import Aurora from "@/app/components/Aurora";
import InvalidLinkPopup from "@/app/components/InvalidLinkPopup";

const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700"] });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"] });

const tabloCards = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `Student ${index + 1}`,
}));

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ invalidLink?: string }>;
}) {
  const params = await searchParams;
  const showInvalidLinkPopup = params.invalidLink === "1";

  return (
    <main
      className={`relative isolate min-h-screen overflow-hidden bg-[#05070b] text-slate-100 ${manrope.className}`}
    >
      {showInvalidLinkPopup ? <InvalidLinkPopup open={true} /> : null}
      <div className="pointer-events-none absolute inset-0 -z-30">
        <Aurora
          colorStops={["#0e1b36", "#183764", "#26589a"]}
          blend={0.68}
          amplitude={0.9}
          speed={0.4}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_0%,rgba(37,86,153,0.32)_0%,rgba(5,7,11,0.92)_55%,rgba(5,7,11,1)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_28%,rgba(32,85,155,0.18)_56%,rgba(255,255,255,0)_75%)]" />

      <section className="mx-auto flex h-screen w-full max-w-7xl flex-col justify-start px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10">
        <div className="mb-2 text-center">
          <p className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[#8db4e8]">
            Digitalna pozvanka
          </p>
          <h1
            className={`${sora.className} text-3xl leading-tight text-white sm:text-4xl lg:text-5xl`}
          >
            Nase triedne tablo
          </h1>
        </div>
        <div className="flex-1 w-full overflow-hidden">
          <div className="grid h-full grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6 lg:p-6">
            {tabloCards.map((card) => (
              <div
                key={card.id}
                className="group flex flex-col rounded-2xl border border-[#2b5ea7]/30 bg-transparent p-4 transition hover:border-[#4e8ddf]"
              >
                <div className="mb-4 flex-1 min-h-[100px] rounded-xl bg-[radial-gradient(circle_at_35%_20%,#3d70b8_0%,#102441_48%,#091324_100%)]" />
                <p className={`${sora.className} text-sm text-[#d6e5fa]`}>
                  {card.name}
                </p>
                <p className="mt-0.5 text-[11px] text-[#7b93b7]">4.B · 2026</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
