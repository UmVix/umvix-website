export type ContactSource = "hero" | "form";

export type HeroContactPayload = {
  source: "hero";
  name: string;
  email: string;
  project: string;
};

export type FormContactPayload = {
  source: "form";
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
};

export type ContactPayload = HeroContactPayload | FormContactPayload;
