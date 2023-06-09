import { Chain } from "connectors"
import useSWRImmutable from "swr/immutable"
import { NFT } from "types"

const useNfts = (chain: Chain): { nfts: Array<NFT>; isLoading: boolean } => {
  const { isLoading, data } = useSWRImmutable(
    chain === "ETHEREUM" ? `${process.env.NEXT_PUBLIC_API}/assets/nft/` : null
  )

  return { nfts: data, isLoading }
}

export default useNfts
