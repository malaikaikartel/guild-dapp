import { Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { X } from "phosphor-react"
import { useFormContext } from "react-hook-form"

const RemoveBackgroundImage = () => {
  const { setValue } = useFormContext()
  const { setLocalBackgroundImage } = useThemeContext()

  const handleRemoveImage = () => {
    setValue("theme.backgroundImage", "", { shouldDirty: true })
    setLocalBackgroundImage(null)
  }

  return (
    <Button
      leftIcon={<Icon as={X} />}
      colorScheme="red"
      variant="outline"
      borderWidth={1}
      h="10"
      onClick={handleRemoveImage}
    >
      Remove image
    </Button>
  )
}

export default RemoveBackgroundImage
