import { Input, InputProps } from "@chakra-ui/react"
import { forwardRef, useState } from "react"
import { useController } from "react-hook-form"

type Props = {
  fieldName: string
} & InputProps

const ControlledTimestampInput = ({ fieldName, ...props }: Props): JSX.Element => {
  const {
    field: { ref, name, value, onChange, onBlur },
  } = useController({
    name: fieldName,
    rules: { required: props.isRequired && "This field is required." },
  })

  return (
    <TimestampInput
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
  )
}

type TimestampInputProps = {
  onChange?: (newValue: number) => void
} & Omit<InputProps, "onChange">

const TimestampInput = forwardRef(
  (props: TimestampInputProps, ref: any): JSX.Element => {
    const [value, setValue] = useState(
      !isNaN(Number(props.value)) ? Number(props.value) : undefined
    )

    return (
      <Input
        type="date"
        ref={ref}
        {...props}
        value={
          value && !isNaN(value) ? new Date(value).toISOString().split("T")[0] : ""
        }
        onChange={(e) => {
          const newValue = !isNaN(e.target.valueAsNumber)
            ? e.target.valueAsNumber
            : undefined
          setValue(newValue)
          props.onChange?.(newValue)
        }}
        max={new Date().toISOString().split("T")[0]}
      />
    )
  }
)

export { ControlledTimestampInput, TimestampInput }
