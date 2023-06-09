import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import useYupAdapters from "./hooks/useYupAdapters"

const YupForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { adapters, isAdatpersLoading } = useYupAdapters()
  const mappedAdapters: SelectOption[] =
    adapters?.map((adapter) => ({
      label: adapter,
      value: adapter,
    })) ?? []

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>Minimum score</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.minAmount` as const}
          control={control}
          rules={{
            required: "This field is required.",
            min: {
              value: 0,
              message: "Amount must be positive",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumberInput
              ref={ref}
              value={value ?? ""}
              onChange={(newValue) => {
                if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
                const parsedValue = parseFloat(newValue)
                return onChange(isNaN(parsedValue) ? "" : parsedValue)
              }}
              onBlur={onBlur}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.adapter}
      >
        <FormLabel>Adapter</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.data.adapter`}
          isClearable
          isLoading={isAdatpersLoading}
          options={mappedAdapters}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.adapter?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default YupForm
