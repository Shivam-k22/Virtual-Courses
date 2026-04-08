import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";

const getCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          serverUrl + "/api/auth/me",
          { withCredentials: true }
        );
        
        dispatch(setUserData(res.data || null));
      } catch (error) {
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, []);
};

export default getCurrentUser;