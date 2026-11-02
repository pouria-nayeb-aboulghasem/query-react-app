// step 3: create relating services

import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import type { CreatePost, Post } from "@/types";

// READ: post list
async function getPosts(): Promise<Post[]> {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINTS.posts}?_limit=10`,
  );

  // fail
  if (!response.ok)
    throw new Error(
      `HTTP error: ${response.status}, post list couldn't be loaded.`,
    );

  // success
  return response.json();
}

// READ: paginated post list
async function getPaginatedPosts(page: number): Promise<Post[]> {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINTS.posts}?_page=${page}&_limit=10`,
  );

  // fail
  if (!response.ok)
    throw new Error(
      `HTTP error: ${response.status}, post list couldn't be loaded.`,
    );

  // success
  return response.json();
}

// CREATE: new post
async function createPost(post: CreatePost): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.posts}`, {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  // fail
  if (!response.ok)
    throw new Error(
      `HTTP error: ${response.status}, post couldn't be updated.`,
    );

  // success
  return response.json();
}

// UPDATE: update post
async function updatePost(
  id: number,
  post: Partial<CreatePost>,
): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.posts}/${id}`, {
    method: "PUT",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  // fail
  if (!response.ok)
    throw new Error(
      `HTTP error: ${response.status}, post couldn't be updated.`,
    );

  // success
  return response.json();
}

export { getPosts, createPost, updatePost, getPaginatedPosts };
