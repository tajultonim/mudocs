"use client";

import {
  BadgeInfo,
  CheckCircle2Icon,
  CircleX,
  LoaderCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { Button } from "./ui/button";

export function ConfirmModel({
  title = "Are you sure?",
  description = "Do you want to proceed with this action?",
  onConfirm,
  children,
  isLoading = false,
}: {
  title?: string;
  description?: ReactNode;
  onConfirm?: () => void;
  children?: React.ReactNode | string;
  isLoading?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isLoading} variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin" /> Loading...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useAlert() {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<"success" | "error" | "info">("info");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(5000);

  const showAlert = useCallback(
    ({
      type = "info",
      message,
      title,
      duration = 5000,
    }: {
      type?: "success" | "error" | "info";
      message: string;
      title: string;
      duration?: number;
    }) => {
      setType(type);
      setMessage(message);
      setTitle(title);
      setDuration(duration);
      setVisible(true);
    },
    []
  );

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const AlertComponent = () => {
    if (visible) {
      return (
        <div className=" absolute z-[100] bottom-8 left-1/2 -translate-x-1/2">
          <Alert variant={type == "error" ? "destructive" : "default"}>
            {type === "success" && <CheckCircle2Icon />}
            {type === "error" && <CircleX />}
            {type === "info" && <BadgeInfo />}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </div>
      );
    } else {
      return null;
    }
  };

  return { AlertComponent, showAlert };
}

export function AlertCard({
  type = "info",
  title = "Notification",
  children = <p>This is a notification message.</p>,
}: {
  type?: "success" | "error" | "info";
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 px-6">
        {type === "success" && <CheckCircle2Icon className="h-10" size={90} />}
        {type === "error" && <CircleX className="h-10" size={90} />}
        {type === "info" && <BadgeInfo className="h-10" size={90} />}
        <div>
          <AlertTitle className="text-center sm:text-left">{title}</AlertTitle>
          <AlertDescription>
            <div className="[&>p]:text-center sm:[&>p]:text-left">
              {children}
            </div>
          </AlertDescription>
        </div>
      </div>
    </Card>
  );
}
