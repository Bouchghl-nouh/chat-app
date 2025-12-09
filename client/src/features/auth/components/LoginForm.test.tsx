import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";
import { useLoginUser } from "../hooks/useLogin";

// Mock the useLoginUser hook
vi.mock("../hooks/useLogin");

describe("LoginForm", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock implementation
    vi.mocked(useLoginUser).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  it("renders login form with email and password fields", () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
    expect(emailInput).toHaveClass("border-red-500");
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows validation error for short password", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });
    await user.type(passwordInput, "12");
    await user.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText(/Password should be at least 4 characters/i),
      ).toBeInTheDocument();
      expect(passwordInput).toHaveClass("border-red-500");
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });
    await user.type(emailInput, "valid@example.com");
    await user.type(passwordInput, "1234");
    await user.click(submitButton);
    expect(mockMutate).toHaveBeenCalledWith({
      email: "valid@example.com",
      password: "1234",
    });
  });

  it("disables submit button when form is submitting", () => {
    vi.mocked(useLoginUser).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: /login/i });
    expect(submitButton).toBeDisabled();
  });
});
