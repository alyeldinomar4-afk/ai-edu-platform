const adminRoles = {
  admin: "admin",
};
const roles = {
  user: "user",
  ...adminRoles,
};
export const enumRoles = {
  ...roles,
  all: Object.values(roles),
  adminRoles: Object.values(adminRoles),
};

Object.freeze(enumRoles);

export const isAdmin = (user = {}) => {
  return enumRoles?.adminRoles?.includes(user?.role);
};

export const isAuth = (user = {}) => {
  return enumRoles.all?.includes(user?.role);
};
