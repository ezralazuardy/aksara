export type Shift = { CoreSound: string; len: number };

export type Character = { [key: string]: string };

export type Consonant = Character;

export type Matra = Character;

export type SpecialSound = Character;

export type Digit = Character;

export type TranslateConfiguration = {
  typeMode: boolean;
  withMurda: boolean;
  withSpace: boolean;
};
