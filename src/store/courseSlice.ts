import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CourseType } from "@/types";

type CourseState = {
  selectedCourse: CourseType;
};

const initialState: CourseState = {
  selectedCourse: "english",
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (state, action: PayloadAction<CourseType>) => {
      state.selectedCourse = action.payload;
    },
  },
});

export const { setCourse } = courseSlice.actions;
export default courseSlice.reducer;
