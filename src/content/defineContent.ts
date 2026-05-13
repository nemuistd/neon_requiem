export function defineContent<const T extends readonly { id: string }[]>(definitions: T): T {
  return definitions;
}

export type ContentId<T extends readonly { id: string }[]> = T[number]["id"];

export function toContentMap<T extends readonly { id: string }[]>(definitions: T): Record<T[number]["id"], T[number]> {
  return definitions.reduce(
    (map, definition) => ({
      ...map,
      [definition.id]: definition
    }),
    {} as Record<T[number]["id"], T[number]>
  );
}

export function toContentOrder<T extends readonly { id: string }[]>(definitions: T): T[number]["id"][] {
  return definitions.map((definition) => definition.id);
}
