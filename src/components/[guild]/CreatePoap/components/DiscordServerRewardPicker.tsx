import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { PlatformType } from "types"

const DiscordServerRewardPicker = () => {
  const { setValue, watch } = useFormContext()

  const { guildPlatforms } = useGuild()
  const discordGuildPlatforms = guildPlatforms
    ?.filter((platform) => platform.platformId === PlatformType.DISCORD)
    ?.map(({ platformGuildId, platformGuildName }) => ({
      value: platformGuildId,
      label: platformGuildName,
    }))

  const serverId = watch("serverId")
  useEffect(() => {
    if (!serverId) setValue("serverId", discordGuildPlatforms[0]?.value)
  }, [discordGuildPlatforms])

  if (!(discordGuildPlatforms.length > 1)) return null

  return (
    <FormControl isRequired>
      <FormLabel>Server</FormLabel>

      <ControlledSelect
        name={`serverId`}
        isClearable
        options={discordGuildPlatforms}
      />
    </FormControl>
  )
}

export default DiscordServerRewardPicker
