import { useAuth } from "../context/AuthContext.jsx";
import { can, canAll, canAny } from "../utils/permissions.js";

export function useCan(permission) {
  const { user } = useAuth();

  return can(user, permission);
}

export function useCanAny(permissions) {
  const { user } = useAuth();

  return canAny(user, permissions);
}

export function useCanAll(permissions) {
  const { user } = useAuth();

  return canAll(user, permissions);
}
