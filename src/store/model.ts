import { createSlice } from '@reduxjs/toolkit';
import * as THREE from 'three';

const modelSlice = createSlice({
  name: 'model',
  initialState: {
    model: THREE.Group || null,
    scene: THREE.Scene || null,
    lightMaps: null,
    floorMaterial: null,
    wallMaterial: null,
    doorMaterial: null,
  },
  reducers: {
    setModel: (state, action) => {
      state.model = action.payload;
    },
    setScene: (state, action) => {
      state.scene = action.payload;
    },
    setLightMaps: (state, action) => {
      state.lightMaps = action.payload;
    },
    setFloorMaterial: (state, action) => {
      state.floorMaterial = action.payload;
    },
    setWallMaterial: (state, action) => {
      state.wallMaterial = action.payload;
    },
    setDoorMaterial: (state, action) => {
      state.doorMaterial = action.payload;
    },
  },
});

export const {
  setModel,
  setScene,
  setLightMaps,
  setFloorMaterial,
  setWallMaterial,
  setDoorMaterial,
} = modelSlice.actions;

export default modelSlice.reducer;
