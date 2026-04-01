import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const register = async (username: string, email: string, password: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getProfile = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateProfile = async (userData: any) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.AUTH.UPDATE_PROFILE,
      userData,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const changePassword = async (passwords: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.AUTH.CHANGE_PASSWORD,
      passwords,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const authService = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
};

export default authService;
