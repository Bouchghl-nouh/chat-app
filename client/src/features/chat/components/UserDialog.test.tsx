import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserDialog from "./UsersDialog";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../hooks/useUsersList", () => ({
  useUsersList: vi.fn(),
}));

vi.mock("@/hooks/useDebounce", () => ({
  useDebounce: vi.fn(),
}));

vi.mock("react-intersection-observer", () => ({
  useInView: vi.fn(() => ({ ref: vi.fn(), inView: false })),
}));

vi.mock("@/assets/unkown.webp", () => ({ default: "unknown.webp" }));

import { useUsersList } from "../hooks/useUsersList";
import { useDebounce } from "@/hooks/useDebounce";
import { useInView } from "react-intersection-observer";

const mockSetOpen = vi.fn();

const mockUsers = [
  {
    id: "1",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    avatar: "https://example.com/avatar1.jpg",
  },
  {
    id: "2",
    username: "janedoe",
    firstName: "Jane",
    lastName: "Doe",
    avatar: null,
  },
];

const defaultUseUsersList = {
  data: { pages: [{ users: mockUsers }] },
  error: null,
  fetchNextPage: vi.fn(),
  hasNextPage: false,
};

const defaultUseDebounce = {
  isDebouncing: false,
  debounceValue: "",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useUsersList).mockReturnValue(defaultUseUsersList as any);
  vi.mocked(useDebounce).mockReturnValue(defaultUseDebounce);
  vi.mocked(useInView).mockReturnValue({ ref: vi.fn(), inView: false } as any);
});

const renderComponent = (open = true) =>
  render(<UserDialog open={open} setOpen={mockSetOpen} />);

describe("UsersDialog", () => {
  describe("Rendering", () => {
    it("renders the dialog when open is true", () => {
      renderComponent(true);
      expect(
        screen.getByPlaceholderText("Type a command or search..."),
      ).toBeInTheDocument();
    });
  });

  describe("Loading & Error States", () => {
    it("shows loading state while debouncing", () => {
      vi.mocked(useDebounce).mockReturnValue({
        isDebouncing: true,
        debounceValue: "",
      });
      renderComponent();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows error message when there is an error", () => {
      vi.mocked(useUsersList).mockReturnValue({
        ...defaultUseUsersList,
        error: new Error("Failed to fetch users"),
      } as any);
      renderComponent();
      expect(screen.getByText("Failed to fetch users")).toBeInTheDocument();
    });

    it("shows 'No results found' when user list is empty", () => {
      vi.mocked(useUsersList).mockReturnValue({
        ...defaultUseUsersList,
        data: { pages: [{ users: [] }] },
      } as any);
      renderComponent();
      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });

    it("shows loader when hasNextPage is true", () => {
      vi.mocked(useUsersList).mockReturnValue({
        ...defaultUseUsersList,
        hasNextPage: true,
      } as any);
      renderComponent();
      // Loader2 spinner is rendered
      expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });
  });

  describe("Search", () => {
    it("updates search value on input change", async () => {
      const user = userEvent.setup();
      renderComponent();
      const input = screen.getByPlaceholderText("Type a command or search...");
      await user.type(input, "john");
      expect(useDebounce).toHaveBeenCalledWith("john", 500);
    });

    it("passes debounced value to useUsersList", () => {
      vi.mocked(useDebounce).mockReturnValue({
        isDebouncing: false,
        debounceValue: "john",
      });
      renderComponent();
      expect(useUsersList).toHaveBeenCalledWith("john");
    });
  });

  describe("Navigation", () => {
    it("navigates to user profile on item select", async () => {
      const user = userEvent.setup();
      renderComponent();
      const firstUser = screen.getByText("johndoe");
      await user.click(firstUser);
      expect(mockNavigate).toHaveBeenCalledWith("profile/1");
    });

    it("navigates to correct profile for second user", async () => {
      const user = userEvent.setup();
      renderComponent();
      const secondUser = screen.getByText("janedoe");
      await user.click(secondUser);
      expect(mockNavigate).toHaveBeenCalledWith("profile/2");
    });
  });

  describe("Infinite Scroll", () => {
    it("calls fetchNextPage when sentinel comes into view", () => {
      const fetchNextPage = vi.fn();
      vi.mocked(useUsersList).mockReturnValue({
        ...defaultUseUsersList,
        hasNextPage: true,
        fetchNextPage,
      } as any);
      vi.mocked(useInView).mockReturnValue({
        ref: vi.fn(),
        inView: true,
      } as any);
      renderComponent();
      expect(fetchNextPage).toHaveBeenCalled();
    });

    it("does not call fetchNextPage when sentinel is out of view", () => {
      const fetchNextPage = vi.fn();
      vi.mocked(useUsersList).mockReturnValue({
        ...defaultUseUsersList,
        hasNextPage: true,
        fetchNextPage,
      } as any);
      vi.mocked(useInView).mockReturnValue({
        ref: vi.fn(),
        inView: false,
      } as any);
      renderComponent();
      expect(fetchNextPage).not.toHaveBeenCalled();
    });

    it("renders users from multiple pages", () => {
      const page2Users = [
        {
          id: "3",
          username: "alice",
          firstName: "Alice",
          lastName: "Smith",
          avatar: null,
        },
      ];
      vi.mocked(useUsersList).mockReturnValue({
        ...defaultUseUsersList,
        data: { pages: [{ users: mockUsers }, { users: page2Users }] },
      } as any);
      renderComponent();
      expect(screen.getByText("alice")).toBeInTheDocument();
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });
  });
});
