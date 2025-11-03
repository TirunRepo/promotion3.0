import type { IPagedData } from "../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";

export interface IAuthUser {
  id: string;
  email: string;
  fullname: string;
  role: string;
  companyName: string;
}

export interface IRegisterUser {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  companyName: string;
  country: string;
  state: string;
  city: string;
}

export interface IGetRegisterUser {
  id?: number | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  country: string;
  state: string;
  city: string;
}

class AuthService {
  private route = "/auth";

  login = (data: { userName: string; password: string }) =>
    ApiUtility.post<IApiResponse<any>>(`${this.route}/login`, data);

  logout = () => ApiUtility.post<IApiResponse<any>>(`${this.route}/logout`, {});

  check = () => ApiUtility.getResult<IAuthUser>(`${this.route}/check`);

  forgotPassword = (email: string) =>
    ApiUtility.post<IApiResponse<any>>(`${this.route}/forgot-password`, { email });

  resetPassword = (token: string, newPassword: string) =>
    ApiUtility.post<IApiResponse<any>>(`${this.route}/reset-password`, { token, newPassword });

  register = (data: any) =>
    ApiUtility.post<IApiResponse<any>>(`${this.route}/register`, data);

  getUserRegister = (page: number, pageSize: number , role: string) =>
    ApiUtility.get<IApiResponse<IPagedData<IGetRegisterUser>>>(`${this.route}/GetRegisterUser?page=${page}&pageSize=${pageSize}&role=${role}`);

  downloadRegisterUser = async () => {
    // Use ApiUtility.downloadFile
    const blob = await ApiUtility.downloadFile(`${this.route}/DownloadRegisterUsers`);

    // Create a URL and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "RegisteredUsers.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

 getAgentInventoryReport = (agentId: number, page: number, pageSize: number) =>
    ApiUtility.get<IApiResponse<IPagedData<any>>>(`${this.route}/GetAgentInventoryReport?agentId=${agentId}&page=${page}&pageSize=${pageSize}`);
  
}

export default new AuthService();
