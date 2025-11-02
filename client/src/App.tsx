
import { useAppDispatch, useAppSelector } from "./hooks/redux"
import { decrement, increment } from "./store/slices/counterSlice"
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Link} from "react-router-dom";
async function handleSubmit() {
  const promise = new Promise((resolve) => setTimeout(resolve, 2000));

  toast.promise(promise, {
    loading: "Saving your data...",
    success: "Data saved!",
    error: "Failed to save.",
  });
}
export function Counter() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <Button onClick={handleSubmit}>toast</Button>
      </div>
      <Link to={"/dashboard"}>to dashboard </Link>
    </div>
  )
}
export default Counter ;