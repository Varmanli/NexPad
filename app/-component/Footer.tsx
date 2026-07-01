import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/#blog", label: "مقالات" },
    { href: "/about", label: "درباره من" },
    { href: "/contact", label: "تماس با من" },
  ];

  const socials = [
    {
      href: "https://github.com/Varmanli",
      label: "GitHub",
      icon: <FaGithub />,
    },
    {
      href: "https://www.linkedin.com/in/amirhosein-varmanli",
      label: "LinkedIn",
      icon: <FaLinkedin />,
    },
    {
      href: "mailto:varmanliamirhosein@gmail.com",
      label: "Email",
      icon: <FaEnvelope />,
    },
  ];

  return (
    <footer
      dir="rtl"
      className="relative z-40 mt-20 overflow-hidden border-t border-border bg-surface/90 text-text backdrop-blur-xl"
    >
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-1/4 bottom-0 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Menu */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-muted transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center justify-center gap-3">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target={
                  social.href.startsWith("mailto:") ? undefined : "_blank"
                }
                rel={
                  social.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                aria-label={social.label}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-surface-soft text-lg text-text-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary-soft hover:text-primary"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 text-center text-xs text-text-soft md:flex-row">
          <p>© {currentYear} تمامی حقوق محفوظ است.</p>

          <a
            href="https://varmanli.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
          >
            varmanli.ir
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
