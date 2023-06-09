import {
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const Score = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const {
    field: {
      name: scoreFieldName,
      onBlur: scoreFieldOnBlur,
      onChange: scoreFieldOnChange,
      ref: scoreFieldRef,
      value: scoreFieldValue,
    },
  } = useController({
    name: `${baseFieldPath}.data.score`,
    rules: {
      required: "This field is required",
      min: {
        value: -1000000000,
        message: "Minimum score is -1000000000",
      },
      max: {
        value: 1000000000,
        message: "Maximum score is 1000000000",
      },
    },
  })

  const handleChange = (newValue) => {
    if (/^[0-9]*\.0*$/i.test(newValue)) return scoreFieldOnChange(newValue)
    const parsedValue = parseFloat(newValue)
    return scoreFieldOnChange(isNaN(parsedValue) ? "" : parsedValue)
  }

  return (
    <Stack spacing={4} alignItems="start" w="full">
      <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}>
        <FormLabel>Community ID</FormLabel>

        <Input
          {...register(`${baseFieldPath}.data.id`, {
            required: "This field is required",
          })}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.score}>
        <FormLabel>Score</FormLabel>

        <NumberInput
          ref={scoreFieldRef}
          name={scoreFieldName}
          value={scoreFieldValue ?? undefined}
          onChange={handleChange}
          onBlur={scoreFieldOnBlur}
          min={-1000000000}
          max={1000000000}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.score?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default Score
