// Single-file panels (simple components)
export { Analytics } from "./Analytics";
export { Settings } from "./Settings";
export { Help } from "./Help";
export { Insights } from "./Insights";
export { Overview } from "./Overview";
export { Nudges } from "./Nudges";

// Complex multi-component panels (in their own folders)
// Behavior - our core feature with multiple sub-components
export { Dashboard, Activity, Reports, Notes, Goals } from "./behavior";

// Detection - behavior detection engine and configuration
export { Detection } from "./detection/Detection";
