import axios, { type AxiosResponse ,AxiosError } from "axios";

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface IApiListResult<T = any> {
  totalCount: number;
  items: T[];
}

class ApiUtility {
  private redirecting = false;
  private client = (() => {
    const axiosInstance = axios.create({
      baseURL: "http://10.2.63.176:8080",
      withCredentials: true,
    });

    // Global 401 interceptor
  axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const excludedPaths = ["/login", "/registration", "/forgot-password" ,"/reset-password"]; // exclude login & registration pages
    if (
      error.response?.status === 401 &&
      !this.redirecting &&
      !excludedPaths.includes(window.location.pathname)
    ) {
      this.redirecting = true;

      // Clear session or tokens
      localStorage.removeItem("token");
      sessionStorage.clear();

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
    return axiosInstance;
  })();

  // Raw GET (returns full Axios response)
  get = async <T>(url: string, params?: any): Promise<AxiosResponse<T>> => {
    return this.client.get(url, { params });
  };

  // GET and unwrap payload
  getResult = async <T>(url: string, params?: any): Promise<T> => {
    const res = await this.client.get<IApiResponse<T>>(url, { params });
    return res.data.data; // unwraps to data directly
  };

  // POST
  post = async <T>(url: string, body?: any): Promise<IApiResponse<T>> => {
    const res = await this.client.post<IApiResponse<T>>(url, body);
    return res.data;
  };

  // PUT / UPDATE
  put = async <T>(url: string, body?: any): Promise<IApiResponse<T>> => {
    const res = await this.client.put<IApiResponse<T>>(url, body);
    return res.data;
  };

  // DELETE
  delete = async <T>(url: string, params?: any): Promise<IApiResponse<T>> => {
    const res = await this.client.delete<IApiResponse<T>>(url, { params });
    return res.data;
  };

  // POST with form data
  postForm = async <T>(url: string, body: Record<string, any>): Promise<IApiResponse<T>> => {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
    const res = await this.client.post<IApiResponse<T>>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  // File download
  downloadFile = async (url: string, params?: any) => {
    const res = await this.client.get(url, {
      params,
      responseType: "blob",
    });
    return res.data;
  };
}

export default new ApiUtility();
