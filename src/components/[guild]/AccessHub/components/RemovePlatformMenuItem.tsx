import { MenuItem, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import useRemoveGuildPlatform from "components/[guild]/AccessHub/hooks/useRemoveGuildPlatform"
import useGuild from "components/[guild]/hooks/useGuild"
import RemovePlatformAlert from "components/[guild]/RemovePlatformAlert"
import { TrashSimple } from "phosphor-react"
import { useEffect } from "react"

type Props = {
  platformGuildId: string
}

const RemovePlatformMenuItem = ({ platformGuildId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  const {
    onSubmit,
    isLoading: isRemoveGuildPlatformLoading,
    response,
  } = useRemoveGuildPlatform(guildPlatform?.id)

  useEffect(() => {
    if (!response) return
    onClose()
  }, [response])

  const color = useColorModeValue("red.600", "red.300")

  return (
    <>
      <MenuItem icon={<TrashSimple />} onClick={onOpen} color={color}>
        Remove reward...
      </MenuItem>

      <RemovePlatformAlert
        guildPlatform={guildPlatform}
        keepAccessDescription="Everything on the platform will remain as is for existing members, but accesses by this Guild won’t be managed anymore"
        revokeAccessDescription="Existing members will lose their accesses on the platform granted by this Guild"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isRemoveGuildPlatformLoading}
      />
    </>
  )
}

export default RemovePlatformMenuItem
