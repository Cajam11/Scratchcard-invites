"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { Sora, Manrope } from "next/font/google";
import html2canvas from "html2canvas";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScratchCard from "@/app/components/ScratchCard";
import Aurora from "@/app/components/Aurora";

const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700"] });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"] });
const classStudents = [
  "A. Novak",
  "M. Kralova",
  "T. Benko",
  "L. Bielik",
  "S. Horvat",
  "N. Urban",
  "E. Juran",
  "P. Svec",
  "Z. Konecna",
  "V. Kollar",
  "R. Marek",
  "K. Blaho",
  "J. Vlcek",
  "B. Sedlak",
  "F. Cernak",
  "D. Hudak",
  "M. Polak",
  "I. Nemec",
  "O. Varga",
  "H. Blazej",
  "C. Lukac",
  "G. Michal",
  "A. Ruzicka",
  "T. Hanak",
  "L. Kolar",
  "S. Fibich",
  "N. Zeman",
  "E. Babic",
  "P. Durica",
  "Z. Toth",
];

const teacherTitle = "Nášmu učiteľovi/učiteľke";
const teacherText =
  "Sme radi, že sme mali tú česť stráviť štyri roky po Vašom boku. Ďakujeme Vám za trpezlivosť, pochopenie a všetku podporu, ktorú ste nám počas týchto rokov venovali. Každá hodina, každá rada a každý moment strávený s Vami nám zostane hlboko v srdci. Bolo nám cťou byť Vašou triedou a vždy na Vás budeme spomínať s úsmevom. Ďakujeme, že ste boli nielen naším učiteľom, ale aj sprievodcom na tejto ceste.";

type TeacherData = {
  phrase_template?: string | null;
  phrase_sentence?: string | null;
  name?: string | null;
};

type VerifyData = {
  success?: boolean;
  token?: string;
  error?: string;
};

type NoticeDetails = {
  event_date?: string | null;
  event_time?: string | null;
  location?: string | null;
};

type NoticeData = {
  success?: boolean;
  notice?: NoticeDetails;
};

async function getTeacher(slug: string): Promise<TeacherData> {
  const res = await fetch(`/api/teachers/${slug}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

async function verify(slug: string, userInput: string) {
  const res = await fetch("/api/verify", {
    method: "POST",
    body: JSON.stringify({ slug, userInput }),
    headers: { "Content-Type": "application/json" },
  });
  const data = (await res.json()) as VerifyData;
  return { ok: res.ok, data };
}

async function fetchNotice(slug: string, token: string) {
  const res = await fetch(`/api/notice/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await res.json()) as NoticeData;
}

function UserBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-30">
        <Aurora
          colorStops={["#0e1b36", "#183764", "#26589a"]}
          blend={0.65}
          amplitude={0.9}
          speed={0.38}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_0%,rgba(37,86,153,0.32)_0%,rgba(5,7,11,0.92)_55%,rgba(5,7,11,1)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_28%,rgba(32,85,155,0.18)_56%,rgba(255,255,255,0)_75%)]" />
    </>
  );
}

export default function InvitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const invitationRef = useRef<HTMLDivElement | null>(null);
  const invitationCardRef = useRef<HTMLDivElement | null>(null);
  const [template, setTemplate] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<NoticeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [successStatus, setSuccessStatus] = useState(false);
  const [isInviteFlipped, setIsInviteFlipped] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const loadTeacher = useCallback(async () => {
    try {
      const data = await getTeacher(slug);
      setTemplate(data.phrase_template || data.phrase_sentence || "");
      setTeacherName(data.name || "");
      setLoading(false);
    } catch {
      setError(
        "Nepodarilo sa nacitat pozvanku. Skontrolujte, ci je odkaz spravny.",
      );
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTeacher();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadTeacher]);

  useEffect(() => {
    if (!successStatus) return;
    invitationCardRef.current?.focus();
  }, [successStatus]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDownloadError(null);

    const { ok, data } = await verify(slug, userInput);
    if (!ok || !data.success) {
      if (data.error) return setError(data.error);
      return setError("Nespravne slovo. Skuste znova.");
    }

    if (!data.token) {
      setError("Chyba overenia. Skuste to znova.");
      return;
    }

    const noticeData = await fetchNotice(slug, data.token);
    if (noticeData.success && noticeData.notice) {
      setIsInviteFlipped(false);
      setSuccessStatus(true);
      setEventDetails(noticeData.notice);
      return;
    }

    setError("Nepodarilo sa nacitat detaily pozvanky.");
  };

  const onInviteCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setIsInviteFlipped(true);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setIsInviteFlipped(false);
    }
  };

  const showInviteFront = () => {
    setIsInviteFlipped(false);
  };

  const showInviteBack = () => {
    setIsInviteFlipped(true);
  };

  const handleDownloadInvite = async () => {
    const invitationNode = invitationRef.current;
    if (!invitationNode) {
      setDownloadError("Pozvanku sa nepodarilo pripravit na stiahnutie.");
      return;
    }

    setDownloading(true);
    setDownloadError(null);

    try {
      const canvas = await html2canvas(invitationNode, {
        backgroundColor: "#05070b",
        scale: Math.min(2, window.devicePixelRatio || 1),
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedRoot = clonedDoc.querySelector(
            '[data-export-root="invite"]',
          );
          if (!(clonedRoot instanceof HTMLElement)) return;
          clonedRoot.style.boxShadow = "none";
        },
        ignoreElements: (element) =>
          element instanceof HTMLElement &&
          (element.dataset.scratchOverlay === "true" ||
            element.dataset.downloadExclude === "true"),
      });

      const safeName = (teacherName || slug)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `pozvanka-${safeName || "stuzkova"}.png`;
      link.click();
    } catch (downloadErr) {
      console.error("Download invite failed:", downloadErr);
      setDownloadError("Stiahnutie zlyhalo. Skuste to prosim znova.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <main
        className={`relative isolate min-h-screen overflow-hidden bg-[#05070b] ${manrope.className}`}
      >
        <UserBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <p className="text-base sm:text-xl text-[#88a4cc] animate-pulse">
            Nacitavam vasu pozvanku...
          </p>
        </div>
      </main>
    );
  }

  if (successStatus && eventDetails) {
    return (
      <main
        className={`relative isolate min-h-screen overflow-hidden bg-[#05070b] ${manrope.className}`}
      >
        <UserBackground />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-3 py-6 sm:px-8 lg:px-12">
          <div className="relative w-full">
            <button
              type="button"
              onClick={showInviteFront}
              aria-label="Zobrazit prednu stranu pozvanky"
              className="absolute -left-8 top-1/2 z-20 -translate-y-1/2 px-1 py-1 text-[#dbe8fb] transition hover:text-[#ffffff] focus:outline-none focus-visible:outline-none focus:ring-0 sm:-left-12 lg:-left-16"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              onClick={showInviteBack}
              aria-label="Zobrazit zadnu stranu pozvanky"
              className="absolute -right-8 top-1/2 z-20 -translate-y-1/2 px-1 py-1 text-[#dbe8fb] transition hover:text-[#ffffff] focus:outline-none focus-visible:outline-none focus:ring-0 sm:-right-12 lg:-right-16"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div
              ref={invitationRef}
              data-export-root="invite"
              className="w-full"
            >
              <div
                className="w-full [perspective:1400px]"
                role="button"
                tabIndex={0}
                ref={invitationCardRef}
                onKeyDown={onInviteCardKeyDown}
                aria-label="Pozvanka. Tlacidla sipok po stranach prepnu medzi prednou a zadnou stranou."
              >
                <div
                  className={`relative min-h-[clamp(27rem,60vh,42rem)] transition-transform duration-500 ease-out [transform-style:preserve-3d] lg:min-h-[clamp(27rem,56vh,44rem)] ${
                    isInviteFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-none border border-[rgba(46,95,168,0.58)] bg-[linear-gradient(120deg,#07101d_5%,#0c1b32_50%,#091624_100%)] shadow-[0_24px_72px_rgba(2,6,15,0.75)] [backface-visibility:hidden] [transform:rotateY(0deg)]">
                    <div className="grid h-full grid-cols-1 divide-y divide-[rgba(46,95,168,0.16)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-[0.92fr_1.16fr_0.92fr] lg:divide-x lg:divide-[rgba(46,95,168,0.16)]">
                      <section className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(11,24,44,0.55)_0%,rgba(7,15,28,0.78)_100%)] px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
                        <p className="mb-2 sm:mb-3 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.26em] text-[#88a4cc]">
                          Trieda 4.D
                        </p>
                        <h2
                          className={`${sora.className} mb-2 sm:mb-3 text-lg sm:text-2xl text-white`}
                        >
                          {teacherTitle}
                        </h2>
                        <p className="mt-1 sm:mt-2 max-w-[36ch] text-xs sm:text-sm leading-6 sm:leading-7 text-[#dbe8fb]">
                          {teacherText}
                        </p>
                      </section>

                      <section className="relative flex h-full flex-col bg-[linear-gradient(180deg,rgba(2,6,15,0.98)_0%,rgba(3,8,18,1)_100%)] px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 sm:col-span-2 lg:col-span-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[linear-gradient(180deg,transparent,rgba(123,167,233,0.35),transparent)]" />
                        <p
                          data-download-exclude="true"
                          className="mb-2 sm:mb-3 text-center text-[9px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#88a4cc]"
                        >
                          Zotrite panel a odhalte detaily
                        </p>
                        <div className="flex-1">
                          <ScratchCard
                            containerClassName="max-w-none h-full rounded-none border-0 shadow-none"
                            contentClassName="bg-[#040812] h-full"
                          >
                            <div className="flex h-full w-full flex-col justify-center bg-[#040812] px-4 sm:px-8 py-4 sm:py-6">
                              <div className="grid gap-3 sm:gap-4 grid-cols-1 text-center">
                                <div className="border-b border-[rgba(123,167,233,0.14)] pb-3 sm:pb-4">
                                  <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#88a4cc]">
                                    Datum
                                  </p>
                                  <p
                                    className={`${sora.className} mt-1.5 sm:mt-2 text-2xl sm:text-4xl text-[#9bc1ff] break-words leading-none`}
                                  >
                                    {eventDetails.event_date || "Doplnime"}
                                  </p>
                                </div>
                                <div className="border-b border-[rgba(123,167,233,0.14)] pb-3 sm:pb-4">
                                  <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#88a4cc]">
                                    Cas
                                  </p>
                                  <p
                                    className={`${sora.className} mt-1.5 sm:mt-2 text-2xl sm:text-4xl text-[#9bc1ff] break-words leading-none`}
                                  >
                                    {eventDetails.event_time || "Doplnime"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#88a4cc]">
                                    Miesto
                                  </p>
                                  <p
                                    className={`${sora.className} mt-1.5 sm:mt-2 text-xl sm:text-3xl text-white break-words leading-tight`}
                                  >
                                    {eventDetails.location || "Doplnime"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </ScratchCard>
                        </div>
                      </section>

                      <section className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(11,24,44,0.55)_0%,rgba(7,15,28,0.78)_100%)] px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 sm:col-span-2 lg:col-span-1">
                        <p className="mb-2 sm:mb-3 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#88a4cc]">
                          Stuzkova pozvanka
                        </p>
                        <h1
                          className={`${sora.className} text-lg sm:text-[1.75rem] text-white leading-tight`}
                        >
                          Nasa Stuzkova
                        </h1>
                        <p className="mt-2 sm:mt-4 text-sm sm:text-base text-[#d9e3f2]">
                          Vazeny ucitel/ka
                        </p>
                        <p
                          className={`${sora.className} mt-1 text-base sm:text-[1.5rem] text-[#9bc1ff] break-words`}
                        >
                          {teacherName}
                        </p>

                        <p className="mt-3 sm:mt-5 text-xs sm:text-sm leading-5 sm:leading-7 text-[#d6e1f1] flex-1">
                          Srdecne Vas pozyvame na nasu stuzkovu. Tesime sa, ze
                          budete sucastou nasho vecera.
                        </p>

                        <div className="mt-3 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="bg-[#08162a]/80 px-3 py-2 border border-[rgba(46,95,168,0.16)]">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#88a4cc]">
                              Rocnik
                            </p>
                            <p
                              className={`${sora.className} mt-1 text-sm sm:text-base text-white`}
                            >
                              2026
                            </p>
                          </div>
                          <div className="bg-[#08162a]/80 px-3 py-2 border border-[rgba(46,95,168,0.16)]">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#88a4cc]">
                              Trieda
                            </p>
                            <p
                              className={`${sora.className} mt-1 text-sm sm:text-base text-white`}
                            >
                              4.D
                            </p>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  <div className="absolute inset-0 overflow-hidden rounded-none border border-[rgba(46,95,168,0.58)] bg-[linear-gradient(120deg,#060d19_5%,#0a1628_50%,#060f1d_100%)] shadow-[0_24px_72px_rgba(2,6,15,0.75)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex h-full w-full flex-col bg-[#040812] px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
                      <p className="mb-2 sm:mb-3 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.26em] text-[#88a4cc]">
                        Trieda 4.D
                      </p>
                      <h2
                        className={`${sora.className} mb-2 sm:mb-3 text-lg sm:text-2xl text-white`}
                      >
                        Ziaci triedy
                      </h2>
                      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                        <div className="grid content-start grid-cols-2 gap-1.5 text-[10px] sm:grid-cols-3 sm:text-[11px]">
                          {classStudents.map((name) => (
                            <p
                              key={`back-${name}`}
                              className="rounded-md border border-[rgba(46,95,168,0.26)] bg-[#0a1830] px-2 py-1 text-center leading-tight text-[#d6e5fa]"
                            >
                              {name}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <button
              onClick={handleDownloadInvite}
              disabled={downloading}
              className="inline-flex items-center justify-center rounded-full border border-[#3f7ad1] bg-[#367ae0] px-4 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#e7f1ff] transition hover:bg-[#3a75cb] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading ? "Pripravujem PNG..." : "Stiahnut pozvanku (PNG)"}
            </button>
            {downloadError && (
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-400">
                {downloadError}
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`relative isolate min-h-screen overflow-hidden bg-[#05070b] ${manrope.className}`}
    >
      <UserBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-3 py-6 sm:px-8 lg:px-12">
        <div className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[rgba(46,95,168,0.54)] bg-[linear-gradient(115deg,#07101d_4%,#0c1b32_50%,#091624_100%)] p-4 sm:p-8 lg:p-10 shadow-[0_38px_110px_rgba(2,6,15,0.95)]">
          <div className="text-center">
            <p className="mb-1 sm:mb-2 text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#88a4cc]">
              Overenie pozvanky
            </p>
            <h1
              className={`${sora.className} text-2xl sm:text-3xl lg:text-4xl text-white leading-tight`}
            >
              Doplnte chybajuce slovo
            </h1>
            <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#d6e1f1]">
              Pred odhalenim detailov pozvanky zadajte overovacie slovo do
              formulara.
            </p>

            {template ? (
              <p className="mt-4 sm:mt-8 rounded-xl border border-[rgba(46,95,168,0.36)] bg-[#08162a] px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-lg italic leading-6 sm:leading-8 text-[#d6e1f1] break-words">
                &quot;{template}&quot;
              </p>
            ) : null}

            <form
              className="mt-6 sm:mt-8 space-y-3 sm:space-y-4"
              onSubmit={onSubmit}
            >
              <div className="mx-auto max-w-sm">
                <input
                  type="text"
                  autoComplete="off"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Zadajte slovo..."
                  className="w-full rounded-xl border border-[rgba(46,95,168,0.5)] bg-[#08162a] px-3 sm:px-4 py-2 sm:py-3 text-center text-base sm:text-lg text-[#dbe9ff] outline-none placeholder:text-[#6b85ac] focus:border-[#6ea1eb]"
                />
              </div>

              {error && (
                <p className="text-xs sm:text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                className="inline-flex rounded-full border border-[#3f7ad1] bg-[#2f64b3] px-6 sm:px-8 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#e7f1ff] transition hover:bg-[#3a75cb]"
              >
                Potvrdit
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
