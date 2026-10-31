import { useFrame, useThree } from '@react-three/fiber';
import { Video } from '@remotion/media';
import { ThreeCanvas } from '@remotion/three';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { continueRender, delayRender, getRemotionEnvironment, staticFile } from 'remotion';
import * as THREE from 'three';
import { PLATE_STAMP } from '@/footage/footage-spec';
import { useCanvasPixelRatio } from '../kit/pixel-ratio';
import { type FootageTrack, frameAt, type TrackFrame } from './footage-track';
import { createPlateSource, type PlateSource, receivePlateFrame } from './plate-source';

export type FootagePlate = { src: string; track: FootageTrack };

type Stage = {
  plateMap: THREE.Texture;
  planes: THREE.Plane[];
  width: number;
  height: number;
  stampShare: number;
  listeners: Set<(frame: TrackFrame, index: number) => void>;
};

const StageContext = createContext<Stage | null>(null);

export const useStage = (): Stage => {
  const stage = useContext(StageContext);
  if (stage === null) {
    throw new Error('Footage prints must sit inside a FootageStage');
  }
  return stage;
};

export const useFootageFrame = (callback: (frame: TrackFrame, index: number) => void) => {
  const { listeners } = useStage();
  const latest = useRef(callback);
  latest.current = callback;
  useLayoutEffect(() => {
    const listener = (frame: TrackFrame, index: number) => latest.current(frame, index);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [listeners]);
};

export const useDisposed = <T extends { dispose: () => void }>(value: T): T => {
  useEffect(() => () => value.dispose(), [value]);
  return value;
};

const useRenderedPlate = (source: PlateSource, frame: number) => {
  const advance = useThree((state) => state.advance);
  useLayoutEffect(() => {
    if (!getRemotionEnvironment().isRendering) {
      return;
    }
    if (source.index === frame) {
      advance(performance.now());
      return;
    }
    const handle = delayRender(`Waiting for footage frame ${frame}`);
    const listener = () => {
      if (source.index !== frame) {
        return;
      }
      source.listeners.delete(listener);
      advance(performance.now());
      continueRender(handle);
    };
    source.listeners.add(listener);
    return () => {
      source.listeners.delete(listener);
    };
  }, [source, frame, advance]);
};

const plateGeometry = (width: number, height: number, stampShare: number) => {
  const geometry = new THREE.PlaneGeometry(width, height);
  geometry.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute([0, 1, 1, 1, 0, stampShare, 1, stampShare], 2),
  );
  return geometry;
};

const StageScene = ({
  plate,
  source,
  frame,
  children,
}: {
  plate: FootagePlate;
  source: PlateSource;
  frame: number;
  children: ReactNode;
}) => {
  const { width, height } = plate.track;
  const stampShare = PLATE_STAMP.rows / (height + PLATE_STAMP.rows);
  const gl = useThree((state) => state.gl);
  gl.localClippingEnabled = true;
  const plateMap = useDisposed(
    useMemo(() => {
      const texture = new THREE.CanvasTexture(source.image);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }, [source]),
  );
  const geometry = useDisposed(
    useMemo(() => plateGeometry(width, height, stampShare), [width, height, stampShare]),
  );
  const material = useDisposed(
    useMemo(
      () => new THREE.MeshBasicMaterial({ map: plateMap, toneMapped: false, depthTest: false }),
      [plateMap],
    ),
  );
  const stage = useMemo<Stage>(
    () => ({
      plateMap,
      planes: [
        new THREE.Plane(new THREE.Vector3(1, 0, 0), width),
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), width),
      ],
      width,
      height,
      stampShare,
      listeners: new Set(),
    }),
    [plateMap, width, height, stampShare],
  );
  const seen = useRef(-1);
  useRenderedPlate(source, frame);
  useFrame(() => {
    if (source.version !== seen.current) {
      seen.current = source.version;
      plateMap.needsUpdate = true;
    }
    const index = source.index ?? frame;
    const tracked = frameAt(plate.track, index);
    stage.planes[0]?.set(new THREE.Vector3(1, 0, 0), width / 2 - tracked.doors[0]);
    stage.planes[1]?.set(new THREE.Vector3(-1, 0, 0), tracked.doors[1] - width / 2);
    for (const listener of stage.listeners) {
      listener(tracked, index);
    }
  });
  return (
    <StageContext.Provider value={stage}>
      <mesh geometry={geometry} material={material} renderOrder={0} />
      {children}
    </StageContext.Provider>
  );
};

export const FootageStage = ({
  plate,
  frame,
  children,
}: {
  plate: FootagePlate;
  frame: number;
  children: ReactNode;
}) => {
  const { width, height } = plate.track;
  const pixelRatio = useCanvasPixelRatio(2);
  const [source] = useState(() => createPlateSource(width, height + PLATE_STAMP.rows));
  const onVideoFrame = useCallback(
    (image: CanvasImageSource) => receivePlateFrame(source, image as HTMLCanvasElement, height),
    [source, height],
  );
  return (
    <>
      <Video src={staticFile(plate.src)} muted headless onVideoFrame={onVideoFrame} />
      <ThreeCanvas
        width={width}
        height={height}
        orthographic
        dpr={pixelRatio}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
        camera={{ position: [0, 0, 100], near: 1, far: 1000, zoom: 1 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <StageScene plate={plate} source={source} frame={frame}>
          {children}
        </StageScene>
      </ThreeCanvas>
    </>
  );
};
