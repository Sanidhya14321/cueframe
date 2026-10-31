import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import type { PageFont, PrintedPage } from '@/schemas';
import { bodyFont, pageFonts } from '../promo/fonts';
import { PageDesignArt } from './page-designs';

const ADVANCE: Record<PageFont, number> = {
  condensed: 0.5,
  script: 0.44,
  serif: 0.6,
  sans: 0.6,
};

const TEXT_MARGIN = 0.86;
const CAPTION_TRACKING = 0.24;

const ABSOLUTE = /^(https?:|data:|blob:|\/)/;

const resolveImage = (value: string): string => (ABSOLUTE.test(value) ? value : staticFile(value));

const fittedSize = (page: PrintedPage, lines: string[], pageWidth: number): number => {
  const longest = Math.max(1, ...lines.map((line) => line.length));
  const width = longest * page.size * (ADVANCE[page.font] + page.tracking);
  const room = pageWidth * TEXT_MARGIN;
  return width > room ? (page.size * room) / width : page.size;
};

type PagePart = { page: PrintedPage; pageWidth: number; pageHeight: number };

const PageText = ({ page, pageWidth, pageHeight }: PagePart) => {
  const lines = page.text.split('\n');
  const size = fittedSize(page, lines, pageWidth);
  const step = size * page.lineHeight;
  const firstLine = pageHeight * page.textY - ((lines.length - 1) * step) / 2;
  const nudge = (page.tracking * size) / 2;
  return (
    <text
      x={nudge}
      y={firstLine}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily={pageFonts[page.font]}
      fontSize={size}
      fontWeight={page.weight}
      letterSpacing={`${page.tracking}em`}
      fill={page.ink}
    >
      {lines.map((line, index) => (
        <tspan key={`${index}-${line}`} x={nudge} dy={index === 0 ? 0 : step}>
          {line}
        </tspan>
      ))}
    </text>
  );
};

const PageCaption = ({ page, pageWidth, pageHeight }: PagePart) => {
  const size = pageWidth * page.captionSize;
  const y = pageHeight * page.captionY;
  const width = page.caption.length * size * (0.62 + CAPTION_TRACKING);
  return (
    <g>
      <text
        x={(CAPTION_TRACKING * size) / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={bodyFont}
        fontSize={size}
        fontWeight={500}
        letterSpacing={`${CAPTION_TRACKING}em`}
        fill={page.ink}
      >
        {page.caption}
      </text>
      <line
        x1={-width / 2 - size * 0.6}
        y1={y + size * 1.3}
        x2={width / 2 + size * 0.6}
        y2={y + size * 1.3}
        stroke={page.ink}
        strokeOpacity={0.7}
        strokeWidth={Math.max(1, size * 0.07)}
      />
    </g>
  );
};

type ImageBox = { x: number; y: number; width: number; height: number };

const LoadedImage = ({
  src,
  fit,
  box,
}: {
  src: string;
  fit: PrintedPage['imageFit'];
  box: ImageBox;
}) => {
  const [handle] = useState(() => delayRender(`printer page image ${src}`));
  useEffect(() => {
    const image = new Image();
    const done = () => continueRender(handle);
    image.onload = () => {
      image.decode().then(done, done);
    };
    image.onerror = done;
    image.src = src;
  }, [handle, src]);
  return (
    <image
      href={src}
      {...box}
      preserveAspectRatio={fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet'}
    />
  );
};

const ImagePlaceholder = ({ box }: { box: ImageBox }) => (
  <g>
    <rect {...box} fill="#e7e7e3" />
    <svg {...box} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <circle cx={64} cy={36} r={7} fill="#cacac4" />
      <path d="M28 70 L45 46 L56 60 L63 52 L74 70 Z" fill="#cacac4" />
    </svg>
  </g>
);

const PageImage = ({ page, pageWidth, pageHeight, uid }: PagePart & { uid: string }) => {
  const width = pageWidth * page.imageWidth;
  const height = pageHeight * page.imageHeight;
  const box = { x: -width / 2, y: pageHeight * page.imageY - height / 2, width, height };
  const radius = Math.min(page.imageRadius, width / 2, height / 2);
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-image-clip`}>
          <rect {...box} rx={radius} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-image-clip)`}>
        {page.image === '' ? (
          <ImagePlaceholder box={box} />
        ) : (
          <LoadedImage
            key={page.image}
            src={resolveImage(page.image)}
            fit={page.imageFit}
            box={box}
          />
        )}
      </g>
    </g>
  );
};

export const PageContent = ({
  page,
  pageWidth,
  pageHeight,
  uid,
  seed,
}: PagePart & { uid: string; seed: string }) => (
  <g clipPath={`url(#${uid}-page-clip)`}>
    <defs>
      <clipPath id={`${uid}-page-clip`}>
        <rect x={-pageWidth / 2} y={0} width={pageWidth} height={pageHeight} />
      </clipPath>
    </defs>
    <PageDesignArt page={page} width={pageWidth} height={pageHeight} seed={seed} />
    {page.content === 'text' ? null : (
      <PageImage page={page} pageWidth={pageWidth} pageHeight={pageHeight} uid={uid} />
    )}
    {page.content === 'image' || page.text.trim() === '' ? null : (
      <PageText page={page} pageWidth={pageWidth} pageHeight={pageHeight} />
    )}
    {page.caption.trim() === '' ? null : (
      <PageCaption page={page} pageWidth={pageWidth} pageHeight={pageHeight} />
    )}
  </g>
);
