import { fp, hp, wp } from "@/utils/responsive";
import { Toast, useToastController, useToastState } from "@tamagui/toast";

export const ShootsToast = () => {
  const toast = useToastController();
  const state = useToastState();

  // don't show any toast if no toast is present or it's handled natively
  if (!toast || state?.isHandledNatively) {
    return null;
  }

  return (
    <Toast
      borderRadius={wp(12)}
      paddingHorizontal={wp(12)}
      paddingVertical={hp(8)}
      backgroundColor={"#FFF"}
      key={state?.id}
      duration={state?.duration}
      enterStyle={{ opacity: 0, scale: 0.95 }}
      exitStyle={{ opacity: 0, scale: 0.95 }}
      animation="quick"
      onPress={() => toast.hide()}
      //   height={120}
      width={wp(120)}
      viewportName="my-shoots"
    >
      <Toast.Title
        fontSize={fp(14)}
        fontWeight={"500"}
        lineHeight={wp(16)}
        color={"#121217"}
      >
        {state?.title}
      </Toast.Title>
      {state?.message && (
        <Toast.Description
          fontSize={fp(12)}
          fontWeight={"400"}
          lineHeight={wp(16)}
          color={"#121217"}
        >
          {state.message}
        </Toast.Description>
      )}
    </Toast>
  );
};
