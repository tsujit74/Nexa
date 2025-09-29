// src/utils/platformInstagram.ts
import { IPost } from "../models/Post";
import fetch from "node-fetch";

export interface IInstagramAccount {
  accessToken: string;
  instagramBusinessId: string;
}

interface InstagramMediaResponse {
  id?: string;
  error?: any;
}

interface InstagramPublishResponse {
  id?: string;
  error?: any;
}

/**
 * Post to Instagram using a fixed default image + user caption.
 * Throws with detailed message if the Graph API returns an error.
 */
export const postToInstagram = async (
  post: IPost,
  instagramAccount: IInstagramAccount
): Promise<InstagramPublishResponse> => {
  const { accessToken, instagramBusinessId } = instagramAccount;

  // Your chosen default image (will be used for every post)
  const defaultImage =
    "https://scontent.fpat2-3.fna.fbcdn.net/v/t39.30808-6/555423632_1503574133975448_3758528328049105783_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Z23zPZm9agsQ7kNvwGyOfTB&_nc_oc=AdmNRdL9Zp0BElHSAFUti_yZvdKBfO4xNw2HGpJmCCud2ByOJewmVKReMEQS7nVHifB1xg3tS2j1XhWQqqDRwJtV&_nc_zt=23&_nc_ht=scontent.fpat2-3.fna&_nc_gid=8kZRLDXMOHMEEu9APMQcDw&oh=00_AfZwuArYMCBr26ePLdRPGp5ulESwfiy4n5iTX2I7jmVD3g&oe=68E08896";

  try {
    // 1) create media container
    const mediaParams = new URLSearchParams({
      image_url: defaultImage,
      caption: post.content ?? "",
      access_token: accessToken,
    });

    const mediaRes = await fetch(
      `https://graph.facebook.com/v17.0/${instagramBusinessId}/media`,
      {
        method: "POST",
        body: mediaParams,
      }
    );

    // cast JSON to a known shape
    const mediaData = (await mediaRes.json()) as InstagramMediaResponse;

    if (!mediaRes.ok || !mediaData.id) {
      // include the returned body to make debugging easier
      throw new Error(
        `Instagram media creation failed: ${JSON.stringify(mediaData)} (status ${mediaRes.status})`
      );
    }

    // 2) publish the media
    const publishParams = new URLSearchParams({
      creation_id: mediaData.id,
      access_token: accessToken,
    });

    const publishRes = await fetch(
      `https://graph.facebook.com/v17.0/${instagramBusinessId}/media_publish`,
      {
        method: "POST",
        body: publishParams,
      }
    );

    const publishData = (await publishRes.json()) as InstagramPublishResponse;

    if (!publishRes.ok || !publishData.id) {
      throw new Error(
        `Instagram publish failed: ${JSON.stringify(publishData)} (status ${publishRes.status})`
      );
    }

    console.log(`[Instagram] Post successful: ${publishData.id}`);
    return publishData;
  } catch (err) {
    // bubble up a helpful error and log details
    console.error("[Instagram] Post failed:", err);
    throw err;
  }
};
