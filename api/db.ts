// Simple in-memory database for profile section (for local development/demo)
// Replace with a real database in production

export type ProfileData = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  bio: string;
  title: string;
  organization: string;
  specialization: string;
  experience: string;
  education: string;
  certifications: string[];
  profileImage: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
    website: string;
  };
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
};

const profiles: Record<string, ProfileData> = {};

export function getProfile(uid: string): ProfileData | null {
  return profiles[uid] || null;
}

export function setProfile(uid: string, data: ProfileData): void {
  profiles[uid] = data;
}
