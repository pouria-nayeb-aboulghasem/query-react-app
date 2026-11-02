import type { PostState } from "@/types/post";

type postActions =
  | { type: "TOGGLE_LOAD" }
  | { type: "PAGING"; payload: number };

function postReducer(state: PostState, action: postActions) {
  switch (action.type) {
    case "TOGGLE_LOAD":
      return { ...state, isPostLoad: true };
    case "PAGING":
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

export { postReducer };
