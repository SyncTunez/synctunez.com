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
import { toast } from "sonner";
import { RegisterFormSchema } from "@/lib/api/schemas";
import type { z } from "zod";

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
import { captureAuthError, captureValidationError, captureComponentError, addBreadcrumb } from "@/lib/sentry";

export default function RegisterModal({ userSession, userAccountRaw }: { userSession: string | null; userAccountRaw: string | null; }) {

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [dialogErrorMessage, setDialogErrorMessage] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof RegisterFormSchema>, unknown, z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const username = form.watch("username");

  const onSubmit: SubmitHandler<z.infer<typeof RegisterFormSchema>> = async (data) => {
    addBreadcrumb('Registration attempt started', 'auth', {
      username: data.username,
      userSession: !!userSession
    });

    try {
      const response = await authorized.get(buildUrl("/register", { username: data.username }));
      if (response.status === 200) {
        addBreadcrumb('Registration successful', 'auth', {
          username: data.username,
          status: response.status
        });
        toast.success("Registration successful! Redirecting...");
        window.location.reload();
      } else {
        captureAuthError(
          `Registration failed with unexpected status: ${response.status}`,
          {
            component: 'RegisterModal',
            action: 'registration',
            authProvider: 'google',
            authStep: 'username_registration',
            statusCode: response.status,
            responseData: response.data,
            additionalData: {
              username: data.username,
              userSession: !!userSession
            }
          },
          'error'
        );
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: unknown) {
      setUsernameError(null);
      setDialogErrorMessage(null);
      
      if (error instanceof AxiosError && error.response) {
        const statusCode = error.response.status;
        const responseData = error.response.data;
        
        captureAuthError(
          `Registration failed with status ${statusCode}: ${responseData}`,
          {
            component: 'RegisterModal',
            action: 'registration',
            authProvider: 'google',
            authStep: 'username_registration',
            statusCode,
            responseData,
            requestData: { username: data.username },
            additionalData: {
              username: data.username,
              userSession: !!userSession,
              error: error.message,
              stack: error.stack
            }
          },
          statusCode >= 500 ? 'error' : 'warning'
        );

        switch (statusCode) {
          case 400:
            if (responseData === "Username is missing or invalid") {
              setUsernameError("Username is missing or invalid.");
              captureValidationError(
                "Username validation failed: missing or invalid",
                {
                  component: 'RegisterModal',
                  action: 'username_validation',
                  formName: 'registration',
                  fieldName: 'username',
                  validationRule: 'required_and_valid',
                  additionalData: {
                    username: data.username,
                    responseData
                  }
                },
                'warning'
              );
            } else {
              setUsernameError("Bad Request: " + responseData);
            }
            break;
          case 401:
            captureAuthError(
              "Registration failed: Could not find Google authentication",
              {
                component: 'RegisterModal',
                action: 'registration',
                authProvider: 'google',
                authStep: 'authentication_check',
                statusCode,
                responseData,
                additionalData: {
                  username: data.username,
                  userSession: !!userSession
                }
              },
              'error'
            );
            toast.error("Registration failed: Could not find Google authentication.");
            break;
          case 409:
            if (responseData === "Username already exists") {
              setDialogErrorMessage("Username already exists.");
              captureValidationError(
                "Username already exists",
                {
                  component: 'RegisterModal',
                  action: 'username_validation',
                  formName: 'registration',
                  fieldName: 'username',
                  validationRule: 'unique',
                  additionalData: {
                    username: data.username,
                    responseData
                  }
                },
                'warning'
              );
            } else {
              setDialogErrorMessage("Conflict: " + responseData);
            }
            break;
          case 502:
            captureAuthError(
              "Registration failed: Failed to retrieve user information from Google",
              {
                component: 'RegisterModal',
                action: 'registration',
                authProvider: 'google',
                authStep: 'google_api_call',
                statusCode,
                responseData,
                additionalData: {
                  username: data.username,
                  userSession: !!userSession
                }
              },
              'error'
            );
            toast.error("Registration failed: Failed to retrieve user information from Google.");
            break;
          default:
            captureAuthError(
              `Unexpected registration error: ${statusCode}`,
              {
                component: 'RegisterModal',
                action: 'registration',
                authProvider: 'google',
                authStep: 'unknown',
                statusCode,
                responseData,
                additionalData: {
                  username: data.username,
                  userSession: !!userSession
                }
              },
              'error'
            );
            toast.error("An unexpected error occurred during registration.");
        }
      } else {
        captureAuthError(
          `Registration network error: ${error instanceof Error ? error.message : String(error)}`,
          {
            component: 'RegisterModal',
            action: 'registration',
            authProvider: 'google',
            authStep: 'network_request',
            additionalData: {
              username: data.username,
              userSession: !!userSession,
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              isNetworkError: true
            }
          },
          'error'
        );
        toast.error("Network error or no response. Please check your internet connection.");
      }
    }
  }

  const handleEscapeKeyDown = (e: KeyboardEvent) => e.preventDefault();
  const handlePointerDownOutside = (e: CustomEvent<{ originalEvent: PointerEvent }>) => e.detail.originalEvent.preventDefault();

  useEffect(() => {
    if (userSession !== null && userAccountRaw === null) {
      setIsRegisterModalOpen(true);
      addBreadcrumb('Register modal opened', 'auth', {
        userSession: !!userSession,
        userAccountRaw: !!userAccountRaw
      });
    } else {
      setIsRegisterModalOpen(false);
    }
  }, [userSession, userAccountRaw]);

  // Track form validation errors
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && name === 'username') {
        const username = value.username || '';
        if (username.length > 0 && username.length < 2) {
          captureValidationError(
            "Username too short",
            {
              component: 'RegisterModal',
              action: 'username_validation',
              formName: 'registration',
              fieldName: 'username',
              validationRule: 'min_length',
              additionalData: {
                username,
                length: username.length,
                minLength: 2
              }
            },
            'info'
          );
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
      <Dialog open={isRegisterModalOpen}>
        <DialogContent
            onEscapeKeyDown={handleEscapeKeyDown}
            onPointerDownOutside={handlePointerDownOutside}
            showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Register for SyncTuneZ</DialogTitle>
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
              <Link href="/api/logout" className="w-full">
                <Button className="w-full" variant="outline">Logout</Button>
              </Link>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
} 