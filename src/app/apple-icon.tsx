import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 42,
          background: "#b91c2b",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 18,
            border: "5px solid rgba(255, 255, 255, 0.72)",
            borderRadius: 32,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 34,
            width: 118,
            height: 82,
            display: "flex",
            overflow: "hidden",
            border: "5px solid #ffffff",
            borderRadius: 14,
            background: "#fff8f1",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(145deg, transparent 0 45%, #e7d2bd 46% 54%, transparent 55% 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 48,
              background: "#ffffff",
              clipPath: "polygon(0 100%, 50% 30%, 100% 100%)",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 54,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: 0,
          }}
        >
          AI
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
