import { ID, ImageGravity, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { data } from "react-router-dom";

// POST /account to AUTH
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password
    );

    if (!newAccount) throw Error;

    // GET PICTURE FROM ACCOUNT IN AUTH
    const avatarUrl: any = avatars.getInitials(user.name);

    // SAVES THE USER IN DB
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: user.name,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.error("Appwrite Error:", error);
  }
}

// SAVE THE USER TO DATABASE
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  username: string;
  imageUrl?: URL;
}) {
  try {
    const dbUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return dbUser;
  } catch (error) {
    console.error("Appwrite Error:", error);
  }
}

// SIGN IN USER
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    console.log("session:", session);

    return session;
  } catch (error) {
    console.error("Appwrite", error);
  }
}

// GET CURRENT USER
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// SIGN OUT ACCOUNT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// CREATE NEW POST
export async function createPost(post: INewPost) {
  try {
    if (!post.file || post.file.length === 0) {
      throw new Error("No file provided for upload");
    }

    // upload image to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const photoUrl = await getFilePreview(uploadedFile.$id);

    if (!photoUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || "";

    // save post to database

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: photoUrl,
        imageId: uploadedFile.$id,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// UPLOAD FILE TO STORAGE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}
// GET THE PREVIEW
export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// GET RECENT POSTS
export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!posts) throw Error;

  return posts;
}

// LIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// SAVE POST
export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;

    return statusCode;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// GET POST BY ID
export async function getPostById(postId: string) {
  try {
    const post = databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return post;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToupdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToupdate) {
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      const photoUrl = await getFilePreview(uploadedFile.$id);

      if (!photoUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: photoUrl, imageId: uploadedFile.$id };
    }

    // convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || "";

    // save post to database

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// DELETE POST
export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return { status: "ok" };
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// FETCH POSTS FROM DB
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}

// SEARCH POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.error("Appwrite Error", error);
  }
}
