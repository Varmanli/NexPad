"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

function Page() {
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = Object.fromEntries(new FormData(form).entries()) as {
      name: string;
      email: string;
      message: string;
    };

    let hasError = false;

    if (!formData.name.trim()) {
      toast.error("نام و نام خانوادگی الزامی است");
      hasError = true;
    }

    if (!formData.email.trim()) {
      toast.error("ایمیل الزامی است");
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      toast.error("ایمیل معتبر نیست");
      hasError = true;
    }

    if (!formData.message.trim()) {
      toast.error("متن پیام الزامی است");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (!res.ok) {
        if (resData.errors) {
          Object.values(resData.errors).forEach((msg) => {
            if (typeof msg === "string") toast.error(msg);
          });
        } else {
          toast.error(resData.error || "ارسال پیام موفقیت‌آمیز نبود.");
        }
        return;
      }

      toast.success(resData.message || "پیام شما با موفقیت ارسال شد");
      form.reset();
    } catch (err) {
      console.log(err);
      toast.error("خطای سرور. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    {
      icon: <FaPhoneAlt />,
      label: "شماره تماس",
      value: "09016828270",
      href: "tel:09016828270",
    },
    {
      icon: <FaEnvelope />,
      label: "ایمیل",
      value: "nexpad1404@gmail.com",
      href: "mailto:nexpad1404@gmail.com",
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "موقعیت",
      value: "تهران، ایران",
      href: null,
    },
  ];

  const socials = [
    {
      href: "https://instagram.com/nex.pad",
      label: "Instagram",
      icon: <FaInstagram />,
      className: "hover:text-pink-500",
    },
    {
      href: "https://www.linkedin.com/in/amirhosein-varmanli",
      label: "LinkedIn",
      icon: <FaLinkedin />,
      className: "hover:text-blue-500",
    },
    {
      href: "https://youtube.com/nexpad",
      label: "YouTube",
      icon: <FaYoutube />,
      className: "hover:text-red-500",
    },
    {
      href: "https://github.com/Varmanli",
      label: "GitHub",
      icon: <FaGithub />,
      className: "hover:text-text",
    },
  ];

  return (
    <main
      dir="rtl"
      className="
        relative min-h-screen overflow-hidden px-4 py-24
        bg-background text-text
        sm:px-6 lg:px-8
      "
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_50%_0%,rgba(5,150,105,0.14),transparent_32%),radial-gradient(circle_at_12%_45%,rgba(124,58,237,0.10),transparent_28%),radial-gradient(circle_at_88%_60%,rgba(8,145,178,0.10),transparent_30%)]
            dark:bg-[radial-gradient(circle_at_50%_0%,rgba(22,242,164,0.13),transparent_32%),radial-gradient(circle_at_12%_45%,rgba(139,92,246,0.13),transparent_28%),radial-gradient(circle_at_88%_60%,rgba(34,211,238,0.10),transparent_30%)]
          "
        />

        <div
          className="
            absolute inset-0 opacity-[0.25]
            [background-image:linear-gradient(to_right,rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.07)_1px,transparent_1px)]
            [background-size:56px_56px]
            dark:opacity-[0.08]
            dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)]
          "
        />

        <div className="absolute -top-28 right-1/2 h-96 w-96 translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="
              mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20
              bg-primary-soft px-4 py-2 text-sm font-black text-primary
            "
          >
            <HiSparkles />
            ارتباط با NexPad
          </div>

          <h1 className="text-4xl font-black leading-[1.35] tracking-tight text-text sm:text-5xl lg:text-6xl">
            سوالی داری؟{" "}
            <span className="bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent">
              پیام بده
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-text-muted sm:text-lg">
            برای پیشنهاد، همکاری، گزارش مشکل یا هر سوالی درباره مقالات و محتوای
            NexPad، از طریق فرم زیر با ما در ارتباط باش.
          </p>
        </div>

        {/* Content */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          {/* Contact info card */}
          <aside
            className="
              overflow-hidden rounded-[2rem] border border-border bg-surface/85
              shadow-2xl shadow-slate-900/5 backdrop-blur-xl
              dark:shadow-black/20
            "
          >
            <div className="relative h-full p-6 sm:p-8">
              <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />

              <div className="relative">
                <h2 className="text-2xl font-black text-text">اطلاعات تماس</h2>

                <p className="mt-3 text-sm font-medium leading-7 text-text-muted">
                  معمولا پیام‌ها در اولین فرصت بررسی می‌شوند. اگر موضوع فوری
                  داری، ایمیل مستقیم بهترین گزینه است.
                </p>

                <div className="mt-8 space-y-4">
                  {contactItems.map((item) => {
                    const content = (
                      <div
                        className="
                          group flex items-center gap-4 rounded-3xl border border-border
                          bg-surface-soft p-4 transition-all duration-300
                          hover:-translate-y-1 hover:border-primary/40 hover:bg-primary-soft
                        "
                      >
                        <span
                          className="
                            grid h-12 w-12 shrink-0 place-items-center rounded-2xl
                            bg-primary-soft text-primary transition-transform duration-300
                            group-hover:scale-105
                          "
                        >
                          {item.icon}
                        </span>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-text-soft">
                            {item.label}
                          </p>
                          <p className="mt-1 break-words text-sm font-black text-text">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );

                    return item.href ? (
                      <a key={item.label} href={item.href} className="block">
                        {content}
                      </a>
                    ) : (
                      <div key={item.label}>{content}</div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-3xl border border-border bg-surface-soft p-5">
                  <p className="text-sm font-black text-text">
                    شبکه‌های اجتماعی
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className={`
                          grid h-11 w-11 place-items-center rounded-2xl border border-border
                          bg-surface text-xl text-text-muted transition-all duration-200
                          hover:-translate-y-1 hover:bg-surface-hover hover:shadow-lg
                          ${social.className}
                        `}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="
              rounded-[2rem] border border-border bg-surface/85 p-6
              shadow-2xl shadow-slate-900/5 backdrop-blur-xl
              dark:shadow-black/20 sm:p-8
            "
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black text-text">ارسال پیام</h2>
              <p className="mt-2 text-sm font-medium leading-7 text-text-muted">
                اطلاعاتت رو وارد کن و پیام رو بفرست. پاسخ از طریق ایمیل پیگیری
                می‌شود.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm font-black text-text">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="
                    w-full rounded-2xl border border-border bg-surface-soft px-4 py-4
                    text-text outline-none transition-all duration-200
                    placeholder:text-text-soft
                    focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10
                  "
                  placeholder="مثلا امیرحسین ورمانلی"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm font-black text-text">
                  ایمیل
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="
                    w-full rounded-2xl border border-border bg-surface-soft px-4 py-4
                    text-text outline-none transition-all duration-200
                    placeholder:text-text-soft
                    focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10
                  "
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-black text-text">
                  متن پیام
                </label>
                <textarea
                  name="message"
                  required
                  className="
                    min-h-[180px] w-full resize-none rounded-2xl border border-border
                    bg-surface-soft px-4 py-4 text-text outline-none transition-all duration-200
                    placeholder:text-text-soft
                    focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10
                  "
                  placeholder="پیامت رو اینجا بنویس..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl
                bg-primary px-6 py-4 text-sm font-black text-[#080817]
                shadow-xl shadow-primary/20 transition-all duration-200
                hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-primary/30
                disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0
              "
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#080817]/30 border-t-[#080817]" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  ارسال پیام
                  <FaPaperPlane />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs font-medium leading-6 text-text-soft">
              با ارسال پیام، اطلاعات شما فقط برای پاسخ‌گویی و پیگیری درخواست
              استفاده می‌شود.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Page;
