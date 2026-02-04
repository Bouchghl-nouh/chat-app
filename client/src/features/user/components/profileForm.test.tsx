import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileForm from "./profileForm";
vi.mock("../hooks/useUpdateProfile", () => ({
  useUpdateProfile: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));
const MOCK_USER_PROFILE = {
  username: "username",
  email: "email@gmail.com",
  firstName:"firstName",
  lastName:"lastName"
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

vi.mock("@/features/user/components/updatePasswordDialog", () => ({
  default: () => (
    <div data-testid="mock-password-dialog">Mock Password Dialog</div>
  ),
}));
describe.only("ProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page fields", () => {
    render(<ProfileForm />);
    const fieldLabels = [
      /username/i,
      /firstName/i,
      /lastName/i,
      /email/i,
      /bio/i,
    ];
    fieldLabels.forEach((label) => {
      const input = screen.getByLabelText(label);
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
    });
    const changePasswordButton = screen.getByRole("button", {
      name: /Change Password/i,
    });
    const editProfileButton = screen.getByRole("button", {
      name: /Edit Profile/i,
    });
    expect(changePasswordButton).toBeInTheDocument();
    expect(editProfileButton).toBeInTheDocument();
  });
  it("allows uploading a new avatar image", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    const editButton = screen.getByRole("button", { name: /Edit Profile/i });
    await user.click(editButton);
    const fileInput = document.getElementById("avatar") as HTMLInputElement;
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    await user.upload(fileInput, file);
    expect(fileInput.files?.[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it("shows validation error for invalid inputs", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    const editButton = screen.getByRole("button", { name: /Edit Profile/i });
    await user.click(editButton);
    const firstNameInput = screen.getByLabelText(/firstName/i);
    const lastNameInput = screen.getByLabelText(/lastName/i);
    const submitButton = screen.getByRole("button", {
      name: /Save Changes/i,
    });
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });
    await user.clear(firstNameInput);
    await user.clear(lastNameInput);
    await user.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText(/^First name should be at least 2 characters$/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/^Last name should be at least 2 characters$/i),
      ).toBeInTheDocument();
    });
    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(firstNameInput).toHaveClass("border-red-500");
    expect(lastNameInput).toHaveClass("border-red-500");
  });
  it("shows no errors if inputs are correct", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    const editButton = screen.getByRole("button", { name: /Edit Profile/i });
    await user.click(editButton);
    const submitButton = screen.getByRole("button", {
      name: /Save Changes/i,
    });
    const fieldLabels = [/username/i, /firstName/i, /lastName/i];
    for (const label of fieldLabels) {
      const input = screen.getByLabelText(label);
      await user.clear(input);
      await user.type(input, "Hello");
    }
    await user.click(submitButton);
    fieldLabels.forEach((label) => {
      const input = screen.getByLabelText(label);
      expect(input).not.toHaveClass("border-red-500");
    });
  });
  it("cancel should reset inputs to their initial value", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    const editButton = screen.getByRole("button", { name: /Edit Profile/i });
    await user.click(editButton);
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });
    const fieldLabels = [/username/i, /firstName/i, /lastName/i];
    for (const label of fieldLabels) {
      const input = screen.getByLabelText(label);
      await user.clear(input);
      await user.type(input, "Hello");
    }
    await user.click(cancelButton);
    const userNameInput = screen.getByLabelText(/username/i);
    const lastNameInput = screen.getByLabelText(/lastName/i);
    const firstNameInput = screen.getByLabelText(/firstName/i);
    await waitFor(() => {
      expect(userNameInput).toHaveValue(MOCK_USER_PROFILE.username);
      expect(userNameInput).toBeDisabled();
      expect(firstNameInput).toHaveValue(MOCK_USER_PROFILE.firstName);
      expect(firstNameInput).toBeDisabled();
      expect(lastNameInput).toHaveValue(MOCK_USER_PROFILE.lastName);
      expect(lastNameInput).toBeDisabled();
    });
  });
});
