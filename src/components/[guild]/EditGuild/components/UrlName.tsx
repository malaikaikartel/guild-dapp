import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFormContext, useFormState } from "react-hook-form"
import slugify from "slugify"

const checkUrlName = (urlName: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/guild/${urlName}`).then(
    async (response) => response.ok && response.status !== 204
  )

const UrlName = ({ maxWidth = "sm" }) => {
  const { errors } = useFormState()
  const { register, setError, clearErrors, setValue } = useFormContext()

  const { urlName: currentUrlName } = useGuild()

  return (
    <FormControl isInvalid={!!errors?.urlName}>
      <FormLabel>URL name</FormLabel>
      <InputGroup size="lg" maxWidth={maxWidth}>
        <InputLeftAddon>guild.xyz/</InputLeftAddon>
        <Input
          {...register("urlName")}
          onChange={(event) => {
            setValue("urlName", slugify(event.target.value, { trim: false }), {
              shouldDirty: true,
            })
          }}
          onBlur={(event) => {
            if (!event.target.value.length) {
              setError("urlName", { message: "This field is required" })
              return
            }

            const newUrlName = slugify(event.target.value)
            setValue("urlName", newUrlName, { shouldDirty: true })

            checkUrlName(newUrlName).then((alreadyExists) => {
              if (alreadyExists && currentUrlName !== newUrlName)
                setError("urlName", {
                  message: "Sorry, this guild name is already taken",
                })
              return
            })

            clearErrors("urlName")
          }}
        />
      </InputGroup>
      <FormErrorMessage>{errors?.urlName?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default UrlName
