import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/authSlice';
import classReducer from '@/store/classSlice';
import liveMonitorReducer from '@/store/liveMonitoringSlice';
import feedbackReducer from '@/store/feedbackSlice';
import { createPreloadedState, type PreloadedStateOverrides } from './defaultState';
import type { RootState } from './storeTypes';

export type { RootState, PreloadedStateOverrides, LiveMonitorStateOverrides } from './storeTypes';

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      user: userReducer,
      classes: classReducer,
      liveMonitor: liveMonitorReducer,
      feedback: feedbackReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
    ...(preloadedState !== undefined
      ? { preloadedState: preloadedState as RootState }
      : {}),
  });
}

type ExtendedRenderOptions = {
  preloadedState?: PreloadedStateOverrides;
  store?: ReturnType<typeof createTestStore>;
} & Omit<RenderOptions, 'wrapper'>;

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    store = createTestStore(
      preloadedState !== undefined ? createPreloadedState(preloadedState) : undefined
    ),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
