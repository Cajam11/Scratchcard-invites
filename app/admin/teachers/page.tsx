"use client";

import { useEffect, useState } from "react";
import HiddenWordEditor from "@/app/admin/components/HiddenWordEditor";
import Image from "next/image";

interface Teacher {
  id: string;
  name: string;
  slug: string;
  phrase_template: string;
  phrase_sentence: string;
  hidden_word: string;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  created_at: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sentence: "",
    hidden_word: "",
    event_date: "",
    event_time: "",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [previewTeacher, setPreviewTeacher] = useState<Teacher | null>(null);

  const loadTeachers = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      const res = await fetch("/api/admin/teachers");
      const data = await res.json();

      if (!res.ok) {
        setMessage(`Chyba: ${data.error || "Nepodarilo sa nacitat ucitelov"}`);
        return;
      }

      setTeachers(data.teachers || []);
    } catch (err) {
      console.error(err);
      setMessage("Chyba: Problem so sietou");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTeachers(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setQrUrl("");

    try {
      const response = await fetch("/api/admin/teachers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(
          `Chyba: ${result.error || "Nepodarilo sa vytvorit ucitela"}`,
        );
        return;
      }

      setMessage(`Ucitel "${result.teacher.name}" bol uspesne vytvoreny.`);
      setQrUrl(result.qrDataUrl);
      setFormData({
        name: "",
        sentence: "",
        hidden_word: "",
        event_date: "",
        event_time: "",
        location: "",
      });

      await loadTeachers();
    } catch (err) {
      console.error(err);
      setMessage("Chyba: Problem so sietou");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[#c4a661]/30 bg-[#121212]/95 p-6 shadow-lg shadow-black/50 sm:p-8">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c4a661] to-transparent" />
        <p className="text-xs uppercase tracking-[0.35em] text-[#c4a661]/80">
          Pozvanky
        </p>
        <h1 className="mt-3 text-3xl text-white sm:text-4xl">Ucitelia</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Sprava personalizovanych invite odkazov a QR kodov
        </p>
      </section>

      <section className="rounded-2xl border border-[#c4a661]/25 bg-[#121212]/90 p-6 shadow-lg shadow-black/40 sm:p-8">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-full border border-[#c4a661] px-6 py-2.5 text-xs uppercase tracking-[0.24em] text-[#c4a661] transition hover:bg-[#c4a661] hover:text-[#0a0a0a]"
        >
          {showForm ? "Zrusit" : "Pridat ucitela"}
        </button>

        {showForm && (
          <div className="mt-7 rounded-2xl border border-[#c4a661]/20 bg-black/25 p-5 sm:p-6">
            <h2 className="mb-5 text-lg uppercase tracking-[0.18em] text-[#c4a661]">
              Novy ucitel
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/85">
                    Meno
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Meno Priezvisko"
                    className="mt-2 w-full rounded-xl border border-[#c4a661]/20 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-[#c4a661]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/85">
                    Datum stuzkovej
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#c4a661]/20 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c4a661]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/85">
                    Cas
                  </label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) =>
                      setFormData({ ...formData, event_time: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-[#c4a661]/20 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#c4a661]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/85">
                    Miesto
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Miestnost alebo sala"
                    className="mt-2 w-full rounded-xl border border-[#c4a661]/20 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-[#c4a661]"
                  />
                </div>
              </div>

              <HiddenWordEditor
                sentence={formData.sentence}
                hiddenWord={formData.hidden_word}
                onSentenceChange={(sentence) =>
                  setFormData({ ...formData, sentence })
                }
                onHiddenWordChange={(hidden_word) =>
                  setFormData({ ...formData, hidden_word })
                }
              />

              <button
                type="submit"
                disabled={
                  submitting || !formData.hidden_word || !formData.sentence
                }
                className="w-full rounded-full border border-[#c4a661] bg-[#c4a661] py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#0a0a0a] transition hover:bg-[#d6b56a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Vytvaram..." : "Vytvorit ucitela"}
              </button>

              {message && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    message.startsWith("Chyba")
                      ? "border-red-500/30 bg-red-500/10 text-red-300"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {message}
                </div>
              )}

              {qrUrl && (
                <div className="rounded-xl border border-[#c4a661]/30 bg-[#c4a661]/5 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#c4a661]/90">
                    QR kod pozvanky
                  </p>
                  <Image
                    src={qrUrl}
                    alt="QR code"
                    width={192}
                    height={192}
                    className="rounded-lg bg-white p-2"
                  />
                </div>
              )}
            </form>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#c4a661]/25 bg-[#121212]/90 p-6 shadow-lg shadow-black/40 sm:p-8">
        {loading ? (
          <p className="text-[#c4a661]">Nacitavam ucitelov...</p>
        ) : teachers.length === 0 ? (
          <p className="text-neutral-400">
            Zatial nie su vytvoreni ziadni ucitelia.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#c4a661]/30 text-[#c4a661]">
                <tr>
                  <th className="pb-3 font-medium">Meno</th>
                  <th className="pb-3 font-medium">Veta</th>
                  <th className="pb-3 font-medium">Skryte slovo</th>
                  <th className="pb-3 font-medium">Datum pridania</th>
                  <th className="pb-3 font-medium">Akcia</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-b border-[#c4a661]/10 hover:bg-white/5"
                  >
                    <td className="py-3 text-white">{teacher.name}</td>
                    <td className="max-w-xs truncate py-3 text-neutral-400">
                      {teacher.phrase_sentence}
                    </td>
                    <td className="py-3 font-mono text-[#c4a661]">
                      {teacher.hidden_word}
                    </td>
                    <td className="py-3 text-neutral-500">
                      {new Date(teacher.created_at).toLocaleDateString("sk-SK")}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => setPreviewTeacher(teacher)}
                        className="rounded-full border border-[#c4a661]/50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#c4a661] transition hover:border-[#c4a661] hover:bg-[#c4a661]/10"
                      >
                        Nahlad
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {previewTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-md border border-[#c4a661]/40 bg-[#121212] p-8 shadow-2xl md:p-14">
            <button
              onClick={() => setPreviewTeacher(null)}
              className="absolute right-8 top-8 z-20 rounded-full border border-[#c4a661]/40 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[#c4a661] transition hover:border-[#c4a661] hover:bg-[#c4a661]/10"
            >
              Zavriet
            </button>

            <div className="absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 border-[#c4a661]/60" />
            <div className="absolute right-4 top-4 h-12 w-12 border-r-2 border-t-2 border-[#c4a661]/60" />
            <div className="absolute bottom-4 left-4 h-12 w-12 border-b-2 border-l-2 border-[#c4a661]/60" />
            <div className="absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-[#c4a661]/60" />

            <div className="relative z-10 mx-auto text-center">
              <h2 className="mb-4 text-sm uppercase tracking-[0.4em] text-[#c4a661]">
                Srdecne Vas pozyvame
              </h2>
              <h3 className="mb-6 text-4xl text-white">Nasa Stuzkova</h3>
              <p className="mb-10 text-xl italic text-neutral-300">
                Vazeny ucitel/ka
                <span className="mt-2 block text-2xl text-[#c4a661]">
                  {previewTeacher.name}
                </span>
              </p>

              <div className="mx-auto max-w-md rounded-lg border border-[#c4a661]/20 bg-black/40 p-8 backdrop-blur-sm">
                <div className="space-y-6">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                      Datum
                    </p>
                    <p className="text-2xl text-[#c4a661]">
                      {previewTeacher.event_date || "Doplnime"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                      Cas
                    </p>
                    <p className="text-2xl text-[#c4a661]">
                      {previewTeacher.event_time || "Doplnime"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                      Miesto
                    </p>
                    <p className="text-xl text-white">
                      {previewTeacher.location || "Doplnime"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
