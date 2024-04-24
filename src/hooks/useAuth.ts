import { clear as clearAuthReducer } from "@src/redux/reducers/authReducer";
import { clear as clearPatientSearchReducer } from "@src/redux/reducers/patientSearchReducer";
import { clear as clearVolunteerSearchReducer } from "@src/redux/reducers/volunteerSearchReducer";
import { clear as clearGeneralReducer } from "@src/redux/reducers/generalReducer";
import { deleteCookie } from "cookies-next";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";

export default function useLogout() {
  const dispatch = useDispatch();

  const logout = useCallback(async () => {
    await getAuth().signOut();
    deleteCookie("authUser");
    dispatch(clearAuthReducer());
    dispatch(clearPatientSearchReducer());
    dispatch(clearVolunteerSearchReducer());
    dispatch(clearGeneralReducer());
  }, [dispatch]);

  const vals = useMemo(() => ({ logout }), [logout]);

  return vals;
}
