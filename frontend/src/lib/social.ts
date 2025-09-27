import api from "./api";

export interface SocialAccountsType {
  twitter?: string;
  linkedin?: {
    accessToken: string;
    name?: string;
    email?: string;
    photo?: string;
  };
  instagram?: string;
}

// Get linked social accounts
export const getSocialAccounts = async (token: string) => {
  const res = await api.get(`/social/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.socialAccounts || {};
};

// Start OAuth flow for a platform
export const startSocialOAuth = async (platform: string) => {
  const token = localStorage.getItem("token"); // JWT token stored in login
  const res = await api.get(`/social/start/${platform}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.url;
};
