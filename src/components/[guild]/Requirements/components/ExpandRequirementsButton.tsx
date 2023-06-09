import { Divider, Flex, Icon, useColorMode } from "@chakra-ui/react"
import { formattedLogic } from "components/[guild]/LogicDivider"
import Button from "components/common/Button"
import { ArrowDown, ArrowUp } from "phosphor-react"
import { Logic } from "types"

type Props = {
  logic: Logic
  hiddenRequirements: number
  isRequirementsExpanded: boolean
  onToggleExpanded: () => void
}

const ExpandRequirementsButton = ({
  logic,
  hiddenRequirements,
  isRequirementsExpanded,
  onToggleExpanded,
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Flex pt={3} width="full" alignItems="center" justifyContent="center">
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
        opacity={isRequirementsExpanded ? 0 : 1}
        transition={`opacity .1s ${isRequirementsExpanded ? "" : "0.16s"}`}
      />
      <Flex
        px={4}
        alignItems="center"
        justifyContent="center"
        fontSize="xs"
        fontWeight="bold"
      >
        <Button
          w="full"
          size="xs"
          borderRadius="md"
          color={colorMode === "light" ? "blackAlpha.500" : "gray.400"}
          bg={colorMode === "light" ? "blackAlpha.50" : undefined}
          textTransform="uppercase"
          fontWeight="bold"
          rightIcon={<Icon as={isRequirementsExpanded ? ArrowUp : ArrowDown} />}
          onClick={onToggleExpanded}
        >
          {isRequirementsExpanded
            ? "Collapse"
            : `${formattedLogic[logic]} ${hiddenRequirements} more`}
        </Button>
      </Flex>
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
        opacity={isRequirementsExpanded ? 0 : 1}
        transition={`opacity .1s ${isRequirementsExpanded ? "" : "0.16s"}`}
      />
    </Flex>
  )
}

export default ExpandRequirementsButton
