export const MOTOR_PHASE_TYPES = [
  "Single Phase",
  "Three Phase",
  "Single & Three Phase",
] as const;

export const STARTER_TYPES = [
  "DOL (Direct Online)",
  "Star-Delta",
  "Auto Star-Delta",
  "Soft Starter",
  "VFD (Variable Frequency Drive)",
  "Capacitor Start",
  "Capacitor Start Capacitor Run (CSCR)",
  "Capacitor Run",
  "Submersible Panel Starter",
] as const;

export const MOTOR_TYPES = [
  "Submersible",
  "Openwell Submersible",
  "Monoblock",
  "Centrifugal",
  "Self-Priming",
  "Jet Pump",
  "Compressor",
] as const;

export const WATER_SOURCE_TYPES = [
  "Sump",
  "Bore / Borewell",
  "Open Well",
  "Overhead Tank",
  "Municipal Supply",
  "Sump and Bore Both",
] as const;

export const TIMER_TYPES = ["Real Timer", "Cyclic Timer"] as const;

export const UNIT_TYPES = ["GSM", "RF", "IOT", "Dlx", "Analog", "Economic"] as const;

export const OPTION_CATEGORIES = {
  motorPhaseType: { label: "Motor Phase Type", defaults: MOTOR_PHASE_TYPES },
  starterType: { label: "Starter Type", defaults: STARTER_TYPES },
  motorType: { label: "Motor Type", defaults: MOTOR_TYPES },
  waterSource: { label: "Water Source", defaults: WATER_SOURCE_TYPES },
  timerType: { label: "Timer", defaults: TIMER_TYPES },
  unitType: { label: "Unit Type", defaults: UNIT_TYPES },
} as const;

export type OptionCategory = keyof typeof OPTION_CATEGORIES;
