export const UserRoleEnum = {
  ADMIN: "admin",
  Project_Admin: "project admin",
  MEMBER: "member",
};

export const AvailableUserRole = Object.values(UserRoleEnum);
// isme keys nhi pass hongi , values pass hongi

export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in progress",
  DONE: "done",
};

export const AvailableTaskStatus = Object.values(TaskStatusEnum);
