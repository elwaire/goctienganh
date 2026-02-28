import { authApi } from "./authApi";
import { commonApi } from "./commonApi";
import { subjectsApi } from "./subjectsApi";
import { topicsApi } from "./topicsApi";
import { avatarsApi } from "./avatarsApi";
import { permissionsApi } from "./permissionsApi";
import { rolesApi } from "./rolesApi";
import { usersApi } from "./usersApi";
import { questionsApi } from "./questionsApi";
import { questionGroupsApi } from "./questionGroupsApi";
import { examsApi } from "./examsApi";
import { questionCategoriesApi } from "./questionCategoriesApi";

const apiServices = {
  auth: authApi,
  common: commonApi,
  subjects: subjectsApi,
  topics: topicsApi,
  avatars: avatarsApi,
  permissions: permissionsApi,
  roles: rolesApi,
  users: usersApi,
  questions: questionsApi,
  questionGroups: questionGroupsApi,
  exams: examsApi,
  questionCategories: questionCategoriesApi,
};

export default apiServices;

export * from "./authApi";
export * from "./permissionsApi";
export * from "./rolesApi";
export * from "./usersApi";
export * from "./commonApi";
export * from "./subjectsApi";
export * from "./topicsApi";
export * from "./avatarsApi";
export * from "./questionsApi";
export * from "./questionGroupsApi";
export * from "./examsApi";
export * from "./questionCategoriesApi";
