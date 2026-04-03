import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true   // ✅ IMPORTANT
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;   // ✅ stop loading
    }
  }
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;