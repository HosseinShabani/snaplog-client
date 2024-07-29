export type ProjectT = {
  created_at: string;
  id: number;
  status: string;
  recording?: string;
  user_prompt?: string;
  transcribed_content?: string;
  modified_content?: string;
};

export type TemplateT = {
  label: string;
  value: string;
};
