import { FaCode, FaRocket, FaBookOpen, FaUserAstronaut } from "react-icons/fa";

function Page() {
  const features = [
    {
      icon: <FaBookOpen />,
      title: "یادگیری ساده‌تر",
      text: "مفاهیم برنامه‌نویسی را با زبان ساده، مثال‌های واقعی و مسیر قابل فهم یاد می‌گیری.",
    },
    {
      icon: <FaCode />,
      title: "تمرکز روی تجربه واقعی",
      text: "محتواها فقط تئوری نیستند؛ از چالش‌ها، پروژه‌ها و خطاهای واقعی توسعه نرم‌افزار حرف می‌زنیم.",
    },
    {
      icon: <FaRocket />,
      title: "رشد مرحله‌به‌مرحله",
      text: "از نکات پایه تا موضوعات پیشرفته، مسیر یادگیری طوری طراحی می‌شود که گیج و خسته نشوی.",
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
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_50%_0%,rgba(5,150,105,0.14),transparent_32%),radial-gradient(circle_at_15%_40%,rgba(124,58,237,0.10),transparent_28%),radial-gradient(circle_at_85%_60%,rgba(8,145,178,0.10),transparent_30%)]
            dark:bg-[radial-gradient(circle_at_50%_0%,rgba(22,242,164,0.13),transparent_32%),radial-gradient(circle_at_15%_40%,rgba(139,92,246,0.13),transparent_28%),radial-gradient(circle_at_85%_60%,rgba(34,211,238,0.10),transparent_30%)]
          "
        />

        <div
          className="
            absolute inset-0 opacity-[0.28]
            [background-image:linear-gradient(to_right,rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.07)_1px,transparent_1px)]
            [background-size:56px_56px]
            dark:opacity-[0.08]
            dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)]
          "
        />

        <div className="absolute -top-32 right-1/2 h-96 w-96 translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="
              mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20
              bg-primary-soft px-4 py-2 text-sm font-black text-primary
            "
          >
            <FaUserAstronaut />
            درباره NexPad
          </div>

          <h1
            className="
              text-4xl font-black leading-[1.35] tracking-tight text-text
              sm:text-5xl lg:text-6xl
            "
          >
            جایی برای یادگیری{" "}
            <span className="bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent">
              ساده، کاربردی و واقعی
            </span>{" "}
            برنامه‌نویسی
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-9 text-text-muted sm:text-lg">
            NexPad یک فضای آموزشی برای توسعه‌دهنده‌های آینده است؛ جایی که مفاهیم
            برنامه‌نویسی، الگوریتم‌ها، تجربه‌های پروژه‌ای و چالش‌های دنیای
            کدنویسی را با زبانی ساده، دقیق و قابل استفاده یاد می‌گیری.
          </p>
        </div>

        {/* Main content card */}
        <div
          className="
            mt-14 overflow-hidden rounded-[2rem] border border-border
            bg-surface/85 shadow-2xl shadow-slate-900/5 backdrop-blur-xl
            dark:shadow-black/20
          "
        >
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Text */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6 h-1 w-20 rounded-full bg-gradient-to-l from-primary to-secondary" />

              <h2 className="text-2xl font-black text-text sm:text-3xl">
                NexPad چرا ساخته شده؟
              </h2>

              <div className="mt-6 space-y-5 text-base font-medium leading-9 text-text-muted sm:text-lg">
                <p>
                  ما باور داریم یادگیری برنامه‌نویسی نباید خشک، پیچیده و ترسناک
                  باشد. هدف NexPad این است که مسیر یادگیری را برای علاقه‌مندان
                  به توسعه نرم‌افزار شفاف‌تر، جذاب‌تر و کاربردی‌تر کند.
                </p>

                <p>
                  در این وبلاگ درباره موضوعاتی می‌نویسیم که واقعاً در مسیر
                  توسعه‌دهنده شدن به کار می‌آیند؛ از مفاهیم پایه و الگوریتم‌ها
                  تا تجربه‌های عملی، ابزارهای مدرن، خطاهای رایج و نکات پروژه‌ای.
                </p>

                <p>
                  من،{" "}
                  <strong className="font-black text-primary">
                    امیرحسین ورمانلی
                  </strong>
                  ، هم در کنار تیم NexPad تلاش می‌کنم تجربه‌ها و آموخته‌های
                  واقعی دنیای توسعه را ساده‌تر و قابل‌فهم‌تر با شما به اشتراک
                  بگذارم.
                </p>
              </div>
            </div>

            {/* Side panel */}
            <div
              className="
                border-t border-border bg-surface-soft p-6
                dark:bg-white/[0.03]
                sm:p-8 lg:border-r lg:border-t-0 lg:p-10
              "
            >
              <h3 className="text-xl font-black text-text">
                ما روی چه چیزهایی تمرکز داریم؟
              </h3>

              <div className="mt-6 space-y-4">
                {features.map((item) => (
                  <div
                    key={item.title}
                    className="
                      group rounded-3xl border border-border bg-surface p-5
                      transition-all duration-300
                      hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10
                    "
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="
                          grid h-12 w-12 shrink-0 place-items-center rounded-2xl
                          bg-primary-soft text-xl text-primary
                          transition-transform duration-300 group-hover:scale-105
                        "
                      >
                        {item.icon}
                      </span>

                      <div>
                        <h4 className="text-base font-black text-text">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-sm font-medium leading-7 text-text-muted">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div
          className="
            mx-auto mt-10 max-w-4xl rounded-[2rem] border border-primary/20
            bg-primary-soft p-6 text-center
            sm:p-8
          "
        >
          <p className="text-base font-bold leading-8 text-text sm:text-lg">
            NexPad فقط یک وبلاگ آموزشی نیست؛ تلاشی است برای اینکه یادگیری
            برنامه‌نویسی، واقعی‌تر، قابل لمس‌تر و لذت‌بخش‌تر شود.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Page;
