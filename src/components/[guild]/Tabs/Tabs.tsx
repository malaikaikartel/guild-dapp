import {
  Box,
  HStack,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import useIsStuck from "hooks/useIsStuck"
import { PropsWithChildren } from "react"
import useGuild from "../hooks/useGuild"
import { useThemeContext } from "../ThemeContext"
import TabButton from "./components/TabButton"

type Props = {
  tabTitle: string
}

const Tabs = ({ tabTitle, children }: PropsWithChildren<Props>): JSX.Element => {
  const { ref, isStuck } = useIsStuck()
  const { colorMode } = useColorMode()
  const { textColor } = useThemeContext()
  const tabButtonColor = isStuck && colorMode === "light" ? "black" : textColor

  const { urlName } = useGuild()
  const bgColor = useColorModeValue("white", "gray.800")

  return (
    <Stack
      ref={ref}
      direction="row"
      justifyContent="space-between"
      alignItems={"center"}
      position="sticky"
      top={0}
      py={3}
      mt={-3}
      mb={2}
      width="full"
      zIndex={isStuck ? "banner" : "auto"}
      _before={{
        content: `""`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "full",
        // button height + padding
        height: "calc(var(--chakra-space-11) + (2 * var(--chakra-space-3)))",
        bgColor: bgColor,
        boxShadow: "md",
        transition: "opacity 0.2s ease, visibility 0.1s ease",
        visibility: isStuck ? "visible" : "hidden",
        opacity: isStuck ? 1 : 0,
      }}
    >
      <Box
        position="relative"
        ml={-8}
        minW="0"
        sx={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent)",
        }}
      >
        <HStack
          overflowX="auto"
          px={8}
          color={tabButtonColor}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          <TabButton href={`${urlName}`}>{tabTitle}</TabButton>
          {/* <TabButton href="#" disabled tooltipText="Stay tuned!">
            More tabs soon
          </TabButton> */}
        </HStack>
      </Box>

      <Box
        color={tabButtonColor}
        sx={{
          "> *": {
            color: tabButtonColor,
          },
        }}
      >
        {children}
      </Box>
    </Stack>
  )
}

export default Tabs
