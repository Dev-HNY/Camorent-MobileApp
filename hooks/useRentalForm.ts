import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

export const rentalFormSchema = z.object({
  shootName: z
    .string()
    .trim()
    .min(3, "Shoot name must be at least 3 characters")
    .max(100, "Shoot name must be less than 100 characters"),
  rentalDates: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .refine((data) => data.startDate && data.endDate, {
      message: "Please select rental start and end dates",
    }),
});

export type RentalFormData = z.infer<typeof rentalFormSchema>;

interface UseRentalFormProps {
  initialShootName?: string;
  initialRentalDates?: {
    startDate: string;
    endDate: string;
  } | null;
  onShootNameChange?: (name: string) => void;
  onRentalDatesChange?: (dates: { startDate: string; endDate: string }) => void;
}

export function useRentalForm({
  initialShootName = "",
  initialRentalDates = null,
  onShootNameChange,
  onRentalDatesChange,
}: UseRentalFormProps = {}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      shootName: initialShootName,
      rentalDates: initialRentalDates || { startDate: "", endDate: "" },
    },
    mode: "onChange",
  });

  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(initialRentalDates);

  useEffect(() => {
    if (initialRentalDates) {
      setSelectedDateRange(initialRentalDates);
    }
  }, [initialRentalDates]);

  useEffect(() => {
    setValue("shootName", initialShootName);
  }, [initialShootName, setValue]);

  const handleDateRangeChange = (dates: {
    startDate: string;
    endDate: string;
  }) => {
    setSelectedDateRange(dates);
    setValue("rentalDates", dates);
    trigger("rentalDates");
    onRentalDatesChange?.(dates);
  };

  const handleShootNameChange = (name: string) => {
    setValue("shootName", name);
    onShootNameChange?.(name);
  };

  return {
    control,
    handleSubmit,
    errors,
    setValue,
    trigger,
    selectedDateRange,
    handleDateRangeChange,
    handleShootNameChange,
  };
}
