import { apiUrl } from "../../config/constants";
import axios from "axios";

import {
  appDoneLoading,
  appLoading,
  setMessage,
  showMessageWithTimeout,
} from "../appState/actions";
import { selectToken } from "../user/selectors";

export const storeRequests = (requests) => {
  return {
    type: "STORE_REQUESTS",
    payload: requests,
  };
};

export const storeNewRequest = (request) => {
  return {
    type: "ADD_REQUEST",
    payload: request,
  };
};

export const storeUpdatedRequest = (request) => {
  return {
    type: "UPDATE_REQUEST",
    payload: request,
  };
};

export const storeDeleteRequest = (requestId) => {
  return {
    type: "DELETE_REQUEST",
    payload: requestId,
  };
};

export const fetchRequests = async (dispatch, getState) => {
  dispatch(appLoading());
  try {
    const response = await axios.get(`${apiUrl}/request`);
    dispatch(storeRequests(response.data));
    dispatch(appDoneLoading());
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
    } else {
      console.log(error.message);
    }
    dispatch(appDoneLoading());
  }
};

export const addRequest = (title, content) => {
  return async (dispatch, getState) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${apiUrl}/request`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("what is res in add request", res);
      // dispatch(storeNewRequest())
      dispatch(
        showMessageWithTimeout("success", true, "Request Created Successfully")
      );
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        console.log(error.message);
      }
      dispatch(appDoneLoading());
    }
  };
};

const addNewRequestComment = (newRequests) => {
  return { type: "ADD_NEW_REQUEST_COMMENT", payload: newRequests };
};

export const postNewRequestComment = (content, requestId) => {
  return async (dispatch, getState) => {
    dispatch(appLoading());
    const token = selectToken(getState());
    const requests = getState().request;
    try {
      const response = await axios.post(
        `${apiUrl}/comment`,
        {
          content,
          requestId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newComment = response.data;

      const newRequests = requests.map((request) => {
        if (request.id === requestId) {
          return { ...request, comments: [...request.comments, newComment] };
        }
        return request;
      });

      dispatch(addNewRequestComment(newRequests));
      dispatch(appDoneLoading());
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        dispatch(setMessage("danger", true, error.response.data.message));
      } else {
        console.log(error.message);
        dispatch(setMessage("danger", true, error.message));
      }
      dispatch(appDoneLoading());
    }
  };
};

const addNewRequestReply = (newRequests) => {
  return { type: "ADD_NEW_REQUEST_REPLY", payload: newRequests };
};

export const postNewRequestReply = (content, requestId, commentId) => {
  return async (dispatch, getState) => {
    dispatch(appLoading());
    const token = selectToken(getState());
    const requests = getState().request;

    try {
      const response = await axios.post(
        `${apiUrl}/answer`,
        {
          content,
          commentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newReply = response.data;

      const newRequests = requests.map((request) => {
        if (request.id === requestId) {
          const newComments = request.comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, answers: [...comment.answers, newReply] };
            }
            return comment;
          });
          return { ...request, comments: newComments };
        }
        return request;
      });

      dispatch(addNewRequestReply(newRequests));
      dispatch(appDoneLoading());
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        dispatch(setMessage("danger", true, error.response.data.message));
      } else {
        console.log(error.message);
        dispatch(setMessage("danger", true, error.message));
      }
      dispatch(appDoneLoading());
    }
  };
};

export const updateRequest = (requestId, title, content) => {
  return async (dispatch, getState) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${apiUrl}/request/${requestId}`,
        {
          title,
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(storeUpdatedRequest(response.data));
      dispatch(
        showMessageWithTimeout("success", true, "Request Updated Successfully")
      );
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        dispatch(setMessage("danger", true, error.response.data.message));
      } else {
        console.log(error.message);
        dispatch(setMessage("danger", true, error.message));
      }
      dispatch(appDoneLoading());
    }
  };
};

export const deleteRequest = (requestId) => {
  return async (dispatch, getState) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${apiUrl}/request/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      dispatch(storeDeleteRequest(requestId));
      dispatch(
        showMessageWithTimeout("success", true, "Request Deleted Successfully")
      );
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        dispatch(setMessage("danger", true, error.response.data.message));
      } else {
        console.log(error.message);
        dispatch(setMessage("danger", true, error.message));
      }
      dispatch(appDoneLoading());
    }
  };
};
