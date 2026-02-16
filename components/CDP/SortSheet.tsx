import { YStack, XStack, Separator } from "tamagui";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Heading2 } from "@/components/ui/Typography";
import { Radio } from "@/components/ui/Radio";

export interface SortOption {
  type: "price" | "name" | "recent";
  order: "asc" | "desc";
  label: string;
}

interface SortSheetProps {
  isOpen: boolean;
  onClose: () => void;
  sortOptions: SortOption[];
  activeSortOption: SortOption;
  onSelectSort: (option: SortOption) => void;
}

export function SortSheet({
  isOpen,
  onClose,
  sortOptions,
  activeSortOption,
  onSelectSort,
}: SortSheetProps) {
  const handleSortSelect = (option: SortOption) => {
    onSelectSort(option);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[40]}>
      <YStack gap="$1" paddingTop="$3">
        <XStack paddingHorizontal="$4" justifyContent="flex-start">
          <Heading2>Sort by</Heading2>
        </XStack>
        <Separator alignItems="stretch" borderColor="#E5E7EB" />
        <YStack>
          {sortOptions.map((option) => (
            <Radio
              key={option.label}
              label={option.label}
              selected={activeSortOption.label === option.label}
              onSelect={() => handleSortSelect(option)}
            />
          ))}
        </YStack>
      </YStack>
    </BottomSheet>
  );
}
