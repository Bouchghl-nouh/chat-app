import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "./RegisterForm";
import { useRegisterUser } from "../hooks/useRegister";

// Mock the useRegisterUser hook
vi.mock("../hooks/useRegister");

describe("RegisterForm", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock implementation
    vi.mocked(useRegisterUser).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  it("renders register form with username, email and password fields", () => {
    render(<RegisterForm />);
    const userNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole("button", { name: /Create account/i });
    expect(userNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
  it("shows validation error for short username", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    const userNameInput = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole("button", { name: /Create account/i });
    await user.type(userNameInput, "J");
    await user.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText(/Name should be at least 2 characters/i),
      ).toBeInTheDocument();
    });
    expect(userNameInput).toHaveClass("border-red-500");
    expect(mockMutate).not.toHaveBeenCalled();
  });
  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /Create account/i });
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
    expect(emailInput).toHaveClass("border-red-500");
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows validation error for short passwords", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole("button", { name: /Create account/i });
    await user.type(passwordInput, "123");
    await user.type(confirmPasswordInput, "12");
    await user.click(submitButton);
    await waitFor(() => {
      const errors = screen.getAllByText(
        /Password should be at least 4 characters/i,
      );
      expect(errors).toHaveLength(2);
      expect(passwordInput).toHaveClass("border-red-500");
      expect(confirmPasswordInput).toHaveClass("border-red-500");
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });
  it("shows validation error for non-matching passwords", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole("button", { name: /Create account/i });
    await user.type(passwordInput, "1234");
    await user.type(confirmPasswordInput, "4321");
    await user.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText(/Passwords do not match/i),
      ).toBeInTheDocument();
      expect(confirmPasswordInput).toHaveClass("border-red-500");
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });
  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    const userNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole("button", { name: /Create account/i });
    await user.type(userNameInput, "Joe");
    await user.type(emailInput, "valid@example.com");
    await user.type(passwordInput, "1234");
    await user.type(confirmPasswordInput, "1234");
    await user.click(submitButton);
    expect(mockMutate).toHaveBeenCalledWith({
      username: "Joe",
      email: "valid@example.com",
      password: "1234",
    });
  });

    it("disables submit button when form is submitting", () => {
      vi.mocked(useRegisterUser).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as any);
      render(<RegisterForm />);
      const submitButton = screen.getByRole("button", { name: /Creating account/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
});
