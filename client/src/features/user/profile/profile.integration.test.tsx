import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import UserProfile from "./index";
import { Toaster } from "@/components/ui/sonner";
import type { ProfileFormSchema } from "@/features/user/validation/updateProfile.schema";
import { clearCredentials } from "@/store/slices/userSlice";
// Mock useNavigate
const mockDispatch = vi.fn();

vi.mock("@/hooks/redux", () => ({
  useAppDispatch: vi.fn(() => mockDispatch),
}));
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const BASE_URL = import.meta.env.VITEST_API_URL;

describe("UserProfile Integration Tests", () => {
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

  const renderUserProfilePage = () => {
    return render(
      <>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <UserProfile />
          </BrowserRouter>
        </QueryClientProvider>
        <Toaster richColors closeButton position="top-right" duration={5000} />
      </>,
    );
  };

  it("should update the user profile form successfully", async () => {
    server.use(
      http.get(`${BASE_URL}/user/me`, async () => {
        return HttpResponse.json(
          {
            success: true,
            message: "user data",
            statusCode: 200,
            data: {
              username: "username",
              email: "email@gmail.com",
            },
          },
          { status: 200 },
        );
      }),
    );
    server.use(
      http.patch(`${BASE_URL}/user/me`, async ({ request }) => {
        (await request.json()) as ProfileFormSchema;
        return HttpResponse.json(
          {
            success: true,
            message: "updated profile successfully",
            statusCode: 200,
          },
          { status: 200 },
        );
      }),
    );
    const user = userEvent.setup();
    renderUserProfilePage();
    const EditButton = await screen.findByRole("button", {
      name: /Edit Profile/i,
    });
    await user.click(EditButton);
    const userNameInput = screen.getByLabelText(/^username/i);
    const lastNameInput = screen.getByLabelText(/^lastName/i);
    const firstNameInput = screen.getByLabelText(/^firstName/i);
    const bio = screen.getByLabelText(/^bio$/i);
    const submitButton = screen.getByRole("button", { name: /save Changes/i });
    await user.type(userNameInput, "username");
    await user.type(lastNameInput, "lastName");
    await user.type(firstNameInput, "firstName");
    await user.type(bio, "bio");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/updated profile successfully/i),
      ).toBeInTheDocument();
      expect(mockDispatch).toHaveBeenCalledWith(clearCredentials())
    });
  });
  it("should inputs values the same as ones got from api", async () => {
    server.use(
      http.get(`${BASE_URL}/user/me`, async () => {
        return HttpResponse.json(
          {
            success: true,
            message: "user data",
            statusCode: 200,
            data: {
              username: "username",
              email: "email@gmail.com",
              description: "description",
              firstName: "John",
              lastName: "Doe",
            },
          },
          { status: 200 },
        );
      }),
    );
    renderUserProfilePage();
    const emailInput = await screen.findByLabelText(/email address/i);
    const userNameInput = screen.getByLabelText(/^username/i);
    const lastNameInput = screen.getByLabelText(/^lastName/i);
    const firstNameInput = screen.getByLabelText(/^firstName/i);
    const bio = screen.getByLabelText(/^bio$/i);
    await waitFor(() => {
      expect(userNameInput).toHaveValue("username");
      expect(lastNameInput).toHaveValue("Doe");
      expect(firstNameInput).toHaveValue("John");
      expect(bio).toHaveValue("description");
      expect(emailInput).toHaveValue("email@gmail.com");
    });
  });
  it("should update the user password form successfully", async () => {
    server.use(
      http.get(`${BASE_URL}/user/me`, async () => {
        return HttpResponse.json(
          {
            success: true,
            message: "user data",
            statusCode: 200,
            data: {
              username: "username",
              email: "email@gmail.com",
            },
          },
          { status: 200 },
        );
      }),
    );
    server.use(
      http.patch(`${BASE_URL}/auth/newPassword`, async ({ request }) => {
        (await request.json()) as ProfileFormSchema;
        return HttpResponse.json(
          {
            success: true,
            message: "password updated successfully",
            statusCode: 200,
          },
          { status: 200 },
        );
      }),
    );
    const user = userEvent.setup();
    renderUserProfilePage();
    const changePasswordButton = await screen.findByRole("button", {
      name: /Change Password/i,
    });
    await user.click(changePasswordButton);
    const oldPasswordInput = screen.getByLabelText(/Old Password/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const saveButton = screen.getByRole("button", { name: /Save/i });
    await user.type(oldPasswordInput, "OldPassword123!");
    await user.type(passwordInput, "NewPassword123!");
    await user.type(confirmPasswordInput, "NewPassword123!");
    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password updated successfully/i),
      ).toBeInTheDocument();
    });
  });
});
