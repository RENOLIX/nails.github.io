import { Clock3, Instagram, Mail, Music2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-[#fadbe0] text-gray-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:items-start">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em]">
            <Clock3 className="h-4 w-4" />
            Business Hours
          </h3>
          <p className="mt-5 text-sm font-semibold">Samedi — Jeudi</p>
          <p className="mt-2 text-sm">9:00 AM – 23:00 PM</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <img
            src="https://hercules-cdn.com/file_kph7rblw10KlLe96KcNfrsHH"
            alt="Nailsy Magic"
            className="h-20 w-auto object-contain"
          />
          <div className="mt-5 flex items-center justify-center gap-3">
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

        <div className="md:text-right">
          <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] md:justify-end">
            Contact Us
            <Mail className="h-4 w-4" />
          </h3>
          <a href="mailto:contact@nailsymagic.com" className="mt-5 block text-sm hover:text-pink-700">
            contact@nailsymagic.com
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-pink-200 px-4 py-5 text-center text-xs text-slate-500">
        © 2026 Nailsy Magic. Tous droits réservés.
      </div>
    </footer>
  );
}
