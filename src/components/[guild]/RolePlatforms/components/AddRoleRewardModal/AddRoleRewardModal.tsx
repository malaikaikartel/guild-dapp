import {
  HStack,
  IconButton,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { ArrowLeft } from "phosphor-react"
import platforms from "platforms/platforms"
import { useRef, useState } from "react"
import { PlatformName } from "types"
import AddDiscordPanel from "./components/AddDiscordPanel"
import AddGithubPanel from "./components/AddGithubPanel"
import AddGooglePanel from "./components/AddGooglePanel"
import AddTelegramPanel from "./components/AddTelegramPanel"
import SelectExistingPlatform from "./components/SelectExistingPlatform"

const addPlatformComponents: Record<
  Exclude<PlatformName, "" | "TWITTER" | "POAP">,
  (props) => JSX.Element
> = {
  DISCORD: AddDiscordPanel,
  TELEGRAM: AddTelegramPanel,
  GITHUB: AddGithubPanel,
  GOOGLE: AddGooglePanel,
}

const AddRoleRewardModal = ({ isOpen, onClose }) => {
  const [selection, setSelectionOg] = useState<PlatformName>(null)
  const modalRef = useRef(null)

  const AddPlatformPanel = addPlatformComponents[selection]

  const setSelection = (platform: PlatformName) => {
    setSelectionOg(platform)
    modalRef.current?.scrollTo({ top: 0 })
  }

  const closeModal = () => {
    setSelection(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="4xl"
      scrollBehavior="inside"
      colorScheme={"dark"}
    >
      <ModalOverlay />
      <ModalContent minH="550px">
        <ModalHeader>
          <HStack>
            {selection !== null && (
              <IconButton
                rounded={"full"}
                aria-label="Back"
                size="sm"
                mb="-3px"
                icon={<ArrowLeft size={20} />}
                variant="ghost"
                onClick={() => setSelection(null)}
              />
            )}
            <Text>
              Add {(selection === null && "reward") || platforms[selection].name}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalBody ref={modalRef}>
          {(selection === null && (
            <>
              <SelectExistingPlatform onClose={onClose} />
              <Text fontWeight={"bold"} mb="3">
                Add new platform
              </Text>
              <PlatformsGrid onSelection={setSelection} />
            </>
          )) || <AddPlatformPanel onSuccess={closeModal} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddRoleRewardModal
