import type { PrintedPage, PrinterPagesProps } from '@/schemas';
import type { PrinterGeometry } from './geometry';
import { PageContent } from './page-content';
import type { PagePose } from './page-motion';

const BLUR_PER_SPEED = 0.32;
const MAX_BLUR = 36;

export const PrintedSheet = ({
  page,
  pose,
  paper,
  geometry,
  uid,
  seed,
}: {
  page: PrintedPage;
  pose: PagePose;
  paper: PrinterPagesProps['paper'];
  geometry: PrinterGeometry;
  uid: string;
  seed: string;
}) => {
  const { pageWidth, pageHeight, across, along } = geometry;
  const lift = 1 - pose.landed;
  const blur = Math.min(MAX_BLUR, pose.speed * BLUR_PER_SPEED * paper.motionBlur);
  const shadowBlur = 4 + lift * 16;
  const left = -pageWidth / 2;
  return (
    <g
      transform={`translate(${pose.x.toFixed(3)} ${pose.y.toFixed(3)}) rotate(${pose.turn.toFixed(4)} 0 ${along / 2})`}
      filter={`url(#${uid}-motion)`}
    >
      <defs>
        <filter id={`${uid}-motion`} x="-5%" y="-12%" width="110%" height="124%">
          <feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} />
        </filter>
        <filter id={`${uid}-shadow`} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation={shadowBlur.toFixed(2)} />
        </filter>
        <linearGradient id={`${uid}-paper-light`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.045" />
        </linearGradient>
      </defs>
      <g transform={`matrix(0 1 -1 0 ${across / 2} ${along / 2})`}>
        <rect
          x={left + 4 + lift * 10}
          y={4 + lift * 20}
          width={pageWidth}
          height={pageHeight}
          fill="#000000"
          opacity={paper.shadow * (0.34 - lift * 0.1)}
          filter={`url(#${uid}-shadow)`}
        />
        <rect x={left} y={0} width={pageWidth} height={pageHeight} fill={paper.color} />
        <PageContent
          page={page}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          uid={uid}
          seed={seed}
        />
        <rect
          x={left}
          y={0}
          width={pageWidth}
          height={pageHeight}
          fill={`url(#${uid}-paper-light)`}
          stroke="#000000"
          strokeOpacity={0.07}
          strokeWidth={1.5}
        />
      </g>
    </g>
  );
};
