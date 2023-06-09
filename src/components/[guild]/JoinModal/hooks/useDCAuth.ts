import useOauthPopupWindow from "./useOauthPopupWindow"

type DCAuth = {
  accessToken: string
  tokenType: string
  expires: number
  authorization: string
}

const useDCAuth = (scope = "guilds identify guilds.members.read") =>
  useOauthPopupWindow<DCAuth>(
    "DISCORD",
    "https://discord.com/api/oauth2/authorize",
    {
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
      scope,
    }
  )

export default useDCAuth
