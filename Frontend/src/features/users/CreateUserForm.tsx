import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "../../components/forms/inputField";
import { Button } from "../../components/ui/button";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export interface CreateUserFormProps {
  onSubmit: (values: CreateUserFormValues) => void | Promise<void>;
  submitting?: boolean;
}

/**
 * CreateUserForm
 *
 * Sample form demonstrating the standard form architecture for this
 * project: React Hook Form for state/validation wiring, Zod for the schema
 * and inferred types, and InputField (already RHF-compatible via
 * forwardRef) for the fields themselves.
 *
 * Not connected to the backend — onSubmit is provided by the caller
 * (e.g. a Redux thunk or an axios call in a page/feature component).
 * Every future form (CreateProductForm, CreateVendorForm, etc.) should
 * follow this same shape: schema -> types -> useForm -> register.
 *
 * Example:
 *   <CreateUserForm
 *     submitting={isCreating}
 *     onSubmit={(values) => dispatch(createUser(values))}
 *   />
 */
export function CreateUserForm({ onSubmit, submitting = false }: CreateUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <InputField
        label="Name"
        placeholder="Enter full name"
        required
        error={errors.name?.message}
        {...register("name")}
      />

      <InputField
        label="Email"
        type="email"
        placeholder="Enter email"
        required
        error={errors.email?.message}
        {...register("email")}
      />

      <InputField
        label="Password"
        type="password"
        placeholder="Enter password"
        required
        helperText={!errors.password ? "Minimum 8 characters" : undefined}
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" loading={submitting} className="mt-2 self-start">
        Create user
      </Button>
    </form>
  );
}
