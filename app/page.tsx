import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#f8fafc_42%,_#e2e8f0_100%)] text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-amber-300/70 bg-white/70 px-4 py-1 text-sm font-medium tracking-wide text-amber-800 shadow-sm backdrop-blur">
            Digitálna stužková pozvánka
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Jednoduchá brána pre učiteľov, ktorá odomkne oznamko po overení hlášky.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Každý učiteľ dostane vlastný link alebo QR kód. Najprv zadá preddefinovanú hlášku,
            potom sa mu zobrazí skryté oznamko so scratch efektom a detailmi stužkovej.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Admin prístup
            </Link>
            <Link
              href="/invite/demo"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white/70 px-6 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-white"
            >
              Ukážka pozvánky
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
