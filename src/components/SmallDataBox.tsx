import { Poppins, Inter } from "next/font/google";

const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const inter700 = Inter({ subsets: ["latin"], weight: "700" });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
interface DataParams {
  title: string;
  Icon: () => JSX.Element;
  text: string;
}

export default function SmallDataBox({ title, Icon, text }: DataParams) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "15px",
        width: 245,
        height: 101,
      }}
    >
      <div className="titleBox" style={{ marginTop: 16, marginLeft: 20 }}>
        <p
          style={{
            fontFamily: poppins500.style.fontFamily,
            fontSize: 12,
            lineHeight: "20px",
            letterSpacing: "-0.02em",
            textAlign: "left",
            color: "#A3AED0",
          }}
        >
          {title}
        </p>
      </div>
      <div
        className="Graphic"
        style={{ marginLeft: 14.5, display: "flex", flexDirection: "row" }}
      >
        <Icon />
        <p
          style={{
            font: inter700.style.fontFamily,
            fontWeight: 700,
            fontSize: 20,
            lineHeight: "27px",
            letterSpacing: "-0.02em",
            textAlign: "left",
            margin: "auto",
            color: "#2B3674",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
