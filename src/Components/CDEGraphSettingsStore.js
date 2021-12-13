import create from 'zustand';
const useCDEGraphSettingsStore = create((set, get) => ({
  lineWidth: 10,
  setLineWidth: (lineWidth) => set(state => ({ lineWidth: lineWidth })),
  pointSize: 5,
  setPointSize: (pointSize) => set(state => ({ pointSize: pointSize })),
}));

export default useCDEGraphSettingsStore;