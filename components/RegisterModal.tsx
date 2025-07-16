"use client"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { clsx } from "clsx";
import { CheckCircle, XCircle } from "lucide-react";

import { AxiosError } from 'axios';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {authorized, buildUrl} from "@/lib/api/apiClient";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function RegisterModal({ userSession, userAccountRaw }: { userSession: string | null; userAccountRaw: string | null; }) {

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [dialogErrorMessage, setDialogErrorMessage] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof FormSchema>, unknown, z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const username = form.watch("username");

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    try {
      const response = await authorized.get(buildUrl("/register", { username: data.username }));
      if (response.status === 200) {
        toast.success("Registration successful! Redirecting...");
        window.location.reload();
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: unknown) {
      setUsernameError(null);
      setDialogErrorMessage(null);
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 400:
            if (error.response.data === "Username is missing or invalid") {
              setUsernameError("Username is missing or invalid.");
            } else {
              setUsernameError("Bad Request: " + error.response.data);
            }
            break;
          case 401:
            toast.error("Registration failed: Could not find Google authentication.");
            break;
          case 409:
            if (error.response.data === "Username already exists") {
              setDialogErrorMessage("Username already exists.");
            } else {
              setDialogErrorMessage("Conflict: " + error.response.data);
            }
            break;
          case 502:
            toast.error("Registration failed: Failed to retrieve user information from Google.");
            break;
          default:
            toast.error("An unexpected error occurred during registration.");
        }
      } else {
        toast.error("Network error or no response. Please check your internet connection.");
      }
    }
  }

  const handleEscapeKeyDown = (e: KeyboardEvent) => e.preventDefault();
  const handlePointerDownOutside = (e: CustomEvent<{ originalEvent: PointerEvent }>) => e.detail.originalEvent.preventDefault();

  useEffect(() => {
    if (userSession !== null && userAccountRaw === null) {
      setIsRegisterModalOpen(true);
    } else {
      setIsRegisterModalOpen(false);
    }
  }, [userSession, userAccountRaw]);

  return (
      <Dialog open={isRegisterModalOpen}>
        <DialogContent
            onEscapeKeyDown={handleEscapeKeyDown}
            onPointerDownOutside={handlePointerDownOutside}
            showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Register for SyncTunez</DialogTitle>
            <DialogDescription>
              Create an account to manage your music and connect with others.
            </DialogDescription>
          </DialogHeader>
          {dialogErrorMessage && (
            <p className="text-center text-red-500 mb-4">{dialogErrorMessage}</p>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <FormField
                  control={form.control}
                  name="username"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} className={clsx(usernameError && "border-red-500")} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <div className="mt-2 text-sm">
                          <p className={clsx("flex items-center gap-1", username.length >= 2 ? "text-green-500" : "text-red-500")}>
                            {username.length >= 2 ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            Must be at least 2 characters
                          </p>
                        </div>
                        {usernameError && <FormMessage>{usernameError}</FormMessage>}
                      </FormItem>
                  )}
              />
              <Button type="submit" className="w-full">Register</Button>
              <Link href="/logout" className="w-full">
                <Button className="w-full" variant="outline">Logout</Button>
              </Link>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
} 