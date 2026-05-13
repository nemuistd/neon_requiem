export type ActiveTabId = "restoration" | "song" | "item" | "idol" | "record";

export type UiElements = {
  root: HTMLElement;
  lightsAmount: HTMLElement;
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
