import { Clock3, Instagram, Mail, Music2 } from "lucide-react";
import SafeImage from "@/components/SafeImage.tsx";
import { NAILSY_LOGO } from "@/lib/assets.ts";

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-[#fadbe0] text-gray-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-4 py-9 text-center md:grid md:grid-cols-3 md:items-start md:gap-10 md:py-12 md:text-left">
        <div className="order-2 flex flex-col items-center md:order-1 md:items-start">
          <h3 className="flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] md:justify-start">
            <Clock3 className="h-4 w-4" />
            Business Hours
          </h3>
          <p className="mt-3 text-sm font-semibold">Samedi — Jeudi</p>
          <p className="mt-2 text-sm">9:00 AM – 23:00 PM</p>
        </div>

        <div className="order-1 flex flex-col items-center text-center md:order-2">
          <SafeImage
            src={NAILSY_LOGO}
            alt="Nailsy Magic"
            fallbackLabel="Nailsy Magic"
            fallbackClassName="bg-transparent p-0 text-2xl font-black text-pink-700 ring-0"
            className="h-20 w-auto object-contain md:h-24"
          />
          <div className="mt-5 hidden items-center justify-center gap-3 md:flex">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-pink-200/55 px-4 py-2 text-sm font-semibold hover:bg-pink-200"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-pink-200/55 px-4 py-2 text-sm font-semibold hover:bg-pink-200"
            >
              <Music2 className="h-4 w-4" />
              TikTok
            </a>
          </div>
        </div>

        <div className="order-3 flex flex-col items-center md:items-end md:text-right">
          <h3 className="flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] md:justify-end">
            Contact Us
            <Mail className="h-4 w-4" />
          </h3>
          <a href="mailto:contact@nailsymagic.com" className="mt-3 block text-sm hover:text-pink-700">
            contact@nailsymagic.com
          </a>
        </div>

        <div className="order-4 flex items-center justify-center gap-3 md:hidden">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-pink-200/55 px-4 py-2 text-sm font-semibold hover:bg-pink-200"
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-pink-200/55 px-4 py-2 text-sm font-semibold hover:bg-pink-200"
          >
            <Music2 className="h-4 w-4" />
            TikTok
          </a>
        </div>
      </div>

      <div className="mx-3 border-t border-pink-200 px-4 py-5 text-center text-xs text-slate-500 md:mx-auto md:max-w-7xl">
        © 2026 Nailsy Magic. Tous droits réservés.
      </div>
    </footer>
  );
}
