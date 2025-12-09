import { http, HttpResponse } from "msw";
const BASE_URL = import.meta.env.VITEST_API_URL || "http://localhost:3000";

export const handlers = [
  http.post(`${BASE_URL}/auth/register`, async () => {
    return HttpResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {},
        statusCode: 201,
      },
      { status: 201 },
    );
  }),
  http.post(`${BASE_URL}/auth/login`,async()=>{
    return HttpResponse.json(
      {
        success: true,
        message: "Login successful",
        data: { token: "mock-token" },
        statusCode: 200,
      },
      { status: 200 },
    );
  })
];
