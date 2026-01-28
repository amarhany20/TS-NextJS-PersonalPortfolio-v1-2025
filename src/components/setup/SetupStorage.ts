export type SetupDraft = {
  database?: {
    type: 'postgresql';
    connectionString?: string;
  };
  admin?: {
    username: string;
    email: string;
    displayName: string;
    password: string;
  };
  site?: {
    theme: string;
    siteTitle: string;
    siteSubtitle?: string;
    description?: string;
  };
  content?: {
    includeSampleData: boolean;
  };
};

const STORAGE_KEY = 'setup-draft';

export const readSetupDraft = (): SetupDraft => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SetupDraft) : {};
  } catch (error) {
    console.warn('Failed to read setup draft from storage', error);
    return {};
  }
};

export const writeSetupDraft = (draft: SetupDraft) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch (error) {
    console.warn('Failed to write setup draft to storage', error);
  }
};

export const mergeSetupDraft = (partial: SetupDraft) => {
  const current = readSetupDraft();
  writeSetupDraft({
    ...current,
    ...partial,
  });
};

export const clearSetupDraft = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};
