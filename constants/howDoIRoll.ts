import { CameraEquipmentIcon } from "@/components/icons/home/roll_section/CameraEquipmentIcon";
import { MobileIcon } from "@/components/icons/home/roll_section/MobileIcon";
import { ComponentType } from "react";

export interface HowDoIRollStep {
  number: string;
  icon: ComponentType<any>;
  title: string;
}

export const HOW_DO_I_ROLL_STEPS: HowDoIRollStep[] = [
  {
    number: "01",
    icon: CameraEquipmentIcon,
    title: "Add the equipment you need for your shoot.",
  },
  // {
  //   number: "02",
  //   icon: MobileIcon,
  //   title: "Upload documents & complete KYC easily.",
  // },
  {
    number: "02",
    icon: MobileIcon,
    title: "Choose expert delivery options.",
  },
];
