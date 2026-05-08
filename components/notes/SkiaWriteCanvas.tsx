import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import {
  Canvas,
  Path,
  Picture,
  Skia,
  PaintStyle,
  StrokeCap,
  StrokeJoin,
  useCanvasRef,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector, PointerType } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { eraseStrokesAtPoint, pushUndoState, redoStroke, undoStroke } from './notesOperation';

type Point = { x: number; y: number };
type Stroke = Point[];
type DrawPath = ReturnType<typeof Skia.Path.Make>;

type SkiaWriteCanvasProps = {
  eraserEnabled?: boolean;
};

export type SkiaWriteCanvasRef = {
  clearAll: () => void;
  undo: () => void;
  redo: () => void;
};

// Pen style.
const strokePaint = Skia.Paint();
strokePaint.setColor(Skia.Color('#222222'));
strokePaint.setStyle(PaintStyle.Stroke);
strokePaint.setStrokeWidth(2);
strokePaint.setStrokeCap(StrokeCap.Round);
strokePaint.setStrokeJoin(StrokeJoin.Round);
strokePaint.setAntiAlias(true);

const makeEmptyPicture = (width: number, height: number) => {
  const recorder = Skia.PictureRecorder();
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);
  recorder.beginRecording(Skia.XYWHRect(0, 0, safeWidth, safeHeight));
  return recorder.finishRecordingAsPicture();
};

const pointsToPath = (points: Stroke): DrawPath => {
  const path = Skia.Path.Make();
  if (points.length === 0) return path;
  path.moveTo(points[0].x, points[0].y);
  if (points.length === 1) {
    path.lineTo(points[0].x + 0.1, points[0].y + 0.1);
    return path;
  }
  if (points.length === 2) {
    path.lineTo(points[1].x, points[1].y);
    return path;
  }
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    path.quadTo(points[i].x, points[i].y, midX, midY);
  }
  path.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  return path;
};

const SkiaWriteCanvas = forwardRef<SkiaWriteCanvasRef, SkiaWriteCanvasProps>(
  function SkiaWriteCanvas({ eraserEnabled = false }, ref) {
    const { width, height } = useWindowDimensions();

    // Drawing data.
    const strokesRef = useRef<Stroke[]>([]);
    const strokePathsRef = useRef<DrawPath[]>([]);
    const undoStackRef = useRef<Stroke[][]>([]);
    const redoStackRef = useRef<Stroke[][]>([]);
    const currentStrokeRef = useRef<Stroke>([]);
    const currentPathRef = useRef<DrawPath | null>(null);
    const isDrawingRef = useRef(false);
    const isErasingSessionRef = useRef(false);
    const ERASER_RADIUS = 10;

    // What Skia draws.
    const committedPicture = useSharedValue(makeEmptyPicture(width, height));
    const activePath = useSharedValue<DrawPath>(Skia.Path.Make());

    // Recreate saved drawing.
    const rebuildPicture = () => {
      if (width <= 0 || height <= 0) {
        committedPicture.value = makeEmptyPicture(1, 1);
        return;
      }
      const recorder = Skia.PictureRecorder();
      const skCanvas = recorder.beginRecording(
        Skia.XYWHRect(0, 0, width, height)
      );
      for (const path of strokePathsRef.current) {
        skCanvas.drawPath(path, strokePaint);
      }
      committedPicture.value = recorder.finishRecordingAsPicture();
    };

    // Eraser logic.
    const eraseAtPoint = (x: number, y: number) => {
      if (!isErasingSessionRef.current) {
        pushUndoState(strokesRef, undoStackRef, redoStackRef);
        isErasingSessionRef.current = true;
      }
      const next = eraseStrokesAtPoint(strokesRef.current, x, y, ERASER_RADIUS);
      const changed =
        next.length !== strokesRef.current.length ||
        next.some((s, i) => s.length !== strokesRef.current[i]?.length);
      if (changed) {
        strokesRef.current = next;
        strokePathsRef.current = next.map(pointsToPath);
        rebuildPicture();
      }
    };

    // Pen logic.
    const startStroke = (x: number, y: number) => {
      const path = Skia.Path.Make();
      path.moveTo(x, y);
      currentPathRef.current = path;
      currentStrokeRef.current = [{ x, y }];
      isDrawingRef.current = true;
      activePath.value = path.copy();
    };

    const addPointToStroke = (x: number, y: number) => {
      if (!currentPathRef.current) return;
      const pts = currentStrokeRef.current;
      pts.push({ x, y });

      if (pts.length >= 2) {
        const prev = pts[pts.length - 2];
        const midX = (prev.x + x) / 2;
        const midY = (prev.y + y) / 2;
        currentPathRef.current.quadTo(prev.x, prev.y, midX, midY);
      } else {
        currentPathRef.current.lineTo(x, y);
      }

      activePath.value = currentPathRef.current.copy();
    };

    const finishStroke = () => {
      if (currentStrokeRef.current.length && currentPathRef.current) {
        const pts = currentStrokeRef.current;
        if (pts.length >= 2) {
          currentPathRef.current.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        }
        pushUndoState(strokesRef, undoStackRef, redoStackRef);
        strokesRef.current.push([...currentStrokeRef.current]);
        strokePathsRef.current.push(currentPathRef.current);
      }

      currentStrokeRef.current = [];
      currentPathRef.current = null;
      isDrawingRef.current = false;

      rebuildPicture();
      activePath.value = Skia.Path.Make();
    };

    // Functions parent can call.
    useImperativeHandle(ref, () => ({
      clearAll: () => {
        if (strokesRef.current.length > 0) {
          pushUndoState(strokesRef, undoStackRef, redoStackRef);
        }
        strokesRef.current = [];
        strokePathsRef.current = [];
        redoStackRef.current = [];
        currentStrokeRef.current = [];
        currentPathRef.current = null;
        isDrawingRef.current = false;
        activePath.value = Skia.Path.Make();
        rebuildPicture();
      },
      undo: () => {
        if (!undoStroke(strokesRef, undoStackRef, redoStackRef)) return;
        strokePathsRef.current = strokesRef.current.map(pointsToPath);
        activePath.value = Skia.Path.Make();
        isDrawingRef.current = false;
        rebuildPicture();
      },
      redo: () => {
        if (!redoStroke(strokesRef, undoStackRef, redoStackRef)) return;
        strokePathsRef.current = strokesRef.current.map(pointsToPath);
        activePath.value = Skia.Path.Make();
        isDrawingRef.current = false;
        rebuildPicture();
      },
    }), []);

    // Stylus touch handling.
    const panGesture = useMemo(() =>
      Gesture.Pan()
        .runOnJS(true)
        .minDistance(0)
        .onBegin((e) => {
          if (e.pointerType !== PointerType.STYLUS) return;
          eraserEnabled ? eraseAtPoint(e.x, e.y) : startStroke(e.x, e.y);
        })
        .onUpdate((e) => {
          if (e.pointerType !== PointerType.STYLUS) return;
          eraserEnabled ? eraseAtPoint(e.x, e.y) : addPointToStroke(e.x, e.y);
        })
        .onFinalize(() => {
          if (eraserEnabled) {
            isErasingSessionRef.current = false;
            return;
          }
          if (isDrawingRef.current) finishStroke();
        }),
    [eraserEnabled]);

    // UI.
    return (
      <GestureDetector gesture={panGesture}>
        <View style={styles.canvasTouchLayer}>
          <Canvas style={styles.canvas}>
            <Picture picture={committedPicture} />
            <Path
              path={activePath}
              color="#222"
              style="stroke"
              strokeWidth={2}
              strokeCap="round"
              strokeJoin="round"
            />
          </Canvas>
        </View>
      </GestureDetector>
    );
  }
);

export default SkiaWriteCanvas;

const styles = StyleSheet.create({
  canvas: { flex: 1 },
  canvasTouchLayer: { flex: 1 },
});

