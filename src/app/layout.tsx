import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/shared/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tessellate - Creative Workflow Platform",
  description: "Transform your creative vision into reality with our integrated moodboard and lookbook platform",
  icons: {
    icon: "https://ancuwmmivgdvommzigwv.supabase.co/storage/v1/object/sign/digital%20assets/cropped%20t.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNWFkYWFkOS01Y2YyLTRmNzQtYmU5Yi0wYTdjMjdhMDE2NzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkaWdpdGFsIGFzc2V0cy9jcm9wcGVkIHQucG5nIiwiaWF0IjoxNzU3NDI3ODE3LCJleHAiOjE4MTc5MDc4MTd9.wwfGuA_YNafyw5ESP8s_fuPzW9NDkbijMZGpYaOHF3E",
    shortcut: "https://ancuwmmivgdvommzigwv.supabase.co/storage/v1/object/sign/digital%20assets/cropped%20t.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNWFkYWFkOS01Y2YyLTRmNzQtYmU5Yi0wYTdjMjdhMDE2NzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkaWdpdGFsIGFzc2V0cy9jcm9wcGVkIHQucG5nIiwiaWF0IjoxNzU3NDI3ODE3LCJleHAiOjE4MTc5MDc4MTd9.wwfGuA_YNafyw5ESP8s_fuPzW9NDkbijMZGpYaOHF3E",
    apple: "https://ancuwmmivgdvommzigwv.supabase.co/storage/v1/object/sign/digital%20assets/cropped%20t.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNWFkYWFkOS01Y2YyLTRmNzQtYmU5Yi0wYTdjMjdhMDE2NzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkaWdpdGFsIGFzc2V0cy9jcm9wcGVkIHQucG5nIiwiaWF0IjoxNzU3NDI3ODE3LCJleHAiOjE4MTc5MDc4MTd9.wwfGuA_YNafyw5ESP8s_fuPzW9NDkbijMZGpYaOHF3E"
  },
  openGraph: {
    title: "Tessellate - Creative Workflow Platform",
    description: "Transform your creative vision into reality with our integrated moodboard and lookbook platform",
    images: ["https://ancuwmmivgdvommzigwv.supabase.co/storage/v1/object/sign/digital%20assets/cropped%20t.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNWFkYWFkOS01Y2YyLTRmNzQtYmU5Yi0wYTdjMjdhMDE2NzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkaWdpdGFsIGFzc2V0cy9jcm9wcGVkIHQucG5nIiwiaWF0IjoxNzU3NDI3ODE3LCJleHAiOjE4MTc5MDc4MTd9.wwfGuA_YNafyw5ESP8s_fuPzW9NDkbijMZGpYaOHF3E"],
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Tessellate - Creative Workflow Platform",
    description: "Transform your creative vision into reality with our integrated moodboard and lookbook platform",
    images: ["https://ancuwmmivgdvommzigwv.supabase.co/storage/v1/object/sign/digital%20assets/cropped%20t.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNWFkYWFkOS01Y2YyLTRmNzQtYmU5Yi0wYTdjMjdhMDE2NzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkaWdpdGFsIGFzc2V0cy9jcm9wcGVkIHQucG5nIiwiaWF0IjoxNzU3NDI3ODE3LCJleHAiOjE4MTc5MDc4MTd9.wwfGuA_YNafyw5ESP8s_fuPzW9NDkbijMZGpYaOHF3E"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}