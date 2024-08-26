import { create } from 'zustand';

import { TemplateT } from '@/constants/ProjectConst';

interface SettingsValue {
  system_prompt: string | null;
  default_template: string | null;
  default_template_desc: string | null;
}

interface SettingsState {
  settings: SettingsValue;
  updateSettings: (settings: SettingsValue | null) => void;
  updateTemplates: (templates: TemplateT[]) => void;
  templates: TemplateT[];
}

export const useSettings = create<SettingsState>(set => ({
  settings: {
    system_prompt: null,
    default_template: null,
    default_template_desc: null,
  },
  templates: [],
  updateTemplates: templates => set({ templates }),
  updateSettings: settings =>
    set(state => ({ settings: { ...state.settings, ...(settings ?? {}) } })),
}));
