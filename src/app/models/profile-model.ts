export interface ProfileModel {
  uploading: boolean;
  id: number;
  image?: string;
  status: string;
  name: string;
  active: string;
  token: string;
  error?: string;
}
