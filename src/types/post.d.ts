// step 2: create related types

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type PostState = {
  isPostLoad: boolean;
  post: CreatePost | null;
  page: number;
};

type CreatePost = Pick<Post, "title" | "body" | "userId">;

export type { Post, PostState, CreatePost };
