import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SkiaWriteCanvas, { SkiaWriteCanvasRef } from './SkiaWriteCanvas';

export default function NotesBoard() {
  const [eraserEnabled, setEraserEnabled] = useState(false);
  const canvasRef = useRef<SkiaWriteCanvasRef>(null);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.modeSwitchBox}>
          <TouchableOpacity
            style={[styles.modeButton, !eraserEnabled && styles.activeToolButton]}
            onPress={() => setEraserEnabled(false)}
          >
            <MaterialCommunityIcons name="pen" size={22} color={!eraserEnabled ? '#fff' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, eraserEnabled && styles.activeToolButton]}
            onPress={() => setEraserEnabled(true)}
          >
            <MaterialCommunityIcons name="eraser" size={22} color={eraserEnabled ? '#fff' : '#333'} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => {
            canvasRef.current?.undo();
          }}
        >
          <MaterialCommunityIcons name="undo" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => {
            canvasRef.current?.redo();
          }}
        >
          <MaterialCommunityIcons name="redo" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => {
            canvasRef.current?.clearAll();
          }}
        >
          <MaterialCommunityIcons name="delete-sweep-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.noteBox}>
        <SkiaWriteCanvas ref={canvasRef} eraserEnabled={eraserEnabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    backgroundColor: '#fff',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  toolbar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  toolButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#F1F1F1',
  },
  modeSwitchBox: {
    height: 36,
    padding: 2,
    borderRadius: 8,
    marginRight: 8,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },
  modeButton: {
    width: 34,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeToolButton: {
    backgroundColor: '#21C17C',
  },
  noteBox: {
    width: '100%',
    height: '94%',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
});
