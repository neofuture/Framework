export interface ProfileModel {
  id: number;
  image?: string;
  status: string;
  name: string;
  active: string;
  token: string;
  error?: string;
}
