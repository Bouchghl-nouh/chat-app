import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { RegisterPage } from "./index";
import { Toaster } from "@/components/ui/sonner"
import type { RegisterRequest } from "../api/register.api";
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

describe("RegisterPage Integration Tests", () => {
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

  const renderRegisterPage = () => {
    return render(
      <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </QueryClientProvider>
      <Toaster richColors closeButton position="top-right" duration={5000}/>
      </>
    );
  };

  it("should submit the registration form successfully", async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/full name/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole("button", { name: /register/i });
    await user.type(emailInput, "email@gmai.com");
    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
  it("should show server error message on registration failure", async () => {
    server.use(
      http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
        const body = (await request.json()) as RegisterRequest;
        if (body.email === "existing@email.com") {
          return HttpResponse.json(
            {
              success: false,
              message: "Email already used",
              statusCode: 400,
            },
            { status: 400 },
          );
        }
      }),
    );
    const user = userEvent.setup();
    renderRegisterPage();
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/full name/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole("button", { name: /register/i });
    await user.type(emailInput, "existing@email.com");
    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email already used/i)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
