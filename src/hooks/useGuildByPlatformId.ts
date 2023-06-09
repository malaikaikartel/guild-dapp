import { Guild, PlatformName } from "types"
import useSWRWithOptionalAuth from "./useSWRWithOptionalAuth"

const useGuildByPlatformId = (platform: PlatformName, platformId: string) => {
  const shouldFetch = platformId?.length > 0
  const { data, isLoading } = useSWRWithOptionalAuth<Partial<Guild>>(
    shouldFetch ? `/platform/guild/${platform}/${platformId}` : null,
    { fallbackData: { id: null } },
    true
  )

  return { ...data, isLoading }
}

export default useGuildByPlatformId
