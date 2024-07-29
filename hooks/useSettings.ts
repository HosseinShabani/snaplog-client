import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

interface SettingsValue {
  system_prompt: string | null;
  default_template: string | null;
  default_template_desc: string | null;
}

interface SettingsState {
  settings: SettingsValue;
  updateSettings: (settings: SettingsValue | null) => void;
}

export const useSettings = create<SettingsState>(set => ({
  settings: {
    system_prompt: null,
    default_template: null,
    default_template_desc: null,
  },
  updateSettings: settings =>
    set(state => ({ settings: { ...state.settings, ...(settings ?? {}) } })),
}));
