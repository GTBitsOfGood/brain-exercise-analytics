import "./globals.css";
import type { Metadata } from "next";

import { DM_Sans, Inter, Poppins } from "next/font/google";

import firebaseInit from "@src/firebase/config";
import { classes } from "@src/utils/utils";
import StoreProvider from "@src/redux/StoreProvider";
import FirebaseAuthGuard from "@src/components/FirebaseAuthGuard/FirebaseAuthGuard";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin-ext"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Brain Exercise Initiative",
    default: "Brain Exercise Initiative",
  },
  description:
    "Brain Exercise Initiative analytics dashboard and volunteer management system",
};

firebaseInit();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={classes(
          poppins.className,
          inter.className,
          dmSans.className,
        )}
      >
        <StoreProvider>
          <FirebaseAuthGuard>{children}</FirebaseAuthGuard>
        </StoreProvider>
      </body>
    </html>
  );
}
