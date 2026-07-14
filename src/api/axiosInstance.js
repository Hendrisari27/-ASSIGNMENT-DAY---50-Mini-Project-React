import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { loginApi, fetchProfileApi } from "./mockApi";

// Instance axios untuk semua panggilan API ber-auth.
export const api = axios.create({ baseURL: "/api" });

// Mock backend (hanya untuk latihan). Di app sungguhan bagian ini tidak ada —
// request diteruskan ke server nyata.
const mock = new MockAdapter(api, { delayResponse: 400 });

mock.onPost("/auth/login").reply(async (config) => {
  try {
    const body = JSON.parse(config.data || "{}");
    const { token, user } = await loginApi(body);
    return [200, { token, user }];
  } catch (e) {
    return [401, { message: e.message }];
  }
});

mock.onGet("/auth/me").reply(async (config) => {
  const auth = config.headers?.Authorization || "";
  try {
    const user = await fetchProfileApi(String(auth).replace("Bearer ", ""));
    return [200, { user }];
  } catch (e) {
    return [401, { message: e.message }]; // token invalid / expired
  }
});

// Response interceptor: kalau ada respon 401 (token expired), bersihkan token
// dan arahkan user ke /login. Mencegah user terjebak di state error.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
