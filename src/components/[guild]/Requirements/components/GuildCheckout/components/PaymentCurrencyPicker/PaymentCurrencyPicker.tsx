import {
  Circle,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains } from "connectors"
import { ArrowSquareOut, CaretDown } from "phosphor-react"
import { useEffect } from "react"
import { SUPPORTED_CURRENCIES } from "utils/guildCheckout/constants"
import shortenHex from "utils/shortenHex"
import usePrice from "../../hooks/usePrice"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"
import CurrencyListItem from "./components/CurrencyListItem"
import TokenInfo from "./components/TokenInfo"

const PaymentCurrencyPicker = (): JSX.Element => {
  const { requirement, pickedCurrency, setPickedCurrency } =
    useGuildCheckoutContext()

  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")
  const lightShade = useColorModeValue("white", "gray.700")
  const lightShadeHover = useColorModeValue("gray.100", "gray.600")
  const borderWidth = useColorModeValue(1, 0)
  const dropdownBgColor = useColorModeValue("gray.50", "blackAlpha.400")

  const { account } = useWeb3React()
  const { openAccountModal } = useWeb3ConnectionManager()

  const currencyOptions = SUPPORTED_CURRENCIES.filter(
    (c) =>
      c.chainId === Chains[requirement.chain] && c.address !== requirement.address
  )

  useEffect(() => setPickedCurrency(currencyOptions[0].address), [])

  const {
    data: { estimatedPriceInSellToken },
    isValidating,
    error,
  } = usePrice(pickedCurrency)

  return (
    <Stack spacing={3}>
      <Text as="span" fontWeight="bold">
        Payment currency
      </Text>

      <Menu gutter={0} matchWidth placement="bottom" flip={false}>
        {({ isOpen }) => (
          <>
            <MenuButton
              w="full"
              h="auto"
              p={4}
              bgColor={lightShade}
              borderWidth={borderWidth}
              borderColor="gray.100"
              _hover={{
                bgColor: lightShadeHover,
              }}
              borderTopRadius="2xl"
              borderBottomRadius={isOpen ? 0 : "2xl"}
              transition="border-radius 0.2s ease, background-color 0.2s ease"
              _focusVisible={{ boxShadow: "outline" }}
            >
              <HStack w="full" justifyContent="space-between">
                {pickedCurrency ? (
                  <TokenInfo
                    chainId={Chains[requirement.chain]}
                    address={pickedCurrency}
                    requiredAmount={estimatedPriceInSellToken}
                    isLoading={isValidating}
                    error={error}
                  />
                ) : (
                  <HStack spacing={4}>
                    <Circle
                      size={"var(--chakra-space-11)"}
                      bgColor={circleBgColor}
                    />
                    <Text as="span">Choose currency</Text>
                  </HStack>
                )}
                <Icon
                  as={CaretDown}
                  boxSize={4}
                  transform={isOpen && "rotate(-180deg)"}
                  transition="transform .3s"
                />
              </HStack>
            </MenuButton>

            <MenuList
              p={0}
              pb={8}
              border="none"
              borderTopRadius={0}
              borderBottomRadius="2xl"
              overflow="hidden"
              transformOrigin="center"
              maxH={48}
            >
              <Stack
                maxH={40}
                overflowY="auto"
                className="custom-scrollbar"
                spacing={0}
                divider={<MenuDivider m="0" />}
                bgColor={dropdownBgColor}
              >
                {currencyOptions.map((c) => (
                  <CurrencyListItem
                    key={`${c.chainId}-${c.address}`}
                    chainId={c.chainId}
                    address={c.address}
                  />
                ))}
              </Stack>

              {account && (
                <HStack
                  justifyContent="space-between"
                  bgColor={lightShade}
                  h={8}
                  px={4}
                  fontSize="sm"
                >
                  <Text as="span" colorScheme="gray">
                    Connected address:
                  </Text>

                  <Button
                    size="sm"
                    variant="link"
                    rightIcon={<Icon as={ArrowSquareOut} />}
                    onClick={openAccountModal}
                  >
                    {shortenHex(account, 3)}
                  </Button>
                </HStack>
              )}
            </MenuList>
          </>
        )}
      </Menu>
    </Stack>
  )
}

export default PaymentCurrencyPicker
