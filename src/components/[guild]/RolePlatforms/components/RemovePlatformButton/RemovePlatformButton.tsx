import { CloseButton, Tooltip, useDisclosure } from "@chakra-ui/react"
import RemovePlatformAlert from "components/[guild]/RemovePlatformAlert"
import { GuildPlatform } from "types"
import useRemovePlatform from "./hooks/useRemovePlatform"

type Props = {
  removeButtonColor: string
  guildPlatform: GuildPlatform
}

const RemovePlatformButton = ({
  removeButtonColor,
  guildPlatform,
}: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useRemovePlatform(onClose)

  return (
    <>
      <Tooltip label={"Remove reward..."}>
        <CloseButton
          size="sm"
          color={removeButtonColor}
          rounded="full"
          aria-label="Remove reward"
          zIndex="1"
          onClick={onOpen}
        />
      </Tooltip>

      <RemovePlatformAlert
        guildPlatform={guildPlatform}
        keepAccessDescription="Everything on the platform will remain as is for existing members, but accesses by this role won’t be managed anymore"
        revokeAccessDescription="Existing members will lose their accesses on the platform granted by this role"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </>
  )
}

export default RemovePlatformButton
