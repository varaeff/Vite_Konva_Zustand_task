import { useStage } from "@/feature/stage";
import { useEffect, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";

interface PlaceholderProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  imgWidth?: number;
  imgHeight?: number;
  background?: string;
  color?: string;
  text?: string;
}

export const ImgPlaceholder = ({
  imgWidth = 100,
  imgHeight = 100,
  background = "#cccccc",
  color = "#6a6a6a",
  text = "Placeholder",
}: // ...props
PlaceholderProps) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const { width = 0, height = 0 } = useResizeObserver({
    ref: ref,
  });
  const stage = useStage();

  const [src, setSrc] = useState("");

  color = color || "#6a6a6a";
  background = background || "#dddddd";
  text = text || "Placeholder";

  useEffect(() => {
    const image = document.createElement("canvas");

    image.width = Number(imgWidth);
    image.height = Number(imgHeight);

    const ctx = image.getContext("2d");

    // draw placeholder
    if (ctx) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, imgWidth, imgHeight);

      ctx.font = `${imgWidth / 10}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, imgWidth / 2, imgHeight / 2);
    }

    // set canvas as image src
    setSrc(image.toDataURL());

    return () => {
      image.remove();
    };
  }, [imgWidth, imgHeight, background, color, text]);

  useEffect(() => {
    stage.setSize({ width, height });
  }, [width, height]); // eslint-disable-line react-hooks/exhaustive-deps

  return <img ref={ref} src={src} className="mx-auto max-h-screen" />;
};
