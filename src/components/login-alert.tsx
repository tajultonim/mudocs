import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { ReactNode } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";

export function LoginPopup({
  children,
  title,
  description,
  isLoading = false,
}: {
  children: ReactNode;
  title: string;
  description: string;
  isLoading?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <LoginForm />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              {isLoading ? (<>Loading<span className="loading loading-dots loading-xs"></span></>) : "Cancel"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
