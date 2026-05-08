type Point = { x: number; y: number };
type Stroke = Point[];

type StrokeRef = { current: Stroke[] };
type StrokeHistoryRef = { current: Stroke[][] };

const cloneStrokes = (strokes: Stroke[]): Stroke[] => strokes.map((stroke) => stroke.map((point) => ({ ...point })));

export const eraseStrokesAtPoint = (strokes: Stroke[], x: number, y: number, eraserRadius: number): Stroke[] => {
  const radiusSq = eraserRadius * eraserRadius;
  const nextStrokes: Stroke[] = [];

  for (const stroke of strokes) {
    let segment: Stroke = [];

    for (const point of stroke) {
      const isInsideEraser = (point.x - x) ** 2 + (point.y - y) ** 2 <= radiusSq;

      if (isInsideEraser) {
        if (segment.length > 1) {
          nextStrokes.push(segment);
        }
        segment = [];
      } else {
        segment.push(point);
      }
    }

    if (segment.length > 1) {
      nextStrokes.push(segment);
    }
  }

  return nextStrokes;
};

export const pushUndoState = (
  strokesRef: StrokeRef,
  undoStackRef: StrokeHistoryRef,
  redoStackRef: StrokeHistoryRef
): void => {
  undoStackRef.current.push(cloneStrokes(strokesRef.current));
  redoStackRef.current = [];
};

export const undoStroke = (
  strokesRef: StrokeRef,
  undoStackRef: StrokeHistoryRef,
  redoStackRef: StrokeHistoryRef
): boolean => {
  const previous = undoStackRef.current.pop();
  if (!previous) return false;
  redoStackRef.current.push(cloneStrokes(strokesRef.current));
  strokesRef.current = cloneStrokes(previous);
  return true;
};

export const redoStroke = (
  strokesRef: StrokeRef,
  undoStackRef: StrokeHistoryRef,
  redoStackRef: StrokeHistoryRef
): boolean => {
  const restored = redoStackRef.current.pop();
  if (!restored) return false;
  undoStackRef.current.push(cloneStrokes(strokesRef.current));
  strokesRef.current = cloneStrokes(restored);
  return true;
};
