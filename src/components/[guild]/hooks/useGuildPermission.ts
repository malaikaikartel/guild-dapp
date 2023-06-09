import useGuild from "components/[guild]/hooks/useGuild"

import useUser from "./useUser"

const useGuildPermission = () => {
  const { id, isSuperAdmin } = useUser()
  const guild = useGuild()

  if (!Array.isArray(guild?.admins) || typeof id !== "number")
    return { isAdmin: false, isOwner: false }

  const admin = guild.admins.find((a) => a?.id === id)

  return {
    isAdmin: !!admin || isSuperAdmin,
    isOwner: !!admin?.isOwner,
  }
}

export default useGuildPermission
