import {
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Link from "components/common/Link"
import { ArrowRight, Copy, DownloadSimple, Question, Warning } from "phosphor-react"
import { useWatch } from "react-hook-form"
import useBalancy from "../hooks/useBalancy"

const BalancyCounterWithPopover = ({ ...rest }) => {
  const { holders, addresses, isLoading, inaccuracy, usedLogic } = useBalancy()

  const logic = useWatch({ name: "logic" })

  const { hasCopied, onCopy } = useClipboard(addresses ? addresses?.join("\n") : "")

  const exportAddresses = () => {
    const csvContent = "data:text/csv;charset=utf-8," + addresses?.join("\n")
    const encodedUri = encodeURI(csvContent)
    window.open(encodedUri, "_blank")
  }

  return (
    <HStack spacing={4} {...rest}>
      {typeof holders === "number" ? (
        <HStack>
          {inaccuracy > 0 && (
            <Tooltip
              label={`Couldn't calculate holders for ${inaccuracy} requirement${
                inaccuracy > 1 ? "s" : ""
              }.`}
            >
              <Warning color="gray" />
            </Tooltip>
          )}
          <Text fontSize="sm" color="gray" fontWeight="medium">
            {inaccuracy > 0 ? (usedLogic === "OR" ? "at least" : "at most") : ""}{" "}
            {isLoading ? <Spinner size="sm" color="gray" mx={2} /> : holders}{" "}
            {`potential member${holders > 1 ? "s" : ""}`}
          </Text>
          <Popover trigger="hover" openDelay={0} size="lg">
            <PopoverTrigger>
              <Question color="gray" />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <Text>
                  Number of addresses meeting the requirements for your guild.
                </Text>

                <Wrap spacing={1} mt={3} mb={4}>
                  <Button
                    size="xs"
                    pt="1px"
                    rounded="md"
                    onClick={onCopy}
                    isDisabled={!addresses?.length}
                    leftIcon={<Copy />}
                  >
                    {hasCopied ? "Copied!" : "Copy addresses"}
                  </Button>
                  <Button
                    size="xs"
                    pt="1px"
                    rounded="md"
                    onClick={exportAddresses}
                    isDisabled={!addresses?.length}
                    leftIcon={<DownloadSimple />}
                  >
                    Export addresses
                  </Button>
                </Wrap>

                <Text
                  mt="2"
                  colorScheme={"gray"}
                  fontSize="sm"
                  fontWeight={"medium"}
                >
                  {/* Powered by{" "}
                  <Link
                    href="https://twitter.com/balancy_io"
                    fontWeight="semibold"
                    isExternal
                  >
                    Balancy
                    <Icon as={ArrowSquareOut} mx="1" />
                  </Link>*/}
                  <Link href="/balancy" fontWeight="semibold" colorScheme={"blue"}>
                    Go to Balancy playground
                    <Icon as={ArrowRight} mx="1" />
                  </Link>
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      ) : (
        isLoading && <Spinner size="sm" color="gray" />
      )}
    </HStack>
  )
}

export default BalancyCounterWithPopover
