import axios from "axios";

export async function postToTwitter(token: string, content: string) {
  return axios.post(
    "https://api.twitter.com/2/tweets",
    { text: content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function postToLinkedIn(token: string, content: string) {
  return axios.post(
    "https://api.linkedin.com/v2/ugcPosts",
    {
      author: "urn:li:person:YOUR_USER_URN",
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function postToInstagram(token: string, content: string, imageUrl?: string) {
  return axios.post(
    `https://graph.facebook.com/v17.0/me/media`,
    { caption: content, image_url: imageUrl },
    { params: { access_token: token } }
  );
}
