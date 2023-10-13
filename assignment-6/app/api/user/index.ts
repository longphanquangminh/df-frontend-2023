import { https } from './config';

export interface User {
  taiKhoan: string;
  matKhau: string;
}

export const userApi = {
  getList: async (): Promise<User[]> => {
    const response = await https.get<User[]>(
      '/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP00'
    );
    return response.data;
  },
  deleteUser: (taiKhoan: string): void => {
    https.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
  },
};
