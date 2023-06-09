import { Heading, HStack, Icon, Spacer } from "@chakra-ui/react"
import MemberCount from "components/[guild]/RoleCard/components/MemberCount"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import { DotsSixVertical } from "phosphor-react"
import { Role } from "types"

type Props = {
  role: Role
}

const DraggableRoleCard = ({ role }: Props) => {
  if (!role) return null

  return (
    <Card p={4} cursor="grab" mb="3">
      <HStack spacing={4}>
        <GuildLogo imageUrl={role.imageUrl} size={"36px"} />
        <Heading as="h3" fontSize={"md"} fontFamily="display">
          {role.name}
        </Heading>
        <MemberCount memberCount={role.members?.length ?? role.memberCount} />
        <Spacer />
        <Icon as={DotsSixVertical} />
      </HStack>
    </Card>
  )
}

export default DraggableRoleCard
