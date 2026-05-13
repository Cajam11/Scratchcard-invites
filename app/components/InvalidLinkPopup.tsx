"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type InvalidLinkPopupProps = {
  open: boolean;
};

export default function InvalidLinkPopup({ open }: InvalidLinkPopupProps) {
  const [visible, setVisible] = useState(open);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!visible) {
    return null;
  }

  const closePopup = () => {
    setVisible(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("invalidLink");
    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#3a6bb0] bg-[#071325] p-6 shadow-[0_25px_80px_rgba(2,6,15,0.9)]">
        <h2 className="text-lg font-semibold text-white">Nespravny odkaz</h2>
        <p className="mt-2 text-sm text-[#c4d7f4]">
          Zadali ste nespravny link. Presmerovali sme vas na domovsku stranku.
        </p>
        <button
          type="button"
          onClick={closePopup}
          className="mt-5 w-full rounded-xl border border-[#4e8ddf] bg-[#102648] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#16335f]"
        >
          Rozumiem
        </button>
      </div>
    </div>
  );
}
