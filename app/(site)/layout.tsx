import Header from ".././-component/Header";
import Footer from ".././-component/Footer";
import ThemeProvider from "../context/ThemeProvider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ThemeProvider>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </ThemeProvider>
    </div>
  );
}
