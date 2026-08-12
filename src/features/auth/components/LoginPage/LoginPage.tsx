"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  PasswordInput,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useLoginPage } from "@/features/auth/components/LoginPage/useLoginPage";

export function LoginPage() {
  const { t } = useAppTranslation();
  const { form, onSubmit, isSubmitting, errorMessage } = useLoginPage();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: 360 }}>
        <CardHeader>
          <CardTitle>{t("app.name", "Nova Console")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit} className="grid gap-4">
            <FormField
              label={t("auth.login.email", "Email")}
              htmlFor="email"
              error={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                autoComplete="username"
                invalid={!!errors.email}
                {...register("email")}
              />
            </FormField>
            <FormField
              label={t("auth.login.password", "Password")}
              htmlFor="password"
              error={errors.password?.message}
            >
              <PasswordInput
                id="password"
                autoComplete="current-password"
                invalid={!!errors.password}
                {...register("password")}
              />
            </FormField>
            {errorMessage ? (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}
            <Button type="submit" loading={isSubmitting} className="w-full">
              {t("auth.login.submit", "Sign in")}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
