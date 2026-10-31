import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type PrinterPagesProps,
  printerPagesDefaults,
  printerPagesMeta,
  printerPagesSchema,
} from '@/schemas';
import { printerGeometry, svgId } from '../../printer/geometry';
import { OutputTray } from '../../printer/output-tray';
import { pagePose, REST_GAP } from '../../printer/page-motion';
import { PrintedSheet } from '../../printer/printed-sheet';
import { PrinterBody, SlotShade } from '../../printer/printer-body';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const cameraTransform = (
  camera: PrinterPagesProps['camera'],
  frame: number,
  width: number,
  height: number,
  focus: number,
): string => {
  const x =
    width / 2 + camera.x + (Math.sin(frame / 60) * 28 + Math.sin(frame / 23) * 4) * camera.drift;
  const y = height / 2 + camera.y + Math.cos(frame / 75) * 18 * camera.drift;
  const angle = camera.angle + Math.sin(frame / 90) * 0.8 * camera.drift;
  const zoom = camera.zoom * (1 + Math.sin(frame / 110) * 0.02 * camera.drift);
  return `translate(${x.toFixed(3)} ${y.toFixed(3)}) rotate(${angle.toFixed(4)}) scale(${zoom.toFixed(5)}) translate(0 ${-focus})`;
};

const PrinterPages = ({
  pages,
  timing,
  paper,
  printer,
  camera,
  look,
  motion,
}: PrinterPagesProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const uid = svgId(useId());
  const geometry = printerGeometry(paper.width);
  const { along, slotTop } = geometry;
  return (
    <PromoLayer look={look} motion={motion} focusX={40}>
      <AbsoluteFill>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <defs>
            <clipPath id={`${uid}-feed`}>
              <rect
                x={-geometry.bodyWidth}
                y={slotTop}
                width={geometry.bodyWidth * 2}
                height={geometry.trayEnd * 3}
              />
            </clipPath>
          </defs>
          <g transform={cameraTransform(camera, frame, width, height, REST_GAP + along / 2)}>
            <OutputTray geometry={geometry} colors={printer} uid={uid} />
            <g clipPath={`url(#${uid}-feed)`}>
              {pages.map((page, index) => {
                const pose = pagePose(frame, index, timing, along, paper.scatter);
                return pose.visible ? (
                  <PrintedSheet
                    key={index}
                    page={page}
                    pose={pose}
                    paper={paper}
                    geometry={geometry}
                    uid={`${uid}-page-${index}`}
                    seed={`printer-page-${index}`}
                  />
                ) : null;
              })}
            </g>
            <SlotShade geometry={geometry} uid={uid} />
            <PrinterBody geometry={geometry} colors={printer} uid={uid} />
          </g>
        </svg>
      </AbsoluteFill>
    </PromoLayer>
  );
};

export const printerPagesScene: SceneModule = {
  id: 'printer-pages',
  component: PrinterPages,
  render: (key) => (
    <Composition
      key={key}
      id="printer-pages"
      component={PrinterPages}
      schema={printerPagesSchema}
      defaultProps={printerPagesDefaults}
      durationInFrames={printerPagesMeta.durationInFrames}
      fps={printerPagesMeta.fps}
      width={printerPagesMeta.width}
      height={printerPagesMeta.height}
    />
  ),
};
