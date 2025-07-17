import React, { useEffect, useRef } from "react";
// @ts-ignore
import QRCodeStyling from "qr-code-styling";

const logoImage = "/icon.png";


type QRCodeWithLogoProps = {
  url: string;
  size?: number;
};

const QRCodeWithLogo: React.FC<QRCodeWithLogoProps> = ({ url, size = 200 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<any>();

  useEffect(() => {
    const [colorStart, colorEnd] = ["#0f766e","#0f766e"];
    qrCode.current = new QRCodeStyling({
      width: size,
      height: size,
      data: url,
      image: logoImage,
      imageOptions: {
        crossOrigin: "anonymous",
        hideBackgroundDots: true,
        imageSize: 0.34,
        margin: 2,
      },
      dotsOptions: {
        gradient: {
          type: "radial",
          rotation: Math.PI / 3, // 60 degrees
          colorStops: [
            { offset: 0, color: "#0f766e" },
            { offset: 0.5, color: "#2dd4bf" },
            { offset: 1, color: "#14b8a6" }
          ]
        },
        type: "extra-rounded"
      },
      cornersSquareOptions: {
        type: "dot"
      },
      cornersDotOptions: {
        type: "dot"
      },
      backgroundOptions: {
        color: "rgba(0,0,0,0)"
      }
    });

    if (ref.current) {
      ref.current.innerHTML = "";
      qrCode.current.append(ref.current);
    }
  }, [url, size]);

  return <div ref={ref} style={{ overflow: 'hidden', display: 'inline-block' }} />;
};

export default QRCodeWithLogo; 