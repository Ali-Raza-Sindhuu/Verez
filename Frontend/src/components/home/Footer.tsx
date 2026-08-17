const socialIcons = [
  {
    label: "Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 1.6a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8ZM17.6 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
  },
  {
    label: "Facebook",
    path: "M13.5 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.8h2.5V21h3Z",
  },
  {
    label: "LinkedIn",
    path: "M6.9 8.4H3.7V20h3.2V8.4ZM5.3 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.3 20h-3.2v-6c0-1.4 0-3.2-2-3.2s-2.3 1.6-2.3 3.1V20H9.6V8.4h3.1v1.6h.05c.4-.8 1.5-1.6 3.1-1.6 3.3 0 3.9 2.2 3.9 5V20Z",
  },
];

const columns = [
  { title: "Menu", links: ["Home", "Pricing plans", "About us", "Contact us"] },
  { title: "Company", links: ["Style guide", "Password protect", "Testimonial", "404 page"] },
  { title: "Social", links: ["Instagram", "Facebook", "LinkedIn"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 pb-14 border-b border-white/5">
        <div>
          <h3 className="font-display font-semibold text-2xl">Contact us now</h3>
          <p className="text-slate-text text-sm mt-1">Simplify your customer relationships, maximize growth.</p>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2 bg-card border border-white/10 rounded-full p-1.5 pl-5 w-full md:w-auto"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            className="bg-transparent text-sm placeholder:text-slate-text/60 focus:outline-none flex-1 min-w-0"
          />
          <button
            type="submit"
            className="bg-teal text-ink text-sm font-medium px-5 py-2 rounded-full whitespace-nowrap hover:bg-teal-glow transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10 pt-14">
        <div>
          <a href="#" className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="w-8 h-8 rounded-md bg-teal flex items-center justify-center text-ink font-bold">
              V
            </span>
            Vexez
          </a>
          <p className="text-sm text-slate-text mt-4 leading-relaxed">
            vexez@gmail.com
            <br />
            (704) 555-0127
          </p>
          <div className="flex gap-3 mt-5 text-slate-text">
            {socialIcons.map((icon) => (
              <a key={icon.label} href="#" aria-label={icon.label} className="hover:text-teal transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d={icon.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {columns.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-medium mb-4">{c.title}</p>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-slate-text hover:text-cream transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-2 mt-14 pt-6 border-t border-white/5 text-xs text-slate-text/60">
        <span>© {new Date().getFullYear()} Vexez. All rights reserved.</span>
        <span>Privacy policy · Terms & conditions</span>
      </div>
    </footer>
  );
}
