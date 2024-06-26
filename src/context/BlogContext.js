// import { createContext, useReducer } from "react";

// const BlogContext = createContext();

// const blogReducer = (state, action) => {
//   switch (action.type) {
//     case "add_blogpost":
//       return [...state, { title: `Blog Post #${state.length + 1}` }];

//     default:
//       return state;
//   }
// };

// const BlogProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(blogReducer, []);

//   const addBlogPost = () => {
//     dispatch({ type: "add_blogpost" });
//   };

//   return (
//     <BlogContext.Provider value={{ data: state, addBlogPost }}>
//       {children}
//     </BlogContext.Provider>
//   );
// };

// export { BlogContext, BlogProvider };

import createDataContext from "./createDataContext";
import jsonServer from "../api/jsonServer";

const blogReducer = (state, action) => {
  switch (action.type) {
    case "get_blogposts":
      return action.payload;

    case "edit_blogpost":
      return state.map((blogPost) => {
        if (blogPost.id === action.payload.id) {
          return action.payload;
        } else {
          return blogPost;
        }
      });

    case "delete_blogpost":
      const filteredPosts = state.filter((post) => post.id !== action.payload);
      return [...filteredPosts];

    default:
      return state;
  }
};

const getBlogPosts = (dispatch) => {
  return async () => {
    const response = await jsonServer.get("/blogposts");

    dispatch({ type: "get_blogposts", payload: response.data });
  };
};

const addBlogPost = () => {
  return async (title, content, callback) => {
    await jsonServer.post("/blogposts", { title, content });
    if (callback) {
      callback();
    }
  };
};

const editBlogPost = (dispatch) => {
  return async (id, title, content, callback) => {
    await jsonServer.put(`/blogposts/${id}`, { title, content });

    dispatch({ type: "edit_blogpost", payload: { id, title, content } });

    if (callback) {
      callback();
    }
  };
};

const deleteBlogPost = (dispatch) => {
  return async (id) => {
    await jsonServer.delete(`/blogposts/${id}`);
    dispatch({ type: "delete_blogpost", payload: id });
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
  []
);
