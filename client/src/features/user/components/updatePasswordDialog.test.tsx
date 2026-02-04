import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileForm from "./profileForm";

vi.mock("../hooks/useUpdateProfile", () => ({
  useUpdateProfile: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));
vi.mock("../hooks/useUpdatePassword", () => ({
  useUpdatePassword: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));
const MOCK_USER_PROFILE = {
  username: "username",
  email: "email@gmail.com",
  firstName: "firstName",
  lastName: "lastName",
};
vi.mock("../hooks/useMyProfile", () => ({
  useMyProfile: vi.fn(() => ({
    data: MOCK_USER_PROFILE,
    isLoading: false,
  })),
}));
vi.mock("@/hooks/redux", () => ({
  useAppDispatch: vi.fn(() => vi.fn()),
}));

describe("", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Dialog fields", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    const changePasswordButton = screen.getByRole("button", {
      name: /Change Password/i,
    });
    await user.click(changePasswordButton);
    const SaveButton = screen.getByRole("button", {
      name: /Save/i,
    });
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });
    const fieldLabels = [/Old Password/i, /^password$/i, /Confirm Password/i];
    for (let label of fieldLabels) {
      const input = screen.getByLabelText(label);
      expect(input).toBeInTheDocument();
    }
    expect(cancelButton).toBeInTheDocument();
    expect(SaveButton).toBeInTheDocument();
  });
  it("show validation errors for invalid inputs", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    const changePasswordButton = screen.getByRole("button", {
      name: /Change Password/i,
    });
    await user.click(changePasswordButton);
    const SaveButton = screen.getByRole("button", {
      name: /Save/i,
    });
    const oldPasswordInput = screen.getByLabelText(/Old Password/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    await user.type(oldPasswordInput, "p");
    await user.type(passwordInput, "pa");
    await user.type(confirmPasswordInput, "pa");
    await user.click(SaveButton);
    await waitFor(() => {
      expect(
        screen.getByText(/Old Password should be at least 2 characters$/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/^Password should be at least 4 characters$/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/^Confirm Password should be at least 4 characters$/i),
      ).toBeInTheDocument();
      expect(SaveButton).toBeInTheDocument();
    });
  });
  it("show validation errors for password mismatch", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    const changePasswordButton = screen.getByRole("button", {
      name: /Change Password/i,
    });
    await user.click(changePasswordButton);
    const SaveButton = screen.getByRole("button", {
      name: /Save/i,
    });
    const oldPasswordInput = screen.getByLabelText(/Old Password/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    await user.type(oldPasswordInput, "oldPassword");
    await user.type(passwordInput, "password");
    await user.type(confirmPasswordInput, "paassword");
    await user.click(SaveButton);
    await waitFor(() => {
      expect(screen.getByText(/^Passwords do not match$/i)).toBeInTheDocument();
      expect(SaveButton).toBeInTheDocument();
    });
  });
  it("hitting cancel should make the dialog disappear", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    const changePasswordButton = screen.getByRole("button", {
      name: /Change Password/i,
    });
    await user.click(changePasswordButton);
    const CancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });

    const oldPasswordInput = screen.getByLabelText(/Old Password/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    await user.click(CancelButton);
    await waitFor(() => {
      expect(oldPasswordInput).not.toBeInTheDocument();
      expect(passwordInput).not.toBeInTheDocument();
      expect(confirmPasswordInput).not.toBeInTheDocument();
    });
  });
  it("shows no errors if inputs are correct", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    const changePasswordButton = screen.getByRole("button", {
      name: /Change Password/i,
    });
    await user.click(changePasswordButton);
    const submitButton = screen.getByRole("button", {
      name: /Save/i,
    });
    const fieldLabels = [/Old Password/i, /^Password$/i, /Confirm Password/i];
    for (const label of fieldLabels) {
      const input = screen.getByLabelText(label);
      await user.type(input, "pass");
    }
    await user.click(submitButton);
    fieldLabels.forEach((label) => {
      const input = screen.getByLabelText(label);
      expect(input).not.toHaveClass("border-red-500");
    });
  });
});
