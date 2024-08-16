export type ProjectT = {
  created_at: string;
  id: number;
  name?: string;
  status: string;
  recording?: string;
  user_prompt?: string;
  transcribed_content?: string;
  modified_content?: string;
  template?: { name: string };
  removed: boolean;
};

export interface TemplateT {
  id: number;
  name: string;
  prompt: string;
}
