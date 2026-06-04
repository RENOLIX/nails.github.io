export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-[#fadbe0] text-gray-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide">Business Hours</h3>
          <p className="mt-4 text-sm font-semibold">Samedi — Jeudi</p>
          <p className="mt-2 text-sm">9:00 AM – 23:00 PM</p>
        </div>

        <div className="md:text-right">
          <h3 className="text-sm font-extrabold uppercase tracking-wide">Contact Us</h3>
          <div className="mt-4 grid gap-2 text-sm">
            <a href="mailto:contact@nailsymagic.com" className="hover:text-pink-700">
              contact@nailsymagic.com
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="hover:text-pink-700">
              Instagram
            </a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" className="hover:text-pink-700">
              TikTok
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-pink-200 px-4 py-4 text-center text-xs">
        © 2026 Nailsy Magic. Tous droits réservés.
      </div>
    </footer>
  );
}
