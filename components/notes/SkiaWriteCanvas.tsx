import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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

const pointsToPath = (points: Stroke) => {
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

  for (let i = 1; i < points.length - 1; i += 1) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    path.quadTo(points[i].x, points[i].y, midX, midY);
  }

  const last = points[points.length - 1];
  path.lineTo(last.x, last.y);
  return path;
};

const SkiaWriteCanvas = forwardRef<SkiaWriteCanvasRef, SkiaWriteCanvasProps>(function SkiaWriteCanvas(
  { eraserEnabled = false },
  ref
) {
  const strokesRef = useRef<Stroke[]>([]);
  const strokePathsRef = useRef<DrawPath[]>([]);
  const undoStackRef = useRef<Stroke[][]>([]);
  const redoStackRef = useRef<Stroke[][]>([]);
  const isErasingSessionRef = useRef(false);
  const currentStrokeRef = useRef<Stroke>([]);
  const currentPathRef = useRef<DrawPath | null>(null);
  const isDrawingRef = useRef(false);
  const activePath = useSharedValue<DrawPath>(Skia.Path.Make());
  const [refreshTick, forceUpdate] = useState(0);
  const ERASER_RADIUS = 10;

  const refresh = () => forceUpdate((p) => p + 1);

  const eraseAtPoint = (x: number, y: number) => {
    if (!isErasingSessionRef.current) {
      pushUndoState(strokesRef, undoStackRef, redoStackRef);
      isErasingSessionRef.current = true;
    }
    const nextStrokes = eraseStrokesAtPoint(strokesRef.current, x, y, ERASER_RADIUS);

    if (nextStrokes.length !== strokesRef.current.length) {
      strokesRef.current = nextStrokes;
      strokePathsRef.current = nextStrokes.map(pointsToPath);
      refresh();
      return;
    }

    const changedByLength = nextStrokes.some(
      (stroke, idx) => stroke.length !== (strokesRef.current[idx]?.length ?? 0)
    );
    if (changedByLength) {
      strokesRef.current = nextStrokes;
      strokePathsRef.current = nextStrokes.map(pointsToPath);
      refresh();
    }
  };

  const startStroke = (x: number, y: number) => {
    currentStrokeRef.current = [{ x, y }];
    const nextPath = Skia.Path.Make();
    nextPath.moveTo(x, y);
    currentPathRef.current = nextPath;
    activePath.value = nextPath;
    isDrawingRef.current = true;
  };

  const addPointToStroke = (x: number, y: number) => {
    const last = currentStrokeRef.current[currentStrokeRef.current.length - 1];
    if (!last) return;

    currentStrokeRef.current.push({ x, y });
    const points = currentStrokeRef.current;
    if (points.length >= 2) {
      const prev = points[points.length - 2];
      const midX = (prev.x + x) / 2;
      const midY = (prev.y + y) / 2;
      currentPathRef.current?.quadTo(prev.x, prev.y, midX, midY);
    } else {
      currentPathRef.current?.lineTo(x, y);
    }
    if (currentPathRef.current) {
      // Reuse same mutable path to avoid per-move allocations/flicker.
      activePath.value = currentPathRef.current;
    }
  };

  const finishStroke = () => {
    if (currentStrokeRef.current.length && currentPathRef.current) {
      const pts = currentStrokeRef.current;

      if (pts.length >= 2) {
        const last = pts[pts.length - 1];
        currentPathRef.current.lineTo(last.x, last.y);
      }

      pushUndoState(strokesRef, undoStackRef, redoStackRef);
      strokesRef.current.push(currentStrokeRef.current);
      strokePathsRef.current.push(currentPathRef.current);
    }
    currentStrokeRef.current = [];
    currentPathRef.current = null;
    isDrawingRef.current = false;
    refresh();
    requestAnimationFrame(() => {
      activePath.value = Skia.Path.Make();
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      clearAll: () => {
        if (strokesRef.current.length > 0) {
          pushUndoState(strokesRef, undoStackRef, redoStackRef);
        }
        strokesRef.current = [];
        strokePathsRef.current = [];
        redoStackRef.current = [];
        currentStrokeRef.current = [];
        currentPathRef.current = null;
        activePath.value = Skia.Path.Make();
        isDrawingRef.current = false;
        refresh();
      },
      undo: () => {
        const changed = undoStroke(strokesRef, undoStackRef, redoStackRef);
        if (!changed) return;
        strokePathsRef.current = strokesRef.current.map(pointsToPath);
        currentStrokeRef.current = [];
        currentPathRef.current = null;
        activePath.value = Skia.Path.Make();
        isDrawingRef.current = false;
        refresh();
      },
      redo: () => {
        const changed = redoStroke(strokesRef, undoStackRef, redoStackRef);
        if (!changed) return;
        strokePathsRef.current = strokesRef.current.map(pointsToPath);
        currentStrokeRef.current = [];
        currentPathRef.current = null;
        activePath.value = Skia.Path.Make();
        isDrawingRef.current = false;
        refresh();
      },
    }),
    []
  );

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onBegin((event) => {
      const { x, y } = event;
      if (eraserEnabled) {
        eraseAtPoint(x, y);
        return;
      }
      startStroke(x, y);
    })
    .onUpdate((event) => {
      const { x, y } = event;
      if (eraserEnabled) {
        eraseAtPoint(x, y);
        return;
      }
      addPointToStroke(x, y);
    })
    .onFinalize(() => {
      if (eraserEnabled) {
        isErasingSessionRef.current = false;
        return;
      }
      finishStroke();
    });

  const allPaths = strokePathsRef.current;
  void refreshTick;

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.canvasTouchLayer}>
        <Canvas style={styles.canvas}>
          {allPaths.map((path, idx) => (
            <Path
              key={idx}
              path={path}
              color="#222"
              style="stroke"
              strokeWidth={3}
              strokeCap="round"
              strokeJoin="round"
            />
          ))}
          <Path
            path={activePath}
            color="#222"
            style="stroke"
            strokeWidth={3}
            strokeCap="round"
            strokeJoin="round"
          />
        </Canvas>
      </View>
    </GestureDetector>
  );
});

export default SkiaWriteCanvas;

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  canvasTouchLayer: {
    flex: 1,
  },
});
