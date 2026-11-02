import { postReducer } from "@/reducers";
import type { PostState } from "@/types";
import { useReducer } from "react";

const initialState: PostState = {
  isPostLoad: false,
  post: null,
  page: 1,
};

function usePost() {
  const [state, dispatch] = useReducer(postReducer, initialState);
  return {
    isPostLoad: state.isPostLoad,
    setIsPostLoad: () => dispatch({ type: "TOGGLE_LOAD" }),
    post: state.post,
    page: state.page,
    setPage: (page: number) => dispatch({ type: "PAGING", payload: page }),
  };
}

export { usePost };
