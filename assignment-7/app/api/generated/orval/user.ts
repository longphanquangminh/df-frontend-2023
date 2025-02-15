/**
 * Generated by orval v6.18.1 🍺
 * Do not edit manually.
 * Swagger API
 * This is a swagger for API.
 * OpenAPI spec version: 1.0
 */
import axios from 'axios'
import type {
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import type {
  MeResponse,
  UserResponse,
  UpdateUserRequest,
  MessageResponse,
  UpdatePasswordRequest
} from './bookstore.schemas'




  /**
 * Retrieve my information
 * @summary Retrieve my information
 */
export const getMe = <TData = AxiosResponse<MeResponse>>(
     options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/me`,options
    );
  }
/**
 * Update user
 * @summary Update user
 */
export const updateUser = <TData = AxiosResponse<UserResponse>>(
    updateUserRequest: UpdateUserRequest, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/users`,
      updateUserRequest,options
    );
  }
/**
 * Update user's password
 * @summary Update user's password
 */
export const updatePassword = <TData = AxiosResponse<MessageResponse>>(
    updatePasswordRequest: UpdatePasswordRequest, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/users/password`,
      updatePasswordRequest,options
    );
  }
