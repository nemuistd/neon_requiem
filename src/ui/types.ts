export type ActiveTabId = "restoration" | "song" | "item" | "idol" | "record" | "meguri";

export type UiElements = {
  root: HTMLElement;
  lightsAmount: HTMLElement;
  memoryFragmentsAmount: HTMLElement;
  memoryFragmentResource: HTMLElement;
  lightsPerSecond: HTMLElement;
  liveButton: HTMLButtonElement;
  settingsButton: HTMLButtonElement;
  settingsPanel: HTMLElement;
  settingsCloseButton: HTMLButtonElement;
  settingsResetButton: HTMLButtonElement;
  settingsVersion: HTMLElement;
  idolList: HTMLElement;
  contentList: HTMLElement;
  messageLog: HTMLElement;
};
