import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { LoginPage } from "./index";
import { Toaster } from "@/components/ui/sonner"
import { Provider } from 'react-redux'
import {store} from '../../../store'
import type { LoginRequest } from "../api/login.api";
// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const BASE_URL = import.meta.env.VITEST_API_URL ;

describe("LoginPage Integration Tests", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderLoginPage = () => {
    return render(
      <>
      <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </QueryClientProvider>
      <Toaster richColors closeButton position="top-right" duration={5000}/>
      </Provider>
      </>
    );
  };

  it("should submit the login form successfully", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.type(emailInput, "email@gmail.com");
    await user.type(passwordInput, "Password123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
  it("should show server error message on login failure", async () => {
    server.use(
      http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
        const body = (await request.json()) as LoginRequest;
        if (body.email !== "existing@email.com") {
          return HttpResponse.json(
            {
              success: false,
              message: "Invalid credentials",
              statusCode: 400,
            },
            { status: 400 },
          );
        }
      }),
    );
    const user = userEvent.setup();
    renderLoginPage();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.type(emailInput, "notExisting@email.com");
    await user.type(passwordInput, "Password123!");
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
