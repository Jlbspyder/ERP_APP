export function can(user, permission) {
  if (!user) return false;
  if (!permission) return true;

  return user.permissions.includes(permission);
}

export function canAny(user, permissions = []) {
  if (!user) return false;
  if (permissions.length === 0) return true;

  return permissions.some((permission) => user.permissions.includes(permission));
}

export function canAll(user, permissions = []) {
  if (!user) return false;
  if (permissions.length === 0) return true;

  return permissions.every((permission) => user.permissions.includes(permission));
}