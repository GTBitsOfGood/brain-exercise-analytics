export interface GridRowDef {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateStart: string;
  secondContactName: string;
  secondContactPhone: string;
  additionalAffiliation: string;
  active: boolean;
  email: string;
  chapter: string;
  location: { country: string; state: string; city: string };
}
