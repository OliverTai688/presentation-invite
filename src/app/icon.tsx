import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 16,
          background: "#b91c2b",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 7,
            border: "2px solid rgba(255, 255, 255, 0.72)",
            borderRadius: 12,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 12,
            width: 42,
            height: 29,
            display: "flex",
            overflow: "hidden",
            border: "2px solid #ffffff",
            borderRadius: 5,
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
              height: 17,
              background: "#ffffff",
              clipPath: "polygon(0 100%, 50% 30%, 100% 100%)",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 19,
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
