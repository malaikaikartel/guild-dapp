import { Box, DarkMode, HStack, Img, Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import Card from "components/common/Card"
import LinkButton from "components/common/LinkButton"
import Section from "components/common/Section"
import GuildCard, { GuildSkeletonCard } from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { Plus, Wallet } from "phosphor-react"

const YourGuilds = () => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  const { data: usersGuilds, isLoading: isGuildsLoading } = useSWRWithOptionalAuth(
    `/guild?`, // ? is included, so the request hits v2Replacer in fetcher
    {
      dedupingInterval: 60000, // one minute
      revalidateOnMount: true,
    }
  )

  return (
    <Section
      title="Your guilds"
      titleRightElement={
        usersGuilds?.length && (
          <Box my="-2 !important" ml="auto !important">
            <DarkMode>
              <LinkButton
                leftIcon={<Plus />}
                size="sm"
                variant="ghost"
                href="/create-guild"
              >
                Create guild
              </LinkButton>
            </DarkMode>
          </Box>
        )
      }
      mb={{ base: 8, md: 12, lg: 14 }}
      sx={{ ".chakra-heading": { color: "white" } }}
    >
      {!account ? (
        <Card p="6">
          <Stack
            direction={{ base: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing="5"
          >
            <HStack spacing="4">
              <Img src="landing/robot.svg" boxSize={"2em"} />
              <Text fontWeight={"semibold"}>
                Connect your wallet to view your guilds / create new ones
              </Text>
            </HStack>
            <Button
              w={{ base: "full", sm: "auto" }}
              flexShrink="0"
              colorScheme="indigo"
              leftIcon={<Wallet />}
              onClick={openWalletSelectorModal}
            >
              Connect
            </Button>
          </Stack>
        </Card>
      ) : isGuildsLoading ? (
        <GuildCardsGrid>
          {[...Array(3)].map((_, i) => (
            <GuildSkeletonCard key={i} />
          ))}
        </GuildCardsGrid>
      ) : usersGuilds?.length ? (
        <GuildCardsGrid>
          {usersGuilds.map((guild) => (
            <GuildCard guildData={guild} key={guild.urlName} />
          ))}
        </GuildCardsGrid>
      ) : (
        <Card p="6">
          <Stack
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            spacing="6"
          >
            <HStack>
              <Text fontWeight={"semibold"}>
                You're not a member of any guilds yet. Explore and join some below,
                or create your own!
              </Text>
            </HStack>
            <LinkButton leftIcon={<Plus />} href="/create-guild" colorScheme="gray">
              Create guild
            </LinkButton>
          </Stack>
        </Card>
      )}
    </Section>
  )
}

export default YourGuilds
