export interface Patient {
  id: number;
  email: string;
  name: string;
  age?: number;
  condition?: string;
  created_at: Date;
}

export interface MagicLink {
  id: number;
  patient_id: number;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

export interface JWTPayload {
  patientId: number;
  email: string;
  name: string;
}
