import { Chain } from "connectors"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import fetcher from "utils/fetcher"

const fetch1000Badges = (endpoint: string, skip: number) =>
  fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
    body: {
      query: `{
        badgeSpecs(first:1000 skip:${skip}) {
          id
          metadata {
            name
            image
          }
        }
      }`,
    },
  }).then((res) =>
    res?.data?.badgeSpecs
      ?.filter((badge) => !!badge.metadata?.name)
      ?.map((badge) => ({
        value: badge.id,
        label: badge.metadata.name,
        img: badge.metadata.image.replace("ipfs://", "https://ipfs.fleek.co/ipfs/"),
      }))
  )

// We can only fetch 1000 badges at once, so we need to fetch them in multiple requests
const fetchBadges = async (endpoint: string) => {
  let badges = []
  let skip = 0
  let newBadges = []

  do {
    newBadges = await fetch1000Badges(endpoint, skip)
    badges = badges.concat(newBadges ?? [])
    skip += 1000
  } while (newBadges?.length > 0)

  return badges
}

const path: Record<
  Extract<Chain, "ETHEREUM" | "POLYGON" | "OPTIMISM" | "GOERLI">,
  string
> = {
  ETHEREUM: "badges-mainnet",
  POLYGON: "badges-polygon",
  OPTIMISM: "badges-optimism",
  GOERLI: "badges-goerli",
}

const useOtterspaceBadges = (chain: Chain) =>
  useSWRImmutable<SelectOption[]>(
    chain && path[chain]
      ? `https://api.thegraph.com/subgraphs/name/otterspace-xyz/${path[chain]}`
      : null,
    fetchBadges
  )

export default useOtterspaceBadges
